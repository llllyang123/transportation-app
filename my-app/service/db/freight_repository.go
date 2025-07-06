package db

import (
	"context"
	"database/sql"
	"errors"
	"freight/models"
)

// FreightRepository 货运订单数据访问接口
type FreightRepository interface {
	Create(ctx context.Context, freight *models.FreightOrder) error
	GetByID(ctx context.Context, id uint64) (*models.FreightOrder, error)
	List(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error)
	Update(ctx context.Context, freight *models.FreightOrder) error
	Delete(ctx context.Context, id uint64) error
}

// MySQLFreightRepository MySQL实现
type MySQLFreightRepository struct {
	db *sql.DB
}

// NewFreightRepository 创建货运订单仓储实例
func NewFreightRepository(db *sql.DB) FreightRepository {
	return &MySQLFreightRepository{db: db}
}

// Create 创建货运订单
func (r *MySQLFreightRepository) Create(ctx context.Context, freight *models.FreightOrder) error {
	query := `
        INSERT INTO freight_orders (
            origin, destination, type, typeid, remark, order_date, 
            price, status, is_urgent, has_insurance, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

	result, err := r.db.ExecContext(ctx, query,
		freight.Origin,
		freight.Destination,
		freight.Type,
		freight.TypeID,
		freight.Remark,
		freight.OrderDate,
		freight.Price,
		freight.Status,
		freight.IsUrgent,
		freight.HasInsurance,
	)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	freight.ID = uint64(id)
	return nil
}

// GetByID 获取货运订单
func (r *MySQLFreightRepository) GetByID(ctx context.Context, id uint64) (*models.FreightOrder, error) {
	query := `
        SELECT id, origin, destination, type, typeid, remark, 
               order_date, price, status, is_urgent, has_insurance,
               created_at, updated_at
        FROM freight_orders
        WHERE id = ? AND status != 0
    `

	var freight models.FreightOrder
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&freight.ID,
		&freight.Origin,
		&freight.Destination,
		&freight.Type,
		&freight.TypeID,
		&freight.Remark,
		&freight.OrderDate,
		&freight.Price,
		&freight.Status,
		&freight.IsUrgent,
		&freight.HasInsurance,
		&freight.CreatedAt,
		&freight.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &freight, nil
}

// List 列出货运订单
func (r *MySQLFreightRepository) List(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	// 构建查询SQL和参数
	query := `
        SELECT id, origin, destination, cargo_type, cargo_type_id, remark, 
               order_date, price, status, is_urgent, has_insurance,
               created_at, updated_at
        FROM freight_orders
        WHERE status != 0
    `

	var args []interface{}

	// 添加过滤条件
	if filter.Origin != "" {
		query += " AND origin = ?"
		args = append(args, filter.Origin)
	}

	if filter.Destination != "" {
		query += " AND destination = ?"
		args = append(args, filter.Destination)
	}

	if filter.Status != nil {
		query += " AND status = ?"
		args = append(args, *filter.Status)
	}

	// 添加分页
	if filter.Page > 0 && filter.PageSize > 0 {
		query += " LIMIT ? OFFSET ?"
		args = append(args, filter.PageSize, (filter.Page-1)*filter.PageSize)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var freights []*models.FreightOrder
	for rows.Next() {
		var freight models.FreightOrder
		if err := rows.Scan(
			&freight.ID,
			&freight.Origin,
			&freight.Destination,
			&freight.Type,
			&freight.TypeID,
			&freight.Remark,
			&freight.OrderDate,
			&freight.Price,
			&freight.Status,
			&freight.IsUrgent,
			&freight.HasInsurance,
			&freight.CreatedAt,
			&freight.UpdatedAt,
		); err != nil {
			return nil, err
		}
		freights = append(freights, &freight)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return freights, nil
}

// Update 更新货运订单
func (r *MySQLFreightRepository) Update(ctx context.Context, freight *models.FreightOrder) error {
	query := `
        UPDATE freight_orders
        SET origin = ?, destination = ?, cargo_type = ?, cargo_type_id = ?, 
            remark = ?, order_date = ?, price = ?, status = ?, 
            is_urgent = ?, has_insurance = ?, updated_at = NOW()
        WHERE id = ? AND status != 0
    `

	_, err := r.db.ExecContext(ctx, query,
		freight.Origin,
		freight.Destination,
		freight.Type,
		freight.TypeID,
		freight.Remark,
		freight.OrderDate,
		freight.Price,
		freight.Status,
		freight.IsUrgent,
		freight.HasInsurance,
		freight.ID,
	)

	return err
}

// Delete 删除货运订单
func (r *MySQLFreightRepository) Delete(ctx context.Context, id uint64) error {
	query := `
        UPDATE freight_orders
        SET status = 0, updated_at = NOW()
        WHERE id = ? AND status != 0
    `

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("货运订单不存在")
	}

	return nil
}
