package handlers

import (
	"encoding/json"
	"net/http"

	"freight/services"
	"freight/utils"
)

// UserHandler 用户处理函数
type UserHandler struct {
	UserService services.UserService
}

// NewUserHandler 创建用户处理函数实例
func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{UserService: userService}
}

// Register 用户注册
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "请求格式错误")
		return
	}

	// 验证请求参数
	if req.Username == "" || req.Password == "" || req.Email == "" {
		utils.ResponseError(w, http.StatusBadRequest, "用户名、密码和邮箱不能为空")
		return
	}

	// 创建用户
	user, err := h.UserService.Register(req.Username, req.Password, req.Email)
	if err != nil {
		utils.ResponseError(w, http.StatusConflict, err.Error())
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusCreated, map[string]interface{}{
		"message": "用户注册成功",
		"user": map[string]interface{}{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

// Login 用户登录
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		LoginID  string `json:"login_id"` // 改为login_id以支持邮箱或用户名
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "请求格式错误")
		return
	}

	// 验证登录（调用已支持邮箱的服务层）
	user, token, err := h.UserService.Login(req.LoginID, req.Password)
	if err != nil {
		utils.ResponseError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// 返回成功响应
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "登录成功",
		"token":   token,
		"user": map[string]interface{}{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"avatar":   user.AvatarURL,
			"role":     user.Role,
			"six":      user.Six,
			"token":    token,
		},
	})
}

// UpdateGender 更新用户性别（仅支持更新为man或women）
func (h *UserHandler) UpdateGender(w http.ResponseWriter, r *http.Request) {
	// 1. 解析请求体中的性别参数
	var req struct {
		UserId int64  `json:"user_id"`
		Gender string `json:"gender"` // 只能是"man"或"women"
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ResponseError(w, http.StatusBadRequest, "请求格式错误")
		return
	}

	// 2. 从中间件处理后的上下文获取用户ID
	// （假设中间件已将用户ID存入r.Context()的"userID"键）
	// 2. 参数校验
	if req.UserId <= 0 {
		utils.ResponseError(w, http.StatusBadRequest, "无效的用户ID")
		return
	}
	if req.Gender != "man" && req.Gender != "women" {
		utils.ResponseError(w, http.StatusBadRequest, "性别参数无效，必须是'man'或'women'")
		return
	}

	// 3. 调用服务层更新性别
	updatedUser, err := h.UserService.UpdateGender(req.UserId, req.Gender)
	if err != nil {
		utils.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	// 4. 返回成功响应（格式与Login/Register保持一致）
	utils.ResponseJSON(w, http.StatusOK, map[string]interface{}{
		"message": "性别更新成功",
		"user": map[string]interface{}{
			"id":       updatedUser.ID,
			"username": updatedUser.Username,
			"six":      updatedUser.Six, // 仅返回必要字段
		},
	})
}
