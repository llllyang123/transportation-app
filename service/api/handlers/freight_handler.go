// api/handlers/freight_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"freight/models"
	"freight/services"
	"freight/utils"
	"github.com/gorilla/mux"
)

type FreightHandler struct {
	service services.FreightService
	logger  utils.Logger
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
	if origin := r.URL.Query().Get("origin"); origin != "" {
		filter.Origin = origin
	}

	if destination := r.URL.Query().Get("destination"); destination != "" {
		filter.Destination = destination
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
