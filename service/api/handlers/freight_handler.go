// api/handlers/freight_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"freight/models"
	"freight/services"
	"freight/utils"
	"github.com/gorilla/mux"
)

type FreightHandler struct {
	service services.FreightService
	logger  utils.Logger
}

// 新增：接单请求参数结构体
type AcceptFreightRequest struct {
	UserID uint64 `json:"user_id"` // 接单用户ID
}

// NewFreightHandler 创建处理器实例
func NewFreightHandler(service services.FreightService) *FreightHandler {
	return &FreightHandler{service: service}
}

// CreateFreight 处理创建请求
func (h *FreightHandler) CreateFreight(w http.ResponseWriter, r *http.Request) {
	var freight models.FreightOrder
	if err := json.NewDecoder(r.Body).Decode(&freight); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的请求数据")
		return
	}
	defer r.Body.Close()

	if err := h.service.CreateFreight(r.Context(), &freight); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "创建货运订单失败")
		return
	}

	utils.ResponseJSON(w, http.StatusCreated, map[string]interface{}{
		"message": "货运订单创建成功",
		"data":    freight,
	})
}

// GetFreightByID 处理查询请求
func (h *FreightHandler) GetFreightByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的订单ID")
		return
	}

	freight, err := h.service.GetFreightByID(r.Context(), id)
	if err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "获取货运订单失败")
		return
	}

	if freight == nil {
		utils.ResponseError(w, http.StatusNotFound, "货运订单不存在")
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "获取货运订单成功",
		"data":    freight,
	})
}

// ListFreights 处理列表请求
func (h *FreightHandler) ListFreights(w http.ResponseWriter, r *http.Request) {
	var filter models.FreightFilter

	// 解析查询参数
	if origin := r.URL.Query().Get("origin_location"); origin != "" {
		filter.OriginLocation = origin
	}

	if destination := r.URL.Query().Get("destination_location"); destination != "" {
		filter.DestinationLocation = destination
	}

	if statusStr := r.URL.Query().Get("status"); statusStr != "" {
		status, err := strconv.ParseUint(statusStr, 10, 8)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的状态值")
			return
		}
		statusUint8 := uint8(status)
		filter.Status = &statusUint8
	}

	// 解析其他过滤参数...

	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的页码")
			return
		}
		filter.Page = page
	}

	if pageSizeStr := r.URL.Query().Get("page_size"); pageSizeStr != "" {
		pageSize, err := strconv.Atoi(pageSizeStr)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的每页大小")
			return
		}
		filter.PageSize = pageSize
	}

	// 调用服务层获取列表
	freights, err := h.service.ListFreights(r.Context(), filter)
	if err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "获取货运订单列表失败")
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "获取货运订单列表成功",
		"data":    freights,
	})
}

// UpdateFreight 处理更新请求
func (h *FreightHandler) UpdateFreight(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的订单ID")
		return
	}

	var freight models.FreightOrder
	if err := json.NewDecoder(r.Body).Decode(&freight); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的请求数据")
		return
	}
	defer r.Body.Close()

	// 设置ID
	freight.ID = id

	if err := h.service.UpdateFreight(r.Context(), &freight); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "更新货运订单失败")
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "更新货运订单成功",
		"data":    freight,
	})
}

// DeleteFreight 处理删除请求
func (h *FreightHandler) DeleteFreight(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的订单ID")
		return
	}

	if err := h.service.DeleteFreight(r.Context(), id); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "删除货运订单失败")
		return
	}

	utils.ResponseJSON(w, http.StatusOK, map[string]string{
		"message": "删除货运订单成功",
	})
}

// AcceptFreight 处理接单请求（更新user_id、status和时间）
func (h *FreightHandler) AcceptFreight(w http.ResponseWriter, r *http.Request) {
	// 1. 解析路径中的订单ID
	vars := mux.Vars(r)
	orderID, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的订单ID")
		return
	}

	// 2. 解析请求体中的接单用户ID
	var req AcceptFreightRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的请求数据："+err.Error())
		return
	}
	defer r.Body.Close()

	// 3. 验证用户ID是否有效
	if req.UserID == 0 {
		utils.ResponseError(w, http.StatusBadRequest, "接单用户ID不能为空")
		return
	}

	// 4. 构建仅包含需更新字段的订单对象
	// （复用UpdateFreight的服务层逻辑，仅更新必要字段）
	freight := &models.FreightOrder{
		ID:        orderID,                    // 订单ID（用于定位）
		UserID:    req.UserID,                 // 更新接单用户ID
		Status:    2,                          // 状态改为“运输中”（假设1=待接单，2=运输中）
		UpdatedAt: utils.FromTime(time.Now()), // 更新时间
	}

	// 5. 调用服务层的Update方法更新订单
	if err := h.service.AcceptOrder(r.Context(), freight.ID, freight.UserID); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "接单失败："+err.Error())
		return
	}

	// 6. 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "接单成功",
		"data": map[string]uint64{
			"order_id": orderID,
			"user_id":  req.UserID,
		},
	})
}

// ListFreightsByUser 根据用户ID查询订单列表
func (h *FreightHandler) ListFreightsByUser(w http.ResponseWriter, r *http.Request) {
	// 1. 解析路径中的用户ID
	vars := mux.Vars(r)
	userID, err := strconv.ParseUint(vars["user_id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的用户ID")
		return
	}

	// 2. 解析查询参数（分页、筛选条件）
	var filter models.FreightFilter

	// 状态筛选（可选）
	if statusStr := r.URL.Query().Get("status"); statusStr != "" {
		status, err := strconv.ParseUint(statusStr, 10, 8)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的状态值")
			return
		}
		statusUint8 := uint8(status)
		filter.Status = &statusUint8
	}

	// 分页参数（可选）
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的页码")
			return
		}
		filter.Page = page
	}

	if pageSizeStr := r.URL.Query().Get("page_size"); pageSizeStr != "" {
		pageSize, err := strconv.Atoi(pageSizeStr)
		if err != nil {
			utils.ResponseError(w, http.StatusBadRequest, "无效的每页大小")
			return
		}
		filter.PageSize = pageSize
	}

	// 3. 调用服务层方法查询用户订单
	freights, err := h.service.ListByUserID(r.Context(), userID, filter)
	if err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "查询用户订单失败："+err.Error())
		return
	}

	// 4. 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "查询用户订单成功",
		"data":    freights,
	})
}

// CompleteOrder 处理订单完成请求
func (h *FreightHandler) CompleteOrder(w http.ResponseWriter, r *http.Request) {
	// 解析路径参数（订单ID）
	vars := mux.Vars(r)
	orderID, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的订单ID")
		return
	}

	// 解析请求体（当前用户ID）
	var req struct {
		UserID uint64 `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "无效的请求数据")
		return
	}
	defer r.Body.Close()

	// 调用服务层完成订单
	if err := h.service.CompleteOrder(r.Context(), orderID, req.UserID); err != nil {
		utils.ResponseError(w, http.StatusForbidden, err.Error())
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message":  "订单已完成",
		"order_id": orderID,
	})
}
