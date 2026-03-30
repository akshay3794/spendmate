import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import CommonText from './commonText';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import { Metrics } from '../../utils/metrics';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';

type Props = {
  onChange: (value: Date) => void;
};

const MonthSelection = ({ onChange }: Props) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const showPicker = useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => setShow(value),
    [],
  );
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onValueChange = (event: any, newDate?: Date) => {
    setShow(false);

    if (event === 'dismissedAction') {
      return;
    }

    if (newDate) {
      onChange(newDate);
      setDate(newDate);
    }
  };
  return (
    <View style={styles.row}>
      <CommonText>Select Month</CommonText>
      <TouchableOpacity onPress={() => showPicker(true)}>
        <CommonText>{moment(date).format('MMM YYYY')}</CommonText>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: Metrics._10,
    },
  });

export default MonthSelection;
