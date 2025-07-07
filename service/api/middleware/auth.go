package middleware

import (
	"context"
	"net/http"
	"strings"

	"freight/utils"
)

// AuthMiddleware JWT认证中间件
type AuthMiddleware struct {
	JwtSecret string
}

// NewAuthMiddleware 创建认证中间件实例
func NewAuthMiddleware(jwtSecret string) *AuthMiddleware {
	return &AuthMiddleware{JwtSecret: jwtSecret}
}

// Handler 中间件处理函数
func (m *AuthMiddleware) Handler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 从请求头中获取token
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.ResponseError(w, http.StatusUnauthorized, "缺少认证信息")
			return
		}

		// 验证token格式
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ResponseError(w, http.StatusUnauthorized, "认证格式错误")
			return
		}

		tokenStr := parts[1]

		// 解析和验证token
		claims, err := utils.ParseJWT(tokenStr, m.JwtSecret)
		if err != nil {
			utils.ResponseError(w, http.StatusUnauthorized, "无效的token")
			return
		}

		// 从claims中获取用户ID和用户名
		userID, ok := claims["user_id"].(float64)
		if !ok {
			utils.ResponseError(w, http.StatusUnauthorized, "无效的用户ID")
			return
		}

		username, ok := claims["username"].(string)
		if !ok {
			utils.ResponseError(w, http.StatusUnauthorized, "无效的用户名")
			return
		}

		// 将用户信息添加到请求上下文中
		ctx := context.WithValue(r.Context(), "user_id", int64(userID))
		ctx = context.WithValue(ctx, "username", username)
		r = r.WithContext(ctx)

		// 继续处理请求
		next(w, r)
	}
}
