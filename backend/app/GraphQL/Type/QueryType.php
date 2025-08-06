<?php
namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Resolvers\QueryResolver;
use Models\Category;
use Models\Product;
use PDO;

class QueryType extends ObjectType
{
    public function __construct()
    {
        $pdo = new PDO(
            'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASS']
        );

        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(new CategoryType()),
                    'resolve' => fn () => (new QueryResolver($pdo))->categories(),
                ],
                'products' => [
                    'type' => Type::listOf(new ProductType()),
                    'args' => [
                        'category' => ['type' => Type::string()],
                    ],
                    'resolve' => fn ($root, $args) => (new QueryResolver($pdo))->products($args['category'] ?? null),
                ],
            ],
        ]);
    }
}
