import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 筛选条件类型
type FilterParams = {
  country?: string;
  destination?: string;
  origin?: string;
  type?: string;
  status?: string; // 仅我的运输页使用
};

// 组件属性
type CargoFilterProps = {
  onFilter: (filters: FilterParams) => void;
  showStatusFilter?: boolean; // 控制是否显示状态筛选（我的运输页用）
  cargoTypes?: string[];      // 货物类型选项
  countries?: string[];       // 国家选项（示例）
};

// 默认筛选选项（可扩展）
const DEFAULT_CARGO_TYPES = ['普通货物', '易碎品', '生鲜', '贵重物品'];
const DEFAULT_COUNTRIES = ['中国', '美国', '日本', '德国', '澳大利亚'];

export default function CargoFilter({ 
  onFilter, 
  showStatusFilter = false, 
  cargoTypes = DEFAULT_CARGO_TYPES, 
  countries = DEFAULT_COUNTRIES 
}: CargoFilterProps) {
  const [filters, setFilters] = useState<FilterParams>({});

  // 处理筛选条件变更
  const handleChange = (key: keyof FilterParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 提交筛选
  const handleSubmit = () => {
    onFilter(filters);
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <View style={styles.container}>
      {/* 国家筛选 */}
      <TextInput
        style={styles.input}
        placeholder="国家"
        onChangeText={(value) => handleChange('country', value)}
        value={filters.country || ''}
      />

      {/* 目的地筛选 */}
      <TextInput
        style={styles.input}
        placeholder="目的地"
        onChangeText={(value) => handleChange('destination', value)}
        value={filters.destination || ''}
      />

      {/* 始发地筛选 */}
      <TextInput
        style={styles.input}
        placeholder="始发地"
        onChangeText={(value) => handleChange('origin', value)}
        value={filters.origin || ''}
      />

      {/* 货物类型筛选 */}
      <TextInput
        style={styles.input}
        placeholder="货物类型"
        onChangeText={(value) => handleChange('type', value)}
        value={filters.type || ''}
      />

      {/* 状态筛选（仅我的运输页显示） */}
      {showStatusFilter && (
        <TextInput
          style={styles.input}
          placeholder="状态（待取/运输中...）"
          onChangeText={(value) => handleChange('status', value)}
          value={filters.status || ''}
        />
      )}

      {/* 操作按钮 */}
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleSubmit}
        >
          <Text style={styles.actionText}>筛选</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={styles.actionText}>重置</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15 
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    width: '45%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  actionText: { 
    color: '#fff', 
    fontSize: 14 
  },
});