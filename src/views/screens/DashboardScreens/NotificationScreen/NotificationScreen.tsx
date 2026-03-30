import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../../../../hooks/useTheme';
import { getStyles } from './NotificationScreen.styles';
import Header from '../../../components/header';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import CommonText from '../../../components/commonText';
import { getNotificationList } from '../../../../api/notification/NotificationAPI';
import Loader from '../../../components/loader';
import moment from 'moment';

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'NotificationScreen'>;
};

type NotificationItem = {
  _id?: string;
  id?: string | number;
  title?: string;
  body?: string;
  message?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

const NotificationScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = getStyles();
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getData(1, true);
  }, []);

  const getData = async (pageNumber: number, isReset = false) => {
    if (!hasMore && !isReset) return;

    isReset ? setLoading(true) : setPaginationLoading(true);
    try {
      const response = await getNotificationList({ page: pageNumber });
      if (response.success) {
        const list = response?.data || [];

        setNotifications(prevData => (isReset ? list : [...prevData, ...list]));
        setHasMore(list.length === 10);
        setPage(pageNumber + 1);
      }
    } catch (error) {
      console.log('Notification list error:', error);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!paginationLoading && hasMore) {
      getData(page);
    }
  }, [paginationLoading, hasMore, page]);

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    const title = item.title || 'Notification';
    const message = item.message || item.body || item.description || '';
    const timestamp = item.createdAt || item.updatedAt;

    return (
      <View style={styles.card}>
        <CommonText style={styles.title}>{title}</CommonText>
        {!!message && <CommonText style={styles.message}>{message}</CommonText>}
        {!!timestamp && (
          <CommonText style={styles.timestamp}>
            {moment(timestamp).format('DD MMM YYYY, hh:mm A')}
          </CommonText>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        showBackButton={true}
        label={'Notifications'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          style={styles.flx}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) =>
            String(item._id || item.id || `notification-${index}`)
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            paginationLoading ? (
              <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <CommonText>No notification yet</CommonText>
            </View>
          )}
        />
      </View>
      {loading && <Loader show={loading} />}
    </View>
  );
};

export default NotificationScreen;
