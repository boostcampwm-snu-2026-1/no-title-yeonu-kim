export type DepositRequest = {
  amount: number;
};

export type DepositResponse = {
  balance: number;
  depositedAt: string;
};
