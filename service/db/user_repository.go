package db

import (
	"database/sql"
	"errors"
	"freight/models"
	"freight/utils"
	"time"
)

// UserRepositoryImpl 用户数据访问实现
type UserRepositoryImpl struct {
	db *sql.DB
}

// NewUserRepository 创建用户数据访问实例
func NewUserRepository(db *sql.DB) models.UserRepository {
	return &UserRepositoryImpl{db: db}
}

// Create 创建用户
func (r *UserRepositoryImpl) Create(user *models.User) error {
	// 设置自动生成的字段
	now := time.Now()
	user.CreatedAt = utils.FromTime(now)
	user.UpdatedAt = utils.FromTime(now)

	// 设置默认值
	if user.AvatarURL == "" {
		user.AvatarURL = "https://picsum.photos/100/100" // 设置默认头像
	}
	if user.Role == "" {
		user.Role = "user" // 设置默认角色
	}
	if user.Status == 0 {
		user.Status = 1 // 设置默认状态（1表示活跃）
	}

	query := `
        INSERT INTO users (
            username, password, email, avatar_url, role, six, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

	_, err := r.db.Exec(query,
		user.Username,
		user.Password,
		user.Email,     // 修正顺序
		user.AvatarURL, // 直接使用值，而非指针
		user.Role,      // 直接使用值，而非指针
		user.Six,
		user.Status,
		user.CreatedAt, // 自动生成的时间
		user.UpdatedAt, // 自动生成的时间
	)

	return err
}

// FindByUsername 通过用户名查找用户
func (r *UserRepositoryImpl) FindByUsername(username string) (*models.User, error) {
	query := `SELECT id, username, password, email, status, avatar_url, role, six, created_at, updated_at 
              FROM users WHERE username = ?`

	var user models.User
	err := r.db.QueryRow(query, username).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Six, &user.Status, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// FindByEmail 通过邮箱查找用户
func (r *UserRepositoryImpl) FindByEmail(email string) (*models.User, error) {
	query := `SELECT id, username, password, email, avatar_url, role, six, status, created_at, updated_at 
              FROM users WHERE email = ?`

	var user models.User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Six, &user.Status, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// FindByID 通过ID查找用户
func (r *UserRepositoryImpl) FindByID(id int64) (*models.User, error) {
	query := `SELECT id, username, password, email, avatar_url, role, six, status, created_at, updated_at 
              FROM users WHERE id = ?`

	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Six, &user.Status, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("用户不存在")
		}
		return nil, err
	}

	return &user, nil
}
