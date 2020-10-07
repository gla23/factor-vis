import React from "react";
import { Drag } from "../hooks/useDrag";

interface SquareProps {
  children: string;
  size: number;
  drag: Drag;
}
export const Square = (props: SquareProps) => {
  const { size, drag } = props;
  const { position } = drag;
  return (
    <div
      className="square"
      onClick={drag.onClick}
      onMouseDown={drag.onMouseDown}
      onMouseUp={drag.onMouseUp}
      style={{
        lineHeight: size + "px",
        width: size + "px",
        height: size + "px",
        top: position.y - size / 2,
        left: position.x - size / 2,
      }}
    >
      {props.children}
    </div>
  );
};
