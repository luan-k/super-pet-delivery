// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0

package db

import (
	"context"

	"github.com/google/uuid"
)

type Querier interface {
	AssociateProductWithCategory(ctx context.Context, arg AssociateProductWithCategoryParams) (ProductCategory, error)
	AssociateProductWithImage(ctx context.Context, arg AssociateProductWithImageParams) (ProductImage, error)
	CreateCategory(ctx context.Context, arg CreateCategoryParams) (Category, error)
	CreateClient(ctx context.Context, arg CreateClientParams) (Client, error)
	CreateImage(ctx context.Context, arg CreateImageParams) (Image, error)
	CreateProduct(ctx context.Context, arg CreateProductParams) (Product, error)
	CreateSale(ctx context.Context, arg CreateSaleParams) (Sale, error)
	CreateSession(ctx context.Context, arg CreateSessionParams) (Session, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeleteCategory(ctx context.Context, id int64) error
	DeleteClient(ctx context.Context, id int64) error
	DeleteImage(ctx context.Context, id int64) error
	DeleteProduct(ctx context.Context, id int64) error
	DeleteSale(ctx context.Context, id int64) error
	DeleteUser(ctx context.Context, id int64) error
	DisassociateProductFromCategory(ctx context.Context, arg DisassociateProductFromCategoryParams) (ProductCategory, error)
	DisassociateProductFromImage(ctx context.Context, arg DisassociateProductFromImageParams) (ProductImage, error)
	GetCategory(ctx context.Context, id int64) (Category, error)
	GetClient(ctx context.Context, id int64) (Client, error)
	GetImage(ctx context.Context, id int64) (Image, error)
	GetProduct(ctx context.Context, id int64) (Product, error)
	GetSale(ctx context.Context, id int64) (Sale, error)
	GetSession(ctx context.Context, id uuid.UUID) (Session, error)
	GetUser(ctx context.Context, id int64) (User, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	GetUserByUsername(ctx context.Context, username string) (User, error)
	ListCategories(ctx context.Context, arg ListCategoriesParams) ([]Category, error)
	ListCategoriesByProduct(ctx context.Context, productID int64) ([]Category, error)
	ListClients(ctx context.Context, arg ListClientsParams) ([]Client, error)
	ListImages(ctx context.Context, arg ListImagesParams) ([]Image, error)
	ListImagesByProduct(ctx context.Context, productID int64) ([]Image, error)
	ListProducts(ctx context.Context, arg ListProductsParams) ([]Product, error)
	ListProductsByCategory(ctx context.Context, arg ListProductsByCategoryParams) ([]Product, error)
	ListProductsByUser(ctx context.Context, userID int64) ([]Product, error)
	ListSales(ctx context.Context, arg ListSalesParams) ([]Sale, error)
	ListSessionsByUsername(ctx context.Context, username string) ([]Session, error)
	ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error)
	UpdateCategory(ctx context.Context, arg UpdateCategoryParams) (Category, error)
	UpdateClient(ctx context.Context, arg UpdateClientParams) (Client, error)
	UpdateImage(ctx context.Context, arg UpdateImageParams) (Image, error)
	UpdateProduct(ctx context.Context, arg UpdateProductParams) (Product, error)
	UpdateSale(ctx context.Context, arg UpdateSaleParams) (Sale, error)
	UpdateSession(ctx context.Context, arg UpdateSessionParams) (Session, error)
	UpdateSessionsUsername(ctx context.Context, arg UpdateSessionsUsernameParams) ([]Session, error)
	UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error)
}

var _ Querier = (*Queries)(nil)
