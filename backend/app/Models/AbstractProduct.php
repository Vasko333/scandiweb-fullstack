<?php
namespace Models;

abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected bool $inStock;
    protected string $category;
    protected string $brand;
    protected array $gallery;
    protected string $description;
    protected array $attributes;
    protected array $prices;

    public function __construct(
        string $id,
        string $name,
        bool $inStock,
        string $category,
        string $brand,
        array $gallery,
        string $description,
        array $attributes,
        array $prices
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->inStock = $inStock;
        $this->category = $category;
        $this->brand = $brand;
        $this->gallery = $gallery;
        $this->description = $description;
        $this->attributes = $attributes;
        $this->prices = $prices;
    }

    abstract public function getProductDetails(): array;

    public function getId(): string
    {
        return $this->id;
    }

    public function isInStock(): bool
    {
        return $this->inStock;
    }
}