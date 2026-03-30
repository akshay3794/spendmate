import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStyles } from './Home.styles';
import Header from '../../../components/header';
import CommonText from '../../../components/commonText';
import { BarChart } from 'react-native-gifted-charts';
import TransactionCard from '../../../components/transactionCard';
import { getSubcategoriesList } from '../../../../api/categories/categoriesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setSubCategories } from '../../../../store/slices/subCategorySlice';
import {
  getIncomeExpenseApi,
  getTransactionApi,
} from '../../../../api/transaction/transactionAPI';
import Loader from '../../../components/loader';
import { setTransactions } from '../../../../store/slices/transactionSlice';
import { RootState } from '../../../../store/store';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native';
import { useTheme } from '../../../../hooks/useTheme';
import MonthSelection from '../../../components/monthSelection';

type Props = {
  navigation: BottomTabNavigationProp<AllNavParamList, 'Home'>;
};

const Home = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = getStyles();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions,
  );

  useEffect(() => {
    handleApis();
  }, []);

  const handleApis = async () => {
    await getData();
    await getTransactions();
    await getIncomeExpenseData();
  };

  const getData = async () => {
    setLoading(true);
    try {
      let response = await getSubcategoriesList();
      if (response.success) {
        const updatedData = response.data.map((item: any) => ({
          ...item,
          value: item.id,
        }));
        dispatch(setSubCategories(updatedData));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async () => {
    setLoading(true);
    try {
      let response = await getTransactionApi({});
      if (response.success) {
        dispatch(setTransactions(response.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getIncomeExpenseData = async (month?: number, year?: number) => {
    setLoading(true);
    try {
      const request = {
        month,
        year,
      };
      let { success, data } = await getIncomeExpenseApi(request);
      if (success) {
        setExpense(data.total_expense);
        setIncome(data.total_income);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (value: Date) => {
    const month = value.getMonth() + 1;
    const year = value.getFullYear();
    getIncomeExpenseData(month, year);
  };

  return (
    <View style={styles.container}>
      <Header
        label={'Home'}
        showBackButton={false}
        showNotificationIcon={true}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />
      <ScrollView
        style={styles.flx}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.subContainer}
      >
        <MonthSelection onChange={value => handleMonthChange(value)} />
        <View style={styles.card}>
          <CommonText style={styles.title1}>Balance</CommonText>
          <CommonText style={styles.amount1}>
            {`\u20B9`} {income - expense}{' '}
          </CommonText>
        </View>
        <View style={styles.row}>
          <View style={[styles.shortCard, { backgroundColor: '#00A86B' }]}>
            <BanknoteArrowDown color={theme.white} />
            <View>
              <CommonText style={styles.title2}>Income</CommonText>
              <CommonText style={styles.amount2}>
                {`\u20B9`} {income}{' '}
              </CommonText>
            </View>
          </View>
          <View style={[styles.shortCard, { backgroundColor: '#FD3C4A' }]}>
            <BanknoteArrowUp color={theme.white} />
            <View>
              <CommonText style={styles.title2}>Expense</CommonText>
              <CommonText style={styles.amount2}>
                {`\u20B9`} {expense}
              </CommonText>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <CommonText>Recent Transactions</CommonText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TransactionStack')}
          >
            <CommonText style={styles.view}>View all</CommonText>
          </TouchableOpacity>
        </View>
        <FlatList
          data={transactions}
          style={styles.flx}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => <TransactionCard data={item} />}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <CommonText>No transaction yet.</CommonText>
            </View>
          )}
        />
      </ScrollView>
      {loading && <Loader show={loading} />}
    </View>
  );
};

export default Home;
