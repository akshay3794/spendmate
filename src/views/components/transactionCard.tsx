import { View, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Themes } from '../../utils/colors';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../../utils/fonts';
import CommonText from './commonText';
import { TransactionItem } from '../../store/slices/transactionSlice';
import { formatToReadableDate } from '../../utils/helperFunctions';

type Props = {
  data: TransactionItem;
};

const TransactionCard = ({ data }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isIncome = data.transaction_type === 'income';

  return (
    <View style={styles.card}>
      <View>
        <CommonText style={styles.cardTitle}>
          {data.subCategoryData.label}{' '}
          <CommonText style={isIncome ? styles.incomeBadge : styles.expenseBadge}>
            {isIncome ? 'Income' : 'Expense'}
          </CommonText>
        </CommonText>
        <CommonText style={styles.cardDate}>
          {formatToReadableDate(data.transaction_date)}
        </CommonText>
      </View>
      <CommonText
        style={[
          styles.cardAmount,
          isIncome ? styles.incomeAmount : styles.expenseAmount,
        ]}
      >
        {`\u20B9`} {data.amount}
      </CommonText>
    </View>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
      height: moderateScale(50),
      padding: moderateScale(10),
      marginHorizontal: moderateScale(5),
      marginBottom: moderateScale(10),
      marginTop: moderateScale(5),
      elevation: 4,
      backgroundColor: theme.white,
      borderRadius: moderateScale(5),
    },
    cardTitle: {
      color: theme.grey,
      fontFamily: 'PoppinsSemiBold',
      fontSize: Fonts.text,
    },
    cardDate: {
      color: theme.grey,
      fontSize: Fonts.extraSmallText,
    },
    cardAmount: {
      fontSize: Fonts.text,
    },
    incomeAmount: {
      color: '#00A86B',
    },
    expenseAmount: {
      color: '#FD3C4A',
    },
    incomeBadge: {
      color: '#00A86B',
      fontSize: Fonts.miniText,
    },
    expenseBadge: {
      color: '#FD3C4A',
      fontSize: Fonts.miniText,
    },
  });

export default TransactionCard;
