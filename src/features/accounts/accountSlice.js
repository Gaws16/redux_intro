import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return { payload: { amount, purpose } };
      },
      reducer(state, action) {
        if (state.loan !== 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertCurrency(state) {
      state.isLoading = true;
    },
  },
});
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export function deposit(amount, currency) {
  if (currency === "BGN") {
    return {
      type: "account/deposit",
      payload: amount,
    };
  }
  return async function (dispatch, getState) {
    dispatch({ type: "account/convertCurrency" });
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=BGN`
    );
    const data = await response.json();
    const convertedAmount = data?.rates?.BGN;
    dispatch({
      type: "account/deposit",
      payload: convertedAmount,
    });
  };
}
export default accountSlice.reducer;
