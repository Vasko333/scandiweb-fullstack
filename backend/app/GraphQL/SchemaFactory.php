<?php
namespace App\GraphQL;

use GraphQL\Type\Schema;
use App\GraphQL\Type\QueryType;
use App\GraphQL\Type\MutationType;
use PDO;
use PDOException;

class SchemaFactory
{
    public function create(): Schema
    {
        try {
            $host = $_ENV['DB_HOST'];
            $port = $_ENV['DB_PORT'] ?? 3306;
            $dbname = $_ENV['DB_NAME'];
            $user = $_ENV['DB_USER'];
            $pass = $_ENV['DB_PASS'];

            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            return new Schema([
                'query' => new QueryType($pdo),
                'mutation' => new MutationType($pdo),
            ]);
        } catch (PDOException $e) {
            throw new \RuntimeException('DB Connection failed: ' . $e->getMessage());
        }
    }
}
