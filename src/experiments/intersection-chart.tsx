import { Mafs, Coordinates, Line, Theme, vec, Point } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getRandomInt, intersect, map, yFromX } from "../helpers/math";

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
    } catch (err) {
      console.error(err);
    }

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
      } catch (err) {
        console.error(err);
      }
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
      } catch (err) {
        console.error(err);
      }
    }

    if (
      prevPlayheadPosition.current &&
      intersection &&
      prevPlayheadPosition.current < intersection.x &&
      playheadPosition > intersection.x
    ) {
      try {
        intersectionSynth.triggerAttackRelease("E5", 0.01);
      } catch (err) {
        console.error(err);
      }
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
        zoom={false}
        pan={false}
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
