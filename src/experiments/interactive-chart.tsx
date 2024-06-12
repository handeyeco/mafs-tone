import { Mafs, Coordinates, Line, Theme, vec, useMovablePoint } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { intersect, map, yFromX } from "../helpers/math";

const lockedPoint1: vec.Vector2 = [-5, 5];
const lockedPoint2: vec.Vector2 = [5, -5];

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
    } catch (err) {
      console.error(err);
    }

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
        } catch (err) {
          console.error(err);
        }
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
        } catch (err) {
          console.error(err);
        }
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
