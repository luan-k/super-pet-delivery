// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: session.sql

package db

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createSession = `-- name: CreateSession :one
INSERT INTO sessions (
    id,
    username,
    refresh_token,
    user_agent,
    client_ip,
    is_blocked,
    expires_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING id, username, refresh_token, user_agent, client_ip, is_blocked, expires_at, created_at
`

type CreateSessionParams struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	RefreshToken string    `json:"refresh_token"`
	UserAgent    string    `json:"user_agent"`
	ClientIp     string    `json:"client_ip"`
	IsBlocked    bool      `json:"is_blocked"`
	ExpiresAt    time.Time `json:"expires_at"`
}

func (q *Queries) CreateSession(ctx context.Context, arg CreateSessionParams) (Session, error) {
	row := q.db.QueryRowContext(ctx, createSession,
		arg.ID,
		arg.Username,
		arg.RefreshToken,
		arg.UserAgent,
		arg.ClientIp,
		arg.IsBlocked,
		arg.ExpiresAt,
	)
	var i Session
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.RefreshToken,
		&i.UserAgent,
		&i.ClientIp,
		&i.IsBlocked,
		&i.ExpiresAt,
		&i.CreatedAt,
	)
	return i, err
}

const getSession = `-- name: GetSession :one
SELECT id, username, refresh_token, user_agent, client_ip, is_blocked, expires_at, created_at FROM sessions
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetSession(ctx context.Context, id uuid.UUID) (Session, error) {
	row := q.db.QueryRowContext(ctx, getSession, id)
	var i Session
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.RefreshToken,
		&i.UserAgent,
		&i.ClientIp,
		&i.IsBlocked,
		&i.ExpiresAt,
		&i.CreatedAt,
	)
	return i, err
}

const listSessionsByUsername = `-- name: ListSessionsByUsername :many
SELECT id, username, refresh_token, user_agent, client_ip, is_blocked, expires_at, created_at FROM sessions
WHERE username = $1
`

func (q *Queries) ListSessionsByUsername(ctx context.Context, username string) ([]Session, error) {
	rows, err := q.db.QueryContext(ctx, listSessionsByUsername, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Session{}
	for rows.Next() {
		var i Session
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.RefreshToken,
			&i.UserAgent,
			&i.ClientIp,
			&i.IsBlocked,
			&i.ExpiresAt,
			&i.CreatedAt,
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

const updateSession = `-- name: UpdateSession :one
UPDATE sessions 
SET 
    username = COALESCE($2, username)
WHERE id = $1
RETURNING id, username, refresh_token, user_agent, client_ip, is_blocked, expires_at, created_at
`

type UpdateSessionParams struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
}

func (q *Queries) UpdateSession(ctx context.Context, arg UpdateSessionParams) (Session, error) {
	row := q.db.QueryRowContext(ctx, updateSession, arg.ID, arg.Username)
	var i Session
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.RefreshToken,
		&i.UserAgent,
		&i.ClientIp,
		&i.IsBlocked,
		&i.ExpiresAt,
		&i.CreatedAt,
	)
	return i, err
}

const updateSessionsUsername = `-- name: UpdateSessionsUsername :many
UPDATE sessions
SET username = $2
WHERE username = $1
RETURNING id, username, refresh_token, user_agent, client_ip, is_blocked, expires_at, created_at
`

type UpdateSessionsUsernameParams struct {
	Username   string `json:"username"`
	Username_2 string `json:"username_2"`
}

func (q *Queries) UpdateSessionsUsername(ctx context.Context, arg UpdateSessionsUsernameParams) ([]Session, error) {
	rows, err := q.db.QueryContext(ctx, updateSessionsUsername, arg.Username, arg.Username_2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Session{}
	for rows.Next() {
		var i Session
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.RefreshToken,
			&i.UserAgent,
			&i.ClientIp,
			&i.IsBlocked,
			&i.ExpiresAt,
			&i.CreatedAt,
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
