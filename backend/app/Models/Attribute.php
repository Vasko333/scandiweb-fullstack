<?php
namespace Models;

class Attribute extends AbstractAttribute
{
    public function getAttributeDetails(): array
    {
        return [
            'name' => $this->getName(),
            'type' => $this->getType(),
            'items' => $this->items,
        ];
    }
}