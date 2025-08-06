<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'AttributeItem',
            'fields' => [
                'displayValue' => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::string()),
                'slug' => Type::nonNull(Type::string()),
            ]
        ]);
    }
}
