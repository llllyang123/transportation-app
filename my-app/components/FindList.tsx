import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import React, { useState } from 'react';
import { FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button, Card, Switch } from 'react-native-paper';
import CountryPicker from './CountryPicker';
// 货物数据类型
export type Cargo = {
  id: number;
  origin_location: string;
  origin_code: string,
  destination_location: string;
  destination_code: string,
  type: string;
  typeid: number,
  remark: string;
  date: string;
  price: string;
  status: 1 | 2 | 3; //'待取' | '运输中' | '已完成';
  isUrgent: boolean;
  hasInsurance: boolean;
};

// 筛选条件类型
type FilterParams = {
  category: number;
  categoryName: string,
  sort: 'default' | 'price-asc' | 'price-desc' | 'time-new' | 'time-old';
  // priceRange: string;
  // origin: string;
  selectedCountry: string,
  destination: string;
  status: number;
  isUrgent: boolean;
  hasInsurance: boolean;
};

// 筛选组件
const TaobaoStyleFilter: React.FC<{ 
  onFilter: (filters: FilterParams) => void;
  initialFilters?: Partial<FilterParams>;
  categories?: { id: number; name: string }[];
}> = ({ onFilter, initialFilters, categories = [] }) => {
  const [activeTab, setActiveTab] = useState<'category' | 'sort' | 'price' | 'more'>('category');
  const [showModal, setShowModal] = useState(false);
  const [ selectedCategory, setSelectedCategory ] = useState( 1 );
  const [ selectedCategoryName, setSelectedCategoryName ] = useState(`${t("hallInfo.allType")}`);
  // const [selectedPriceRange, setSelectedPriceRange] = useState('全部价格');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [priceSlider, setPriceSlider] = useState([0, 1000]);
  // const [ origin, setOrigin ] = useState( '' );
  const [selectedCountry, setSelectedCountry] = useState('');
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  
  // 分类数据
  const categoryData = [
    { id: 1, name: `${t("hallInfo.allType")}` },
    ...categories,
  ];

  // 价格区间数据
  const priceRanges = [
    { id: '1', name: '全部价格' },
    { id: '2', name: '¥0-¥100' },
    { id: '3', name: '¥100-¥500' },
    { id: '4', name: '¥500-¥1000' },
    { id: '5', name: '¥1000以上' },
  ];

  // 初始化筛选条件
  React.useEffect(() => {
    if (initialFilters) {
      if ( initialFilters.category ) setSelectedCategory( initialFilters.category ); 
      if (initialFilters.category) setSelectedCategoryName(initialFilters.categoryName as any);
      // if (initialFilters.priceRange) setSelectedPriceRange(initialFilters.priceRange);
      if (initialFilters.sort) setSortOption(initialFilters.sort as any);
      // if ( initialFilters.origin ) setOrigin( initialFilters.origin );
      if ( initialFilters.selectedCountry ) setSelectedCountry( initialFilters.selectedCountry );
      if (initialFilters.destination) setDestination(initialFilters.destination);
      if (initialFilters.status) setStatus(initialFilters.status);
      if (initialFilters.isUrgent !== undefined) setIsUrgent(initialFilters.isUrgent);
      if (initialFilters.hasInsurance !== undefined) setHasInsurance(initialFilters.hasInsurance);
    }
  }, [initialFilters]);

  // 打开模态框
  const openModal = (tab: 'category' | 'sort' | 'price' | 'more') => {
    setActiveTab(tab);
    setShowModal(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
  };

  // 应用筛选
  const applyFilters = () => {
    const filters: FilterParams = {
      category: selectedCategory,
      categoryName: selectedCategoryName,
      sort: sortOption,
      // priceRange: selectedPriceRange,
      // origin,
      selectedCountry,
      destination,
      status,
      isUrgent,
      hasInsurance,
    };
    
    onFilter(filters);
    closeModal();
  };

  // 重置筛选
  const resetFilters = () => {
    setSelectedCategory( 1 );
    setSelectedCategoryName(`${t("hallInfo.allType")}`);
    // setSelectedPriceRange('全部价格');
    setSortOption('default');
    // setOrigin( '' );
    setSelectedCountry('')
    setDestination('');
    setStatus(0);
    setIsUrgent(false);
    setHasInsurance(false);
    setPriceSlider([0, 1000]);
    
    const filters: FilterParams = {
      category: 1,
      categoryName: `${t("hallInfo.allType")}`,
      sort: 'default',
      // priceRange: '全部价格',
      // origin: '',
      selectedCountry: '',
      destination: '',
      status: 0,
      isUrgent: false,
      hasInsurance: false,
    };
    
    onFilter(filters);
    closeModal();
  };

  // 渲染分类选项
  const renderCategoryItem = ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.filterItem,
        selectedCategory === item.id ? styles.filterItemSelected : null,
      ]}
      onPress={() => {
        setSelectedCategory( item.id );
        setSelectedCategoryName(item.name)
      }}
    >
      <Text style={selectedCategory === item.id ? styles.filterItemTextSelected : styles.filterItemText}>
        {item.name}
      </Text>
      {selectedCategory === item.id && (
        <MaterialIcons name="check" size={16} color="#1677ff" />
      )}
    </TouchableOpacity>
  );

  // 渲染价格区间选项
  // const renderPriceItem = ({ item }: { item: { id: string; name: string } }) => (
  //   <TouchableOpacity
  //     key={item.id}
  //     style={[
  //       styles.filterItem,
  //       selectedPriceRange === item.name ? styles.filterItemSelected : null,
  //     ]}
  //     onPress={() => {
  //       setSelectedPriceRange(item.name);
  //     }}
  //   >
  //     <Text style={selectedPriceRange === item.name ? styles.filterItemTextSelected : styles.filterItemText}>
  //       {item.name}
  //     </Text>
  //     {selectedPriceRange === item.name && (
  //       <MaterialIcons name="check" size={16} color="#1677ff" />
  //     )}
  //   </TouchableOpacity>
  // );

  // 渲染排序选项
  const renderSortItem = (option: string, label: string, icon?: string) => (
    <TouchableOpacity
      style={[
        styles.sortItem,
        sortOption === option ? styles.sortItemSelected : null,
      ]}
      onPress={() => setSortOption(option as any)}
    >
      <Text style={sortOption === option ? styles.sortItemTextSelected : styles.sortItemText}>
        {label}
      </Text>
      {icon && (
        <MaterialIcons
          name={sortOption === option ? 'arrow-drop-down' : 'arrow-drop-down'}
          size={18}
          color={sortOption === option ? '#1677ff' : '#999'}
        />
      )}
    </TouchableOpacity>
  );

  const handleCountrySelectEnd = (country: any) => {
    console.log("Selected country end:", country.iso_code);
    setSelectedCountry(country.iso_code);
  };



  return (
    <>
      {/* 顶部筛选栏 */}
      <View style={styles.filterBar}>
        {/* 分类按钮 */}
        <TouchableOpacity 
          style={[styles.filterButton, selectedCategory !== 1 && styles.filterButtonActive]}
          onPress={() => openModal('category')}
        >
          <Text style={selectedCategory !== 1 ? styles.filterButtonTextActive : styles.filterButtonText}>
            {selectedCategoryName}
          </Text>
          <FontAwesome 
            name="angle-down" 
            size={16} 
            color={selectedCategory !== 1 ? '#1677ff' : '#666'} 
          />
        </TouchableOpacity>
        
        {/* 排序按钮 */}
        <TouchableOpacity 
          style={[styles.filterButton, sortOption !== 'default' && styles.filterButtonActive]}
          onPress={() => openModal('sort')}
        >
          <Text style={sortOption !== 'default' ? styles.filterButtonTextActive : styles.filterButtonText}>
            {sortOption === 'default' ? `${t("hallInfo.defaultSort")}` : 
             sortOption === 'price-asc' ? `${t("hallInfo.lowestPrice")}` : `${t("hallInfo.highestPrice")}`}
          </Text>
          <FontAwesome 
            name="angle-down" 
            size={16} 
            color={sortOption !== 'default' ? '#1677ff' : '#666'} 
          />
        </TouchableOpacity>
        
        {/* 价格区间按钮 */}
        {/* <TouchableOpacity 
          style={[styles.filterButton, selectedPriceRange !== '全部价格' && styles.filterButtonActive]}
          onPress={() => openModal('price')}
        >
          <Text style={selectedPriceRange !== '全部价格' ? styles.filterButtonTextActive : styles.filterButtonText}>
            {selectedPriceRange}
          </Text>
          <FontAwesome 
            name="angle-down" 
            size={16} 
            color={selectedPriceRange !== '全部价格' ? '#1677ff' : '#666'} 
          />
        </TouchableOpacity> */}
        
        {/* 更多筛选按钮 */}
        <TouchableOpacity 
          style={[styles.filterButton, (selectedCountry || destination || status || isUrgent || hasInsurance) && styles.filterButtonActive]}
          onPress={() => openModal('more')}
        >
          <Text style={(selectedCountry || destination || status || isUrgent || hasInsurance) ? styles.filterButtonTextActive : styles.filterButtonText}>
            {t("hallInfo.more")}
          </Text>
          <Feather 
            name="sliders" 
            size={16} 
            color={(selectedCountry || destination || status || isUrgent || hasInsurance) ? '#1677ff' : '#666'} 
          />
        </TouchableOpacity>
      </View>

      {/* 筛选模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            {/* 模态框头部 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeTab === 'category' ? `${t("hallInfo.selectCategory")}` : 
                 activeTab === 'sort' ? `${t("hallInfo.sortBy")}` : 
                 activeTab === 'price' ? `${t("hallInfo.priceRange")}` : `${t("hallInfo.moreFilters")}`}
              </Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>{t("hallInfo.reSet")}</Text>
              </TouchableOpacity>
            </View>
            
            {/* 模态框内容 */}
            <ScrollView style={styles.modalScrollView}>
              {activeTab === 'category' && (
                <View style={styles.modalSection}>
                  <FlatList
                    data={categoryData}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.categoryList}
                  />
                </View>
              )}
              
              {activeTab === 'sort' && (
                <View style={styles.modalSection}>
                  {renderSortItem('default', `${t("hallInfo.defaultSort")}`)}
                  {renderSortItem('price-asc', `${t("hallInfo.priceFromLowToHigh")}`, 'arrow-down')}
                  {renderSortItem('price-desc', `${t("hallInfo.priceFromHighToLow")}`, 'arrow-up')}
                  {renderSortItem('time-new', `${t("hallInfo.latestRelease")}`, 'clock')}
                  {renderSortItem('time-old', `${t("hallInfo.earliestRelease")}`, 'clock-o')}
                </View>
              )}
              
              {activeTab === 'more' && (
                <View style={styles.modalSection}>
                  {/* 始发地 */}
                  <View style={styles.filterGroup}>
                    <Text style={ styles.filterLabel }>{ t("hallInfo.origin") }</Text>
                    <View style={styles.filterInputContainer}>
                      {/* <TextInput
                        style={styles.filterInput}
                        placeholder="请输入始发地"
                        value={origin}
                        onChangeText={setOrigin}
                      /> */}
                      <CountryPicker
                        lab='destination'
                        onCountrySelect={handleCountrySelectEnd}
                        placeholder={t("common.selectCountry")}
                        showSearch={true}
                      />
                    </View>
                  </View>
                  
                  {/* 目的地 */}
                  <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>{ t("hallInfo.destination") }</Text>
                    <View style={styles.filterInputContainer}>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="请输入目的地"
                        value={destination}
                        onChangeText={setDestination}
                      />
                    </View>
                  </View>
                  
                  {/* 状态 */}
                  <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>{t('hallInfo.statusName')}</Text>
                    <View style={styles.filterOptions}>
                      <TouchableOpacity
                        style={[
                          styles.filterOption,
                          status === 1 && styles.filterOptionSelected,
                        ]}
                        onPress={() => setStatus(status === 1 ? 0 : 1)}
                      >
                        <Text style={status === 1 ? styles.filterOptionTextSelected : styles.filterOptionText}>
                        {t("hallInfo.waitingForPickup")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.filterOption,
                          status === 2 && styles.filterOptionSelected,
                        ]}
                        onPress={() => setStatus(status === 2 ? 0 : 2)}
                      >
                        <Text style={status === 2 ? styles.filterOptionTextSelected : styles.filterOptionText}>
                          {t("hallInfo.inTransit")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.filterOption,
                          status === 3 && styles.filterOptionSelected,
                        ]}
                        onPress={() => setStatus(status === 3 ? 0 : 3)}
                      >
                        <Text style={status === 3 ? styles.filterOptionTextSelected : styles.filterOptionText}>
                        {t("hallInfo.completed")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* 紧急货物 */}
                  <View style={styles.filterSwitch}>
                    <Text style={styles.filterSwitchLabel}>紧急货物</Text>
                    <Switch
                      value={isUrgent}
                      onValueChange={setIsUrgent}
                      color="#1677ff"
                    />
                  </View>
                  
                  {/* 有保险 */}
                  <View style={styles.filterSwitch}>
                    <Text style={styles.filterSwitchLabel}>有保险</Text>
                    <Switch
                      value={hasInsurance}
                      onValueChange={setHasInsurance}
                      color="#1677ff"
                    />
                  </View>
                </View>
              )}
            </ScrollView>
            
            {/* 模态框底部 */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>{ t("hallInfo.enter") }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// 货物列表项组件
const CargoItem: React.FC<{ 
  cargo: Cargo;
  onPress: () => void;
  renderItemContent?: (cargo: Cargo) => React.ReactNode;
}> = ({ cargo, onPress, renderItemContent }) => {
  if (renderItemContent) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.cargoItem}>
        <Card style={styles.card}>
          <Card.Content>
            {renderItemContent(cargo)}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.cargoItem}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{cargo.type}</Text>
            <Text style={styles.itemPrice}>{cargo.price}</Text>
          </View>
          
          <View style={styles.itemInfo}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeOrigin}>{cargo.origin}</Text>
              <View style={styles.routeArrow}>
                <MaterialIcons name="arrow-right-alt" size={20} color="#999" />
              </View>
              <Text style={styles.routeDestination}>{cargo.destination}</Text>
            </View>
            
            <Text style={styles.itemDate}>{cargo.date}</Text>
          </View>
          
          <View style={styles.itemFooter}>
            <Text style={styles.itemRemark} numberOfLines={1}>
              {cargo.remark}
            </Text>
            
            <View style={styles.itemTags}>
              {cargo.isUrgent && (
                <View style={styles.tagUrgent}>
                  <Text style={styles.tagText}>{t('hallInfo.emergency')}</Text>
                </View>
              )}
              {cargo.hasInsurance && (
                <View style={styles.tagInsurance}>
                  <Text style={styles.tagText}>保险</Text>
                </View>
              )}
              <View 
                style={[
                  styles.tagStatus,
                  cargo.status === 1 ? styles.tagStatusPending :
                  cargo.status === 2 ? styles.tagStatusInProgress :
                  styles.tagStatusCompleted
                ]}
              >
                <Text style={styles.tagText}>{cargo.status === 1 ? t('hallInfo.waitingForPickup') : cargo.status === 2 ? t('hallInfo.inTransit') : cargo.status === 3 ? t('hallInfo.completed') : '' }</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// 空状态组件
