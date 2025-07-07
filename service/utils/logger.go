package utils

import "log"

// Logger 日志接口
type Logger interface {
	Info(msg string)
	Error(msg string, err error)
	Fatal(msg string, err error)
}

// DefaultLogger 默认日志实现
type DefaultLogger struct{}

// NewLogger 创建日志实例
func NewLogger() Logger {
	return &DefaultLogger{}
}

// Info 记录信息日志
func (l *DefaultLogger) Info(msg string) {
	log.Printf("[INFO] %s", msg)
}

// Error 记录错误日志
func (l *DefaultLogger) Error(msg string, err error) {
	log.Printf("[ERROR] %s: %v", msg, err)
}

// Fatal 记录致命错误并退出
func (l *DefaultLogger) Fatal(msg string, err error) {
	log.Fatalf("[FATAL] %s: %v", msg, err)
}
