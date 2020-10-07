import {
  useEffect,
  useState,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";

interface Position {
  x: number;
  y: number;
}
const origin: Position = { x: 0, y: 0 };
const add = (a: Position, b: Position) => ({ x: a.x + b.x, y: a.y + b.y });
const minus = (a: Position, b: Position) => ({ x: a.x - b.x, y: a.y - b.y });

export interface Drag {
  position: Position;
  onClick?: (e: ReactMouseEvent<HTMLElement>) => void;
  onMouseDown?: (e: ReactMouseEvent<HTMLElement>) => void;
  onMouseUp?: (e: ReactMouseEvent<HTMLElement>) => void;
}
const useMousePos = (
  update: (position: Position) => any,
  listen: boolean = true
) => {
  useEffect(() => {
    if (!listen) return;
    const fn = (event: MouseEvent) =>
      update({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [update, listen]);
};

export const useToggleDrag = (initial: Position): Drag => {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(origin);
  const mouseRef = useRef(origin);
  useMousePos((position) => {
    mouseRef.current = position;
    if (dragging) setPosition(add(position, offsetRef.current));
  });

  return {
    position,
    onClick: () => {
      offsetRef.current = minus(position, mouseRef.current);
      setDragging((d) => !d);
    },
  };
};
export const useDrag = (initial: Position): Drag => {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(origin);
  const mouseRef = useRef(origin);
  useMousePos((position) => {
    mouseRef.current = position;
    if (dragging) setPosition(add(position, offsetRef.current));
  });

  return {
    position,
    onMouseDown: () => {
      offsetRef.current = minus(position, mouseRef.current);
      setDragging(true);
    },
    onMouseUp: () => setDragging(false),
  } as const;
};
