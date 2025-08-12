package services

import (
	"context"
	"errors"
	"fmt"
	"freight/db"
	"freight/models"
	"freight/utils"
	"time"
)

// FreightService 货运订单服务接口，定义所有需要实现的方法
type FreightService interface {
	CreateFreight(ctx context.Context, freight *models.FreightOrder) error
	GetFreightByID(ctx context.Context, id uint64) (*models.FreightOrder, error)
	ListFreights(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error)
	UpdateFreight(ctx context.Context, freight *models.FreightOrder) error
	DeleteFreight(ctx context.Context, id uint64) error // 新增删除方法
	AcceptOrder(ctx context.Context, orderID, userID uint64) error
	ListByUserID(ctx context.Context, userID uint64, filter models.FreightFilter) ([]*models.FreightOrder, error) // 新增
	CompleteOrder(ctx context.Context, orderID uint64, userID uint64) error
}

// FreightServiceImpl 货运订单服务实现
type FreightServiceImpl struct {
	//db   *sql.DB
	repo db.FreightRepository // 替换原来的 *sql.DB，用仓储接口
}

// NewFreightService 创建货运订单服务实例
func NewFreightService(repo db.FreightRepository) FreightService {
	return &FreightServiceImpl{repo: repo}
}

// CreateFreight 创建货运订单
func (s *FreightServiceImpl) CreateFreight(ctx context.Context, freight *models.FreightOrder) error {
	if freight.OriginLocation == "" {
		return errors.New("出发地不能为空")
	}
	if freight.OriginCode == "" {
		return errors.New("出发地不能为空")
	}
	if freight.DestinationLocation == "" {
		return errors.New("目的地不能为空")
	}
	if freight.DestinationCode == "" {
		return errors.New("目的地不能为空")
	}
	if freight.Price <= 0 {
		return errors.New("价格必须大于0")
	}
	return s.repo.Create(ctx, freight)
}

// GetFreightByID 获取单个货运订单
func (s *FreightServiceImpl) GetFreightByID(ctx context.Context, id uint64) (*models.FreightOrder, error) {
	return s.repo.GetByID(ctx, id)
}

// ListFreights 列出货运订单
func (s *FreightServiceImpl) ListFreights(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	return s.repo.List(ctx, filter)
}

// UpdateFreight 更新货运订单
func (s *FreightServiceImpl) UpdateFreight(ctx context.Context, freight *models.FreightOrder) error {
	// 检查订单是否存在（可选）
	existing, err := s.repo.GetByID(ctx, freight.ID)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("货运订单不存在")
	}
	return s.repo.Update(ctx, freight)
}

// DeleteFreight 删除货运订单（实现缺失的方法）
func (s *FreightServiceImpl) DeleteFreight(ctx context.Context, id uint64) error {
	// 检查订单是否存在（可选）
	freight, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if freight == nil {
		return errors.New("货运订单不存在")
	}
	return s.repo.Delete(ctx, id)
}

// AcceptOrder 接单逻辑：复用Update方法更新指定字段
func (s *FreightServiceImpl) AcceptOrder(ctx context.Context, orderID, userID uint64) error {
	// 1. 查询订单是否存在且状态为“待接单”
	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return err
	}
	if order == nil {
		return errors.New("订单不存在")
	}

	// 2. 验证订单状态（假设1为待接单，2为运输中）
	if order.Status != 1 {
		return errors.New("订单状态不允许接单（仅待接单状态可接单）")
	}
	fmt.Println("OrderDate", order.OrderDate)
	// 3. 构建仅包含需要更新的字段的订单对象
	updateOrder := &models.FreightOrder{
		ID:        orderID,                    // 必须指定ID，用于Update方法定位订单
		UserID:    userID,                     // 更新接单用户ID
		Status:    2,                          // 状态改为“运输中”
		UpdatedAt: utils.FromTime(time.Now()), // 更新时间
		OrderDate: order.OrderDate,            // 关键：保留原订单的 order_date
	}

	// 4. 调用Update方法更新订单
	return s.repo.Update(ctx, updateOrder)
}

// 实现 ListByUserID 方法
func (s *FreightServiceImpl) ListByUserID(ctx context.Context, userID uint64, filter models.FreightFilter) ([]*models.FreightOrder, error) {
	return s.repo.ListByUserID(ctx, userID, filter)
}

// CompleteOrder 完成订单（仅接单用户可操作，状态从“运输中”转为“已完成”）
func (s *FreightServiceImpl) CompleteOrder(ctx context.Context, orderID uint64, userID uint64) error {
	// 新增：参数合法性校验（防止非整数userID）
	if userID == 0 {
		return errors.New("无效的用户ID（必须为正整数）")
	}
	if orderID == 0 {
		return errors.New("无效的订单ID（必须为正整数）")
	}

	// 1. 查询订单是否存在
	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("查询订单失败：%w", err) // 使用%w包装原始错误
	}
	if order == nil {
		return errors.New("订单不存在或已被删除")
	}

	// 2. 验证订单状态（仅“运输中”可完成，状态码 2→3）
	if order.Status != 2 {
		return errors.New("订单状态不允许完成（仅运输中状态可操作）")
	}

	// 3. 验证操作权限（仅接单用户可完成订单）
	if order.UserID != userID {
		return errors.New("无权操作：仅接单用户可完成订单")
	}

	// 4. 构建更新对象（仅修改必要字段）
	updateOrder := &models.FreightOrder{
		UpdatedAt: utils.FromTime(time.Now()), // 更新时间
		// 复用原始订单的其他字段（避免Update方法覆盖非必要字段）
		OriginLocation:      order.OriginLocation,
		OriginCode:          order.OriginCode,
		DestinationLocation: order.DestinationLocation,
		DestinationCode:     order.DestinationCode,
		Type:                order.Type,
		TypeID:              order.TypeID,
		Remark:              order.Remark,
		OrderDate:           order.OrderDate,
		Price:               order.Price,
		Status:              3, // 状态改为“已完成”
		IsUrgent:            order.IsUrgent,
		HasInsurance:        order.HasInsurance,
		ID:                  orderID,
		Email:               order.Email,
		UserID:              order.UserID, // 保持接单用户ID不变
	}

	// 5. 调用仓储层更新
	return s.repo.Update(ctx, updateOrder)
}
