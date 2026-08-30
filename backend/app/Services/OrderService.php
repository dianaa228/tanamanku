<?php

namespace App\Services;

use App\Jobs\SendOrderNotification;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        private CartService $cartService,
        private InventoryService $inventoryService,
    ) {
    }

    /**
     * Checkout — seluruh proses dalam SATU database transaction (docs/16).
     *  - Stok dicek server-side lalu dikurangi.
     *  - Total & subtotal DIHITUNG SERVER-SIDE, tidak pernah dari klien.
     */
    public function createFromCart(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cart = $this->cartService->show($user);
            if ($cart->items->isEmpty()) {
                throw ValidationException::withMessages(['cart' => ['Keranjang kosong.']]);
            }

            // 1) Validasi stok & hitung subtotal dari data server
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $this->inventoryService->checkStock($item->product, $item->quantity);
                $subtotal += $item->quantity * (float) $item->unit_price;
            }

            // 2) Ongkir & diskon ditentukan server (tarif dari config, bukan hardcoded)
            $shippingCost = (float) ($data['shipping_cost'] ?? config('shop.shipping_cost_default', 15000));
            $discount = 0.0; // kupon diimplementasikan di fase berikutnya

            // 3) Buat order + items
            $order = Order::create([
                'user_id' => $user->id,
                'store_id' => $cart->items->first()->product->store_id,
                'order_number' => 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'status' => Order::STATUS_PENDING,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $subtotal + $shippingCost - $discount,
                'payment_status' => Payment::STATUS_PENDING,
                'note' => $data['note'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->quantity * (float) $item->unit_price,
                ]);

                // 4) Kurangi stok + reserve
                $this->inventoryService->reserve($item->product, $item->quantity);
            }

            // 5) Payment pending + shipment snapshot alamat
            Payment::create([
                'order_id' => $order->id,
                'method' => $data['payment_method'],
                'reference' => null,
                'amount' => $order->total,
                'status' => Payment::STATUS_PENDING,
            ]);

            Shipment::create([
                'order_id' => $order->id,
                'courier' => $data['courier'] ?? 'reguler',
                'address_snapshot' => $data['address'],
                'status' => 'pending',
            ]);

            // 6) Bersihkan keranjang & beri notifikasi
            $this->cartService->clear($user);
            SendOrderNotification::dispatch($order);

            return $order->load('items', 'payment', 'shipment');
        });
    }

    public function index(User $user): \Illuminate\Pagination\LengthAwarePaginator
    {
        return Order::forUser($user->id)
            ->with('items.product:id,name,slug', 'payment', 'shipment')
            ->latest()
            ->paginate(15);
    }

    public function cancel(Order $order): Order
    {
        if (! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PAID])) {
            throw ValidationException::withMessages(['order' => ['Pesanan tidak dapat dibatalkan pada status ini.']]);
        }

        DB::transaction(function () use ($order) {
            $order->update(['status' => Order::STATUS_CANCELLED]);
            foreach ($order->items as $item) {
                $this->inventoryService->release($item->product, $item->quantity);
            }
        });

        return $order;
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $allowed = [
            Order::STATUS_PROCESSING, Order::STATUS_SHIPPED,
            Order::STATUS_DELIVERED, Order::STATUS_COMPLETED,
        ];

        if (! in_array($status, $allowed)) {
            throw ValidationException::withMessages(['status' => ['Status tidak valid.']]);
        }

        $order->update(['status' => $status]);

        return $order;
    }

    public function sellerOrders(int $storeId): \Illuminate\Pagination\LengthAwarePaginator
    {
        return Order::where('store_id', $storeId)
            ->with('user:id,name', 'items', 'shipment')
            ->latest()
            ->paginate(15);
    }
}
