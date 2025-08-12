package utils

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// 常用时间格式常量（全项目统一）
const (
	LayoutDate     = "2006-01-02"          // 仅日期格式（年-月-日）
	LayoutDateTime = "2006-01-02 15:04:05" // 日期时间格式
	LayoutTime     = "15:04:05"            // 仅时间格式
	LayoutISO      = time.RFC3339          // ISO标准格式（带时区）
)

// ------------------------------
// CustomNullTime：处理可空的日期时间（含时间部分）
// ------------------------------
type CustomNullTime struct {
	sql.NullTime // 嵌入sql.NullTime，继承Valid和Time字段
}

// FromTime 将time.Time转换为CustomNullTime（非空）
func FromTime(t time.Time) CustomNullTime {
	return CustomNullTime{
		NullTime: sql.NullTime{
			Time:  t,
			Valid: true,
		},
	}
}

// FromNullTime 将sql.NullTime转换为CustomNullTime
func FromNullTime(nt sql.NullTime) CustomNullTime {
	return CustomNullTime{nt}
}

// MarshalJSON：序列化为 "YYYY-MM-DD 15:04:05" 字符串（空值为null）
func (c CustomNullTime) MarshalJSON() ([]byte, error) {
	if !c.Valid {
		return []byte("null"), nil
	}
	// 格式化为本地时间的LayoutDateTime格式
	return json.Marshal(c.Time.Local().Format(LayoutDateTime))
}

// UnmarshalJSON：从 "YYYY-MM-DD 15:04:05" 字符串解析（null表示空值）
func (c *CustomNullTime) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		c.Valid = false
		return nil
	}

	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return fmt.Errorf("解析时间失败：%w", err)
	}

	t, err := time.ParseInLocation(LayoutDateTime, s, time.Local)
	if err != nil {
		return fmt.Errorf("时间格式错误（需符合%s）：%w", LayoutDateTime, err)
	}

	c.Time = t
	c.Valid = true
	return nil
}

// ------------------------------
// Date：处理纯日期（仅YYYY-MM-DD，无时间部分）
// ------------------------------
type Date struct {
	time.Time
}

// NewDate：从年、月、日创建Date
func NewDate(year, month, day int) Date {
	return Date{time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.Local)}
}

// FromTime：从time.Time提取日期部分（忽略时间）
func FromTimeToDate(t time.Time) Date {
	return Date{time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.Local)}
}

// ParseDate：从"YYYY-MM-DD"字符串解析为Date
func ParseDate(s string) (Date, error) {
	t, err := time.ParseInLocation(LayoutDate, s, time.Local)
	if err != nil {
		return Date{}, fmt.Errorf("日期格式错误（需符合%s）：%w", LayoutDate, err)
	}
	return Date{t}, nil
}

// MarshalJSON：序列化为"YYYY-MM-DD"字符串（空值为""）
func (d Date) MarshalJSON() ([]byte, error) {
	if d.IsZero() {
		return json.Marshal("")
	}
	return json.Marshal(d.Format(LayoutDate))
}

// UnmarshalJSON：从"YYYY-MM-DD"字符串解析（空字符串表示零值）
func (d *Date) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return fmt.Errorf("解析日期失败：%w", err)
	}
	if s == "" {
		d.Time = time.Time{} // 空值表示零日期
		return nil
	}

	t, err := time.ParseInLocation(LayoutDate, s, time.Local)
	if err != nil {
		return fmt.Errorf("日期格式错误（需符合%s）：%w", LayoutDate, err)
	}
	d.Time = t
	return nil
}

// Scan：从数据库读取（支持DATE类型或字符串）
func (d *Date) Scan(value interface{}) error {
	switch v := value.(type) {
	case time.Time:
		// 从时间中提取日期部分（忽略时分秒）
		d.Time = time.Date(v.Year(), v.Month(), v.Day(), 0, 0, 0, 0, time.Local)
	case string:
		t, err := time.ParseInLocation(LayoutDate, v, time.Local)
		if err != nil {
			return fmt.Errorf("数据库日期格式错误：%w", err)
		}
		d.Time = t
	case []byte:
		t, err := time.ParseInLocation(LayoutDate, string(v), time.Local)
		if err != nil {
			return fmt.Errorf("数据库日期格式错误：%w", err)
		}
		d.Time = t
	case nil:
		d.Time = time.Time{} // 数据库NULL表示零日期
	default:
		return fmt.Errorf("不支持的数据库日期类型：%T", v)
	}
	return nil
}

// Value：写入数据库（转为"YYYY-MM-DD"字符串）
func (d Date) Value() (driver.Value, error) {
	if d.IsZero() {
		return nil, nil // 零日期对应数据库NULL
	}
	return d.Format(LayoutDate), nil
}

// String：返回"YYYY-MM-DD"字符串
func (d Date) String() string {
	if d.IsZero() {
		return ""
	}
	return d.Format(LayoutDate)
}

// AddDays：日期加减天数（返回新Date，不修改原对象）
func (d Date) AddDays(days int) Date {
	newTime := d.Time.AddDate(0, 0, days)
	return Date{newTime}
}
