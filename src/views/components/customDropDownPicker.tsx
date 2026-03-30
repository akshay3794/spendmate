import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../hooks/useTheme';
import { StyleSheet, View, ViewStyle } from 'react-native';
import CommonText from './commonText';
import { LightTheme } from '../../utils/colors';
import { Metrics } from '../../utils/metrics';
import { Fonts } from '../../utils/fonts';

interface Props {
  label: string;
  dropdownOpen: boolean;
  value: string;
  placeholder?: string;
  items: { label: string; value: string }[];
  setDropdownOpen: () => void;
  error?: string;
  searchable?: boolean;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  containerStyle?: ViewStyle;
}

const CustomDropDownPicker: React.FC<Props> = ({
  label,
  dropdownOpen,
  value,
  items,
  setDropdownOpen,
  error,
  searchable = false,
  placeholder = 'Select an item',
  setValue,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {label != '' && (
        <CommonText style={styles.dropDownLabel}>{label}</CommonText>
      )}
      <DropDownPicker
        open={dropdownOpen}
        value={value}
        items={items}
        setOpen={setDropdownOpen}
        setValue={setValue}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        searchable={searchable}
        style={styles.pickerStyle}
        placeholderStyle={styles.labelStyle}
        dropDownContainerStyle={styles.dropDownContainer}
        listItemLabelStyle={styles.listItemLabel}
        containerStyle={containerStyle}
      />
      {error && <CommonText style={styles.error}>{error}</CommonText>}
    </View>
  );
};

const getStyles = (theme: typeof LightTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: Metrics._20,
    },
    dropDownLabel: {
      marginBottom: Metrics._12,
      fontSize: Fonts.text,
      color: theme.black2,
    },
    error: {
      marginTop: Metrics._4,
      fontSize: Fonts.extraSmallText,
      color: theme.error,
    },
    pickerStyle: {
      borderWidth: Metrics._1,
      height: Metrics._48,
      borderColor: theme.border,
      paddingHorizontal: Metrics._16,
      borderRadius: Metrics._8,
    },
    labelStyle: {
      fontSize: Fonts.extraSmallText,
    },
    dropDownContainer: {
      borderTopWidth: 0,
      borderColor: theme.border,
    },
    listItemLabel: {
      fontSize: Fonts.extraSmallText,
      color: theme.black2,
    },
  });

export default CustomDropDownPicker;
