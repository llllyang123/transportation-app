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
		},
	})
}
