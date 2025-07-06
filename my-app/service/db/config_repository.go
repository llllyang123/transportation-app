package db

import (
	"database/sql"
	"errors"
	"freight/models"
)

// ConfigRepositoryImpl 配置数据访问实现
type ConfigRepositoryImpl struct {
	db *sql.DB
}

// NewConfigRepository 创建配置数据访问实例
func NewConfigRepository(db *sql.DB) models.ConfigRepository {
	return &ConfigRepositoryImpl{db: db}
}

// Create 创建配置
func (r *ConfigRepositoryImpl) Create(config *models.Config) error {
	query := `INSERT INTO configs (key, value, description, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query, config.Key, config.Value, config.Description, config.CreatedAt, config.UpdatedAt)
	return err
}

// GetByKey 通过键获取配置
func (r *ConfigRepositoryImpl) GetByKey(key string) (*models.Config, error) {
	query := `SELECT id, key, value, description, created_at, updated_at 
              FROM configs WHERE key = ?`

	var config models.Config
	err := r.db.QueryRow(query, key).Scan(
		&config.ID, &config.Key, &config.Value, &config.Description, &config.CreatedAt, &config.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("配置不存在")
		}
		return nil, err
	}

	return &config, nil
}

// Update 更新配置
func (r *ConfigRepositoryImpl) Update(config *models.Config) error {
	query := `UPDATE configs SET value = ?, description = ?, updated_at = ? 
              WHERE key = ?`

	_, err := r.db.Exec(query, config.Value, config.Description, config.UpdatedAt, config.Key)
	return err
}

// Delete 删除配置
func (r *ConfigRepositoryImpl) Delete(key string) error {
	query := `DELETE FROM configs WHERE key = ?`

	result, err := r.db.Exec(query, key)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("配置不存在")
	}

	return nil
}
