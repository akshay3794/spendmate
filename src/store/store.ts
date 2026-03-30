import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import subCategoryReducer from './slices/subCategorySlice';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import currencyReducer from './slices/currencySlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    subcategories: subCategoryReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
