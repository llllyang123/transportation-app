// utils/utils.go
package utils

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

// ResponseJSON 返回JSON响应
func ResponseJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// ResponseError 返回错误响应
func ResponseError(w http.ResponseWriter, statusCode int, message string) {
	ResponseJSON(w, statusCode, map[string]string{"error": message})
}

// HashPassword 生成密码哈希（使用成本因子14）
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Printf("生成密码哈希失败: %v", err)
		return "", err
	}
	return string(bytes), nil
}

// CheckPasswordHash 验证密码哈希
func CheckPasswordHash(password, hash string) bool {
	log.Printf("验证密码 - 输入: %s, 哈希: %s", password, hash)
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		log.Printf("密码验证失败: %v", err)
		return false
	}
	return true
}

// GenerateJWT 生成JWT token
func GenerateJWT(userID int64, username, secret string) (string, error) {
	// 创建token
	token := jwt.New(jwt.SigningMethodHS256)

	// 设置claims
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix() // 24小时过期

	// 生成签名
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ParseJWT 解析JWT token
func ParseJWT(tokenString, secret string) (jwt.MapClaims, error) {
	// 解析token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// 验证签名方法
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("无效的签名方法")
		}
		return []byte(secret), nil
	})

	// 检查解析错误
	if err != nil {
		return nil, err
	}

	// 检查token有效性
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("无效的token")
}
