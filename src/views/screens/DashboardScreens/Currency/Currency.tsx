import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStyles } from './Currency.styles';
import Header from '../../../components/header';
import {
  getCurrencyList,
  getUserCurrency,
  saveUserCurrency,
} from '../../../../api/currency/currencyAPI';
import Loader from '../../../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrencyList,
  setSelectedCurrency,
} from '../../../../store/slices/currencySlice';
import { RootState } from '../../../../store/store';
import CurrencyCard from '../../../components/currencyCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import CommonButton from '../../../components/commonButton';

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'Currency'>;
};

const Currency = ({ navigation }: Props) => {
  const styles = getStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { currencyList, selectedCurrency } = useSelector(
    (state: RootState) => state.currency,
  );

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setSelectedCurrencyCode(selectedCurrency?.code ?? '');
  }, [selectedCurrency]);

  const getData = async () => {
    await getCurrencies();
    await getSelectedCurrency();
  };

  const getCurrencies = async () => {
    setLoading(true);
    try {
      const response = await getCurrencyList();
      if (response.success) {
        dispatch(setCurrencyList(response.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCurrency = async () => {
    setLoading(true);
    try {
      const response = await getUserCurrency();
      if (response.success) {
        dispatch(setSelectedCurrency(response.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const currencyToSave = currencyList.find(
      item => item.code === selectedCurrencyCode,
    );

    if (!currencyToSave) {
      return;
    }
    setLoading(true);
    try {
      const request = {
        currency: selectedCurrencyCode,
      };
      const response = await saveUserCurrency(request);
      if (response.success) {
        dispatch(setSelectedCurrency(currencyToSave));
        navigation.goBack();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        label={'Currency'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <FlatList
          data={currencyList}
          renderItem={({ item }) => (
            <CurrencyCard
              onPress={() => setSelectedCurrencyCode(item.code)}
              selected={selectedCurrencyCode === item.code}
              data={item}
            />
          )}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={true}
          style={styles.flx}
          contentContainerStyle={styles.contentContainer}
        />
        <CommonButton
          label="Submit"
          onPress={() => handleSubmit()}
          fullWidth={true}
        />
      </View>
      {loading && <Loader show={loading} />}
    </View>
  );
};

export default Currency;
