import { connect, useSelector } from "react-redux";
import store from "../../store";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay() {
  const balance = useSelector((store) => store.account.balance);
  return <div className="balance">{formatCurrency(balance)} lv.</div>;
}

export default BalanceDisplay;
