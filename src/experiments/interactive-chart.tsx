import { Mafs, Coordinates, Line, Theme, vec, useMovablePoint } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const lockedPoint1: vec.Vector2 = [-5, 5];
const lockedPoint2: vec.Vector2 = [5, -5];

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

function yFromX(x: number, point1: vec.Vector2, point2: vec.Vector2) {
  const gradient = (point2[1] - point1[1]) / (point2[0] - point1[0]);
  const intercept = point1[1] - gradient * point1[0];
  return gradient * x + intercept;
}

const panner = new Tone.Panner().toDestination();

const interactiveSynth = new Tone.Synth({
  oscillator: {
    type: "fatsawtooth",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
  },
}).connect(panner);

const lockedSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
  },
  volume: -10,
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

export default function InteractiveChart() {
  const point1 = useMovablePoint([-5, -5]);
  const point2 = useMovablePoint([5, 5]);
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const prevPlayheadPosition = useRef<number>();
  const [playing, setPlaying] = useState(false);
  // 0 = both, 1 = interactive, 2 = locked
  const [whichLines, setWhichLines] = useState(0);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      setPlaying(false);
      return;
    }

    const x = playheadPosition;

    try {
      panner.set({ pan: map(x, -10, 10, -1, 1) });
    } catch (err) {}

    const intersection = intersect(
      ...point1.point,
      ...point2.point,
      ...lockedPoint1,
      ...lockedPoint2
    );

    // interactive line
    if (whichLines === 0 || whichLines === 1) {
      const interactiveXMin = Math.min(point1.x, point2.x);
      const interactiveXMax = Math.max(point1.x, point2.x);
      if (x > interactiveXMin && x < interactiveXMax) {
        try {
          const y = yFromX(playheadPosition, point1.point, point2.point);
          const freq = map(y, -10, 10, 200, 1000);
          interactiveSynth.triggerAttackRelease(freq, 0.05);
        } catch (err) {}
      }
    }

    // locked line
    if (whichLines === 0 || whichLines === 2) {
      const lockedXMin = Math.min(lockedPoint1[0], lockedPoint1[0]);
      const lockedXMax = Math.max(lockedPoint2[0], lockedPoint2[0]);
      if (x > lockedXMin && x < lockedXMax) {
        try {
          const y = yFromX(playheadPosition, lockedPoint1, lockedPoint2);
          const freq = map(y, -10, 10, 200, 1000);
          lockedSynth.triggerAttackRelease(freq, 0.05);
        } catch (err) {}
      }
    }

    if (
      intersection &&
      prevPlayheadPosition.current &&
      prevPlayheadPosition.current < intersection.x &&
      x > intersection.x
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
          point1={lockedPoint1}
          point2={lockedPoint2}
          style="dashed"
          color={Theme.violet}
        />
        <Line.Segment
          point1={point1.point}
          point2={point2.point}
          color={Theme.blue}
        />

        {point1.element}
        {point2.element}

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
          Play Interactive Line
        </button>
        <button
          onClick={() => {
            setWhichLines(2);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play Locked Line
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
