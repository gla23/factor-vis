import { useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import { useMousePos, useMouseUp } from "./useMousePos";

export class Position {
  constructor(public x: number, public y: number, public z: number = 0) {}
  scale(operand: number) {
    return new Position(this.x * operand, this.y * operand, this.z * operand);
  }
  add(operand: Position) {
    return new Position(
      this.x + operand.x,
      this.y + operand.y,
      this.z + operand.z
    );
  }
  minus(operand: Position) {
    return new Position(
      this.x - operand.x,
      this.y - operand.y,
      this.z - operand.z
    );
  }
  dot(operand: Position) {
    return this.x * operand.x + this.y * operand.y + this.z * operand.z;
  }
  multiply(matrix: Matrix) {
    return new Position(
      this.dot(matrix[0]),
      this.dot(matrix[1]),
      this.dot(matrix[2])
    );
  }
  map(fn: (value: number) => number) {
    return new Position(fn(this.x), fn(this.y), fn(this.z));
  }
}

type Matrix = readonly [Position, Position, Position];

const origin = new Position(0, 0, 0);

export interface Drag {
  x: number;
  y: number;
  onClick?: (e: ReactMouseEvent) => void;
  onMouseDown?: (e: ReactMouseEvent) => void;
  onMouseUp?: (e: ReactMouseEvent) => void;
}

export const useToggleDrag = (initial: Position): Drag => {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(origin);
  const mouseRef = useRef(origin);
  useMousePos((position) => {
    const pos = new Position(position.x, position.y);
    mouseRef.current = pos;
    if (dragging) setPosition(pos.add(offsetRef.current));
  });

  return {
    x: position.x,
    y: position.y,
    onClick: (event: ReactMouseEvent) => {
      event.stopPropagation();
      offsetRef.current = position.minus(mouseRef.current);
      setDragging((d) => !d);
    },
  };
};
export const useDrag = (initial: Position): Drag => {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(origin);
  const mouseRef = useRef(origin);
  useMouseUp((event) => setDragging(false));
  useMousePos((position) => {
    mouseRef.current = position;
    if (dragging) setPosition(position.add(offsetRef.current));
  });

  return {
    ...position,
    onMouseDown: (event: ReactMouseEvent) => {
      event.stopPropagation();
      offsetRef.current = position.minus(mouseRef.current);
      setDragging(true);
    },
  } as const;
};
