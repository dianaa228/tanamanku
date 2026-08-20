<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Order;
use Illuminate\Http\JsonResponse;

class ShipmentController extends BaseController
{
    public function show(Order $order): JsonResponse
    {
        return $this->success($order->shipment, 'Info pengiriman');
    }
}
