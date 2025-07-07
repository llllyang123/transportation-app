// handlers/config_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	_ "freight/models"
	"freight/services"
	"freight/utils"
)

type ConfigHandler struct {
	ConfigService services.ConfigService
}

func NewConfigHandler(configService services.ConfigService) *ConfigHandler {
	return &ConfigHandler{ConfigService: configService}
}

// CreateConfig 处理创建配置请求
func (h *ConfigHandler) CreateConfig(w http.ResponseWriter, r *http.Request) {
	// 从上下文中获取用户ID
	userID, ok := r.Context().Value("user_id").(int64)
	if !ok {
		utils.ResponseError(w, http.StatusUnauthorized, "用户未认证")
		return
	}

	var req struct {
		Key         string `json:"key"`
		Value       string `json:"value"`
		Description string `json:"description,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "请求格式错误")
		return
	}

	// 验证请求参数
	if req.Key == "" || req.Value == "" {
		utils.ResponseError(w, http.StatusBadRequest, "配置键和值不能为空")
		return
	}

	// 创建配置
	if err := h.ConfigService.CreateConfig(req.Key, req.Value, req.Description); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "创建配置失败")
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusCreated, map[string]interface{}{
		"message": "配置创建成功",
		"user_id": userID,
	})
}

// GetConfig 获取配置
func (h *ConfigHandler) GetConfig(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	if key == "" {
		utils.ResponseError(w, http.StatusBadRequest, "缺少配置键")
		return
	}

	// 获取配置
	config, err := h.ConfigService.GetConfig(key)
	if err != nil {
		utils.ResponseError(w, http.StatusNotFound, "配置不存在")
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "获取配置成功",
		"config":  config,
	})
}

// UpdateConfig 更新配置
func (h *ConfigHandler) UpdateConfig(w http.ResponseWriter, r *http.Request) {
	// 从上下文中获取用户ID
	userID, ok := r.Context().Value("user_id").(int64)
	if !ok {
		utils.ResponseError(w, http.StatusUnauthorized, "用户未认证")
		return
	}

	key := r.URL.Query().Get("key")
	if key == "" {
		utils.ResponseError(w, http.StatusBadRequest, "缺少配置键")
		return
	}

	// 获取现有配置
	config, err := h.ConfigService.GetConfig(key)
	if err != nil {
		utils.ResponseError(w, http.StatusNotFound, "配置不存在")
		return
	}

	var req struct {
		Value       string `json:"value"`
		Description string `json:"description,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "请求格式错误")
		return
	}

	// 更新配置
	config.Value = req.Value
	if req.Description != "" {
		config.Description = req.Description
	}

	// 更新配置
	if err := h.ConfigService.UpdateConfig(config); err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "更新配置失败")
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "配置更新成功",
		"config":  config,
		"user_id": userID,
	})
}

// DeleteConfig 删除配置
func (h *ConfigHandler) DeleteConfig(w http.ResponseWriter, r *http.Request) {
	// 从上下文中获取用户ID
	userID, ok := r.Context().Value("user_id").(int64)
	if !ok {
		utils.ResponseError(w, http.StatusUnauthorized, "用户未认证")
		return
	}

	key := r.URL.Query().Get("key")
	if key == "" {
		utils.ResponseError(w, http.StatusBadRequest, "缺少配置键")
		return
	}

	// 删除配置
	if err := h.ConfigService.DeleteConfig(key); err != nil {
		utils.ResponseError(w, http.StatusNotFound, "配置不存在")
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "配置删除成功",
		"user_id": userID,
	})
}

// ListConfigs 获取配置列表
func (h *ConfigHandler) ListConfigs(w http.ResponseWriter, r *http.Request) {
	// 从上下文中获取用户ID
	userID, ok := r.Context().Value("user_id").(int64)
	if !ok {
		utils.ResponseError(w, http.StatusUnauthorized, "用户未认证")
		return
	}

	// 获取配置列表
	configs, err := h.ConfigService.ListConfigs()
	if err != nil {
		utils.ResponseError(w, http.StatusInternalServerError, "获取配置列表失败")
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "获取配置列表成功",
		"configs": configs,
		"user_id": userID,
	})
}
