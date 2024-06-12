import { Mafs, Coordinates, Line, Theme, vec } from "mafs";
import { useState, useEffect } from "react";
import * as Tone from "tone";

// min: inclusive
// max: exclusive
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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

const point1: vec.Vector2 = [getRandomInt(-9, 0), getRandomInt(-9, 0)];
const point2: vec.Vector2 = [getRandomInt(1, 10), getRandomInt(1, 10)];

function yFromX(x: number) {
  const gradient = (point2[1] - point1[1]) / (point2[0] - point1[0]);
  const intercept = point1[1] - gradient * point1[0];
  return gradient * x + intercept;
}

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

const noiseSynth = new Tone.NoiseSynth({
  noise: {
    type: "white",
  },
  volume: -25,
}).connect(panner);

export default function LineChart() {
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      setPlaying(false);
      return;
    }

    if (playheadPosition > point1[0] && playheadPosition < point2[0]) {
      try {
        panner.set({ pan: map(playheadPosition, -10, 10, -1, 1) });

        const y = yFromX(playheadPosition);
        const freq = map(y, -10, 10, 200, 1000);
        synth.triggerAttackRelease(freq, 0.05);

        if (y < 0) {
          noiseSynth.triggerAttackRelease(0.1);
        }
      } catch (err) {}
    }

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
        <Line.Segment point1={point1} point2={point2} color={Theme.blue} />
        {playing && (
          <Line.Segment
            point1={[playheadPosition, -10]}
            point2={[playheadPosition, 10]}
            color={Theme.red}
          />
        )}
      </Mafs>
      <button onClick={handlePressPlay} disabled={playing}>
        Play
      </button>
    </>
  );
}
