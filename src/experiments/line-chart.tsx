import { Mafs, Coordinates, Line, Theme, vec } from "mafs";
import { useState, useEffect } from "react";
import * as Tone from "tone";
import { getRandomInt, map, yFromX } from "../helpers/math";

const point1: vec.Vector2 = [getRandomInt(-9, 0), getRandomInt(-9, 0)];
const point2: vec.Vector2 = [getRandomInt(1, 10), getRandomInt(1, 10)];

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

        const y = yFromX(playheadPosition, point1, point2);
        const freq = map(y, -10, 10, 200, 1000);
        synth.triggerAttackRelease(freq, 0.05);

        if (y < 0) {
          noiseSynth.triggerAttackRelease(0.1);
        }
      } catch (err) {
        console.error(err);
      }
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
