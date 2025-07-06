package routes

import (
	"net/http"

	"freight/api/handlers"
	"freight/api/middleware"
	"freight/services"
)

func SetupRoutes(
	userService services.UserService,
	configService services.ConfigService,
	authMiddleware *middleware.AuthMiddleware,
) http.Handler {
	mux := http.NewServeMux()

	// 创建处理器实例
	userHandler := handlers.NewUserHandler(userService)
	configHandler := handlers.NewConfigHandler(configService)

	// 用户路由
	mux.HandleFunc("/api/users/register", userHandler.Register)
	mux.HandleFunc("/api/users/login", userHandler.Login)

	// 配置路由 - 统一处理函数
	configHandlerFunc := func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			configHandler.CreateConfig(w, r)
		case http.MethodGet:
			configHandler.GetConfig(w, r)
		case http.MethodPut:
			configHandler.UpdateConfig(w, r)
		case http.MethodDelete:
			configHandler.DeleteConfig(w, r)
		default:
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		}
	}

	// 应用认证中间件并注册处理函数
	mux.HandleFunc("/api/configs", authMiddleware.Handler(configHandlerFunc))
	mux.HandleFunc("/api/configs/list", authMiddleware.Handler(configHandler.ListConfigs))

	return mux
}
