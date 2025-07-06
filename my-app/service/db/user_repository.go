package db

import (
	"database/sql"
	"errors"
	"freight/models"
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
	query := `INSERT INTO users (username, password, email, avatar_url, role, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query, user.Username, user.Password, &user.AvatarURL, &user.Role, user.Email, user.Status, user.CreatedAt, user.UpdatedAt)
	return err
}

// FindByUsername 通过用户名查找用户
func (r *UserRepositoryImpl) FindByUsername(username string) (*models.User, error) {
	query := `SELECT id, username, password, email, status, avatar_url, role, created_at, updated_at 
              FROM users WHERE username = ?`

	var user models.User
	err := r.db.QueryRow(query, username).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt)

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
	query := `SELECT id, username, password, email, avatar_url, role, status, created_at, updated_at 
              FROM users WHERE email = ?`

	var user models.User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt)

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
	query := `SELECT id, username, password, email, avatar_url, role, status, created_at, updated_at 
              FROM users WHERE id = ?`

	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.Username, &user.Password, &user.Email, &user.AvatarURL, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("用户不存在")
		}
		return nil, err
	}

	return &user, nil
}
