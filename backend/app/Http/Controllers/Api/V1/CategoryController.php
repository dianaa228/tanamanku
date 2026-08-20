<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends BaseController
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return $this->success(CategoryResource::collection($categories), 'Kategori berhasil dimuat');
    }

    public function show(Category $category): JsonResponse
    {
        return $this->success(new CategoryResource($category->load('products')));
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return $this->created(new CategoryResource($category), 'Kategori berhasil dibuat');
    }

    public function update(StoreCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return $this->success(new CategoryResource($category), 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->update(['is_active' => false]);

        return $this->deleted('Kategori berhasil dinonaktifkan');
    }
}
