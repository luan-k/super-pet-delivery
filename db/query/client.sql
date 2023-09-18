-- name: CreateClient :one
INSERT INTO client (
    full_name,
    phone_whatsapp,
    phone_line,
    pet_name,
    pet_breed,
    address_street,
    address_number,
    address_neighborhood,
    address_reference
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
) RETURNING *;

-- name: GetClient :one
SELECT * FROM client
WHERE id = $1 LIMIT 1;

-- name: ListClients :many
SELECT * FROM client
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateClient :one
UPDATE client 
SET 
    full_name = COALESCE($2, full_name),
    phone_whatsapp = COALESCE($3, phone_whatsapp),
    phone_line = COALESCE($4, phone_line),
    pet_name = COALESCE($5, pet_name),
    pet_breed = COALESCE($6, pet_breed),
    address_street = COALESCE($7, address_street),
    address_number = COALESCE($8, address_number),
    address_neighborhood = COALESCE($9, address_neighborhood),
    address_reference = COALESCE($10, address_reference)
WHERE id = $1
RETURNING *;

-- name: DeleteClient :exec
DELETE FROM client
WHERE id = $1;