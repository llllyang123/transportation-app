package db

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"freight/models"
	"strings"
)

// FreightRepository 货运订单数据访问接口
type FreightRepository interface {
	Create(ctx context.Context, freight *models.FreightOrder) error
	GetByID(ctx context.Context, id uint64) (*models.FreightOrder, error)
	List(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error)
	Update(ctx context.Context, freight *models.FreightOrder) error
	Delete(ctx context.Context, id uint64) error
	ListByUserID(ctx context.Context, userID uint64, filter models.FreightFilter) ([]*models.FreightOrder, error)
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
			origin_location, destination_location, origin_code, destination_code, 
			type, typeid, remark, order_date, price, status, 
			is_urgent, has_insurance, email, user_id, created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
	`

	fmt.Println("sql:", query)

	result, err := r.db.ExecContext(ctx, query,
		freight.OriginLocation,      // 对应 origin_location
		freight.DestinationLocation, // 对应 destination_location
		freight.OriginCode,          // 对应 origin_code
		freight.DestinationCode,     // 对应 destination_code
		freight.Type,                // 对应 type
		freight.TypeID,              // 对应 typeid
		freight.Remark,              // 对应 remark
		freight.OrderDate,           // 对应 order_date
		freight.Price,               // 对应 price
		freight.Status,              // 对应 status
		freight.IsUrgent,            // 对应 is_urgent
		freight.HasInsurance,        // 对应 has_insurance
		freight.Email,               // 对应 email
		freight.UserID,              // 对应 user_id
	)
	fmt.Println("result:", result)
	fmt.Println("err:", err)
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
    SELECT id, origin_location, destination_location, origin_code, destination_code, type, typeid, remark, 
           order_date, price, status, is_urgent, has_insurance,
           created_at, updated_at, email, user_id
    FROM freight_orders
    WHERE id = ? AND status != 0
`

	var freight models.FreightOrder
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&freight.ID,                  // 1. id
		&freight.OriginLocation,      // 2. origin_location
		&freight.DestinationLocation, // 3. destination_location
		&freight.OriginCode,          // 4. origin_code
		&freight.DestinationCode,     // 5. destination_code
		&freight.Type,                // 6. type
		&freight.TypeID,              // 7. typeid
		&freight.Remark,              // 8. remark
		&freight.OrderDate,           // 9. order_date
		&freight.Price,               // 10. price
		&freight.Status,              // 11. status
		&freight.IsUrgent,            // 12. is_urgent
		&freight.HasInsurance,        // 13. has_insurance
		&freight.CreatedAt,           // 14. created_at
		&freight.UpdatedAt,           // 15. updated_at
		&freight.Email,               // 16. email
		&freight.UserID,              // 17. user_id（添加 & 符号）
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
    SELECT id, origin_location, destination_location, origin_code, destination_code, type, typeid, remark, 
           order_date, price, status, is_urgent, has_insurance,
           created_at, updated_at, email, user_id
    FROM freight_orders
    WHERE status = 1
`

	var args []interface{}

	// 添加过滤条件
	if filter.OriginLocation != "" {
		query += " AND origin_location = ?"
		args = append(args, filter.OriginLocation)
	}

	if filter.DestinationLocation != "" {
		query += " AND destination_location = ?"
		args = append(args, filter.DestinationLocation)
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
			&freight.ID,                  // 1. id
			&freight.OriginLocation,      // 2. origin_location
			&freight.DestinationLocation, // 3. destination_location
			&freight.OriginCode,          // 4. origin_code
			&freight.DestinationCode,     // 5. destination_code
			&freight.Type,                // 6. type
			&freight.TypeID,              // 7. typeid
			&freight.Remark,              // 8. remark
			&freight.OrderDate,           // 9. order_date
			&freight.Price,               // 10. price
			&freight.Status,              // 11. status
			&freight.IsUrgent,            // 12. is_urgent
			&freight.HasInsurance,        // 13. has_insurance
			&freight.CreatedAt,           // 14. created_at
			&freight.UpdatedAt,           // 15. updated_at
			&freight.Email,               // 16. email
			&freight.UserID,              // 17. user_id（添加 & 符号）
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
//func (r *MySQLFreightRepository) Update(ctx context.Context, freight *models.FreightOrder) error {
//	query := `
//        UPDATE freight_orders
//        SET origin_location = ?, origin_code = ?, destination_location = ?, destination_code = ?, type = ?, typeid = ?,
//            remark = ?, order_date = ?, price = ?, status = ?,
//            is_urgent = ?, has_insurance = ?, updated_at = NOW(), email = ?, user_id = ?
//        WHERE id = ? AND status != 0
//    `
//
//	_, err := r.db.ExecContext(ctx, query,
//		&freight.OriginLocation,
//		&freight.OriginCode,
//		&freight.DestinationLocation,
//		&freight.DestinationCode,
//		freight.Type,
//		freight.TypeID,
//		freight.Remark,
//		freight.OrderDate,
//		freight.Price,
//		freight.Status,
//		freight.IsUrgent,
//		freight.HasInsurance,
//		freight.ID,
//		freight.Email,
//		freight.UserID,
//	)
//
//	return err
//}

// Update 更新货运订单（仅更新非空字段）
func (r *MySQLFreightRepository) Update(ctx context.Context, freight *models.FreightOrder) error {
	var (
		setClauses []string
		args       []interface{}
	)

	// 动态构建SET子句
	if freight.OriginLocation != "" {
		setClauses = append(setClauses, "origin_location = ?")
		args = append(args, freight.OriginLocation)
	}
	if freight.DestinationLocation != "" {
		setClauses = append(setClauses, "destination_location = ?")
		args = append(args, freight.DestinationLocation)
	}
	if freight.Status != 0 {
		setClauses = append(setClauses, "status = ?")
		args = append(args, freight.Status)
	}
	if freight.UserID != 0 {
		setClauses = append(setClauses, "user_id = ?")
		args = append(args, freight.UserID)
	}
	// 其他字段...

	// 必须更新的字段
	setClauses = append(setClauses, "updated_at = NOW()")

	// 构建完整SQL
	query := fmt.Sprintf(`
		UPDATE freight_orders
		SET %s
		WHERE id = ? AND status != 0
	`, strings.Join(setClauses, ", "))

	// 添加WHERE条件的ID
	args = append(args, freight.ID)

	_, err := r.db.ExecContext(ctx, query, args...)
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

// ListByUserID 根据用户ID列出货运订单（兼容无SortField的情况）
func (r *MySQLFreightRepository) ListByUserID(ctx context.Context, userID uint64, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	// 构建基础查询SQL（强制关联 user_id）
	query := `
		SELECT id, origin_location, destination_location, origin_code, destination_code, type, typeid, remark, 
			   order_date, price, status, is_urgent, has_insurance,
			   created_at, updated_at, email, user_id
		FROM freight_orders
		WHERE user_id = ? AND status != 0
	`

	var args []interface{}
	args = append(args, userID) // 第一个参数：user_id

	// 添加其他过滤条件（复用原有逻辑）
	if filter.OriginLocation != "" {
		query += " AND origin_location = ?"
		args = append(args, filter.OriginLocation)
	}

	if filter.DestinationLocation != "" {
		query += " AND destination_location = ?"
		args = append(args, filter.DestinationLocation)
	}

	if filter.Status != nil {
		query += " AND status = ?"
		args = append(args, *filter.Status)
	}

	// 排序：使用默认排序（不依赖SortField）
	query += " ORDER BY created_at DESC" // 默认按创建时间降序

	// 添加分页
	if filter.Page > 0 && filter.PageSize > 0 {
		query += " LIMIT ? OFFSET ?"
		args = append(args, filter.PageSize, (filter.Page-1)*filter.PageSize)
	}

	// 后续查询逻辑不变...
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
			&freight.OriginLocation,
			&freight.DestinationLocation,
			&freight.OriginCode,
			&freight.DestinationCode,
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
			&freight.Email,
			&freight.UserID,
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
