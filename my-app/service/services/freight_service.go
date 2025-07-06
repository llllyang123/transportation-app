package services

import (
	"context"
	"errors"
	"freight/db"
	"freight/models"
)

// FreightService 货运订单服务接口，定义所有需要实现的方法
type FreightService interface {
	CreateFreight(ctx context.Context, freight *models.FreightOrder) error
	GetFreightByID(ctx context.Context, id uint64) (*models.FreightOrder, error)
	ListFreights(ctx context.Context, filter models.FreightFilter) ([]*models.FreightOrder, error)
	UpdateFreight(ctx context.Context, freight *models.FreightOrder) error
	DeleteFreight(ctx context.Context, id uint64) error // 新增删除方法
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
	if freight.Origin == "" {
		return errors.New("出发地不能为空")
	}
	if freight.Destination == "" {
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
