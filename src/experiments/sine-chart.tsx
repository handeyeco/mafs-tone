import { Mafs, Coordinates, Line, Theme, Plot } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

// min: inclusive
// max: exclusive
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const amplitudeMult = getRandomInt(1, 4);
const frequencyMult = getRandomInt(1, 4);
const plotter = (x: number) => Math.sin(x * frequencyMult) * amplitudeMult;

function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

const panner = new Tone.Panner().toDestination();

const plotSynth = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.01,
  },
}).connect(panner);

const xSynth = new Tone.Synth({
  oscillator: {
    type: "sawtooth",
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.1,
  },
}).connect(panner);

const ySynth = new Tone.Synth({
  oscillator: {
    type: "square",
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

export default function SineChart() {
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const [playing, setPlaying] = useState(false);
  const [axisSound, setAxisSound] = useState(true);
  const [negativeSound, setNegativeSound] = useState(true);
  const prevX = useRef<number>(-10);
  const prevY = useRef<number>(plotter(-10));

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      prevX.current = -10;
      return setPlaying(false);
    }

    const x = playheadPosition;
    const y = plotter(x);

    try {
      panner.set({ pan: map(x, -10, 10, -1, 1) });
    } catch (err) {}

    if (x > -10 && x < 10 && y > -10 && y < 10) {
      try {
        const freq = map(y, -10, 10, 200, 1000);
        plotSynth.triggerAttackRelease(freq, 0.05);
      } catch (err) {}
    }

    if (axisSound) {
      try {
        if ((prevY.current < 0 && y > 0) || (prevY.current > 0 && y < 0)) {
          ySynth.triggerAttackRelease("C5", 0.01);
        }
        if ((prevX.current < 0 && x > 0) || (prevX.current > 0 && x < 0)) {
          xSynth.triggerAttackRelease("E5", 0.01);
        }
      } catch (err) {}
    }

    if (negativeSound && y < 0) {
      try {
        noiseSynth.triggerAttackRelease(0.1);
      } catch (err) {}
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
        <Plot.OfX y={plotter} color={Theme.blue} />
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
          Axis sound
          <input
            type="checkbox"
            checked={axisSound}
            onChange={() => {
              setAxisSound(!axisSound);
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
      </div>
    </>
  );
}
