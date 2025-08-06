<?php
namespace App\GraphQL;

use GraphQL\Type\Schema;
use App\GraphQL\Type\QueryType;
use App\GraphQL\Type\MutationType;

class SchemaFactory
{
    public function create(): Schema
    {
        return new Schema([
            'query' => new QueryType(),
            'mutation' => new MutationType(),
        ]);
    }
}
