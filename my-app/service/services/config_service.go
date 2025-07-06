// services/config_service.go
package services

import (
	"database/sql"
	"errors"
	"freight/models"
	"time"
)

type ConfigService interface {
	CreateConfig(key, value, description string) error // 统一为CreateConfig
	SetConfig(key, value, description string) error
	GetConfig(key string) (*models.Config, error)
	UpdateConfig(config *models.Config) error
	DeleteConfig(key string) error
	ListConfigs() ([]*models.Config, error)
}

type configServiceImpl struct {
	db *sql.DB
}

func NewConfigServiceImpl(db *sql.DB) ConfigService {
	return &configServiceImpl{db: db}
}

func (s *configServiceImpl) CreateConfig(key, value, description string) error {
	// 检查配置是否已存在
	var count int
	query := "SELECT COUNT(*) FROM configs WHERE `key` = ?"
	err := s.db.QueryRow(query, key).Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		return errors.New("配置已存在")
	}

	// 创建新配置
	query = "INSERT INTO configs (`key`, `value`, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
	_, err = s.db.Exec(query, key, value, description, time.Now(), time.Now())
	return err
}

func (s *configServiceImpl) SetConfig(key, value, description string) error {
	// 检查配置是否已存在
	var count int
	query := "SELECT COUNT(*) FROM configs WHERE `key` = ?"
	err := s.db.QueryRow(query, key).Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		return errors.New("配置已存在")
	}

	// 创建新配置
	query = "INSERT INTO configs (`key`, `value`, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
	_, err = s.db.Exec(query, key, value, description, time.Now(), time.Now())
	return err
}

func (s *configServiceImpl) GetConfig(key string) (*models.Config, error) {
	var config models.Config
	query := "SELECT id, `key`, `value`, description, created_at, updated_at FROM configs WHERE `key` = ?"
	err := s.db.QueryRow(query, key).Scan(
		&config.ID,
		&config.Key,
		&config.Value,
		&config.Description,
		&config.CreatedAt,
		&config.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("配置不存在")
		}
		return nil, err
	}

	return &config, nil
}

func (s *configServiceImpl) UpdateConfig(config *models.Config) error {
	//config.UpdatedAt = time.Now()

	query := "UPDATE configs SET `value` = ?, description = ?, updated_at = ? WHERE `key` = ?"
	_, err := s.db.Exec(query, config.Value, config.Description, time.Now(), config.Key)
	return err
}

func (s *configServiceImpl) DeleteConfig(key string) error {
	// 检查配置是否存在
	_, err := s.GetConfig(key)
	if err != nil {
		return err
	}

	// 删除配置
	query := "DELETE FROM configs WHERE `key` = ?"
	_, err = s.db.Exec(query, key)
	return err
}

func (s *configServiceImpl) ListConfigs() ([]*models.Config, error) {
	query := "SELECT id, `key`, `value`, description, created_at, updated_at FROM configs ORDER BY created_at DESC"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var configs []*models.Config
	for rows.Next() {
		var config models.Config
		if err := rows.Scan(
			&config.ID,
			&config.Key,
			&config.Value,
			&config.Description,
			&config.CreatedAt,
			&config.UpdatedAt,
		); err != nil {
			return nil, err
		}
		configs = append(configs, &config)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return configs, nil
}
