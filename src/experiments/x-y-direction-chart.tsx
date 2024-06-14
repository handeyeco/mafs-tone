import { Mafs, Coordinates, Line, Theme, useMovablePoint, vec } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getRandomInt, map, xFromY, yFromX } from "../helpers/math";

const randPoint1: vec.Vector2 = [getRandomInt(-9, 0), getRandomInt(-9, 0)];
const randPoint2: vec.Vector2 = [getRandomInt(1, 10), getRandomInt(1, 10)];

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
}).toDestination();

export default function XYDirectionChart() {
  const point1 = useMovablePoint(randPoint1);
  const point2 = useMovablePoint(randPoint2);
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const prevPlayheadPosition = useRef<number>();
  const [playing, setPlaying] = useState(false);
  const [playYDir, setPlayYDir] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      setPlaying(false);
      return;
    }

    // interactive line
    if (!playYDir) {
      const x = playheadPosition;
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
    } else {
      const y = playheadPosition;
      const interactiveYMin = Math.min(point1.y, point2.y);
      const interactiveYMax = Math.max(point1.y, point2.y);
      if (y > interactiveYMin && y < interactiveYMax) {
        try {
          const x = xFromY(playheadPosition, point1.point, point2.point);
          const freq = map(x, -10, 10, 200, 1000);
          if (freq) {
            interactiveSynth.triggerAttackRelease(freq, 0.05);
          }
        } catch (err) {
          console.error(err);
        }
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
          point1={point1.point}
          point2={point2.point}
          color={Theme.blue}
        />

        {point1.element}
        {point2.element}

        {!!(playing && !playYDir) && (
          <Line.Segment
            point1={[playheadPosition, -10]}
            point2={[playheadPosition, 10]}
            color={Theme.red}
          />
        )}

        {!!(playing && playYDir) && (
          <Line.Segment
            point1={[-10, playheadPosition]}
            point2={[10, playheadPosition]}
            color={Theme.green}
          />
        )}
      </Mafs>
      <div>
        <button
          onClick={() => {
            setPlayYDir(false);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play X Direction
        </button>
        <button
          onClick={() => {
            setPlayYDir(true);
            handlePressPlay();
          }}
          disabled={playing}
        >
          Play Y Direction
        </button>
      </div>
    </>
  );
}
