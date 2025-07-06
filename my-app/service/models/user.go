package models

import (
	"time"
)

// User 用户模型
type User struct {
	ID        int64     `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"` // 不返回密码
	Email     string    `json:"email"`
	AvatarURL string    `json:"avatar_url"`
	Role      string    `json:"role"`
	Status    int       `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserRepository 用户数据访问接口
type UserRepository interface {
	Create(user *User) error
	FindByUsername(username string) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByID(id int64) (*User, error)
}

// UserService 用户服务接口
type UserService interface {
	Register(username, password, email string) (*User, error)
	Login(username, password string) (*User, string, error)
	GetUserByID(id int64) (*User, error)
}
