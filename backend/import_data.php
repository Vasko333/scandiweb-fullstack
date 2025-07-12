<?php

require_once __DIR__ . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

$dotenv->load();

$pdo = new PDO(
    'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_DATABASE'],
    $_ENV['DB_USERNAME'],
    $_ENV['DB_PASSWORD']
);

// ...rest of the script

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents(__DIR__ . '/data.json'), true);

$categoryMap = [];
foreach ($data['data']['categories'] as $category) {
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute([$category['name']]);
    $categoryMap[$category['name']] = $pdo->lastInsertId();
}

foreach ($data['data']['products'] as $product) {
    $stmt = $pdo->prepare("INSERT INTO products (id, name, description, in_stock, category_id, brand)
        VALUES (?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $product['id'],
        $product['name'],
        $product['description'],
        $product['inStock'] ? 1 : 0,
        $categoryMap[$product['category']],
        $product['brand']
    ]);

    // Gallery
    foreach ($product['gallery'] as $img) {
        $stmt = $pdo->prepare("INSERT INTO product_gallery (product_id, image_url) VALUES (?, ?)");
        $stmt->execute([$product['id'], $img]);
    }

    // Attributes
    foreach ($product['attributes'] as $attribute) {
        $stmt = $pdo->prepare("INSERT INTO attributes (name, type) VALUES (?, ?)");
        $stmt->execute([$attribute['name'], $attribute['type']]);
        $attributeId = $pdo->lastInsertId();

        // Product ↔ Attribute
        $stmt = $pdo->prepare("INSERT INTO product_attributes (product_id, attribute_id) VALUES (?, ?)");
        $stmt->execute([$product['id'], $attributeId]);

        foreach ($attribute['items'] as $item) {
            $stmt = $pdo->prepare("INSERT INTO attribute_items (attribute_id, display_value, value, slug) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $attributeId,
                $item['displayValue'],
                $item['value'],
                strtolower(str_replace(' ', '-', $item['id']))
            ]);
        }
    }

    // Prices
    foreach ($product['prices'] as $price) {
        $stmt = $pdo->prepare("INSERT INTO prices (product_id, currency_label, currency_symbol, amount) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $product['id'],
            $price['currency']['label'],
            $price['currency']['symbol'],
            $price['amount']
        ]);
    }
}

echo "✅ Data imported successfully.\n";
