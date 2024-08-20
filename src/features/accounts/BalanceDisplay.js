import { connect, useSelector } from "react-redux";
import store from "../../store";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay({ balance }) {
  return <div className="balance">{formatCurrency(balance)}</div>;
}
function mapPropsToState(state) {
  return {
    balance: state.account.balance,
  };
}
export default connect(mapPropsToState)(BalanceDisplay);
