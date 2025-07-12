<?php
namespace Resolvers;

use PDO;

class MutationResolver
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function placeOrder(array $args): array
    {
        $products = $args['products'];
        $total = 0;

        // Insert order (simplified, adjust as per your schema)
        $stmt = $this->pdo->prepare("INSERT INTO orders (total) VALUES (?)");
        $stmt->execute([$total]);
        $orderId = $this->pdo->lastInsertId();

        foreach ($products as $product) {
            $productId = $product['productId'];
            $quantity = $product['quantity'];
            $attributes = $product['attributes'];

            // Fetch price (simplified)
            $priceStmt = $this->pdo->prepare("SELECT amount FROM prices WHERE product_id = ? LIMIT 1");
            $priceStmt->execute([$productId]);
            $price = $priceStmt->fetchColumn() ?: 0;
            $subtotal = $price * $quantity;
            $total += $subtotal;

            // Insert order details (simplified)
            $stmt = $this->pdo->prepare("INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
            $stmt->execute([$orderId, $productId, $quantity, $subtotal]);
        }

        // Update total in orders table
        $stmt = $this->pdo->prepare("UPDATE orders SET total = ? WHERE id = ?");
        $stmt->execute([$total, $orderId]);

        return ['id' => $orderId, 'products' => $products, 'total' => $total];
    }
}