import React, { useState } from "react";
import { Position, useDrag } from "./hooks/useDrag";
import { Square } from "./shapes/Square";

const factorCount = (n: number, d: number) => {
  if (n === 0 || d < 2) return 0;
  let i = -1;
  while (i++ || true) {
    if (n % d !== 0) return i;
    n = n / d;
  }
};

// TODO
// Add proper matrix multiplication and clear up the mess
// Add z skew slider (x = x - z/5)
// Add lines between "current layer" (the one you're hovering nearest?)

const blues = [
  "rgb(134, 146, 186)",
  "rgb(168, 182, 225)",
  "rgb(207, 218, 255)",
];
const d = "#282c34";

const pointCount = 40;
const points = Array(pointCount)
  .fill(null)
  .map(
    (_, i) =>
      new Position(
        factorCount(i + 1, 2),
        factorCount(i + 1, 3),
        factorCount(i + 1, 5)
      )
  );
const zControlBase = new Position(800, 550);
const xyControlBase = new Position(700, 550);
function App() {
  const [zoom, setZoom] = useState(80);
  const [svgFrame, setSvgFrame] = useState({ width: 1000, height: 600 });
  const origin = new Position(150, svgFrame.height * 0.7);
  const zControl = useDrag(zControlBase.add(new Position(-30, -30)));
  const xyControl = useDrag(xyControlBase.add(new Position(0, 0)));
  const circle = useDrag(new Position(50, 380));
  const rect = useDrag(new Position(50, svgFrame.height - 80));
  const rect2 = useDrag(new Position(200, svgFrame.height - 80));

  const control = xyControlBase
    .minus(new Position(xyControl.x, xyControl.y))
    .scale(-0.02);
  const rotateZ = [
    new Position(Math.cos(control.x), -Math.sin(control.x), 0),
    new Position(Math.sin(control.x), Math.cos(control.x), 0),
    new Position(0, 0, 1),
  ] as const;
  const rotateX = [
    new Position(1, 0, 0),
    new Position(0, Math.cos(control.y), -Math.sin(control.y)),
    new Position(0, Math.sin(control.y), Math.cos(control.y)),
  ] as const;
  const to2D = [
    new Position(1, 0, 0),
    new Position(0, 0, -1),
    new Position(0, 0, 0),
  ] as const;
  const toScreen = (point: Position) =>
    origin.add(
      point.scale(zoom).multiply(rotateZ).multiply(rotateX).multiply(to2D)
    );
  const arrowLength = 0.2;
  const xAxis = toScreen(new Position(6, 0, 0));
  const xArrow1 = toScreen(new Position(6 - arrowLength, arrowLength, 0));
  const xArrow2 = toScreen(new Position(6 - arrowLength, -arrowLength, 0));
  const yAxis = toScreen(new Position(0, 4, 0));
  const yArrow1 = toScreen(new Position(arrowLength, 4 - arrowLength, 0));
  const yArrow2 = toScreen(new Position(-arrowLength, 4 - arrowLength, 0));
  return (
    <div className="App">
      <Square size={30} drag={zControl}>
        Z
      </Square>
      <Square size={30} drag={xyControl}>
        Y
      </Square>
      <svg {...svgFrame}>
        <Line from={origin} to={xAxis} />
        <Line from={xAxis} to={xArrow1} />
        <Line from={xAxis} to={xArrow2} />
        <Line from={origin} to={yAxis} stroke="blue" />
        <Line from={yAxis} to={yArrow1} stroke="blue" />
        <Line from={yAxis} to={yArrow2} stroke="blue" />
        {points.map((point, index) => {
          const n =
            Math.pow(2, point.x) * Math.pow(3, point.y) * Math.pow(5, point.z);
          const opacity = (5 - point.z) / 5;
          const total = toScreen(point);

          return (
            <g key={index} transform={`translate(${total.x}, ${total.y})`}>
              <circle r={5} fill={blues[point.z]} fillOpacity={opacity} />
              <text
                fill={"antiquewhite"}
                fillOpacity={opacity}
                // textAnchor="middle"
                alignmentBaseline="middle"
              >
                {n}
              </text>
            </g>
          );
        })}
        <rect {...rect} width="50" height="50"></rect>
        <rect {...rect2} width="80" height="80"></rect>
      </svg>
      Zoom:{" "}
      <input
        type="range"
        min="10"
        max="200"
        step="10"
        onChange={(e) => setZoom(Number(e.target.value))}
      />
    </div>
  );
}
const Line = (props: any) => (
  <line
    x1={props.from.x}
    y1={props.from.y}
    x2={props.to.x}
    y2={props.to.y}
    stroke={"red"}
    strokeWidth={2}
    {...props}
  />
);
export default App;
