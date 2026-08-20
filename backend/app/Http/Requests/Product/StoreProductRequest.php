<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorisasi ditangani policy (ProductPolicy) di controller —
        // FormRequest hanya memvalidasi input (docs/13).
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'plant_species_id' => ['nullable', 'exists:plant_species,id'],
            'name' => ['required', 'string', 'max:191'],
            'slug' => ['required', 'string', 'max:191', 'unique:products,slug,'.$this->route('product')],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'care_level' => ['nullable', 'in:mudah,sedang,sulit'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048'],
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string', 'max:191'],
            'variants.*.price_adjustment' => ['nullable', 'numeric'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.min' => 'Harga tidak boleh negatif.',
            'stock.min' => 'Stok tidak boleh negatif.',
        ];
    }
}
