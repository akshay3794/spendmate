import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import CommonText from './commonText';
import { CurrencyItem } from '../../store/slices/currencySlice';
import { Metrics } from '../../utils/metrics';
import { Check } from 'lucide-react-native';

type Props = {
  data: CurrencyItem;
  selected: boolean;
  onPress: () => void;
};

const CurrencyCard = ({ data, selected, onPress }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      activeOpacity={0.8}
      style={styles.container}
    >
      <CommonText>{`${data.name}(${data.symbol})`}</CommonText>
      {selected && <Check />}
    </TouchableOpacity>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: Metrics._50,
    },
  });

export default CurrencyCard;
