package db

import (
	"database/sql"
	"fmt"
	"freight/config"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var dbInstance *sql.DB

// Init 初始化数据库连接
func Init(cfg config.DBConfig) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=true",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Name, cfg.Charset)

	var err error
	dbInstance, err = sql.Open(cfg.Driver, dsn)
	if err != nil {
		return fmt.Errorf("打开数据库连接失败: %v", err)
	}

	// 测试连接
	if err = dbInstance.Ping(); err != nil {
		return fmt.Errorf("测试数据库连接失败: %v", err)
	}

	// 设置连接池参数
	dbInstance.SetMaxOpenConns(cfg.MaxOpenConns)
	dbInstance.SetMaxIdleConns(cfg.MaxIdleConns)
	dbInstance.SetConnMaxLifetime(time.Duration(cfg.ConnMaxLifetime) * time.Minute)

	log.Println("数据库连接成功")
	return nil
}

// GetDB 获取数据库实例
func GetDB() *sql.DB {
	return dbInstance
}

// Close 关闭数据库连接
func Close() {
	if dbInstance != nil {
		dbInstance.Close()
	}
}
