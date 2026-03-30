import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getStyles } from './Reports.styles';
import Header from '../../../components/header';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import CommonText from '../../../components/commonText';
import { getTransactionApi } from '../../../../api/transaction/transactionAPI';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../../hooks/useTheme';
import { TransactionItem } from '../../../../store/slices/transactionSlice';
import { useFocusEffect } from '@react-navigation/native';
import CustomDropDownPicker from '../../../components/customDropDownPicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import CustomTextInput from '../../../components/customInput';
import CommonButton from '../../../components/commonButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';

type DateFilterValue = 'this_month' | 'last_month' | 'this_year' | 'all';
type PaymentTypeValue = '' | 'cash' | 'credit_card' | 'debit_card' | 'upi';

const DATE_FILTER_ITEMS = [
  { label: 'This Month', value: 'this_month' as DateFilterValue },
  { label: 'Last Month', value: 'last_month' as DateFilterValue },
  { label: 'This Year', value: 'this_year' as DateFilterValue },
  { label: 'All', value: 'all' as DateFilterValue },
];

const PAYMENT_TYPE_ITEMS = [
  { label: 'All', value: '' as PaymentTypeValue },
  { label: 'Cash', value: 'cash' as PaymentTypeValue },
  { label: 'Credit Card', value: 'credit_card' as PaymentTypeValue },
  { label: 'Debit Card', value: 'debit_card' as PaymentTypeValue },
  { label: 'UPI', value: 'upi' as PaymentTypeValue },
];

const CHART_COLORS = [
  '#1F7A8C',
  '#BFDBF7',
  '#FFB703',
  '#FB8500',
  '#8ECAE6',
  '#6A994E',
  '#D62828',
  '#6D597A',
];

const formatCurrency = (amount: number) => `Rs ${amount.toFixed(2)}`;

const formatPaymentTypeLabel = (paymentType?: string) => {
  if (!paymentType) return 'Unknown';

  return paymentType
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'Reports'>;
};

