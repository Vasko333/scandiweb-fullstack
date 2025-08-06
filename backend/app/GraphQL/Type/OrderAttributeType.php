<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderAttributeType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderAttribute',
            'fields' => [
                'name' => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
            ],
        ]);
    }
}
