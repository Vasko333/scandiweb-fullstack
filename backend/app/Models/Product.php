<?php
namespace Models;

class Product extends AbstractProduct
{
    public function getProductDetails(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->name,
            'inStock' => $this->isInStock(),
            'gallery' => $this->gallery,
            'description' => $this->description,
            'category' => $this->category,
            'brand' => $this->brand,
            'attributes' => $this->attributes,
            'prices' => $this->prices,
        ];
    }
}