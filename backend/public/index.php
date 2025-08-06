<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\GraphQL\SchemaFactory;
use GraphQL\GraphQL;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Load .env with error handling
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['errors' => [['message' => 'Failed to load .env: ' . $e->getMessage()]]]);
    exit;
}

// Create schema
try {
    $schema = (new SchemaFactory())->create();
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['errors' => [['message' => 'Schema creation error: ' . $e->getMessage()]]]);
    exit;
}

// GraphQL POST handler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $query = $input['query'] ?? '';
        $variables = $input['variables'] ?? [];

        $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
        $output = $result->toArray();
    } catch (Throwable $e) {
        http_response_code(500);
        $output = [
            'errors' => [
                ['message' => $e->getMessage()],
            ],
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($output);
}
