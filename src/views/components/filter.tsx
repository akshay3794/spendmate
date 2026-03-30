import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';
import { X } from 'lucide-react-native';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import Container from './container';
import CommonText from './commonText';
import CommonButton from './commonButton';
import { Fonts } from '../../utils/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CustomDropDownPicker from './customDropDownPicker';

export type TransactionFilterDuration =
  | 'this_week'
  | 'this_month'
  | 'this_year';

export type TransactionFilters = {
  type?: 'income' | 'expense';
  duration?: TransactionFilterDuration;
  categoryId?: number;
};

type FilterOption<T> = {
  label: string;
  value: T;
};

type Props = {
  showModal: boolean;
  onClose: () => void;
  onApply: (filters: TransactionFilters) => void;
  initialValues?: TransactionFilters;
};

const TYPE_OPTIONS: FilterOption<'income' | 'expense'>[] = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

const DURATION_OPTIONS: FilterOption<TransactionFilterDuration>[] = [
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'This Year', value: 'this_year' },
];

const Filter = ({ showModal, onClose, onApply, initialValues }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const categoryData = useSelector(
    (state: RootState) => state.subcategories.subCategories,
  );

  const [selectedType, setSelectedType] = useState<TransactionFilters['type']>(
    initialValues?.type,
  );
  const [selectedDuration, setSelectedDuration] = useState<
    TransactionFilters['duration']
  >(initialValues?.duration);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialValues?.categoryId ? String(initialValues.categoryId) : '',
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const filteredCategoryData = useMemo(() => {
    if (!selectedType) {
      return categoryData;
    }

    return categoryData.filter(item => item.transactionType === selectedType);
  }, [categoryData, selectedType]);
  const categoryItems = useMemo(
    () =>
      filteredCategoryData.map(item => ({
        label: item.label,
        value: String(item.id),
      })),
    [filteredCategoryData],
  );

  useEffect(() => {
    if (showModal) {
      setSelectedType(initialValues?.type);
      setSelectedDuration(initialValues?.duration);
      setSelectedCategoryId(
        initialValues?.categoryId ? String(initialValues.categoryId) : '',
      );
      setIsCategoryOpen(false);
    }
  }, [initialValues, showModal]);

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    const isValidCategory = filteredCategoryData.some(
      item => String(item.id) === selectedCategoryId,
    );

    if (!isValidCategory) {
      setSelectedCategoryId('');
    }
  }, [filteredCategoryData, selectedCategoryId]);

  const selectedCount = [
    selectedType,
    selectedDuration,
    selectedCategoryId,
  ].filter(Boolean).length;

  const handleReset = () => {
    setSelectedType(undefined);
    setSelectedDuration(undefined);
    setSelectedCategoryId('');
    setIsCategoryOpen(false);
    onApply({});
    onClose();
  };

  const handleApply = () => {
    onApply({
      ...(selectedType ? { type: selectedType } : {}),
      ...(selectedDuration ? { duration: selectedDuration } : {}),
      ...(selectedCategoryId ? { categoryId: Number(selectedCategoryId) } : {}),
    });
    onClose();
  };

  const renderOptions = <T,>({
    options,
    selectedValue,
    onSelect,
  }: {
    options: FilterOption<T>[];
    selectedValue: T | undefined;
    onSelect: (value: T | undefined) => void;
  }) => (
    <View style={styles.optionContainer}>
      {options.map(option => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              isSelected && styles.selectedOptionButton,
            ]}
            onPress={() => onSelect(isSelected ? undefined : option.value)}
          >
            <CommonText
              style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </CommonText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ReactNativeModal
      isVisible={showModal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modalBox}
    >
      <Container
        boxStyle={styles.containerBox}
        contentStyle={styles.modalContainer}
      >
        <View style={styles.titleRow}>
          <View style={styles.emptyIcon} />
          <View style={styles.titleContent}>
            <CommonText style={styles.title}>Filter Transactions</CommonText>
            <CommonText style={styles.subtitle}>
              {selectedCount > 0
                ? `${selectedCount} filter${
                    selectedCount > 1 ? 's' : ''
                  } selected`
                : 'Choose one or more filters'}
            </CommonText>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
            <X size={moderateScale(20)} color={theme.grey} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CommonText style={styles.sectionTitle}>Type</CommonText>
          {renderOptions({
            options: TYPE_OPTIONS,
            selectedValue: selectedType,
            onSelect: setSelectedType,
          })}
        </View>

        <View style={styles.section}>
          <CommonText style={styles.sectionTitle}>Date Range</CommonText>
          {renderOptions({
            options: DURATION_OPTIONS,
            selectedValue: selectedDuration,
            onSelect: setSelectedDuration,
          })}
        </View>

        <View style={styles.section}>
          <CustomDropDownPicker
            label="Category"
            value={selectedCategoryId}
            items={categoryItems}
            dropdownOpen={isCategoryOpen}
            searchable={true}
            placeholder={
              selectedType
                ? `Select ${selectedType} category`
                : 'Select category'
            }
            setDropdownOpen={() => setIsCategoryOpen(!isCategoryOpen)}
            setValue={setSelectedCategoryId}
          />
        </View>

        <View style={styles.footer}>
          <CommonButton
            label="Reset"
            onPress={handleReset}
            fullWidth={false}
            buttonStyle={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
          <CommonButton
            label="Apply"
            onPress={handleApply}
            fullWidth={false}
            buttonStyle={styles.primaryButton}
          />
        </View>
      </Container>
    </ReactNativeModal>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    modalBox: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    containerBox: {
      width: '100%',
      maxHeight: '100%',
    },
    modalContainer: {
      padding: moderateScale(16),
      borderTopLeftRadius: moderateScale(20),
      borderTopRightRadius: moderateScale(20),
      backgroundColor: theme.background,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(20),
    },
    emptyIcon: {
      width: moderateScale(24),
    },
    titleContent: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
    },
    title: {
      fontSize: Fonts.text,
      fontFamily: 'PoppinsSemiBold',
    },
    subtitle: {
      marginTop: moderateScale(2),
      color: theme.grey2,
      textAlign: 'center',
    },
    section: {
      marginBottom: moderateScale(20),
    },
    sectionTitle: {
      fontSize: Fonts.smallText,
      fontFamily: 'PoppinsSemiBold',
      marginBottom: moderateScale(10),
    },
    optionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    optionButton: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(14),
      borderRadius: moderateScale(20),
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      marginRight: moderateScale(10),
      marginBottom: moderateScale(10),
    },
    selectedOptionButton: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primary,
    },
    optionText: {
      color: theme.grey,
    },
    selectedOptionText: {
      color: theme.primary,
      fontFamily: 'PoppinsSemiBold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: moderateScale(8),
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.white,
      borderColor: theme.border,
      marginRight: moderateScale(6),
    },
    secondaryButtonText: {
      color: theme.black,
    },
    primaryButton: {
      flex: 1,
      marginLeft: moderateScale(6),
    },
  });

export default Filter;
