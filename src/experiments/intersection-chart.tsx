import { Mafs, Coordinates, Line, Theme, vec, Point } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

// min: inclusive
// max: exclusive
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function intersect(
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

function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

let intersection:
    | false
    | {
        x: number;
        y: number;
      },
  line1Point1: vec.Vector2,
  line1Point2: vec.Vector2,
  line2Point1: vec.Vector2,
  line2Point2: vec.Vector2;
do {
  line1Point1 = [getRandomInt(1, 10), getRandomInt(-9, 0)];
  line1Point2 = [getRandomInt(-9, 0), getRandomInt(1, 10)];
  line2Point1 = [getRandomInt(-9, 0), getRandomInt(-9, 0)];
  line2Point2 = [getRandomInt(1, 10), getRandomInt(1, 10)];

  intersection = intersect(
    ...line1Point1,
    ...line1Point2,
    ...line2Point1,
    ...line2Point2
  );
} while (!intersection);

const line1MinX = Math.min(line1Point1[0], line1Point2[0]);
const line1MaxX = Math.max(line1Point1[0], line1Point2[0]);
const line2MinX = Math.min(line2Point1[0], line2Point2[0]);
const line2MaxX = Math.max(line2Point1[0], line2Point2[0]);

function yFromX(x: number, point1: vec.Vector2, point2: vec.Vector2) {
  const gradient = (point2[1] - point1[1]) / (point2[0] - point1[0]);
  const intercept = point1[1] - gradient * point1[0];
  return gradient * x + intercept;
}

const panner = new Tone.Panner().toDestination();

const line1Synth = new Tone.Synth({
  oscillator: {
    type: "fattriangle",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.01,
  },
}).connect(panner);

const line2Synth = new Tone.Synth({
  oscillator: {
    type: "fatsine",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.01,
  },
}).connect(panner);

const intersectionSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.1,
  },
}).connect(panner);

export default function IntersectionChart() {
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const prevPlayheadPosition = useRef<number>();
  const [playing, setPlaying] = useState(false);
  // 0 = both, 1 = line 1, 2 = line 2
  const [whichLines, setWhichLines] = useState(0);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      setPlaying(false);
    }

    const x = playheadPosition;
    try {
      panner.set({ pan: map(x, -10, 10, -1, 1) });
    } catch (err) {}

    // handle line 1
    if (
      (whichLines === 0 || whichLines === 1) &&
      x > line1MinX &&
      x < line1MaxX
    ) {
      try {
        const y = yFromX(playheadPosition, line1Point1, line1Point2);
        const freq = map(y, -10, 10, 200, 1000);
        line1Synth.triggerAttackRelease(freq, 0.05);
      } catch (err) {}
    }

    // handle line 2
    if (
      (whichLines === 0 || whichLines === 2) &&
      x > line2MinX &&
      x < line2MaxX
    ) {
      try {
        const y = yFromX(playheadPosition, line2Point1, line2Point2);
        const freq = map(y, -10, 10, 200, 1000);
        line2Synth.triggerAttackRelease(freq, 0.05);
      } catch (err) {}
    }

    if (
      prevPlayheadPosition.current &&
      intersection &&
      prevPlayheadPosition.current < intersection.x &&
      playheadPosition > intersection.x
    ) {
      try {
        intersectionSynth.triggerAttackRelease("E5", 0.01);
      } catch (err) {}
    }

    prevPlayheadPosition.current = playheadPosition;

    setTimeout(() => {
      setPlayheadPosition((prev) => prev + 0.1);
    }, 10);
  }, [playheadPosition, playing]);

  function handlePressPlay() {
    setPlayheadPosition(-10);
    setPlaying(true);
  }

  return (
    <>
      <Mafs
        preserveAspectRatio={false}
        viewBox={{
          x: [-10, 10],
          y: [-10, 10],
          padding: 0,
        }}
        width={600}
        height={600}
      >
        <Coordinates.Cartesian />
        <Line.Segment
          point1={line1Point1}
          point2={line1Point2}
          color={Theme.blue}
        />
        <Line.Segment
          point1={line2Point1}
          point2={line2Point2}
          color={Theme.green}
        />
        {intersection && (
          <Point x={intersection.x} y={intersection.y} color={Theme.pink} />
        )}
        {playing && (
          <Line.Segment
            point1={[playheadPosition, -10]}
            point2={[playheadPosition, 10]}
            color={Theme.red}
          />
        )}
      </Mafs>
      <div>
        <button
          onClick={() => {
            setWhichLines(1);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play Line 1
        </button>
        <button
          onClick={() => {
            setWhichLines(2);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play Line 2
        </button>
        <button
          onClick={() => {
            setWhichLines(0);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play Both
        </button>
      </div>
    </>
  );
}
