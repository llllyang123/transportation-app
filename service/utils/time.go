package utils

import (
	"database/sql"
	"encoding/json"
	"time"
)

// CustomNullTime 自定义可空时间类型，用于处理数据库中的 NULL 时间
type CustomNullTime struct {
	sql.NullTime
}

// FromTime 将 time.Time 转换为 CustomNullTime
func FromTime(t time.Time) CustomNullTime {
	return CustomNullTime{
		NullTime: sql.NullTime{
			Time:  t,
			Valid: true,
		},
	}
}

// FromNullTime 将 sql.NullTime 转换为 CustomNullTime
func FromNullTime(nt sql.NullTime) CustomNullTime {
	return CustomNullTime{nt}
}

// MarshalJSON 实现 json.Marshaler 接口
func (c CustomNullTime) MarshalJSON() ([]byte, error) {
	if !c.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(c.Time.Local().Format("2006-01-02 15:04:05"))
}

// UnmarshalJSON 实现 json.Unmarshaler 接口
func (c *CustomNullTime) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		c.Valid = false
		return nil
	}

	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	t, err := time.Parse("2006-01-02 15:04:05", s)
	if err != nil {
		return err
	}

	c.Time = t
	c.Valid = true
	return nil
}
