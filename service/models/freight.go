package models

import "freight/utils"

// FreightStatus 货运状态常量
const (
	FreightStatusPending   = 1 // 待发货
	FreightStatusShipping  = 2 // 运输中
	FreightStatusDelivered = 3 // 已送达
)

// FreightOrder 运输订单模型
type FreightOrder struct {
	ID           uint64               `json:"id" db:"id"`
	Origin       string               `json:"origin" db:"origin"`
	Destination  string               `json:"destination" db:"destination"`
	Type         string               `json:"type" db:"type"`      // 注意：字段名与数据库一致
	TypeID       uint8                `json:"type_id" db:"typeid"` // 驼峰命名，映射到typeid
	Remark       string               `json:"remark" db:"remark"`
	OrderDate    utils.CustomNullTime `json:"order_date" db:"order_date"`
	Price        float64              `json:"price" db:"price"`
	Status       uint8                `json:"status" db:"status"`
	IsUrgent     bool                 `json:"is_urgent" db:"is_urgent"`
	HasInsurance bool                 `json:"has_insurance" db:"has_insurance"`
	CreatedAt    utils.CustomNullTime `json:"created_at" db:"created_at"`
	UpdatedAt    utils.CustomNullTime `json:"updated_at" db:"updated_at"`
}

// FreightFilter 订单过滤条件
type FreightFilter struct {
	Origin       string  `json:"origin,omitempty" db:"origin"`
	Destination  string  `json:"destination,omitempty" db:"destination"`
	TypeID       uint8   `json:"type_id,omitempty" db:"typeid"`
	Status       *uint8  `json:"status,omitempty" db:"status"`
	MinPrice     float64 `json:"min_price,omitempty" db:"price >= ?"`
	MaxPrice     float64 `json:"max_price,omitempty" db:"price <= ?"`
	IsUrgent     *bool   `json:"is_urgent,omitempty" db:"is_urgent = ?"`
	HasInsurance *bool   `json:"has_insurance,omitempty" db:"has_insurance = ?"`
	OrderDate    string  `json:"order_date,omitempty" db:"order_date = ?"`
	Page         int     `json:"page,omitempty"`
	PageSize     int     `json:"page_size,omitempty"`
}
