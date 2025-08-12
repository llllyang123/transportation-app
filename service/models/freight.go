package models

import "freight/utils"

// FreightStatus 货运状态常量
const (
	FreightStatusPending   = 1 // 待取货
	FreightStatusShipping  = 2 // 运输中
	FreightStatusDelivered = 3 // 已送达
)

// FreightOrder 运输订单模型
type FreightOrder struct {
	ID                  uint64               `json:"id" db:"id"`
	UserID              uint64               `json:"user_id" db:"user_id"`
	OriginLocation      string               `json:"origin_location" db:"origin_location"`
	OriginCode          string               `json:"origin_code" db:"origin_code"`
	DestinationLocation string               `json:"destination_location" db:"destination_location"`
	DestinationCode     string               `json:"destination_code" db:"destination_code"`
	Type                string               `json:"type" db:"type"`      // 注意：字段名与数据库一致
	TypeID              uint8                `json:"type_id" db:"typeid"` // 驼峰命名，映射到typeid
	Remark              string               `json:"remark" db:"remark"`
	OrderDate           utils.Date           `json:"order_date" db:"order_date"`
	Price               float64              `json:"price" db:"price"`
	Status              uint8                `json:"status" db:"status"`
	IsUrgent            bool                 `json:"is_urgent" db:"is_urgent"`
	HasInsurance        bool                 `json:"has_insurance" db:"has_insurance"`
	CreatedAt           utils.CustomNullTime `json:"created_at" db:"created_at"`
	UpdatedAt           utils.CustomNullTime `json:"updated_at" db:"updated_at"`
	Email               string               `json:"email" db:"email"`
}

// FreightFilter 订单过滤条件
type FreightFilter struct {
	OriginLocation      string  `json:"origin_location,omitempty" db:"origin_location"`
	OriginCode          string  `json:"origin_code,omitempty" db:"origin_code"`
	DestinationLocation string  `json:"destination_location,omitempty" db:"destination_location"`
	DestinationCode     string  `json:"origin_code,omitempty" db:"origin_code"`
	TypeID              uint8   `json:"type_id,omitempty" db:"typeid"`
	Status              *uint8  `json:"status,omitempty" db:"status"`
	MinPrice            float64 `json:"min_price,omitempty" db:"price >= ?"`
	MaxPrice            float64 `json:"max_price,omitempty" db:"price <= ?"`
	IsUrgent            *bool   `json:"is_urgent,omitempty" db:"is_urgent = ?"`
	HasInsurance        *bool   `json:"has_insurance,omitempty" db:"has_insurance = ?"`
	OrderDate           string  `json:"order_date,omitempty" db:"order_date = ?"`
	Page                int     `json:"page,omitempty"`
	PageSize            int     `json:"page_size,omitempty"`
	SortField           string  // 新增：排序字段（如 "created_at", "price", "order_date"）
	SortOrder           string  // 新增：排序方向（"asc" 升序 或 "desc" 降序）
}
