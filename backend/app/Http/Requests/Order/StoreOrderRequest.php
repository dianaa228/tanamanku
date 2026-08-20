<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'in:transfer,ewallet,qris,cod'],
            'courier' => ['nullable', 'in:reguler,express,same-day'],
            'address' => ['required', 'array'],
            'address.label' => ['required', 'string'],
            'address.recipient' => ['required', 'string'],
            'address.phone' => ['required', 'string'],
            'address.street' => ['required', 'string'],
            'address.city' => ['required', 'string'],
            'address.province' => ['required', 'string'],
            'address.postal_code' => ['nullable', 'string'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
