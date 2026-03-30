import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type subcategoryItem = {
  id: number;
  label: string;
  transactionType: string;
  value: string;
};

const initialState = {
  subCategories: <subcategoryItem[]>[],
};

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    setSubCategories: (state, action: PayloadAction<subcategoryItem[]>) => {
      state.subCategories = action.payload;
    },
  },
});

export const { setSubCategories } = subCategorySlice.actions;

export default subCategorySlice.reducer;
