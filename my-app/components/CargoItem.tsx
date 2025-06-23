import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 货物基础类型
type Cargo = {
  id: string;
  origin: string;
  destination: string;
  type: string;
  remark: string;
};

// 我的运输货物类型（扩展状态）
type MyCargo = Cargo & {
  status: '待取' | '运输中' | '已到达' | '签收';
};

// 组件属性
type CargoItemProps = {
  cargo: Cargo | MyCargo;
  onPress: () => void;
  showStatus?: boolean; // 控制是否显示状态（我的运输页用）
};

export default function CargoItem({ 
  cargo, 
  onPress, 
  showStatus = false 
}: CargoItemProps) {
  // 处理超长备注省略
  const truncatedRemark = 
    cargo.remark.length > 30 
      ? `${cargo.remark.slice(0, 30)}...` 
      : cargo.remark;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.origin}>{cargo.origin}</Text>
        <Text style={styles.destination}>{cargo.destination}</Text>
        <Text style={styles.type}>{cargo.type}</Text>
        <Text style={styles.remark}>{truncatedRemark}</Text>
      </View>

      {/* 状态展示（我的运输页用） */}
      {showStatus && (
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{(cargo as MyCargo).status}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: 5,
  },
  origin: { fontWeight: 'bold' },
  destination: { color: '#666' },
  type: { color: '#666' },
  remark: { color: '#999', fontSize: 12 },
  statusContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  status: { 
    fontSize: 12, 
    color: '#333' 
  },
});