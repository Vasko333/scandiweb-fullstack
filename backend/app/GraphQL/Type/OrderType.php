<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Order',
            'fields' => [
                'id' => Type::nonNull(Type::int()),
                'products' => Type::listOf(new OrderProductType()),
                'total' => Type::nonNull(Type::float()),
            ],
        ]);
    }
}