const Reports = ({ navigation }: Props) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const categoryData = useSelector(
    (state: RootState) => state.subcategories.subCategories,
  );
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>(
    'expense',
  );
  const [loading, setLoading] = useState(false);
  const [rawTransactions, setRawTransactions] = useState<TransactionItem[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [value, setValue] = useState<string>('');
  const [paymentTypeOpen, setPaymentTypeOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentTypeValue>('');
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('this_month');
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [budgetInput, setBudgetInput] = useState('');

  const loadBudgets = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('CATEGORY_BUDGETS');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setBudgets(parsed);
        }
      }
    } catch (error) {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (isActive) {
          setLoading(true);
          try {
            const response = await getTransactionApi({});
            if (response.success) {
              setRawTransactions(response.data);
            }
          } finally {
            setLoading(false);
          }
        }
      };

      fetchData();
      loadBudgets();

      return () => {
        isActive = false;
      };
    }, [loadBudgets]),
  );

  useEffect(() => {
    if (!value) {
      return;
    }

    const isValidCategory = categoryData.some(
      item =>
        item.transactionType === selectedType &&
        String(item.id) === String(value),
    );

    if (!isValidCategory) {
      setValue('');
    }
  }, [categoryData, selectedType, value]);

  const filteredTransactions = useMemo(() => {
    let data: TransactionItem[] = [...rawTransactions];

    data = data.filter(item => item.transaction_type === selectedType);

    if (value) {
      data = data.filter(
        item => String(item.subCategoryData?.id) === String(value),
      );
    }

    if (paymentType) {
      data = data.filter(item => item.payment_type === paymentType);
    }

    if (dateFilter === 'all') {
      return data;
    }

    return data.filter(item => {
      const txDate = moment(item.transaction_date);
      if (!txDate.isValid()) return false;

      const now = moment();

      if (dateFilter === 'this_month') {
        return txDate.isSame(now, 'month');
      }

      if (dateFilter === 'last_month') {
        const lastMonth = now.clone().subtract(1, 'month');
        return (
          txDate.month() === lastMonth.month() &&
          txDate.year() === lastMonth.year()
        );
      }

      if (dateFilter === 'this_year') {
        return txDate.isSame(now, 'year');
      }

      return true;
    });
  }, [dateFilter, paymentType, rawTransactions, selectedType, value]);

  useEffect(() => {
    const groupedByDay = filteredTransactions.reduce(
      (acc, item) => {
        const txDate = moment(item.transaction_date);
        if (!txDate.isValid()) {
          return acc;
        }

        const key = txDate.format('YYYY-MM-DD');
        if (!acc[key]) {
          acc[key] = {
            value: 0,
            label: txDate.format('D/M'),
            date: key,
          };
        }

        acc[key].value += item.amount;

        return acc;
      },
      {} as Record<string, { value: number; label: string; date: string }>,
    );

    const grouped = Object.values(groupedByDay).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    setTransactions(grouped);
  }, [filteredTransactions]);

  useEffect(() => {
    if (value) {
      const currentBudget = budgets[value];
      setBudgetInput(currentBudget !== undefined ? String(currentBudget) : '');
    } else {
      setBudgetInput('');
    }
  }, [value, budgets]);

  const selectedCategory = useMemo(
    () => categoryData.find(item => String(item.id) === String(value)),
    [categoryData, value],
  );

  const totalAmount = useMemo(
    () => filteredTransactions.reduce((sum, item) => sum + item.amount, 0),
    [filteredTransactions],
  );

  const categoryChartData = useMemo(() => {
    const grouped = filteredTransactions.reduce(
      (acc, item) => {
        const label = item.subCategoryData?.label ?? 'Uncategorized';
        acc[label] = (acc[label] ?? 0) + item.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .map(([label, amount], index) => ({
        value: amount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: `${Math.round((amount / totalAmount) * 100)}%`,
        label,
      }));
  }, [filteredTransactions, totalAmount]);

  const paymentTypeChartData = useMemo(() => {
    const grouped = filteredTransactions.reduce(
      (acc, item) => {
        const label = formatPaymentTypeLabel(item.payment_type);
        acc[label] = (acc[label] ?? 0) + item.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .map(([label, amount], index) => ({
        value: amount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: `${Math.round((amount / totalAmount) * 100)}%`,
        label,
      }));
  }, [filteredTransactions, totalAmount]);

  const selectedCategoryBudget = value ? budgets[value] : undefined;

  const renderPieLegend = (
    data: { label: string; value: number; color: string }[],
  ) => (
    <View style={styles.chartLegendList}>
      {data.map(item => (
        <View style={styles.legendRow} key={`${item.label}-${item.color}`}>
          <View style={styles.legendInfo}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <CommonText style={styles.legendLabel}>{item.label}</CommonText>
          </View>
          <CommonText style={styles.legendValue}>
            {formatCurrency(item.value)}
          </CommonText>
        </View>
      ))}
    </View>
  );

  const currentCategoryMonthlySpent = useMemo(() => {
    if (!value) return 0;
    const now = moment();

    return rawTransactions
      .filter(item => {
        const txDate = moment(item.transaction_date);
        if (!txDate.isValid()) return false;

        return (
          item.transaction_type === 'expense' &&
          String(item.subCategoryData?.id) === String(value) &&
          txDate.isSame(now, 'month')
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);
  }, [rawTransactions, value]);

  const handleSaveBudget = async () => {
    if (!value) {
      return;
    }

    const numericValue = Number(budgetInput);
    if (isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    const updatedBudgets = {
      ...budgets,
      [value]: numericValue,
    };

    setBudgets(updatedBudgets);

    try {
      await AsyncStorage.setItem(
        'CATEGORY_BUDGETS',
        JSON.stringify(updatedBudgets),
      );
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Header
        label={'Reports'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.flx}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.subContainer}
        >
          <View style={styles.switchContainer}>
            <TouchableOpacity
              onPress={() => setSelectedType('expense')}
              style={[
                styles.switch,
                selectedType === 'expense'
                  ? styles.activeSwitch
                  : styles.inactiveSwitch,
              ]}
            >
              <CommonText
                style={selectedType === 'expense' && styles.selectedText}
              >
                Expense
              </CommonText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedType('income')}
              style={[
                styles.switch,
                selectedType === 'income'
                  ? styles.activeSwitch
                  : styles.inactiveSwitch,
              ]}
            >
              <CommonText
                style={selectedType === 'income' && styles.selectedText}
              >
                Income
              </CommonText>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.filterField}>
              <CustomDropDownPicker
                value={dateFilter}
                dropdownOpen={dateFilterOpen}
                label="Date Range"
                items={DATE_FILTER_ITEMS}
                searchable={false}
                setDropdownOpen={() => {
                  setDateFilterOpen(!dateFilterOpen);
                  setOpenCategory(false);
                  setPaymentTypeOpen(false);
                }}
                setValue={setDateFilter}
              />
            </View>
          </View>

          <View style={[styles.row, styles.filterRow]}>
            <View style={styles.filterField}>
              <CustomDropDownPicker
                value={value}
                dropdownOpen={openCategory}
                label="Category"
                placeholder="All categories"
                items={[
                  { label: 'All', value: '' },
                  ...categoryData
                    .filter(item => item.transactionType === selectedType)
                    .map(item => ({
                      label: item.label,
                      value: String(item.id),
                    })),
                ]}
                searchable
                setDropdownOpen={() => {
                  setOpenCategory(!openCategory);
                  setDateFilterOpen(false);
                  setPaymentTypeOpen(false);
                }}
                setValue={setValue}
              />
            </View>
            <View style={styles.filterField}>
              <CustomDropDownPicker
                value={paymentType}
                dropdownOpen={paymentTypeOpen}
                label="Payment Type"
                placeholder="All payment types"
                items={PAYMENT_TYPE_ITEMS}
                searchable={false}
                setDropdownOpen={() => {
                  setPaymentTypeOpen(!paymentTypeOpen);
                  setOpenCategory(false);
                  setDateFilterOpen(false);
                }}
                setValue={setPaymentType}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <CommonText style={styles.statLabel}>Transactions</CommonText>
              <CommonText style={styles.statValue}>
                {filteredTransactions.length}
              </CommonText>
            </View>
            <View style={styles.statCard}>
              <CommonText style={styles.statLabel}>Total Amount</CommonText>
              <CommonText style={styles.statValue}>
                {formatCurrency(totalAmount)}
              </CommonText>
            </View>
          </View>

          <View style={styles.card}>
            <CommonText style={styles.sectionTitle}>Trend Overview</CommonText>
            <CommonText style={styles.sectionSubtitle}>
              Daily {selectedType} totals for the selected filters
            </CommonText>
            {transactions.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chartScrollContent}
              >
                <LineChart
                  data={transactions}
                  areaChart
                  height={moderateScale(220)}
                  width={Math.max(
                    moderateScale(280),
                    transactions.length * moderateScale(62),
                  )}
                  initialSpacing={moderateScale(18)}
                  endSpacing={moderateScale(18)}
                  color1={theme.primary}
                  dataPointsColor={theme.primary}
                  startFillColor1={theme.primary}
                  startOpacity={0.3}
                  endOpacity={0.05}
                  rulesType="solid"
                  rulesColor={theme.border}
                  showVerticalLines={false}
                  yAxisColor="transparent"
                  xAxisColor={theme.border}
                  yAxisTextStyle={{ color: theme.grey }}
                  xAxisLabelTextStyle={{ color: theme.black }}
                  yAxisOffset={0}
                  maxValue={Math.max(
                    ...transactions.map(item => item.value),
                    1,
                  )}
                />
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <CommonText style={styles.emptyText}>
                  No transactions found for this chart.
                </CommonText>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <CommonText style={styles.sectionTitle}>Category Split</CommonText>
            <CommonText style={styles.sectionSubtitle}>
              Compare {selectedType} totals by category
            </CommonText>
            {categoryChartData.length ? (
              <>
                <PieChart
                  data={categoryChartData}
                  donut
                  radius={moderateScale(95)}
                  innerRadius={moderateScale(55)}
                  showText
                  textColor={theme.black}
                  textSize={moderateScale(10)}
                  focusOnPress
                  centerLabelComponent={() => (
                    <View>
                      <CommonText style={styles.statLabel}>Total</CommonText>
                      <CommonText style={styles.legendValue}>
                        {formatCurrency(totalAmount)}
                      </CommonText>
                    </View>
                  )}
                />
                {renderPieLegend(categoryChartData)}
              </>
            ) : (
              <View style={styles.emptyState}>
                <CommonText style={styles.emptyText}>
                  Add more transactions to see the category split.
                </CommonText>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <CommonText style={styles.sectionTitle}>Payment Split</CommonText>
            <CommonText style={styles.sectionSubtitle}>
              Breakdown by payment method for the same selection
            </CommonText>
            {paymentTypeChartData.length ? (
              <>
                <PieChart
                  data={paymentTypeChartData}
                  donut
                  radius={moderateScale(95)}
                  innerRadius={moderateScale(55)}
                  showText
                  textColor={theme.black}
                  textSize={moderateScale(10)}
                  focusOnPress
                />
                {renderPieLegend(paymentTypeChartData)}
              </>
            ) : (
              <View style={styles.emptyState}>
                <CommonText style={styles.emptyText}>
                  Payment-type data is not available for these transactions.
                </CommonText>
              </View>
            )}
          </View>

          {selectedType === 'expense' && value ? (
            <View style={styles.card}>
              <CommonText style={styles.sectionTitle}>
                Category Budget
              </CommonText>
              <View style={styles.budgetInfo}>
                <CommonText style={styles.budgetHeading}>
                  {selectedCategory?.label ?? 'Selected category'}
                </CommonText>
                <CommonText style={styles.budgetMeta}>
                  This month spent:{' '}
                  {formatCurrency(currentCategoryMonthlySpent)}
                </CommonText>
                <CommonText style={styles.budgetMeta}>
                  Budget: {formatCurrency(selectedCategoryBudget ?? 0)}
                </CommonText>
              </View>
              <CustomTextInput
                label="Set Monthly Budget"
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Enter amount"
                keyboardType="number-pad"
              />
              <CommonButton
                label="Save Budget"
                onPress={handleSaveBudget}
                disabled={!budgetInput.trim()}
              />
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

export default Reports;
