const initialAccountState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
export default function accountReducer(state = initialAccountState, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + +action.payload,
        isLoading: false,
      };
    case "account/withdraw":
      return { ...state, balance: state.balance - +action.payload };
    case "account/requestLoan":
      if (state.loan !== 0) return { ...state };
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + +action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: 0,
        balance: state.balance - state.loan,
      };
    case "account/convertCurrency":
      return { ...state, isLoading: true };
    default:
      return state;
  }
}
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
export function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}
export function requestLoan(amount, purpose) {
  return { type: "account/requestLoan", payload: { amount, purpose } };
}
export function payLoan() {
  return { type: "account/payLoan" };
}
