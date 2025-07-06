package config

import (
	"fmt"
	"gopkg.in/yaml.v3"
	"io/ioutil"
	"log"
)

type DBConfig struct {
	Driver          string `yaml:"driver"`
	Host            string `yaml:"host"`
	Port            int    `yaml:"port"`
	Username        string `yaml:"username"`
	Password        string `yaml:"password"`
	Name            string `yaml:"name"`
	Charset         string `yaml:"charset"`
	MaxOpenConns    int    `yaml:"max_open_conns"`
	MaxIdleConns    int    `yaml:"max_idle_conns"`
	ConnMaxLifetime int    `yaml:"conn_max_lifetime"`
}

// Config 应用配置结构
type Config struct {
	Server struct {
		Port string `yaml:"port"`
	} `yaml:"server"`
	DB  DBConfig `yaml:"db"`
	JWT struct {
		Secret string `yaml:"secret"`
		Expiry int    `yaml:"expiry"`
	} `yaml:"jwt"`
}

var appConfig Config

// Load 加载配置
func Load() (*Config, error) {
	data, err := ioutil.ReadFile("config/config.yaml")
	if err != nil {
		log.Printf("读取配置文件失败: %v", err)
		return nil, err
	}

	if err := yaml.Unmarshal(data, &appConfig); err != nil {
		log.Printf("解析配置文件失败: %v", err)
		return nil, err
	}

	return &appConfig, nil
}

// Get 获取配置实例
func Get() *Config {
	return &appConfig
}

// parseInt 辅助函数：将字符串转换为整数
func parseInt(s string) int {
	var result int
	fmt.Sscanf(s, "%d", &result)
	return result
}
