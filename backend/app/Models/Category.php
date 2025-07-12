<?php
namespace Models;

class Category extends AbstractCategory
{
    public function getDetails(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
        ];
    }
}