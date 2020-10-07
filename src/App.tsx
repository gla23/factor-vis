import React from "react";
import { useDrag } from "./hooks/useDrag";
import { Square } from "./shapes/Square";

function App() {
  const drag1 = useDrag({ x: 50, y: 300 });
  const drag2 = useDrag({ x: 300, y: 50 });
  return (
    <div className="App">
      <Square size={100} drag={drag1}>
        S
      </Square>
      <Square size={100} drag={drag2}>
        T
      </Square>
    </div>
  );
}

export default App;
