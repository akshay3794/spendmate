import * as Yup from 'yup';
import { phoneRegex } from './regex';

export const loginSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(phoneRegex, 'Enter valid phone number')
    .required('Required'),
});

export const addBudgetSchema = Yup.object().shape({
  categoryId: Yup.string().required('Please select a category'),

  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),

  alert: Yup.boolean(),

  alertLimit: Yup.number().when('alert', {
    is: true,
    then: schema =>
      schema
        .required('Alert limit is required')
        .min(1, 'Minimum alert is 1%')
        .max(100, 'Maximum alert is 100%'),
    otherwise: schema => schema.notRequired(),
  }),
});
