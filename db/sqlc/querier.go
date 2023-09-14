// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0

package db

import (
	"context"
)

type Querier interface {
	AssociateProductWithCategory(ctx context.Context, arg AssociateProductWithCategoryParams) (ProductCategory, error)
	CreateCategory(ctx context.Context, arg CreateCategoryParams) (Category, error)
	CreateClient(ctx context.Context, arg CreateClientParams) (Client, error)
	CreateProduct(ctx context.Context, arg CreateProductParams) (Product, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeleteCategory(ctx context.Context, id int64) error
	DeleteClient(ctx context.Context, id int64) error
	DeleteProduct(ctx context.Context, id int64) error
	DeleteUser(ctx context.Context, id int64) error
	DisassociateProductFromCategory(ctx context.Context, arg DisassociateProductFromCategoryParams) (ProductCategory, error)
	GetCategory(ctx context.Context, id int64) (Category, error)
	GetClient(ctx context.Context, id int64) (Client, error)
	GetProduct(ctx context.Context, id int64) (Product, error)
	GetUser(ctx context.Context, id int64) (User, error)
	ListCategories(ctx context.Context, arg ListCategoriesParams) ([]Category, error)
	ListCategoriesByProduct(ctx context.Context, productID int64) ([]Category, error)
	ListClients(ctx context.Context, arg ListClientsParams) ([]Client, error)
	ListProducts(ctx context.Context, arg ListProductsParams) ([]Product, error)
	ListProductsByCategory(ctx context.Context, arg ListProductsByCategoryParams) ([]Product, error)
	ListProductsByUser(ctx context.Context, userID int64) ([]Product, error)
	ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error)
	UpdateCategory(ctx context.Context, arg UpdateCategoryParams) (Category, error)
	UpdateClient(ctx context.Context, arg UpdateClientParams) (Client, error)
	UpdateProduct(ctx context.Context, arg UpdateProductParams) (Product, error)
	UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error)
}

var _ Querier = (*Queries)(nil)
