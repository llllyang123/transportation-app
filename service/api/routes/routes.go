package routes

import (
	"context"
	"net/http"

	"freight/api/handlers"
	"freight/api/middleware"
	"freight/services"

	"github.com/gorilla/mux" // 引入gorilla/mux
)

func SetupRoutes(
	userService services.UserService,
	configService services.ConfigService,
	freightService services.FreightService,
	authMiddleware *middleware.AuthMiddleware,
) http.Handler {
	r := mux.NewRouter() // 使用gorilla/mux的路由器

	// 创建处理器实例
	userHandler := handlers.NewUserHandler(userService)
	configHandler := handlers.NewConfigHandler(configService)
	freightHandler := handlers.NewFreightHandler(freightService)

	// 用户路由
	r.HandleFunc("/api/users/register", userHandler.Register).Methods("POST")
	r.HandleFunc("/api/users/login", userHandler.Login).Methods("POST")

	// 配置路由
	configRouter := r.PathPrefix("/api/configs").Subrouter()
	configRouter.HandleFunc("", authMiddleware.Handler(func(w http.ResponseWriter, r *http.Request) {
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
	})).Methods("POST", "GET", "PUT", "DELETE")

	configRouter.HandleFunc("/list", authMiddleware.Handler(configHandler.ListConfigs)).Methods("GET")

	// 货运路由
	freightRouter := r.PathPrefix("/api/freights").Subrouter()
	freightRouter.HandleFunc("", authMiddleware.Handler(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			freightHandler.CreateFreight(w, r)
		case http.MethodGet:
			freightHandler.ListFreights(w, r)
		default:
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		}
	})).Methods("POST", "GET")

	// 使用gorilla/mux的正则表达式路径参数
	freightRouter.HandleFunc("/{id:[0-9]+}", authMiddleware.Handler(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r) // 正确获取路径变量
		idStr := vars["id"]

		// 将ID添加到请求上下文
		ctx := context.WithValue(r.Context(), "freightID", idStr)
		r = r.WithContext(ctx)

		switch r.Method {
		case http.MethodGet:
			freightHandler.GetFreightByID(w, r)
		case http.MethodPut:
			freightHandler.UpdateFreight(w, r)
		case http.MethodDelete:
			freightHandler.DeleteFreight(w, r)
		default:
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		}
	})).Methods("GET", "PUT", "DELETE")

	return r // 返回gorilla/mux的路由器
}
