import { createSlice } from '@reduxjs/toolkit';

export type BudgetItem = {
  _id: string;
  subCategoryId: number;
  subCategoryData: {
    id: number;
    transactionType: string;
    label: string;
  };
  amount: string;
  spent: string;
  alertEnabled: boolean;
  alertLimit: number;
  createdAt: string;
  updatedAt: string;
};

const initialState = {
  budgetList: <BudgetItem[]>[],
};

const budgetSlice = createSlice({
  name: 'budgetList',
  initialState,
  reducers: {
    setBudgetList: (state, action) => {
      state.budgetList = action.payload;
    },
    appendBudgetList: (state, action) => {
      state.budgetList = [...state.budgetList, ...action.payload];
    },
  },
});

export const { setBudgetList, appendBudgetList } = budgetSlice.actions;

export default budgetSlice.reducer;
