// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: user.sql

package db

import (
	"context"
	"time"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (
    username,
    full_name,
    email,
    hashed_password,
    role
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING id, username, full_name, email, hashed_password, password_changed_at, created_at, role
`

type CreateUserParams struct {
	Username       string `json:"username"`
	FullName       string `json:"full_name"`
	Email          string `json:"email"`
	HashedPassword string `json:"hashed_password"`
	Role           string `json:"role"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.Username,
		arg.FullName,
		arg.Email,
		arg.HashedPassword,
		arg.Role,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.FullName,
		&i.Email,
		&i.HashedPassword,
		&i.PasswordChangedAt,
		&i.CreatedAt,
		&i.Role,
	)
	return i, err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1
`

func (q *Queries) DeleteUser(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteUser, id)
	return err
}

const getUser = `-- name: GetUser :one
SELECT id, username, full_name, email, hashed_password, password_changed_at, created_at, role FROM users
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetUser(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUser, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.FullName,
		&i.Email,
		&i.HashedPassword,
		&i.PasswordChangedAt,
		&i.CreatedAt,
		&i.Role,
	)
	return i, err
}

const getUserByUsername = `-- name: GetUserByUsername :one
SELECT id, username, full_name, email, hashed_password, password_changed_at, created_at, role FROM users
WHERE username = $1
LIMIT 1
`

func (q *Queries) GetUserByUsername(ctx context.Context, username string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByUsername, username)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.FullName,
		&i.Email,
		&i.HashedPassword,
		&i.PasswordChangedAt,
		&i.CreatedAt,
		&i.Role,
	)
	return i, err
}

const listUsers = `-- name: ListUsers :many
SELECT id, username, full_name, email, hashed_password, password_changed_at, created_at, role FROM users
ORDER BY id
LIMIT $1
OFFSET $2
`

type ListUsersParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, listUsers, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []User{}
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.FullName,
			&i.Email,
			&i.HashedPassword,
			&i.PasswordChangedAt,
			&i.CreatedAt,
			&i.Role,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateUser = `-- name: UpdateUser :one
UPDATE users 
SET 
    username = COALESCE($2, username),
    full_name = COALESCE($3, full_name),
    email = COALESCE($4, email),
    hashed_password = COALESCE($5, hashed_password),
    password_changed_at = COALESCE($6, password_changed_at),
    role = COALESCE($7, role)
WHERE id = $1
RETURNING id, username, full_name, email, hashed_password, password_changed_at, created_at, role
`

type UpdateUserParams struct {
	ID                int64     `json:"id"`
	Username          string    `json:"username"`
	FullName          string    `json:"full_name"`
	Email             string    `json:"email"`
	HashedPassword    string    `json:"hashed_password"`
	PasswordChangedAt time.Time `json:"password_changed_at"`
	Role              string    `json:"role"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser,
		arg.ID,
		arg.Username,
		arg.FullName,
		arg.Email,
		arg.HashedPassword,
		arg.PasswordChangedAt,
		arg.Role,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.FullName,
		&i.Email,
		&i.HashedPassword,
		&i.PasswordChangedAt,
		&i.CreatedAt,
		&i.Role,
	)
	return i, err
}
