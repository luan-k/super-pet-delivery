-- name: CreateSale :one
INSERT INTO sale (
    client_id,
    client_name,
    product,
    price,
    observation
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetSale :one
SELECT * FROM sale
WHERE id = $1 LIMIT 1;

-- name: ListSales :many
SELECT * FROM sale
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: CountSales :one
SELECT COUNT(*) FROM sale;

-- name: UpdateSale :one
UPDATE sale 
SET 
    client_id = COALESCE($2, client_id),
    client_name = COALESCE($3, client_name),
    product = COALESCE($4, product),
    price = COALESCE($5, price),
    observation = COALESCE($6, observation)
WHERE id = $1
RETURNING *;

-- name: DeleteSale :exec
DELETE FROM sale
WHERE id = $1;
