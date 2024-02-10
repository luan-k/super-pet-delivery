// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0

package db

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Client struct {
	ID                  int64     `json:"id"`
	FullName            string    `json:"full_name"`
	PhoneWhatsapp       string    `json:"phone_whatsapp"`
	PhoneLine           string    `json:"phone_line"`
	PetName             string    `json:"pet_name"`
	PetBreed            string    `json:"pet_breed"`
	AddressStreet       string    `json:"address_street"`
	AddressCity         string    `json:"address_city"`
	AddressNumber       string    `json:"address_number"`
	AddressNeighborhood string    `json:"address_neighborhood"`
	AddressReference    string    `json:"address_reference"`
	CreatedAt           time.Time `json:"created_at"`
	ChangedAt           time.Time `json:"changed_at"`
}

type Image struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Alt         string `json:"alt"`
	ImagePath   string `json:"image_path"`
}

type Product struct {
	ID          int64    `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	UserID      int64    `json:"user_id"`
	Price       string   `json:"price"`
	Images      []string `json:"images"`
}

type ProductCategory struct {
	ProductID  int64 `json:"product_id"`
	CategoryID int64 `json:"category_id"`
}

type ProductImage struct {
	ProductID int64 `json:"product_id"`
	ImageID   int64 `json:"image_id"`
}

type Sale struct {
	ID             int64     `json:"id"`
	ClientID       int64     `json:"client_id"`
	ClientName     string    `json:"client_name"`
	Product        string    `json:"product"`
	Price          float64   `json:"price"`
	Observation    string    `json:"observation"`
	CreatedAt      time.Time `json:"created_at"`
	ChangedAt      time.Time `json:"changed_at"`
	PdfGeneratedAt time.Time `json:"pdf_generated_at"`
}

type Session struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	RefreshToken string    `json:"refresh_token"`
	UserAgent    string    `json:"user_agent"`
	ClientIp     string    `json:"client_ip"`
	IsBlocked    bool      `json:"is_blocked"`
	ExpiresAt    time.Time `json:"expires_at"`
	CreatedAt    time.Time `json:"created_at"`
}

type User struct {
	ID                int64     `json:"id"`
	Username          string    `json:"username"`
	FullName          string    `json:"full_name"`
	Email             string    `json:"email"`
	HashedPassword    string    `json:"hashed_password"`
	PasswordChangedAt time.Time `json:"password_changed_at"`
	CreatedAt         time.Time `json:"created_at"`
	Role              string    `json:"role"`
}
