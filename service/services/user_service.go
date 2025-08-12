// services/user_service.go
package services

import (
	"database/sql"
	"errors"
	"fmt"
	"freight/models"
	"freight/utils"
	"strings"
	"time"
)

type UserService interface {
	Register(username, password, email string) (*models.User, error)
	Login(username, password string) (*models.User, string, error)
	GetUserByID(id int64) (*models.User, error)
	UpdateGender(userID int64, newGender string) (*models.User, error) // 新增：更新性别接口
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
	username = strings.TrimSpace(username) // 去除可能的空格
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
		CreatedAt: utils.FromTime(time.Now()),
		UpdatedAt: utils.FromTime(time.Now()),
	}, nil
}

func (s *userServiceImpl) Login(loginID, password string) (*models.User, string, error) {
	var user models.User
	loginID = strings.TrimSpace(loginID) // 去除可能的空格
	fmt.Printf("Login attempt with: %s\n", loginID)

	query := `
        SELECT id, username, password, email, role, six, status, created_at, updated_at 
        FROM users 
        WHERE 
            (LOCATE('@', ?) > 0 AND email = ?) 
            OR 
            (LOCATE('@', ?) = 0 AND username = ?)
    `

	// 准备查询，不立即执行
	stmt, err := s.db.Prepare(query)
	if err != nil {
		fmt.Printf("Prepare error: %v\n", err)
		return nil, "", err
	}
	defer stmt.Close()

	// 执行查询并捕获错误
	err = stmt.QueryRow(loginID, loginID, loginID, loginID).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Email,
		&user.Role,
		&user.Six,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("User not found for: %s\n", loginID)
			return nil, "", errors.New("用户不存在")
		}
		fmt.Printf("Query error: %v\n", err)
		return nil, "", err
	}

	// 打印查询到的用户信息（调试用）
	fmt.Printf("User found: %+v\n", user)

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
	query := "SELECT id, username, password, email, role, six,  status, created_at, updated_at FROM users WHERE id = ?"
	err := s.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Email,
		&user.Role,
		&user.Six,
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

// UpdateGender 更新用户性别（仅允许更新为 'man' 或 'women'）
func (s *userServiceImpl) UpdateGender(userID int64, newGender string) (*models.User, error) {
	// 1. 校验性别参数合法性（必须是 'man' 或 'women'）
	newGender = strings.TrimSpace(newGender) // 去除首尾空格
	if newGender != "man" && newGender != "women" {
		return nil, errors.New("无效的性别值，必须是 'man' 或 'women'")
	}

	// 2. 先查询用户是否存在（避免更新不存在的用户）
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, err // 直接返回 "用户不存在" 等错误
	}

	// 3. 执行更新操作（只更新 six 字段和 updated_at 时间）
	query := `
		UPDATE users 
		SET six = ?, updated_at = ? 
		WHERE id = ?
	`
	result, err := s.db.Exec(query, newGender, time.Now(), userID)
	if err != nil {
		return nil, fmt.Errorf("更新性别失败: %w", err)
	}

	// 4. 检查更新是否生效
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("获取更新结果失败: %w", err)
	}
	if rowsAffected == 0 {
		return nil, errors.New("更新失败，未找到可更新的用户")
	}

	// 5. 更新内存中的用户性别，并返回最新信息
	user.Six = newGender
	user.UpdatedAt = utils.FromTime(time.Now())
	return user, nil
}
