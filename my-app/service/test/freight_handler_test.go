package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"freight/api/handlers"
	"freight/models"
	"freight/services"
	"github.com/gorilla/mux"
)

// 模拟服务层
type mockFreightService struct {
	services.FreightService
	// 可以添加用于测试的字段
}

func (m *mockFreightService) CreateFreight(ctx context.Context, freight *models.FreightOrder) error {
	// 实现模拟逻辑
	freight.ID = 1 // 设置模拟ID
	return nil
}

func (m *mockFreightService) GetFreightByID(ctx context.Context, id uint64) (*models.FreightOrder, error) {
	// 返回模拟数据
	return &models.FreightOrder{
		ID:          id,
		Origin:      "上海",
		Destination: "北京",
		CargoType:   "电子产品",
		Price:       1000.0,
		Status:      1,
	}, nil
}

func TestCreateFreight(t *testing.T) {
	// 创建模拟服务
	service := &mockFreightService{}

	// 创建处理器
	handler := handlers.NewFreightHandler(service)

	// 创建请求体
	payload := map[string]interface{}{
		"origin":      "上海",
		"destination": "北京",
		"cargo_type":  "电子产品",
		"price":       1000.0,
		"status":      1,
	}

	// 转换为JSON
	jsonPayload, _ := json.Marshal(payload)

	// 创建请求
	req, err := http.NewRequest("POST", "/api/freights", bytes.NewBuffer(jsonPayload))
	if err != nil {
		t.Fatal(err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", "application/json")

	// 创建响应记录器
	rr := httptest.NewRecorder()

	// 创建路由器并注册处理器
	router := mux.NewRouter()
	router.HandleFunc("/api/freights", handler.CreateFreight).Methods("POST")

	// 执行请求
	router.ServeHTTP(rr, req)

	// 检查响应状态码
	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusCreated)
	}

	// 检查响应内容
	var response map[string]interface{}
	json.Unmarshal(rr.Body.Bytes(), &response)

	if response["message"] != "货运订单创建成功" {
		t.Errorf("handler returned unexpected message: got %v want %v",
			response["message"], "货运订单创建成功")
	}

	// 检查返回的订单数据
	data, ok := response["data"].(map[string]interface{})
	if !ok {
		t.Errorf("handler returned invalid data format")
	}

	if data["id"] != float64(1) {
		t.Errorf("handler returned unexpected ID: got %v want %v",
			data["id"], 1)
	}
}

// 可以类似地编写其他测试方法（GetFreightByID、ListFreights等）
