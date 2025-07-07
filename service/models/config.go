package models

import "time"

type DBConfig struct {
	Driver          string `yaml:"driver"`
	Host            string `yaml:"host"`
	Port            int    `yaml:"port"`
	Username        string `yaml:"username"`
	Password        string `yaml:"password"`
	Name            string `yaml:"name"`
	Charset         string `yaml:"charset"`
	MaxOpenConns    int    `yaml:"max_open_conns"`
	MaxIdleConns    int    `yaml:"max_idle_conns"`
	ConnMaxLifetime int    `yaml:"conn_max_lifetime"`
}

// Config 配置模型
type Config struct {
	Server struct {
		Port string `yaml:"port"`
	} `yaml:"server"`

	DB DBConfig `yaml:"db"`

	ID          int64     `json:"id"`
	Key         string    `json:"key"`
	Value       string    `json:"value"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	JWT struct {
		Secret string `yaml:"secret"`
		Expiry int    `yaml:"expiry"`
	} `yaml:"jwt"`
}

// ConfigRepository 配置数据访问接口
type ConfigRepository interface {
	Create(config *Config) error
	GetByKey(key string) (*Config, error)
	Update(config *Config) error
	Delete(key string) error
}

// ConfigService 配置服务接口
type ConfigService interface {
	CreateConfig(config *Config) error
	GetConfig(key string) (*Config, error)
	UpdateConfig(config *Config) error
	DeleteConfig(key string) error
}

// LoadConfig 加载配置文件
func LoadConfig(filename string) (*Config, error) {
	// 配置加载逻辑...
	return &Config{}, nil
}
