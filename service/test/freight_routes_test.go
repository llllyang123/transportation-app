package handlers_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"

	"freight/api/handlers"
	"freight/models"
)

// 测试用的货运服务实现
type testFreightService struct{}

func (t *testFreightService) CreateFreight(order *models.FreightOrder) (*models.FreightOrder, error) {
	return &models.FreightOrder{
		ID:                  1,
		UserID:              order.UserID,
		OriginLocation:      order.OriginLocation,
		DestinationLocation: order.DestinationLocation,
		Status:              0,
	}, nil
}

func (t *testFreightService) ListFreights(userID uint64) ([]*models.FreightOrder, error) {
	return []*models.FreightOrder{{ID: 1, UserID: userID}}, nil
}

func (t *testFreightService) GetFreightByID(id string) (*models.FreightOrder, error) {
	return &models.FreightOrder{ID: 1}, nil
}

func (t *testFreightService) AcceptFreight(freightID string, userID uint64) (*models.FreightOrder, error) {
	return &models.FreightOrder{ID: 1, Status: 1}, nil
}

func (t *testFreightService) CompleteOrder(freightID string) (*models.FreightOrder, error) {
	return &models.FreightOrder{ID: 1, Status: 2}, nil
}

// 测试用认证中间件
type testAuthMiddleware struct{}

func (t *testAuthMiddleware) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "userID", uint64(1))
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// 创建测试路由
func createTestRouter() *mux.Router {
	freightService := &testFreightService{}
	freightHandler := handlers.NewFreightHandler(freightService)
	authMiddleware := &testAuthMiddleware{}

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

// 测试货运接口
func TestFreightRoutes(t *testing.T) {
	router := createTestRouter()

	req, _ := http.NewRequest("POST", "/api/freights", strings.NewReader(`{"user_id":1,"origin_location":"北京"}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer token")

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	assert.Equal(t, http.StatusOK, recorder.Code)
}
