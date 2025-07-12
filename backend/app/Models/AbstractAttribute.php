<?php
namespace Models;

abstract class AbstractAttribute
{
    protected string $name;
    protected string $type;
    protected array $items;

    public function __construct(string $name, string $type, array $items)
    {
        $this->name = $name;
        $this->type = $type;
        $this->items = $items;
    }

    abstract public function getAttributeDetails(): array;

    public function getName(): string
    {
        return $this->name;
    }

    public function getType(): string
    {
        return $this->type;
    }
}