import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Switch,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { moderateScale } from 'react-native-size-matters';
import { Themes } from '../../utils/colors';
import { Fonts } from '../../utils/fonts';
import { useTheme } from '../../hooks/useTheme';
import Container from './container';
import CommonText from './commonText';
import { X } from 'lucide-react-native';
import CustomDropDownPicker from './customDropDownPicker';
import CustomTextInput from './customInput';
import CommonButton from './commonButton';
import Loader from './loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Slider } from '@miblanchard/react-native-slider';
import { Metrics } from '../../utils/metrics';
import { createBudgetApi } from '../../api/budget/budgetAPI';
import { Formik, FormikHelpers } from 'formik';
import { addBudgetSchema } from '../../utils/validationSchemas';

type Props = {
  showModal: boolean;
  onClose: () => void;
};

type initialProps = {
  categoryId: string;
  amount: string;
  alert: boolean;
  alertLimit: number;
};

type CategorySelectionGuardProps = {
  categoryId: string;
  categoryItems: { label: string; value: string }[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
};

const CategorySelectionGuard = ({
  categoryId,
  categoryItems,
  setFieldValue,
}: CategorySelectionGuardProps) => {
  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const isValidCategory = categoryItems.some(
      item => item.value === categoryId,
    );

    if (!isValidCategory) {
      setFieldValue('categoryId', '');
    }
  }, [categoryId, categoryItems, setFieldValue]);

  return null;
};

const AddBudget = ({ showModal, onClose }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const categoryData = useSelector(
    (state: RootState) => state.subcategories.subCategories,
  );

  const categoriesData = useMemo(
    () =>
      categoryData
        .filter(category => category.transactionType === 'expense')
        .map(category => ({
          label: category.label,
          value: String(category.id),
        })),
    [categoryData],
  );

  const handleSave = async (
    values: initialProps,
    actions: FormikHelpers<initialProps>,
  ) => {
    setLoading(true);
    const request = {
      subCategoryId: values.categoryId,
      amount: values.amount,
      alertEnabled: values.alert,
      alertLimit: values.alert ? values.alertLimit : 0,
    };
    try {
      const response = await createBudgetApi(request);
      if (response) {
        actions.resetForm();
        onClose();
      }
    } catch (error) {
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
      <View style={styles.containerBox}>
        <View style={styles.titleBox}>
          <View style={styles.empty} />
          <CommonText style={styles.title}>Add Budget</CommonText>
          <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
            <X size={moderateScale(20)} color={theme.grey} />
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{
            categoryId: '',
            amount: '',
            alert: false,
            alertLimit: 0,
          }}
          validationSchema={addBudgetSchema}
          onSubmit={(values, actions) => handleSave(values, actions)}
        >
          {({
            values,
            handleSubmit,
            handleChange,
            setFieldValue,
            touched,
            errors,
            handleBlur,
          }) => (
            <Container contentStyle={styles.modalContainer}>
              <CategorySelectionGuard
                categoryId={values.categoryId}
                categoryItems={categoriesData}
                setFieldValue={setFieldValue}
              />
              <CustomDropDownPicker
                value={values.categoryId}
                dropdownOpen={open}
                label="Select Category"
                items={categoriesData}
                searchable={true}
                setDropdownOpen={() => {
                  Keyboard.dismiss();
                  setOpen(!open);
                }}
                error={
                  touched.categoryId && errors.categoryId
                    ? errors.categoryId
                    : undefined
                }
                setValue={selectedValue => {
                  const nextValue =
                    typeof selectedValue === 'function'
                      ? selectedValue(values.categoryId)
                      : selectedValue;

                  setFieldValue('categoryId', nextValue ?? '');
                }}
              />
              <CustomTextInput
                label="Amount"
                placeholder="Enter amount"
                value={values.amount}
                keyboardType="number-pad"
                onChangeText={handleChange('amount')}
                onSubmitEditing={() => Keyboard.dismiss()}
                error={
                  touched.amount && errors.amount ? errors.amount : undefined
                }
              />
              <View style={styles.row}>
                <View style={styles.alertBox}>
                  <CommonText style={styles.alertTitle}>
                    Receive Alerts
                  </CommonText>
                  <CommonText style={styles.alertDesc}>
                    Receive alert when it reaches some point.
                  </CommonText>
                </View>
                <Switch
                  trackColor={{ false: theme.grey2, true: theme.primary }}
                  thumbColor={theme.grey3}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={value => {
                    setFieldValue('alert', value);
                  }}
                  value={values.alert}
                />
              </View>
              {values.alert && (
                <Slider
                  value={values.alertLimit}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  onValueChange={value => setFieldValue('alertLimit', value[0])}
                  trackStyle={styles.track}
                  thumbStyle={styles.thumb}
                  minimumTrackStyle={styles.minimumTrack}
                  renderThumbComponent={() => (
                    <View style={styles.thumb}>
                      <View style={styles.innerThumb}>
                        <CommonText style={styles.thumbValue}>
                          {values.alertLimit}%
                        </CommonText>
                      </View>
                    </View>
                  )}
                />
              )}
              <CommonButton
                label="Save"
                onPress={handleSubmit}
                fullWidth={false}
              />
            </Container>
          )}
        </Formik>
      </View>
      {loading && <Loader show={loading} />}
    </ReactNativeModal>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    modalBox: {
      margin: 0,
      alignItems: 'center',
    },
    containerBox: {
      width: '90%',
      height: '70%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(10),
      backgroundColor: theme.background,
      padding: moderateScale(10),
    },
    modalContainer: {
      borderRadius: moderateScale(10),
      padding: moderateScale(10),
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
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: Metrics._10,
    },
    alertBox: {
      width: '80%',
    },
    alertTitle: {
      fontSize: Fonts.text,
      color: theme.black,
    },
    alertDesc: {
      fontSize: Fonts.smallText,
      color: theme.grey2,
    },
    track: {
      height: Metrics._6,
      borderRadius: Metrics._5,
      backgroundColor: theme.grey,
    },
    maximumTrack: {
      height: Metrics._6,
      borderRadius: Metrics._5,
      backgroundColor: theme.grey,
    },
    thumb: {
      width: Metrics._30,
      height: Metrics._18,
      borderRadius: Metrics._10,
      backgroundColor: theme.white,
      borderWidth: Metrics._3,
      borderColor: theme.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerThumb: {
      width: Metrics._24,
      height: Metrics._16,
      borderRadius: Metrics._6,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    minimumTrack: {
      backgroundColor: theme.primary,
    },
    thumbValue: {
      fontSize: Fonts.miniText,
      color: theme.white,
    },
  });

export default AddBudget;
