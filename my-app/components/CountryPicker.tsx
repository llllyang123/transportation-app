import { Country, sampleCountries } from '@/constants/countries';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import
  {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
  } from 'react-native';

interface CountryPickerProps
{
  lab?: string,
  onCountrySelect: (country: Country) => void;
  initialCountry?: Country;
  placeholder?: string;
  showSearch?: boolean;
}

const CountryPicker: React.FC<CountryPickerProps> = ( {
  lab,
  onCountrySelect,
  initialCountry,
  placeholder = "Select country",
  showSearch = true
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(sampleCountries);

  // 搜索过滤
  useEffect(() => {
    if (!searchText) {
      setFilteredCountries(sampleCountries);
      return;
    }
    
    const filtered = sampleCountries.filter(country => 
      country.country_name.toLowerCase().includes(searchText.toLowerCase()) ||
      country.iso_code.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setFilteredCountries(filtered);
  }, [searchText]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    onCountrySelect(country);
    setIsOpen(false);
  };

  return (
    <View style={ styles.container }>
      <Text style={styles.label}>{t(lab)}</Text>
      {/* 选择框 */}
      <TouchableOpacity 
        style={[styles.selectBox, isOpen && styles.selectBoxOpen]}
        onPress={toggleDropdown}
      >
        <Text style={styles.selectedText}>
          {selectedCountry?.country_name || placeholder}
        </Text>
        <Text style={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* 下拉列表 */}
      {isOpen && (
        <View style={styles.dropdownContainer}>
          {/* 搜索框 */}
          {showSearch && (
            <TextInput
              style={styles.searchInput}
              placeholder={t('common.search')}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
          )}

          {/* 国家列表 */}
          <ScrollView style={styles.countryList}>
            {filteredCountries.map(country => (
              <TouchableOpacity
                key={country.iso_code}
                style={styles.countryItem}
                onPress={() => handleSelectCountry(country)}
              >
                <Text style={styles.countryName}>{country.country_name}</Text>
                <Text style={styles.countryCode}>{country.iso_code}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create( {
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  container: {
    marginBottom: 16,
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  selectBoxOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 14,
  },
  countryList: {
    maxHeight: 200,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryName: {
    fontSize: 15,
  },
  countryCode: {
    fontSize: 12,
    color: '#666',
  },
});

export default CountryPicker;