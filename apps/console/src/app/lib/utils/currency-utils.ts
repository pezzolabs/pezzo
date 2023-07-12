export const toDollarSign = (amount: number) => {
  if (!amount) return "$0.0000";
  return `$${amount.toFixed(4)}`;
};
