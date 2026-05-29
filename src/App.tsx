import { useState } from 'react';

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello World!</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </div>
  );
};
