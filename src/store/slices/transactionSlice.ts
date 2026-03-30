import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SubCategoryItem = {
  id: number;
  categoryId: number;
  label: string;
};

export type TransactionItem = {
  _id: string;
  userId: string;
  amount: number;
  transaction_date: string;
  transaction_type: string;
  payment_type?: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  subCategoryData: SubCategoryItem;
};

const initialState = {
  transactions: <TransactionItem[]>[],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionItem[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<TransactionItem>) => {
      state.transactions.unshift(action.payload);
    },
  },
});

export const { setTransactions, addTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
