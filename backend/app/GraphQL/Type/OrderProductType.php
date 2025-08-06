<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderProduct',
            'fields' => [
                'productId' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
                'attributes' => Type::listOf(new OrderAttributeType()),
            ],
        ]);
    }
}
