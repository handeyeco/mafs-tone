import { vec } from "mafs";

export function intersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return { x, y };
}

export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

// min: inclusive
// max: exclusive
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function yFromX(x: number, point1: vec.Vector2, point2: vec.Vector2) {
  const gradient = (point2[1] - point1[1]) / (point2[0] - point1[0]);
  const intercept = point1[1] - gradient * point1[0];
  return gradient * x + intercept;
}

// ChatGPT wrote this, I don't know if it's right
export function xFromY(y: number, point1: vec.Vector2, point2: vec.Vector2) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  // If the line is vertical, return the x-coordinate of the points
  if (x1 === x2) {
    if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) {
      return x1; // The line segment contains the given y-coordinate
    } else {
      return NaN; // The line segment does not contain the given y-coordinate
    }
  }

  const gradient = (y2 - y1) / (x2 - x1);
  const intercept = y1 - gradient * x1;
  return (y - intercept) / gradient;
}

export function getXIntercept(a: vec.Vector2, b: vec.Vector2) {
  return a[0] - (a[1] * (b[0] - a[0])) / (b[1] - a[1]);
}
