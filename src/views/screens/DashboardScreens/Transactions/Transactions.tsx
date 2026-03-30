import {
  View,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { getStyles } from './Transactions.styles';
import Header from '../../../components/header';
import { ChevronRight, Plus } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../../hooks/useTheme';
import AddTransaction from '../../../components/addTransaction';
import TransactionCard from '../../../components/transactionCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import CommonText from '../../../components/commonText';
import { groupTransactionsByDate } from '../../../../utils/helperFunctions';
import { getTransactionApi } from '../../../../api/transaction/transactionAPI';
import { setTransactions } from '../../../../store/slices/transactionSlice';
import { useFocusEffect } from '@react-navigation/native';
import Filter, { TransactionFilters } from '../../../components/filter';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';

type NavigationProp = BottomTabNavigationProp<AllNavParamList, 'Transactions'>;
type Props = {
  navigation: NavigationProp;
};

const Transactions = ({ navigation }: Props) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const transaction = useSelector(
    (state: RootState) => state.transaction.transactions,
  );
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<TransactionFilters>(
    {},
  );

  useFocusEffect(
    useCallback(() => {
      resetAndFetch();
    }, []),
  );

  useEffect(() => {
    const data = groupTransactionsByDate(transaction);
    setTransactionsData(data);
  }, [transaction]);

  const resetAndFetch = async () => {
    setPage(1);
    setHasMore(true);
    await getTransactions(1, true);
  };

  const getTransactions = async (pageNumber: number, isReset = false) => {
    if (!hasMore && !isReset) return;

    setLoading(true);
    try {
      const response = await getTransactionApi({
        ...(selectedFilters.type ? { type: selectedFilters.type } : {}),
        ...(selectedFilters.duration
          ? { duration: selectedFilters.duration }
          : {}),
        page: pageNumber,
      });

      if (response.success) {
        const fetchedData = response.data;
        const newData = selectedFilters.categoryId
          ? fetchedData.filter(
              (item: any) =>
                item.subCategoryData?.id === selectedFilters.categoryId,
            )
          : fetchedData;

        if (fetchedData.length < 10) {
          setHasMore(false);
        }

        if (isReset) {
          dispatch(setTransactions(newData));
        } else {
          dispatch(setTransactions([...transaction, ...newData]));
        }

        setPage(pageNumber + 1);
      }
    } catch (error) {
      console.log('Pagination Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      getTransactions(page);
    }
  };

  const handleApplyFilters = async (filters: TransactionFilters) => {
    setSelectedFilters(filters);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    try {
      const response = await getTransactionApi({
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.duration ? { duration: filters.duration } : {}),
        page: 1,
      });

      if (response.success) {
        const fetchedData = response.data;
        const filteredData = filters.categoryId
          ? fetchedData.filter(
              (item: any) => item.subCategoryData?.id === filters.categoryId,
            )
          : fetchedData;

        dispatch(setTransactions(filteredData));
        setHasMore(fetchedData.length === 10);
        setPage(2);
      }
    } catch (error) {
      console.log('Filter Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        label={'Transactions'}
        showBackButton={false}
        showFilterIcon={true}
        onFilterIconPress={() => setShowFilterModal(true)}
      />
      <View style={styles.subContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Reports')}
          style={styles.reportContainer}
          activeOpacity={0.8}
        >
          <CommonText style={styles.reportText}>
            See your financial report
          </CommonText>
          <ChevronRight color={theme.primary} />
        </TouchableOpacity>
        <SectionList
          contentContainerStyle={styles.listContentContainer}
          sections={transactionsData}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <TransactionCard data={item} />}
          renderSectionHeader={({ section: { label } }) => (
            <CommonText style={styles.header}>{label}</CommonText>
          )}
          SectionSeparatorComponent={() => (
            <View style={{ height: moderateScale(10) }} />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : null
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <CommonText>No transaction yet.</CommonText>
            </View>
          )}
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
        <AddTransaction
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      {showFilterModal && (
        <Filter
          showModal={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          initialValues={selectedFilters}
        />
      )}
    </View>
  );
};

export default Transactions;
