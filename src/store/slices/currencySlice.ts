import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CurrencyItem = {
  code: string;
  name: string;
  symbol: string;
};

const initialState = {
  currencyList: <CurrencyItem[]>[],
  selectedCurrency: <CurrencyItem>{},
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrencyList: (state, action: PayloadAction<CurrencyItem[]>) => {
      state.currencyList = action.payload;
    },
    setSelectedCurrency: (state, action: PayloadAction<CurrencyItem>) => {
      state.selectedCurrency = action.payload;
    },
  },
});

export const { setCurrencyList, setSelectedCurrency } = currencySlice.actions;

export default currencySlice.reducer;
