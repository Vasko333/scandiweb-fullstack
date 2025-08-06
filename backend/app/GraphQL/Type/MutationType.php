<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Resolvers\MutationResolver;
use PDO;

class MutationType extends ObjectType
{
    public function __construct()
    {
        $pdo = new PDO(
            'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASS']
        );

        parent::__construct([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => new OrderType(),
                    'args' => [
                        'products' => [
                            'type' => Type::listOf(Type::nonNull(new OrderInputType())),
                        ],
                    ],
                    'resolve' => fn ($root, $args) => (new MutationResolver($pdo))->placeOrder($args),
                ],
            ],
        ]);
    }
}
