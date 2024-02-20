-- name: CreateProduct :one
INSERT INTO products (
    name,
    description,
    user_id,
    username,
    price,
    images
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetProduct :one
SELECT * FROM products 
WHERE id = $1 LIMIT 1;

-- name: ListProductsByUser :many
SELECT * FROM products
WHERE user_id = $1
ORDER BY id;

-- name: ListProducts :many
SELECT * FROM products 
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: ListProductsByCategory :many
SELECT p.*
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
WHERE pc.category_id = $1
ORDER BY p.id
LIMIT $2
OFFSET $3;

-- name: UpdateProduct :one
UPDATE  products 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    user_id = COALESCE($4, user_id),
    username = COALESCE($5, username),
    price = COALESCE($6, price),
    images = COALESCE($7, images)
WHERE id = $1
RETURNING *;

-- name: DeleteProduct :exec
DELETE FROM products 
WHERE id = $1;