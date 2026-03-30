import { View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useCallback } from 'react';
import { getStyles } from './Budgets.styles';
import { useTheme } from '../../../../hooks/useTheme';
import Header from '../../../components/header';
import { Plus } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import AddBudget from '../../../components/addBudget';
import CommonText from '../../../components/commonText';
import BudgetCard from '../../../components/budgetCard';
import MonthSelection from '../../../components/monthSelection';
import { getBudgetList } from '../../../../api/budget/budgetAPI';
import Loader from '../../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  appendBudgetList,
  setBudgetList,
} from '../../../../store/slices/budgetSlice';
import { RootState } from '../../../../store/store';
import { useFocusEffect } from '@react-navigation/native';

const Budgets = () => {
  const styles = getStyles();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const budgetList = useSelector((state: RootState) => state.budget.budgetList);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getData(1, selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]),
  );

  const getData = async (pageNumber: number, month?: number, year?: number) => {
    if (!hasMore && pageNumber !== 1) return;

    pageNumber === 1 ? setLoading(true) : setPaginationLoading(true);

    try {
      const request = {
        page: pageNumber,
        ...(year && year > 0 && { year: year }),
        ...(month && month > 0 && { month: month }),
      };

      const response = await getBudgetList(request);

      const list = response?.data || [];
      if (pageNumber === 1) {
        dispatch(setBudgetList(list));
      } else {
        dispatch(appendBudgetList(list));
      }
      setHasMore(list.length === 10);
      setPage(pageNumber);
    } catch (error) {
      console.log('Budget list error:', error);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!paginationLoading && hasMore) {
      getData(page + 1, selectedMonth, selectedYear);
    }
  }, [paginationLoading, hasMore, page, selectedMonth, selectedYear]);

  const handleMonthChange = (value: Date) => {
    const month = value.getMonth() + 1;
    const year = value.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year);
    getData(1, month, year);
  };

  return (
    <View style={styles.container}>
      <Header label={'Budget'} showBackButton={false} />

      <View style={styles.box}>
        <MonthSelection onChange={value => handleMonthChange(value)} />
        <FlatList
          style={styles.flx}
          contentContainerStyle={styles.subContainer}
          showsVerticalScrollIndicator={false}
          data={budgetList}
          renderItem={({ item }) => <BudgetCard item={item} />}
          keyExtractor={item => item._id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={paginationLoading ? <Loader show /> : null}
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <CommonText>No budget created yet.</CommonText>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.line} />}
        />

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.fabContainer}
          activeOpacity={0.8}
        >
          <Plus
            size={moderateScale(25)}
            color={theme.white}
            strokeWidth={moderateScale(3)}
          />
        </TouchableOpacity>
      </View>

      {showModal && (
        <AddBudget showModal={showModal} onClose={() => setShowModal(false)} />
      )}

      {loading && <Loader show={loading} />}
    </View>
  );
};

export default Budgets;
