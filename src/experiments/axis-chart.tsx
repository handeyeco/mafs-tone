import { Mafs, Coordinates, Line, Theme, vec, Point } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getRandomInt, map, yFromX, getXIntercept } from "../helpers/math";

const point1: vec.Vector2 = [getRandomInt(1, 10), getRandomInt(-9, 0)];
const point2: vec.Vector2 = [getRandomInt(-9, 0), getRandomInt(1, 10)];
const minX = Math.min(point1[0], point2[0]);
const maxX = Math.max(point1[0], point2[0]);

const xIntercept = getXIntercept(point1, point2);
const yIntercept = yFromX(0, point1, point2);

const panner = new Tone.Panner().toDestination();

const synth = new Tone.Synth({
  oscillator: {
    type: "triangle",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
  },
}).connect(panner);

const tickSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0,
    decay: 0.01,
    sustain: 0,
    release: 0,
  },
}).connect(panner);

const axisSynth = new Tone.Synth({
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

const noiseSynth = new Tone.NoiseSynth({
  noise: {
    type: "white",
  },
  volume: -25,
}).connect(panner);

export default function AxisChart() {
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const [playing, setPlaying] = useState(false);
  const [lineSound, setLineSound] = useState(true);
  const [tickSound, setTickSound] = useState(true);
  const [axisSound, setAxisSound] = useState(true);
  const [negativeSound, setNegativeSound] = useState(true);
  const prevX = useRef<number>();
  const prevY = useRef<number>();

  useEffect(() => {
    if (!playing) {
      return;
    }

    const x = playheadPosition;
    const y = yFromX(playheadPosition, point1, point2);

    if (x > 10) {
      setPlaying(false);
      return;
    }

    // handle ticks
    if (
      tickSound &&
      prevX.current &&
      Math.ceil(x) !== Math.ceil(prevX.current)
    ) {
      try {
        tickSynth.triggerAttackRelease(150, 1);
      } catch (err) {}
    }

    // handle axis
    if (axisSound) {
      if (prevX.current && prevX.current < 0 && x > 0) {
        try {
          axisSynth.triggerAttackRelease("C5", 0.01);
        } catch (err) {}
      }
      if (prevY.current && prevY.current > 0 && y < 0) {
        try {
          axisSynth.triggerAttackRelease("E5", 0.01);
        } catch (err) {}
      }
    }

    if (x > minX && x < maxX) {
      try {
        if (lineSound) {
          panner.set({ pan: map(x, -10, 10, -1, 1) });

          const freq = map(y, -10, 10, 200, 1000);
          synth.triggerAttackRelease(freq, 0.05);
        }

        if (negativeSound && y < 0) {
          noiseSynth.triggerAttackRelease(0.1);
        }
      } catch (err) {
        console.error(err);
      }
    }

    prevX.current = x;
    prevY.current = y;

    setTimeout(() => {
      setPlayheadPosition((prev) => prev + 0.1);
    }, 10);
  }, [playheadPosition, playing]);

  function handlePressPlay() {
    setPlayheadPosition(-10);
    setPlaying(true);
    prevX.current = undefined;
    prevY.current = undefined;
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
        <Line.Segment point1={point1} point2={point2} color={Theme.blue} />
        <Point x={xIntercept} y={0} color={Theme.green} />
        <Point x={0} y={yIntercept} color={Theme.green} />
        {playing && (
          <Line.Segment
            point1={[playheadPosition, -10]}
            point2={[playheadPosition, 10]}
            color={Theme.red}
          />
        )}
      </Mafs>
      <div>
        <button onClick={handlePressPlay} disabled={playing}>
          Play
        </button>
        <label>
          Line sound
          <input
            type="checkbox"
            checked={lineSound}
            onChange={() => {
              setLineSound(!lineSound);
            }}
          />
        </label>
        <label>
          Negative sound
          <input
            type="checkbox"
            checked={negativeSound}
            onChange={() => {
              setNegativeSound(!negativeSound);
            }}
          />
        </label>
        <label>
          Tick sound
          <input
            type="checkbox"
            checked={tickSound}
            onChange={() => {
              setTickSound(!tickSound);
            }}
          />
        </label>
        <label>
          Axis sound
          <input
            type="checkbox"
            checked={axisSound}
            onChange={() => {
              setAxisSound(!axisSound);
            }}
          />
        </label>
      </div>
    </>
  );
}
