package main

import (
	"freight/api/middleware"
	"freight/api/routes"
	"freight/config"
	"freight/db"
	"freight/services"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	//configPath := flag.String("config", "config/config.yaml", "配置文件路径")
	//flag.Parse()

	// 加载配置
	//cfg, err := models.LoadConfig(*configPath)
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化数据库，传递统一的DBConfig结构
	if err := db.Init(cfg.DB); err != nil {
		log.Fatalf("初始化数据库失败: %v", err)
	}
	defer db.Close()

	// 创建服务
	dbInstance := db.GetDB()

	// 注意：这里直接传递数据库连接给服务层
	userService := services.NewUserServiceImpl(dbInstance, cfg.JWT.Secret)
	configService := services.NewConfigServiceImpl(dbInstance)

	// 创建中间件
	authMiddleware := middleware.NewAuthMiddleware(cfg.JWT.Secret)

	// 设置路由（传递三个参数）
	router := routes.SetupRoutes(userService, configService, authMiddleware)

	// 启动服务器
	log.Printf("服务器启动在端口 %s", cfg.Server.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Server.Port, router))

	log.Printf("服务器启动在端口 %s", config.Get().Server.Port)

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("服务器正在关闭...")

	// 关闭数据库连接
	db.GetDB().Close()

	log.Println("服务器已关闭")
}
