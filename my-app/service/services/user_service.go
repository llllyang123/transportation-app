// services/user_service.go
package services

import (
	"database/sql"
	"errors"
	"fmt"
	"freight/models"
	"freight/utils"
	"time"
)

type UserService interface {
	Register(username, password, email string) (*models.User, error)
	Login(username, password string) (*models.User, string, error)
	GetUserByID(id int64) (*models.User, error)
}

type userServiceImpl struct {
	db        *sql.DB
	jwtSecret string
}

func NewUserServiceImpl(db *sql.DB, jwtSecret string) UserService {
	return &userServiceImpl{db: db, jwtSecret: jwtSecret}
}

func (s *userServiceImpl) Register(username, password, email string) (*models.User, error) {
	// 检查用户名是否已存在
	var count int
	query := "SELECT COUNT(*) FROM users WHERE username = ?"
	err := s.db.QueryRow(query, username).Scan(&count)
	if err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, errors.New("用户名已存在")
	}

	// 检查邮箱是否已存在
	query = "SELECT COUNT(*) FROM users WHERE email = ?"
	err = s.db.QueryRow(query, email).Scan(&count)
	if err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, errors.New("邮箱已被注册")
	}

	// 加密密码
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, errors.New("密码加密失败")
	}

	// 创建用户
	query = "INSERT INTO users (username, password, email, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
	result, err := s.db.Exec(query, username, hashedPassword, email, 1, time.Now(), time.Now())
	if err != nil {
		return nil, err
	}

	// 获取新创建的用户ID
	userID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	// 返回用户信息
	return &models.User{
		ID:        userID,
		Username:  username,
		Password:  hashedPassword,
		Email:     email,
		Status:    1,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (s *userServiceImpl) Login(loginID, password string) (*models.User, string, error) {
	var user models.User
	fmt.Println("loginID:", loginID)
	// 单一查询判断邮箱或用户名
	query := `
        SELECT id, username, password, email, status, created_at, updated_at 
        FROM users 
        WHERE 
            (LOCATE('@', ?) > 0 AND email = ?) 
            OR 
            (LOCATE('@', ?) = 0 AND username = ?)
    `

	err := s.db.QueryRow(query, loginID, loginID, loginID, loginID).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Email,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, "", errors.New("用户不存在")
		}
		return nil, "", err
	}
	// 验证密码
	if !utils.CheckPasswordHash(password, user.Password) {
		return nil, "", errors.New("密码错误")
	}

	// 生成JWT token
	token, err := utils.GenerateJWT(user.ID, user.Username, s.jwtSecret)
	if err != nil {
		return nil, "", errors.New("生成认证令牌失败")
	}

	return &user, token, nil
}

// 辅助函数：模拟三元运算符
func ifElse(condition bool, trueVal, falseVal string) string {
	if condition {
		return trueVal
	}
	return falseVal
}

func (s *userServiceImpl) GetUserByID(id int64) (*models.User, error) {
	var user models.User
	query := "SELECT id, username, password, email, status, created_at, updated_at FROM users WHERE id = ?"
	err := s.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Email,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("用户不存在")
		}
		return nil, err
	}

	return &user, nil
}
