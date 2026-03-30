import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import CommonText from './commonText';
import { X } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import CustomTextInput from './customInput';
import { useTheme } from '../../hooks/useTheme';
import { Themes } from '../../utils/colors';
import { Fonts } from '../../utils/fonts';
import CommonButton from './commonButton';
import Container from './container';
import CustomDropDownPicker from './customDropDownPicker';
import CustomDatePicker from './customDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { formatDate } from '../../utils/helperFunctions';
import { createTransactionApi } from '../../api/transaction/transactionAPI';
import Toast from 'react-native-toast-message';
import Loader from './loader';
import { addTransaction } from '../../store/slices/transactionSlice';
import { subcategoryItem } from '../../store/slices/subCategorySlice';

type Props = {
  showModal: boolean;
  onClose: () => void;
};

const typeEnum = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

const transactionEnum = [
  { label: 'Cash', value: 'cash' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Debit Card', value: 'debit_card' },
  { label: 'UPI', value: 'upi' },
];

const AddTransaction = ({ showModal, onClose }: Props) => {
  const { theme } = useTheme();
  const categoryData = useSelector(
    (state: RootState) => state.subcategories.subCategories,
  );

  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedCategoryData, setSelectedCategoryData] = useState<
    subcategoryItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState<string>('');

  const [amount, setAmount] = useState('');
  const [openTransactionType, setOpenTransactionType] = useState(false);
  const [transactionTypeValue, setTransactionTypeValue] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal]);

  useEffect(() => {
    if (typeValue === 'income') {
      const data = categoryData.filter(
        item => item.transactionType == 'income',
      );
      setSelectedCategoryData(data);
    } else {
      const data = categoryData.filter(
        item => item.transactionType == 'expense',
      );
      setSelectedCategoryData(data);
    }
  }, [typeValue]);

  const resetForm = () => {
    setDate(new Date());
    setAmount('');
    setNote('');
    setValue('');
    setOpen(false);
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!amount || !value) {
      Alert.alert('Spendmate', 'Please fill all required fields.');
      return;
    }

    try {
      const displayDate = formatDate(date.toISOString());
      setLoading(true);
      let request = {
        transaction_type: typeValue,
        amount: amount,
        payment_type: transactionTypeValue,
        transaction_date: displayDate,
        subCategoryId: value,
        note: note,
      };

      let response = await createTransactionApi(request);
      if (response.success) {
        Toast.show({
          text1: 'Spendmate',
          text2: 'Transaction saved',
          type: 'success',
        });
        dispatch(addTransaction(response.data));
        resetForm();
        onClose();
      }
    } catch (error: any) {
      Toast.show({
        text1: 'Spendmate',
        text2: error?.message ?? 'Something went wrong',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReactNativeModal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={showModal}
      style={styles.modalBox}
    >
      <Container
        boxStyle={styles.containerBox}
        contentStyle={styles.modalContainer}
      >
        <View style={styles.titleBox}>
          <View style={styles.empty} />
          <CommonText style={styles.title}>Add Transaction</CommonText>
          <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
            <X size={moderateScale(20)} color={theme.grey} />
          </TouchableOpacity>
        </View>
        <CustomDropDownPicker
          value={typeValue}
          dropdownOpen={typeOpen}
          label="Transaction Type"
          placeholder="Select transaction type"
          items={typeEnum}
          setDropdownOpen={() => {
            Keyboard.dismiss();
            setTypeOpen(!typeOpen);
          }}
          setValue={setTypeValue}
        />
        <CustomTextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="number-pad"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <CustomDropDownPicker
          value={transactionTypeValue}
          dropdownOpen={openTransactionType}
          label="Payment Type"
          placeholder="Select Payment Type"
          items={transactionEnum}
          setDropdownOpen={() => {
            Keyboard.dismiss();
            setOpenTransactionType(!openTransactionType);
          }}
          setValue={setTransactionTypeValue}
        />
        <CustomDatePicker
          label="Select Date"
          date={date}
          open={showDatePicker}
          setDate={(date: Date) => {
            setShowDatePicker(false);
            setDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
          openDatePicker={() => {
            Keyboard.dismiss();
            setShowDatePicker(true);
            setOpen(false);
          }}
        />
        <CustomDropDownPicker
          value={value}
          dropdownOpen={open}
          label="Category"
          placeholder="Select transaction category"
          items={selectedCategoryData}
          searchable={true}
          setDropdownOpen={() => {
            Keyboard.dismiss();
            setOpen(!open);
          }}
          setValue={setValue}
        />
        <CustomTextInput
          label="Note"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          verticalAlign="top"
          autoCapitalize="sentences"
        />

        <CommonButton label="Save" onPress={handleSave} fullWidth={false} />
      </Container>
      {loading && <Loader show={loading} />}
    </ReactNativeModal>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    modalBox: {
      margin: 0,
      flex: 1,
    },
    modalContainer: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(10),
      borderTopRightRadius: moderateScale(10),
      backgroundColor: theme.background,
    },
    containerBox: {
      width: '100%',
      height: '100%',
    },
    titleBox: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(20),
    },
    empty: {
      width: moderateScale(30),
    },
    title: {
      fontSize: Fonts.text,
      fontFamily: 'PoppinsSemiBold',
    },
    label: {
      fontSize: Fonts.text,
      marginBottom: moderateScale(8),
      color: theme.black,
      fontWeight: '400',
    },
  });

export default AddTransaction;
