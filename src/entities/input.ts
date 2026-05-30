export type Input<T> = {
  value: T;
  isError: boolean;
  onChange: (value: T) => void;
};

export type InputForForm<T> = Input<T>;

export type InputWithDetailedError<T, E> = Input<T> & {
  detailedError: E;
};