const EmptyState: React.FC<{ 
  onReset?: () => void;
  message?: string;
  icon?: React.ReactNode;
}> = ({ onReset, message = '没有找到符合条件的货物', icon }) => {
  return (
    <View style={styles.emptyState}>
      {icon || <MaterialIcons name="search" size={48} color="#ccc" />}
      <Text style={styles.emptyText}>{message}</Text>
      {onReset && (
        <Button 
          mode="contained" 
          onPress={onReset}
          style={styles.resetButton}
        >
          {t("hallInfo.resetFilter")}
        </Button>
      )}
    </View>
  );
};

// 大厅页面组件
export type HallScreenProps = {
  title?: string;
  cargos: Cargo[];
  onItemPress?: (cargo: Cargo) => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  renderItemContent?: (cargo: Cargo) => React.ReactNode;
  categories?: { id: number; name: string }[];
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
};

export const HallScreen: React.FC<HallScreenProps> = ({ 
  title = '货物大厅',
  cargos,
  onItemPress,
  onRefresh,
  onLoadMore,
  renderItemContent,
  categories = [
    // { id: '2', name: `${t("publish.typeList.[2]")}` },
    // { id: '3', name: '生鲜' },
    // { id: '4', name: '普通货物' },
    // { id: '5', name: '易碎品' },
    // { id: '6', name: '贵重物品' },
    { id: 2, name: t('publish.typeList.2') },
    { id: 3, name: t('publish.typeList.3') },
    { id: 4, name: t('publish.typeList.4') },
    { id: 5, name: t('publish.typeList.5') },
    { id: 6, name: t('publish.typeList.6')},
    { id: 7, name: t('publish.typeList.7') },
    { id: 8, name: t('publish.typeList.8') },
  ],
  emptyStateMessage,
  emptyStateIcon,
}) => {
  const router = useRouter();
  const [filteredCargos, setFilteredCargos] = useState<Cargo[]>(cargos);
  const [filters, setFilters] = useState<FilterParams>({
    category: 1,
    categoryName: `${t("hallInfo.allType")}`,
    sort: 'default',
    // priceRange: '全部价格',
    // origin: '',
    selectedCountry: '',
    destination: '',
    status: 0,
    isUrgent: false,
    hasInsurance: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  // 处理筛选
  const handleFilter = (newFilters: FilterParams) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // 应用筛选逻辑
  const applyFilters = (filters: FilterParams) => {
    let result = [...cargos];
    
    // 应用分类筛选
    if ( filters.category && filters.category !== 1 )
    {
      console.log("filters", filters)
      result = result.filter( cargo => cargo.typeid === filters.category );
      console.log("result", result)
    }
    
    // 应用始发地筛选
    if (filters.selectedCountry) {
      result = result.filter(cargo => cargo.origin.includes(filters.selectedCountry));
    }
    
    // 应用目的地筛选
    if (filters.destination) {
      result = result.filter(cargo => cargo.destination.includes(filters.destination));
    }
    
    // 应用状态筛选
    if ( filters.status )
    {
      result = result.filter( cargo => cargo.status === filters.status );
    }
    
    // 应用紧急货物筛选
    if (filters.isUrgent) {
      result = result.filter(cargo => cargo.isUrgent);
    }
    
    // 应用保险筛选
    if (filters.hasInsurance) {
      result = result.filter(cargo => cargo.hasInsurance);
    }
    
    
    // 应用排序
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'time-new':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'time-old':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default:
        // 默认排序（按ID倒序）
        result.sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString()));
        break;
    }
    
    setFilteredCargos(result);
  };

  // 刷新数据
  const handleRefresh = () => {
    setRefreshing(true);
    if (onRefresh) {
      onRefresh();
    } else {
      // 默认行为：重新应用当前筛选条件
      applyFilters(filters);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 重置筛选
  const resetFilters = () => {
    const defaultFilters: FilterParams = {
      category: 1,
      categoryName: `${t("hallInfo.allType")}`,
      sort: 'default',
      // priceRange: '全部价格',
      // origin: '',
      selectedCountry: '',
      destination: '',
      status: 0,
      isUrgent: false,
      hasInsurance: false,
    };
    setFilters(defaultFilters);
    setFilteredCargos(cargos);
  };

  // 处理列表项点击
  const handleItemPressWrapper = (cargo: Cargo) => {
    if (onItemPress) {
      onItemPress(cargo);
    } else {
      // 默认行为：跳转到详情页
      router.push(`/hall/${cargo.id}`);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      {/* <Text style={styles.title}>{title}</Text> */}
      
      {/* 筛选组件 */}
      <TaobaoStyleFilter 
        onFilter={handleFilter} 
        initialFilters={filters}
        categories={categories}
      />
      
      {/* 列表展示 */}
      {filteredCargos.length > 0 ? (
        <FlatList
          data={filteredCargos}
          renderItem={({ item }) => (
            <CargoItem
              cargo={item}
              onPress={() => handleItemPressWrapper(item)}
              renderItemContent={renderItemContent}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <EmptyState 
          onReset={resetFilters} 
          message={emptyStateMessage}
          icon={emptyStateIcon}
        />
      )}
    </ScrollView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 10,
    height: 44,
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  filterButtonActive: {
    color: '#1677ff',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
    marginRight: 4,
  },
  filterButtonTextActive: {
    color: '#1677ff',
    fontSize: 14,
    marginRight: 4,
  },
  
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    minHeight: '30%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#1677ff',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#999',
    fontSize: 14,
  },
  modalScrollView: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#1677ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // 分类筛选样式
  categoryList: {
    paddingVertical: 10,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    width: '30%',
  },
  filterItemSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1677ff',
    borderWidth: 1,
  },
  filterItemText: {
    color: '#333',
    fontSize: 14,
  },
  filterItemTextSelected: {
    color: '#1677ff',
    fontSize: 14,
  },
  
  // 排序筛选样式
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  sortItemText: {
    color: '#333',
    fontSize: 16,
  },
  sortItemTextSelected: {
    color: '#1677ff',
    fontSize: 16,
  },
  
  // 价格筛选样式
  priceRangeLabel: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  priceSlider: {
    marginVertical: 20,
  },
  priceRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceRangeButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  priceRangeButtonText: {
    color: '#333',
    fontSize: 14,
  },
  
  // 更多筛选样式
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filterInputContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterInput: {
    fontSize: 16,
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  filterOptionSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1677ff',
    borderWidth: 1,
  },
  filterOptionText: {
    color: '#333',
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: '#1677ff',
    fontSize: 14,
  },
  filterSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterSwitchLabel: {
    fontSize: 16,
    color: '#333',
  },
  
  // 货物列表样式
  list: {
    marginTop: 16,
  },
  cargoItem: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1677ff',
  },
  itemInfo: {
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeOrigin: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  routeArrow: {
    marginHorizontal: 8,
  },
  routeDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRemark: {
    flex: 1,
    marginRight: 8,
    color: '#666',
  },
  itemTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagUrgent: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  tagInsurance: {
    backgroundColor: '#722ed1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  tagStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagStatusPending: {
    backgroundColor: '#1677ff',
  },
  tagStatusInProgress: {
    backgroundColor: '#faad14',
  },
  tagStatusCompleted: {
    backgroundColor: '#52c41a',
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },
  
  // 空状态样式
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginVertical: 16,
    textAlign: 'center',
  },
});