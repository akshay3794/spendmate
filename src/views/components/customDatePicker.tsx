import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../hooks/useTheme';
import { formattedDate } from '../../utils/helperFunctions';
import CommonText from './commonText';
import { Metrics } from '../../utils/metrics';
import { LightTheme } from '../../utils/colors';
import { Fonts } from '../../utils/fonts';

interface DatePickerProps {
  label: string;
  date: Date;
  open: boolean;
  setDate: (date: Date) => void;
  onCancel: () => void;
  openDatePicker: () => void;
  mode?: 'date' | 'time' | 'datetime';
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  label,
  date,
  open,
  setDate,
  onCancel,
  openDatePicker,
  mode = 'date',
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const displayDate = formattedDate(
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
  );

  return (
    <>
      <View style={styles.container}>
        <CommonText style={styles.label}>{label}</CommonText>
        <TouchableOpacity style={styles.dateContainer} onPress={openDatePicker}>
          <CommonText style={styles.date}>{displayDate}</CommonText>
          <CalendarDays size={Metrics._20} color={theme.grey} />
        </TouchableOpacity>
      </View>
      {open && (
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={date => setDate(date)}
          onCancel={onCancel}
          maximumDate={new Date()}
          mode={mode}
        />
      )}
    </>
  );
};

const getStyles = (theme: typeof LightTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: Metrics._20,
    },
    label: {
      marginBottom: Metrics._12,
      fontSize: Fonts.text,
      color: theme.black2,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: Metrics._1,
      borderRadius: Metrics._8,
      height: Metrics._48,
      paddingVertical: Metrics._4,
      paddingHorizontal: Metrics._16,
      borderColor: theme.border,
    },
    date: {
      flex: 1,
      fontSize: Fonts.extraSmallText,
    },
  });

export default CustomDatePicker;
