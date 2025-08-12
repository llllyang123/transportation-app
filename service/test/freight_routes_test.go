package handlers_freight_test

import (
	"context"
	"freight/api/handlers"
	"freight/models"
	"github.com/gorilla/mux"
	"net/http"
)

// 测试用的货运服务实现
type testFreightService struct{}

// 修正 CreateFreight 方法签名
func (t *testFreightService) CreateFreight(ctx context.Context, freight *models.FreightOrder) error {
	// 模拟创建成功
	return nil
}

func (t *testFreightService) ListFreights(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	return []*models.FreightOrder{{ID: 1}}, nil
}

// 确保其他方法也与接口一致
func (t *testFreightService) GetFreightByID(ctx context.Context, id uint64) (*models.FreightOrder, error) {
	return &models.FreightOrder{ID: id}, nil
}

// 4. 更新货运单
func (t *testFreightService) UpdateFreight(ctx context.Context, freight *models.FreightOrder) error {
	// 模拟更新成功
	return nil
}

// 5. 删除货运单
func (t *testFreightService) DeleteFreight(ctx context.Context, id uint64) error {
	// 模拟删除成功
	return nil
}

//func (t *testFreightService) AcceptFreight(freightID string, userID uint64) (*models.FreightOrder, error) {
//	return &models.FreightOrder{ID: 1, Status: 1}, nil
//}

func (t *testFreightService) CompleteOrder(ctx context.Context, orderID uint64, userID uint64) error {
	// 模拟操作成功
	return nil
}

func (t *testFreightService) ListByUserID(ctx context.Context, userID uint64, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	//TODO implement me
	panic("implement me")
}

// 补全缺失的 AcceptOrder 方法（关键）
func (t *testFreightService) AcceptOrder(ctx context.Context, orderID uint64, userID uint64) error {
	// 模拟接单成功
	return nil
}

// 测试用认证中间件
type testAuthMiddlewares struct{}

func (t *testAuthMiddlewares) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "userID", uint64(1))
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// 创建测试路由
func createTestRouters() *mux.Router {
	freightService := &testFreightService{}
	freightHandler := handlers.NewFreightHandler(freightService)
	authMiddleware := &testAuthMiddlewares{}

	r := mux.NewRouter()
	freightRouter := r.PathPrefix("/api/freights").Subrouter()

	// 注册货运路由
	freightRouter.HandleFunc("", authMiddleware.Handler(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			freightHandler.CreateFreight(w, r)
		case http.MethodGet:
			freightHandler.ListFreights(w, r)
		}
	})).Methods("POST", "GET")

	return r
}
