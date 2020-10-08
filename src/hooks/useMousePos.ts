import { useEffect } from "react";
import { Position } from "./useDrag";

export const useMousePos = (
  update: (position: Position) => any,
  listen: boolean = true
) => {
  useEffect(() => {
    if (!listen) return;
    const fn = (event: MouseEvent) =>
      update(new Position(event.clientX, event.clientY));
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [update, listen]);
};
export const useMouseUp = (callback: (event: MouseEvent) => any) => {
  useEffect(() => {
    window.addEventListener("mouseup", callback);
    return () => window.removeEventListener("mouseup", callback);
  }, [callback]);
};
