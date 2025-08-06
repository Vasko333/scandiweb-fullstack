<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class OrderInputType extends InputObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderInput',
            'fields' => [
                'productId' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
                'attributes' => Type::listOf(new AttributeInputType()),
            ]
        ]);
    }
}
