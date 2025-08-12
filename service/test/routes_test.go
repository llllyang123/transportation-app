package handlers_freight_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"

	"freight/api/handlers"
	"freight/models"
)

// 手动创建测试路由（模拟实际项目中的路由定义）
func createTestRouter() *mux.Router {
	// 1. 初始化空服务（仅用于测试）
	userService := &testUserService{}
	authMiddleware := &testAuthMiddleware{}

	// 2. 创建处理器
	userHandler := handlers.NewUserHandler(userService)

	// 3. 定义路由（完全复制实际项目中的路由配置）
	r := mux.NewRouter()

	// 用户路由
	r.HandleFunc("/api/users/register", userHandler.Register).Methods("POST")
	r.HandleFunc("/api/users/login", userHandler.Login).Methods("POST")
	r.HandleFunc("/api/users/gender", authMiddleware.Handler(userHandler.UpdateGender)).Methods("PATCH")

	// 其他路由（如货运、配置）按实际项目复制...

	return r
}

// 测试用的空服务实现
type testUserService struct{}

func (t *testUserService) Register(username, password, email string) (*models.User, error) {
	return &models.User{
		ID:       1,
		Username: username,
		Email:    email,
	}, nil
}

func (t *testUserService) Login(loginID, password string) (*models.User, string, error) {
	return &models.User{ID: 1, Username: loginID}, "test-token", nil
}

func (t *testUserService) GetUserByID(id int64) (*models.User, error) {
	return &models.User{ID: id, Username: "test-user"}, nil
}

func (t *testUserService) UpdateGender(userID int64, six string) (*models.User, error) {
	return &models.User{ID: userID, Six: six}, nil
}

// 测试用的认证中间件（直接通过认证）
type testAuthMiddleware struct{}

func (t *testAuthMiddleware) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 简化认证：直接调用下一个处理器
		next.ServeHTTP(w, r)
	}
}

// 测试路由是否正确响应
func TestUserRoutes(t *testing.T) {
	router := createTestRouter()

	// 测试用例
	testCases := []struct {
		name         string
		path         string
		method       string
		body         string
		expectedCode int
		expectedMsg  string
	}{
		{
			name:         "注册接口",
			path:         "/api/users/register",
			method:       "POST",
			body:         `{"username":"test","password":"123","email":"test@example.com"}`,
			expectedCode: http.StatusCreated,
			expectedMsg:  "注册成功",
		},
		{
			name:         "登录接口",
			path:         "/api/users/login",
			method:       "POST",
			body:         `{"login_id":"test","password":"123"}`,
			expectedCode: http.StatusOK,
			expectedMsg:  "登录成功",
		},
		{
			name:         "更新性别接口",
			path:         "/api/users/gender",
			method:       "PATCH",
			body:         `{"user_id":1,"gender":"women"}`,
			expectedCode: http.StatusOK,
			expectedMsg:  "性别更新成功",
		},
	}

	// 执行测试
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// 创建请求
			req, err := http.NewRequest(tc.method, tc.path, strings.NewReader(tc.body))
			assert.NoError(t, err)
			req.Header.Set("Content-Type", "application/json")

			// 发送请求
			recorder := httptest.NewRecorder()
			router.ServeHTTP(recorder, req)

			// 验证状态码
			assert.Equal(t, tc.expectedCode, recorder.Code)

			// 验证响应内容
			assert.Contains(t, recorder.Body.String(), tc.expectedMsg)
		})
	}
}

// 测试路由方法限制
func TestRouteMethods(t *testing.T) {
	router := createTestRouter()

	testCases := []struct {
		name         string
		path         string
		method       string
		expectedCode int
	}{
		{
			name:         "注册接口-不允许GET",
			path:         "/api/users/register",
			method:       "GET",
			expectedCode: http.StatusMethodNotAllowed,
		},
		{
			name:         "登录接口-不允许PUT",
			path:         "/api/users/login",
			method:       "PUT",
			expectedCode: http.StatusMethodNotAllowed,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req, _ := http.NewRequest(tc.method, tc.path, nil)
			recorder := httptest.NewRecorder()
			router.ServeHTTP(recorder, req)
			assert.Equal(t, tc.expectedCode, recorder.Code)
		})
	}
}
