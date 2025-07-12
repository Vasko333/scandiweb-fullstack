<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php'; // Adjusted path

use Dotenv\Dotenv;
use GraphQL\GraphQL;
use GraphQL\Type\Schema; // Correct import for the Schema class
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Resolvers\QueryResolver;
use Resolvers\MutationResolver;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..'); // Adjusted path for .env
$dotenv->load();

$dbHost = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_NAME'];
$dbUser = $_ENV['DB_USER'];
$dbPass = $_ENV['DB_PASS'];
$dbPort = $_ENV['DB_PORT'] ?? '3306';
try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;port=$dbPort",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION] // Enable error reporting
    );
} catch (PDOException $e) {
    // Output detailed error for debugging
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
  

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Load schema (optional, can be removed if types are defined in code)
// $schemaString = file_get_contents(__DIR__ . '/schema.graphql');

// Define Query Type
$queryType = new ObjectType([
    'name' => 'Query',
    'fields' => [
        'categories' => [
            'type' => Type::listOf(new ObjectType([
                'name' => 'Category',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::int())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                ],
            ])),
            'resolve' => fn() => (new QueryResolver($pdo))->categories(),
        ],
        'products' => [
            'type' => Type::listOf(new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::string())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'inStock' => ['type' => Type::nonNull(Type::boolean())],
                    'gallery' => ['type' => Type::listOf(Type::string())],
                    'description' => ['type' => Type::string()],
                    'category' => ['type' => Type::string()],
                    'brand' => ['type' => Type::string()],
                    'attributes' => ['type' => Type::listOf(new ObjectType([
                        'name' => 'Attribute',
                        'fields' => [
                            'name' => ['type' => Type::nonNull(Type::string())],
                            'type' => ['type' => Type::nonNull(Type::string())],
                            'items' => ['type' => Type::listOf(new ObjectType([
                                'name' => 'AttributeItem',
                                'fields' => [
                                    'displayValue' => ['type' => Type::nonNull(Type::string())],
                                    'value' => ['type' => Type::nonNull(Type::string())],
                                    'slug' => ['type' => Type::nonNull(Type::string())],
                                ],
                            ]))],
                        ],
                    ]))],
                    'prices' => ['type' => Type::listOf(new ObjectType([
                        'name' => 'Price',
                        'fields' => [
                            'amount' => ['type' => Type::nonNull(Type::float())],
                            'currency' => ['type' => new ObjectType([
                                'name' => 'Currency',
                                'fields' => [
                                    'label' => ['type' => Type::nonNull(Type::string())],
                                    'symbol' => ['type' => Type::nonNull(Type::string())],
                                ],
                            ])],
                        ],
                    ]))],
                ],
            ])),
            'args' => [
                'category' => ['type' => Type::string()],
            ],
            'resolve' => fn($root, array $args) => (new QueryResolver($pdo))->products($args['category'] ?? null),
        ],
    ],
]);

// Define Mutation Type
$mutationType = new ObjectType([
    'name' => 'Mutation',
    'fields' => [
        'placeOrder' => [
            'type' => new ObjectType([
                'name' => 'Order',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::int())],
                    'products' => ['type' => Type::listOf(new ObjectType([
                        'name' => 'OrderProduct',
                        'fields' => [
                            'productId' => ['type' => Type::nonNull(Type::string())],
                            'quantity' => ['type' => Type::nonNull(Type::int())],
                            'attributes' => ['type' => Type::listOf(new ObjectType([
                                'name' => 'OrderAttribute',
                                'fields' => [
                                    'name' => ['type' => Type::nonNull(Type::string())],
                                    'value' => ['type' => Type::nonNull(Type::string())],
                                ],
                            ]))],
                        ],
                    ]))],
                    'total' => ['type' => Type::nonNull(Type::float())],
                ],
            ]),
            'args' => [
                'products' => ['type' => Type::nonNull(Type::listOf(Type::nonNull(new ObjectType([
                    'name' => 'OrderInput',
                    'fields' => [
                        'productId' => ['type' => Type::nonNull(Type::string())],
                        'quantity' => ['type' => Type::nonNull(Type::int())],
                        'attributes' => ['type' => Type::listOf(new ObjectType([
                            'name' => 'AttributeInput',
                            'fields' => [
                                'name' => ['type' => Type::nonNull(Type::string())],
                                'value' => ['type' => Type::nonNull(Type::string())],
                            ],
                        ]))],
                    ],
                ]))))],
            ],
            'resolve' => fn($root, array $args) => (new MutationResolver($pdo))->placeOrder($args),
        ],
    ],
]);

// Create Schema
$schema = new Schema([ // Line 135 should be around here
    'query' => $queryType,
    'mutation' => $mutationType,
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $query = $input['query'] ?? '';
    $variables = $input['variables'] ?? [];

    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    header('Content-Type: application/json');
    echo json_encode($result);
}