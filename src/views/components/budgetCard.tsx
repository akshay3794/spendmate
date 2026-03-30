import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useMemo } from 'react';
import { Themes } from '../../utils/colors';
import { Metrics } from '../../utils/metrics';
import { Fonts } from '../../utils/fonts';
import { useTheme } from '../../hooks/useTheme';
import * as Progress from 'react-native-progress';
import CommonText from './commonText';
import { CircleAlert } from 'lucide-react-native';
import { BudgetItem } from '../../store/slices/budgetSlice';

type Props = {
  item: BudgetItem;
};

const BudgetCard = ({ item }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width } = Dimensions.get('window');

  const remaining = Number(item.amount) - Number(item.spent);
  const progress = Number(item.spent) / Number(item.amount);
  const isLimitExceed = progress * 100 >= item.alertLimit;
  const isExpenseExceed = item.spent > item.amount;

  console.log('progress - ', progress);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.titleBox}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isLimitExceed ? theme.warning : theme.primary,
              },
            ]}
          />
          <CommonText style={styles.title}>
            {item.subCategoryData.label}
          </CommonText>
        </View>
        {remaining < 0 && (
          <CircleAlert
            fill={theme.error}
            color={theme.white}
            size={Metrics._24}
          />
        )}
      </View>
      <CommonText style={styles.balanceTitle}>
        Remaining ${remaining}
      </CommonText>
      <Progress.Bar
        progress={progress > 100 ? 1 : progress}
        width={width - 80}
        height={Metrics._10}
        borderRadius={Metrics._10}
        color={isLimitExceed ? theme.warning : theme.primary}
      />
      <CommonText style={styles.balance}>
        ${item.spent} of ${item.amount}
      </CommonText>
      {remaining < 0 && (
        <CommonText style={styles.error}>You've exceed the limit!</CommonText>
      )}
    </View>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      gap: Metrics._4,
      marginBottom: Metrics._10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    balanceTitle: {
      color: theme.black,
      fontSize: Fonts.titleMedium,
      fontFamily: 'Poppins-Regular',
    },
    titleBox: {
      flexDirection: 'row',
      padding: Metrics._8,
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: Metrics._8,
      borderWidth: Metrics._1,
      borderColor: theme.grey3,
      borderRadius: Metrics._50,
    },
    dot: {
      width: Metrics._14,
      height: Metrics._14,
      borderRadius: Metrics._14,
    },
    title: {
      fontSize: Fonts.smallText,
      color: theme.black,
    },
    balance: {
      fontSize: Fonts.smallText,
      color: theme.grey2,
    },
    error: {
      fontSize: Fonts.smallText,
      color: theme.error,
    },
  });

export default BudgetCard;
