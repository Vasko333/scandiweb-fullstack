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

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$schema = (new SchemaFactory())->create();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $query = $input['query'] ?? '';
    $variables = $input['variables'] ?? [];

    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    header('Content-Type: application/json');
    echo json_encode($result->toArray());
}
