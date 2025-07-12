<?php
namespace Resolvers;

use Models\Category;
use Models\Product;
use Models\Attribute;
use PDO;

class QueryResolver
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function categories(): array
    {
        $stmt = $this->pdo->query("SELECT id, name FROM categories");
        $categories = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $categories[] = new Category($row['id'], $row['name']);
        }
        return array_map(fn($category) => $category->getDetails(), $categories);
    }

    public function products(?string $category = null): array
    {
        $query = "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id";
        $params = [];
        if ($category) {
            $query .= " WHERE c.name = ?";
            $params[] = $category;
        }
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        $products = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $galleryStmt = $this->pdo->prepare("SELECT image_url FROM product_gallery WHERE product_id = ?");
            $galleryStmt->execute([$row['id']]);
            $gallery = $galleryStmt->fetchAll(PDO::FETCH_COLUMN);

            $attributesStmt = $this->pdo->prepare("SELECT a.name, a.type, ai.display_value, ai.value, ai.slug 
                FROM attributes a 
                JOIN product_attributes pa ON a.id = pa.attribute_id 
                JOIN attribute_items ai ON a.id = ai.attribute_id 
                WHERE pa.product_id = ?");
            $attributesStmt->execute([$row['id']]);
            $attributesData = $attributesStmt->fetchAll(PDO::FETCH_ASSOC);
            $attributes = [];
            $attributeGroups = [];
            foreach ($attributesData as $attr) {
                $attrName = $attr['name'];
                if (!isset($attributeGroups[$attrName])) {
                    $attributeGroups[$attrName] = ['name' => $attrName, 'type' => $attr['type'], 'items' => []];
                }
                $attributeGroups[$attrName]['items'][] = ['displayValue' => $attr['display_value'], 'value' => $attr['value'], 'slug' => $attr['slug']];
            }
            foreach ($attributeGroups as $group) {
                $attributes[] = new Attribute($group['name'], $group['type'], $group['items']);
            }

            $pricesStmt = $this->pdo->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = ?");
            $pricesStmt->execute([$row['id']]);
            $prices = $pricesStmt->fetchAll(PDO::FETCH_ASSOC);

            $products[] = new Product(
                $row['id'],
                $row['name'],
                (bool)$row['in_stock'],
                $row['category_name'] ?? 'Uncategorized',
                $row['brand'],
                $gallery,
                $row['description'],
                array_map(fn($attr) => $attr->getAttributeDetails(), $attributes),
                $prices
            );
        }
        return array_map(fn($product) => $product->getProductDetails(), $products);
    }

    public function product($root, array $args): ?array
    {
        $id = $args['id'] ?? null;
        if (!$id) {
            return null;
        }

        $stmt = $this->pdo->prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $galleryStmt = $this->pdo->prepare("SELECT image_url FROM product_gallery WHERE product_id = ?");
        $galleryStmt->execute([$row['id']]);
        $gallery = $galleryStmt->fetchAll(PDO::FETCH_COLUMN);

        $attributesStmt = $this->pdo->prepare("SELECT a.name, a.type, ai.display_value, ai.value, ai.slug 
            FROM attributes a 
            JOIN product_attributes pa ON a.id = pa.attribute_id 
            JOIN attribute_items ai ON a.id = ai.attribute_id 
            WHERE pa.product_id = ?");
        $attributesStmt->execute([$row['id']]);
        $attributesData = $attributesStmt->fetchAll(PDO::FETCH_ASSOC);
        $attributes = [];
        $attributeGroups = [];
        foreach ($attributesData as $attr) {
            $attrName = $attr['name'];
            if (!isset($attributeGroups[$attrName])) {
                $attributeGroups[$attrName] = ['name' => $attrName, 'type' => $attr['type'], 'items' => []];
            }
            $attributeGroups[$attrName]['items'][] = ['displayValue' => $attr['display_value'], 'value' => $attr['value'], 'slug' => $attr['slug']];
        }
        foreach ($attributeGroups as $group) {
            $attributes[] = new Attribute($group['name'], $group['type'], $group['items']);
        }

        $pricesStmt = $this->pdo->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = ?");
        $pricesStmt->execute([$row['id']]);
        $prices = $pricesStmt->fetchAll(PDO::FETCH_ASSOC);

        $product = new Product(
            $row['id'],
            $row['name'],
            (bool)$row['in_stock'],
            $row['category_name'] ?? 'Uncategorized',
            $row['brand'],
            $gallery,
            $row['description'],
            array_map(fn($attr) => $attr->getAttributeDetails(), $attributes),
            $prices
        );

        return $product->getProductDetails();
    }
}