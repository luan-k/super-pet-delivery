// Code generated by MockGen. DO NOT EDIT.
// Source: super-pet-delivery/db/sqlc (interfaces: Store)

// Package mockdb is a generated GoMock package.
package mockdb

import (
	context "context"
	reflect "reflect"
	db "super-pet-delivery/db/sqlc"

	uuid "github.com/google/uuid"
	gomock "go.uber.org/mock/gomock"
)

// MockStore is a mock of Store interface.
type MockStore struct {
	ctrl     *gomock.Controller
	recorder *MockStoreMockRecorder
}

// MockStoreMockRecorder is the mock recorder for MockStore.
type MockStoreMockRecorder struct {
	mock *MockStore
}

// NewMockStore creates a new mock instance.
func NewMockStore(ctrl *gomock.Controller) *MockStore {
	mock := &MockStore{ctrl: ctrl}
	mock.recorder = &MockStoreMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockStore) EXPECT() *MockStoreMockRecorder {
	return m.recorder
}

// AssociateProductWithCategory mocks base method.
func (m *MockStore) AssociateProductWithCategory(arg0 context.Context, arg1 db.AssociateProductWithCategoryParams) (db.ProductCategory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AssociateProductWithCategory", arg0, arg1)
	ret0, _ := ret[0].(db.ProductCategory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// AssociateProductWithCategory indicates an expected call of AssociateProductWithCategory.
func (mr *MockStoreMockRecorder) AssociateProductWithCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AssociateProductWithCategory", reflect.TypeOf((*MockStore)(nil).AssociateProductWithCategory), arg0, arg1)
}

// AssociateProductWithImage mocks base method.
func (m *MockStore) AssociateProductWithImage(arg0 context.Context, arg1 db.AssociateProductWithImageParams) (db.ProductImage, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AssociateProductWithImage", arg0, arg1)
	ret0, _ := ret[0].(db.ProductImage)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// AssociateProductWithImage indicates an expected call of AssociateProductWithImage.
func (mr *MockStoreMockRecorder) AssociateProductWithImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AssociateProductWithImage", reflect.TypeOf((*MockStore)(nil).AssociateProductWithImage), arg0, arg1)
}

// CountCategory mocks base method.
func (m *MockStore) CountCategory(arg0 context.Context) (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountCategory", arg0)
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CountCategory indicates an expected call of CountCategory.
func (mr *MockStoreMockRecorder) CountCategory(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountCategory", reflect.TypeOf((*MockStore)(nil).CountCategory), arg0)
}

// CountClients mocks base method.
func (m *MockStore) CountClients(arg0 context.Context) (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountClients", arg0)
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CountClients indicates an expected call of CountClients.
func (mr *MockStoreMockRecorder) CountClients(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountClients", reflect.TypeOf((*MockStore)(nil).CountClients), arg0)
}

// CountImages mocks base method.
func (m *MockStore) CountImages(arg0 context.Context) (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountImages", arg0)
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CountImages indicates an expected call of CountImages.
func (mr *MockStoreMockRecorder) CountImages(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountImages", reflect.TypeOf((*MockStore)(nil).CountImages), arg0)
}

// CountProducts mocks base method.
func (m *MockStore) CountProducts(arg0 context.Context) (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountProducts", arg0)
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CountProducts indicates an expected call of CountProducts.
func (mr *MockStoreMockRecorder) CountProducts(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountProducts", reflect.TypeOf((*MockStore)(nil).CountProducts), arg0)
}

// CountSales mocks base method.
func (m *MockStore) CountSales(arg0 context.Context) (int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountSales", arg0)
	ret0, _ := ret[0].(int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CountSales indicates an expected call of CountSales.
func (mr *MockStoreMockRecorder) CountSales(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountSales", reflect.TypeOf((*MockStore)(nil).CountSales), arg0)
}

// CreateCategory mocks base method.
func (m *MockStore) CreateCategory(arg0 context.Context, arg1 db.CreateCategoryParams) (db.Category, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateCategory", arg0, arg1)
	ret0, _ := ret[0].(db.Category)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateCategory indicates an expected call of CreateCategory.
func (mr *MockStoreMockRecorder) CreateCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateCategory", reflect.TypeOf((*MockStore)(nil).CreateCategory), arg0, arg1)
}

// CreateClient mocks base method.
func (m *MockStore) CreateClient(arg0 context.Context, arg1 db.CreateClientParams) (db.Client, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateClient", arg0, arg1)
	ret0, _ := ret[0].(db.Client)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateClient indicates an expected call of CreateClient.
func (mr *MockStoreMockRecorder) CreateClient(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateClient", reflect.TypeOf((*MockStore)(nil).CreateClient), arg0, arg1)
}

// CreateImage mocks base method.
func (m *MockStore) CreateImage(arg0 context.Context, arg1 db.CreateImageParams) (db.Image, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateImage", arg0, arg1)
	ret0, _ := ret[0].(db.Image)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateImage indicates an expected call of CreateImage.
func (mr *MockStoreMockRecorder) CreateImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateImage", reflect.TypeOf((*MockStore)(nil).CreateImage), arg0, arg1)
}

// CreateProduct mocks base method.
func (m *MockStore) CreateProduct(arg0 context.Context, arg1 db.CreateProductParams) (db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateProduct", arg0, arg1)
	ret0, _ := ret[0].(db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateProduct indicates an expected call of CreateProduct.
func (mr *MockStoreMockRecorder) CreateProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateProduct", reflect.TypeOf((*MockStore)(nil).CreateProduct), arg0, arg1)
}

// CreateSale mocks base method.
func (m *MockStore) CreateSale(arg0 context.Context, arg1 db.CreateSaleParams) (db.Sale, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateSale", arg0, arg1)
	ret0, _ := ret[0].(db.Sale)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateSale indicates an expected call of CreateSale.
func (mr *MockStoreMockRecorder) CreateSale(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateSale", reflect.TypeOf((*MockStore)(nil).CreateSale), arg0, arg1)
}

// CreateSession mocks base method.
func (m *MockStore) CreateSession(arg0 context.Context, arg1 db.CreateSessionParams) (db.Session, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateSession", arg0, arg1)
	ret0, _ := ret[0].(db.Session)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateSession indicates an expected call of CreateSession.
func (mr *MockStoreMockRecorder) CreateSession(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateSession", reflect.TypeOf((*MockStore)(nil).CreateSession), arg0, arg1)
}

// CreateSliderImage mocks base method.
func (m *MockStore) CreateSliderImage(arg0 context.Context, arg1 db.CreateSliderImageParams) (db.SliderImageWidget, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateSliderImage", arg0, arg1)
	ret0, _ := ret[0].(db.SliderImageWidget)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateSliderImage indicates an expected call of CreateSliderImage.
func (mr *MockStoreMockRecorder) CreateSliderImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateSliderImage", reflect.TypeOf((*MockStore)(nil).CreateSliderImage), arg0, arg1)
}

// CreateUser mocks base method.
func (m *MockStore) CreateUser(arg0 context.Context, arg1 db.CreateUserParams) (db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateUser", arg0, arg1)
	ret0, _ := ret[0].(db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateUser indicates an expected call of CreateUser.
func (mr *MockStoreMockRecorder) CreateUser(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateUser", reflect.TypeOf((*MockStore)(nil).CreateUser), arg0, arg1)
}

// DeleteByImageId mocks base method.
func (m *MockStore) DeleteByImageId(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteByImageId", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteByImageId indicates an expected call of DeleteByImageId.
func (mr *MockStoreMockRecorder) DeleteByImageId(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteByImageId", reflect.TypeOf((*MockStore)(nil).DeleteByImageId), arg0, arg1)
}

// DeleteCategory mocks base method.
func (m *MockStore) DeleteCategory(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteCategory", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteCategory indicates an expected call of DeleteCategory.
func (mr *MockStoreMockRecorder) DeleteCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteCategory", reflect.TypeOf((*MockStore)(nil).DeleteCategory), arg0, arg1)
}

// DeleteClient mocks base method.
func (m *MockStore) DeleteClient(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteClient", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteClient indicates an expected call of DeleteClient.
func (mr *MockStoreMockRecorder) DeleteClient(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteClient", reflect.TypeOf((*MockStore)(nil).DeleteClient), arg0, arg1)
}

// DeleteImage mocks base method.
func (m *MockStore) DeleteImage(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteImage", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteImage indicates an expected call of DeleteImage.
func (mr *MockStoreMockRecorder) DeleteImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteImage", reflect.TypeOf((*MockStore)(nil).DeleteImage), arg0, arg1)
}

// DeleteProduct mocks base method.
func (m *MockStore) DeleteProduct(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteProduct", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteProduct indicates an expected call of DeleteProduct.
func (mr *MockStoreMockRecorder) DeleteProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteProduct", reflect.TypeOf((*MockStore)(nil).DeleteProduct), arg0, arg1)
}

// DeleteSale mocks base method.
func (m *MockStore) DeleteSale(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteSale", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteSale indicates an expected call of DeleteSale.
func (mr *MockStoreMockRecorder) DeleteSale(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteSale", reflect.TypeOf((*MockStore)(nil).DeleteSale), arg0, arg1)
}

// DeleteSales mocks base method.
func (m *MockStore) DeleteSales(arg0 context.Context, arg1 []int32) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteSales", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteSales indicates an expected call of DeleteSales.
func (mr *MockStoreMockRecorder) DeleteSales(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteSales", reflect.TypeOf((*MockStore)(nil).DeleteSales), arg0, arg1)
}

// DeleteSliderImage mocks base method.
func (m *MockStore) DeleteSliderImage(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteSliderImage", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteSliderImage indicates an expected call of DeleteSliderImage.
func (mr *MockStoreMockRecorder) DeleteSliderImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteSliderImage", reflect.TypeOf((*MockStore)(nil).DeleteSliderImage), arg0, arg1)
}

// DeleteUser mocks base method.
func (m *MockStore) DeleteUser(arg0 context.Context, arg1 int64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteUser", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteUser indicates an expected call of DeleteUser.
func (mr *MockStoreMockRecorder) DeleteUser(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteUser", reflect.TypeOf((*MockStore)(nil).DeleteUser), arg0, arg1)
}

// DisassociateProductFromCategory mocks base method.
func (m *MockStore) DisassociateProductFromCategory(arg0 context.Context, arg1 db.DisassociateProductFromCategoryParams) (db.ProductCategory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DisassociateProductFromCategory", arg0, arg1)
	ret0, _ := ret[0].(db.ProductCategory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DisassociateProductFromCategory indicates an expected call of DisassociateProductFromCategory.
func (mr *MockStoreMockRecorder) DisassociateProductFromCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DisassociateProductFromCategory", reflect.TypeOf((*MockStore)(nil).DisassociateProductFromCategory), arg0, arg1)
}

// DisassociateProductFromImage mocks base method.
func (m *MockStore) DisassociateProductFromImage(arg0 context.Context, arg1 db.DisassociateProductFromImageParams) (db.ProductImage, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DisassociateProductFromImage", arg0, arg1)
	ret0, _ := ret[0].(db.ProductImage)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// DisassociateProductFromImage indicates an expected call of DisassociateProductFromImage.
func (mr *MockStoreMockRecorder) DisassociateProductFromImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DisassociateProductFromImage", reflect.TypeOf((*MockStore)(nil).DisassociateProductFromImage), arg0, arg1)
}

// EditAssociation mocks base method.
func (m *MockStore) EditAssociation(arg0 context.Context, arg1 db.EditAssociationParams) (db.ProductImage, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "EditAssociation", arg0, arg1)
	ret0, _ := ret[0].(db.ProductImage)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// EditAssociation indicates an expected call of EditAssociation.
func (mr *MockStoreMockRecorder) EditAssociation(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "EditAssociation", reflect.TypeOf((*MockStore)(nil).EditAssociation), arg0, arg1)
}

// GetAllSaleIDs mocks base method.
func (m *MockStore) GetAllSaleIDs(arg0 context.Context) ([]int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetAllSaleIDs", arg0)
	ret0, _ := ret[0].([]int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetAllSaleIDs indicates an expected call of GetAllSaleIDs.
func (mr *MockStoreMockRecorder) GetAllSaleIDs(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetAllSaleIDs", reflect.TypeOf((*MockStore)(nil).GetAllSaleIDs), arg0)
}

// GetCategory mocks base method.
func (m *MockStore) GetCategory(arg0 context.Context, arg1 int64) (db.Category, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetCategory", arg0, arg1)
	ret0, _ := ret[0].(db.Category)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetCategory indicates an expected call of GetCategory.
func (mr *MockStoreMockRecorder) GetCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetCategory", reflect.TypeOf((*MockStore)(nil).GetCategory), arg0, arg1)
}

// GetClient mocks base method.
func (m *MockStore) GetClient(arg0 context.Context, arg1 int64) (db.Client, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetClient", arg0, arg1)
	ret0, _ := ret[0].(db.Client)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetClient indicates an expected call of GetClient.
func (mr *MockStoreMockRecorder) GetClient(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetClient", reflect.TypeOf((*MockStore)(nil).GetClient), arg0, arg1)
}

// GetImage mocks base method.
func (m *MockStore) GetImage(arg0 context.Context, arg1 int64) (db.Image, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetImage", arg0, arg1)
	ret0, _ := ret[0].(db.Image)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetImage indicates an expected call of GetImage.
func (mr *MockStoreMockRecorder) GetImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetImage", reflect.TypeOf((*MockStore)(nil).GetImage), arg0, arg1)
}

// GetProduct mocks base method.
func (m *MockStore) GetProduct(arg0 context.Context, arg1 int64) (db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetProduct", arg0, arg1)
	ret0, _ := ret[0].(db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProduct indicates an expected call of GetProduct.
func (mr *MockStoreMockRecorder) GetProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProduct", reflect.TypeOf((*MockStore)(nil).GetProduct), arg0, arg1)
}

// GetProductByURL mocks base method.
func (m *MockStore) GetProductByURL(arg0 context.Context, arg1 string) (db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetProductByURL", arg0, arg1)
	ret0, _ := ret[0].(db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetProductByURL indicates an expected call of GetProductByURL.
func (mr *MockStoreMockRecorder) GetProductByURL(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetProductByURL", reflect.TypeOf((*MockStore)(nil).GetProductByURL), arg0, arg1)
}

// GetSale mocks base method.
func (m *MockStore) GetSale(arg0 context.Context, arg1 int64) (db.Sale, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSale", arg0, arg1)
	ret0, _ := ret[0].(db.Sale)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSale indicates an expected call of GetSale.
func (mr *MockStoreMockRecorder) GetSale(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSale", reflect.TypeOf((*MockStore)(nil).GetSale), arg0, arg1)
}

// GetSalesByClientID mocks base method.
func (m *MockStore) GetSalesByClientID(arg0 context.Context, arg1 int64) ([]db.Sale, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSalesByClientID", arg0, arg1)
	ret0, _ := ret[0].([]db.Sale)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSalesByClientID indicates an expected call of GetSalesByClientID.
func (mr *MockStoreMockRecorder) GetSalesByClientID(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSalesByClientID", reflect.TypeOf((*MockStore)(nil).GetSalesByClientID), arg0, arg1)
}

// GetSalesByDate mocks base method.
func (m *MockStore) GetSalesByDate(arg0 context.Context, arg1 db.GetSalesByDateParams) ([]int64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSalesByDate", arg0, arg1)
	ret0, _ := ret[0].([]int64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSalesByDate indicates an expected call of GetSalesByDate.
func (mr *MockStoreMockRecorder) GetSalesByDate(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSalesByDate", reflect.TypeOf((*MockStore)(nil).GetSalesByDate), arg0, arg1)
}

// GetSession mocks base method.
func (m *MockStore) GetSession(arg0 context.Context, arg1 uuid.UUID) (db.Session, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetSession", arg0, arg1)
	ret0, _ := ret[0].(db.Session)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetSession indicates an expected call of GetSession.
func (mr *MockStoreMockRecorder) GetSession(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetSession", reflect.TypeOf((*MockStore)(nil).GetSession), arg0, arg1)
}

// GetUser mocks base method.
func (m *MockStore) GetUser(arg0 context.Context, arg1 int64) (db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUser", arg0, arg1)
	ret0, _ := ret[0].(db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUser indicates an expected call of GetUser.
func (mr *MockStoreMockRecorder) GetUser(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUser", reflect.TypeOf((*MockStore)(nil).GetUser), arg0, arg1)
}

// GetUserByEmail mocks base method.
func (m *MockStore) GetUserByEmail(arg0 context.Context, arg1 string) (db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUserByEmail", arg0, arg1)
	ret0, _ := ret[0].(db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUserByEmail indicates an expected call of GetUserByEmail.
func (mr *MockStoreMockRecorder) GetUserByEmail(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUserByEmail", reflect.TypeOf((*MockStore)(nil).GetUserByEmail), arg0, arg1)
}

// GetUserByUsername mocks base method.
func (m *MockStore) GetUserByUsername(arg0 context.Context, arg1 string) (db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUserByUsername", arg0, arg1)
	ret0, _ := ret[0].(db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUserByUsername indicates an expected call of GetUserByUsername.
func (mr *MockStoreMockRecorder) GetUserByUsername(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUserByUsername", reflect.TypeOf((*MockStore)(nil).GetUserByUsername), arg0, arg1)
}

// ListCategories mocks base method.
func (m *MockStore) ListCategories(arg0 context.Context, arg1 db.ListCategoriesParams) ([]db.Category, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListCategories", arg0, arg1)
	ret0, _ := ret[0].([]db.Category)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListCategories indicates an expected call of ListCategories.
func (mr *MockStoreMockRecorder) ListCategories(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListCategories", reflect.TypeOf((*MockStore)(nil).ListCategories), arg0, arg1)
}

// ListCategoriesByProduct mocks base method.
func (m *MockStore) ListCategoriesByProduct(arg0 context.Context, arg1 int64) ([]db.Category, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListCategoriesByProduct", arg0, arg1)
	ret0, _ := ret[0].([]db.Category)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListCategoriesByProduct indicates an expected call of ListCategoriesByProduct.
func (mr *MockStoreMockRecorder) ListCategoriesByProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListCategoriesByProduct", reflect.TypeOf((*MockStore)(nil).ListCategoriesByProduct), arg0, arg1)
}

// ListClients mocks base method.
func (m *MockStore) ListClients(arg0 context.Context, arg1 db.ListClientsParams) ([]db.Client, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListClients", arg0, arg1)
	ret0, _ := ret[0].([]db.Client)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListClients indicates an expected call of ListClients.
func (mr *MockStoreMockRecorder) ListClients(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListClients", reflect.TypeOf((*MockStore)(nil).ListClients), arg0, arg1)
}

// ListImages mocks base method.
func (m *MockStore) ListImages(arg0 context.Context, arg1 db.ListImagesParams) ([]db.Image, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListImages", arg0, arg1)
	ret0, _ := ret[0].([]db.Image)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListImages indicates an expected call of ListImages.
func (mr *MockStoreMockRecorder) ListImages(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListImages", reflect.TypeOf((*MockStore)(nil).ListImages), arg0, arg1)
}

// ListImagesByProduct mocks base method.
func (m *MockStore) ListImagesByProduct(arg0 context.Context, arg1 int64) ([]db.ListImagesByProductRow, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListImagesByProduct", arg0, arg1)
	ret0, _ := ret[0].([]db.ListImagesByProductRow)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListImagesByProduct indicates an expected call of ListImagesByProduct.
func (mr *MockStoreMockRecorder) ListImagesByProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListImagesByProduct", reflect.TypeOf((*MockStore)(nil).ListImagesByProduct), arg0, arg1)
}

// ListProducts mocks base method.
func (m *MockStore) ListProducts(arg0 context.Context, arg1 db.ListProductsParams) ([]db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListProducts", arg0, arg1)
	ret0, _ := ret[0].([]db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListProducts indicates an expected call of ListProducts.
func (mr *MockStoreMockRecorder) ListProducts(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListProducts", reflect.TypeOf((*MockStore)(nil).ListProducts), arg0, arg1)
}

// ListProductsByCategory mocks base method.
func (m *MockStore) ListProductsByCategory(arg0 context.Context, arg1 int64) ([]db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListProductsByCategory", arg0, arg1)
	ret0, _ := ret[0].([]db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListProductsByCategory indicates an expected call of ListProductsByCategory.
func (mr *MockStoreMockRecorder) ListProductsByCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListProductsByCategory", reflect.TypeOf((*MockStore)(nil).ListProductsByCategory), arg0, arg1)
}

// ListProductsByUser mocks base method.
func (m *MockStore) ListProductsByUser(arg0 context.Context, arg1 int64) ([]db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListProductsByUser", arg0, arg1)
	ret0, _ := ret[0].([]db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListProductsByUser indicates an expected call of ListProductsByUser.
func (mr *MockStoreMockRecorder) ListProductsByUser(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListProductsByUser", reflect.TypeOf((*MockStore)(nil).ListProductsByUser), arg0, arg1)
}

// ListSales mocks base method.
func (m *MockStore) ListSales(arg0 context.Context, arg1 db.ListSalesParams) ([]db.Sale, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListSales", arg0, arg1)
	ret0, _ := ret[0].([]db.Sale)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListSales indicates an expected call of ListSales.
func (mr *MockStoreMockRecorder) ListSales(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListSales", reflect.TypeOf((*MockStore)(nil).ListSales), arg0, arg1)
}

// ListSessionsByUsername mocks base method.
func (m *MockStore) ListSessionsByUsername(arg0 context.Context, arg1 string) ([]db.Session, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListSessionsByUsername", arg0, arg1)
	ret0, _ := ret[0].([]db.Session)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListSessionsByUsername indicates an expected call of ListSessionsByUsername.
func (mr *MockStoreMockRecorder) ListSessionsByUsername(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListSessionsByUsername", reflect.TypeOf((*MockStore)(nil).ListSessionsByUsername), arg0, arg1)
}

// ListSliderImages mocks base method.
func (m *MockStore) ListSliderImages(arg0 context.Context, arg1 db.ListSliderImagesParams) ([]db.SliderImageWidget, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListSliderImages", arg0, arg1)
	ret0, _ := ret[0].([]db.SliderImageWidget)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListSliderImages indicates an expected call of ListSliderImages.
func (mr *MockStoreMockRecorder) ListSliderImages(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListSliderImages", reflect.TypeOf((*MockStore)(nil).ListSliderImages), arg0, arg1)
}

// ListUsers mocks base method.
func (m *MockStore) ListUsers(arg0 context.Context, arg1 db.ListUsersParams) ([]db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListUsers", arg0, arg1)
	ret0, _ := ret[0].([]db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListUsers indicates an expected call of ListUsers.
func (mr *MockStoreMockRecorder) ListUsers(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListUsers", reflect.TypeOf((*MockStore)(nil).ListUsers), arg0, arg1)
}

// UpdateCategory mocks base method.
func (m *MockStore) UpdateCategory(arg0 context.Context, arg1 db.UpdateCategoryParams) (db.Category, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateCategory", arg0, arg1)
	ret0, _ := ret[0].(db.Category)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateCategory indicates an expected call of UpdateCategory.
func (mr *MockStoreMockRecorder) UpdateCategory(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateCategory", reflect.TypeOf((*MockStore)(nil).UpdateCategory), arg0, arg1)
}

// UpdateClient mocks base method.
func (m *MockStore) UpdateClient(arg0 context.Context, arg1 db.UpdateClientParams) (db.Client, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateClient", arg0, arg1)
	ret0, _ := ret[0].(db.Client)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateClient indicates an expected call of UpdateClient.
func (mr *MockStoreMockRecorder) UpdateClient(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateClient", reflect.TypeOf((*MockStore)(nil).UpdateClient), arg0, arg1)
}

// UpdateImage mocks base method.
func (m *MockStore) UpdateImage(arg0 context.Context, arg1 db.UpdateImageParams) (db.Image, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateImage", arg0, arg1)
	ret0, _ := ret[0].(db.Image)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateImage indicates an expected call of UpdateImage.
func (mr *MockStoreMockRecorder) UpdateImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateImage", reflect.TypeOf((*MockStore)(nil).UpdateImage), arg0, arg1)
}

// UpdateProduct mocks base method.
func (m *MockStore) UpdateProduct(arg0 context.Context, arg1 db.UpdateProductParams) (db.Product, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateProduct", arg0, arg1)
	ret0, _ := ret[0].(db.Product)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateProduct indicates an expected call of UpdateProduct.
func (mr *MockStoreMockRecorder) UpdateProduct(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateProduct", reflect.TypeOf((*MockStore)(nil).UpdateProduct), arg0, arg1)
}

// UpdateSale mocks base method.
func (m *MockStore) UpdateSale(arg0 context.Context, arg1 db.UpdateSaleParams) (db.Sale, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateSale", arg0, arg1)
	ret0, _ := ret[0].(db.Sale)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateSale indicates an expected call of UpdateSale.
func (mr *MockStoreMockRecorder) UpdateSale(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateSale", reflect.TypeOf((*MockStore)(nil).UpdateSale), arg0, arg1)
}

// UpdateSession mocks base method.
func (m *MockStore) UpdateSession(arg0 context.Context, arg1 db.UpdateSessionParams) (db.Session, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateSession", arg0, arg1)
	ret0, _ := ret[0].(db.Session)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateSession indicates an expected call of UpdateSession.
func (mr *MockStoreMockRecorder) UpdateSession(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateSession", reflect.TypeOf((*MockStore)(nil).UpdateSession), arg0, arg1)
}

// UpdateSessionsUsername mocks base method.
func (m *MockStore) UpdateSessionsUsername(arg0 context.Context, arg1 db.UpdateSessionsUsernameParams) ([]db.Session, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateSessionsUsername", arg0, arg1)
	ret0, _ := ret[0].([]db.Session)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateSessionsUsername indicates an expected call of UpdateSessionsUsername.
func (mr *MockStoreMockRecorder) UpdateSessionsUsername(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateSessionsUsername", reflect.TypeOf((*MockStore)(nil).UpdateSessionsUsername), arg0, arg1)
}

// UpdateSliderImage mocks base method.
func (m *MockStore) UpdateSliderImage(arg0 context.Context, arg1 db.UpdateSliderImageParams) (db.SliderImageWidget, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateSliderImage", arg0, arg1)
	ret0, _ := ret[0].(db.SliderImageWidget)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateSliderImage indicates an expected call of UpdateSliderImage.
func (mr *MockStoreMockRecorder) UpdateSliderImage(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateSliderImage", reflect.TypeOf((*MockStore)(nil).UpdateSliderImage), arg0, arg1)
}

// UpdateSliderImageByImageId mocks base method.
func (m *MockStore) UpdateSliderImageByImageId(arg0 context.Context, arg1 db.UpdateSliderImageByImageIdParams) (db.SliderImageWidget, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateSliderImageByImageId", arg0, arg1)
	ret0, _ := ret[0].(db.SliderImageWidget)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateSliderImageByImageId indicates an expected call of UpdateSliderImageByImageId.
func (mr *MockStoreMockRecorder) UpdateSliderImageByImageId(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateSliderImageByImageId", reflect.TypeOf((*MockStore)(nil).UpdateSliderImageByImageId), arg0, arg1)
}

// UpdateUser mocks base method.
func (m *MockStore) UpdateUser(arg0 context.Context, arg1 db.UpdateUserParams) (db.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateUser", arg0, arg1)
	ret0, _ := ret[0].(db.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateUser indicates an expected call of UpdateUser.
func (mr *MockStoreMockRecorder) UpdateUser(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateUser", reflect.TypeOf((*MockStore)(nil).UpdateUser), arg0, arg1)
}
