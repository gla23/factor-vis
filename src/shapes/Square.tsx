import React from "react";
import { Drag } from "../hooks/useDrag";

interface SquareProps {
  children: string;
  size: number;
  drag: Drag;
}
export const Square = (props: SquareProps) => {
  const { size, drag } = props;
  return (
    <div
      className="shape square"
      onClick={drag.onClick}
      onMouseDown={drag.onMouseDown}
      onMouseUp={drag.onMouseUp}
      style={{
        lineHeight: size + "px",
        width: size + "px",
        height: size + "px",
        top: drag.y - size / 2,
        left: drag.x - size / 2,
      }}
    >
      {props.children}
    </div>
  );
};
