import { Mafs, Coordinates, Line, Theme, vec } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getRandomInt, map, yFromX } from "../helpers/math";

const point1: vec.Vector2 = [getRandomInt(-9, -5), getRandomInt(-9, -5)];
const point2: vec.Vector2 = [getRandomInt(5, 10), getRandomInt(5, 10)];
const minX = Math.min(point1[0], point2[0]);
const maxX = Math.max(point1[0], point2[0]);

const speechAvailable = "speechSynthesis" in window;

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
  volume: -20,
}).connect(panner);

export default function SpeechSynthChart() {
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const [readStartEnd, setReadStartEnd] = useState(true);
  const [readAxis, setReadAxis] = useState(true);
  const prevX = useRef(-10);
  const prevY = useRef(-10);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const x = playheadPosition;
    const y = yFromX(x, point1, point2);

    if (x > 10) {
      setPlaying(false);
      return;
    }

    panner.set({ pan: map(x, -10, 10, -1, 1) });

    if (x > point1[0] && x < point2[0]) {
      try {
        const freq = map(y, -10, 10, 200, 1000);
        synth.triggerAttackRelease(freq, 0.05);
      } catch (err) {
        console.error(err);
      }
    }

    let nextFrameDelay = 10;
    if (speechAvailable) {
      if (readStartEnd) {
        if (prevX.current < minX && x >= minX) {
          const startLine = new SpeechSynthesisUtterance("Start line");
          window.speechSynthesis.speak(startLine);
          nextFrameDelay = 1500;
        }

        if (prevX.current < maxX && x >= maxX) {
          const endLine = new SpeechSynthesisUtterance("End line");
          window.speechSynthesis.speak(endLine);
          nextFrameDelay = 1500;
        }
      }

      if (readAxis) {
        if (prevX.current < 0 && x >= 0) {
          const xAxis = new SpeechSynthesisUtterance("X axis");
          window.speechSynthesis.speak(xAxis);
          nextFrameDelay = 1500;
        }

        if (prevY.current < 0 && y >= 0) {
          const yAxis = new SpeechSynthesisUtterance("Y axis");
          window.speechSynthesis.speak(yAxis);
          nextFrameDelay = 1500;
        }
      }
    }

    prevX.current = x;
    prevY.current = y;

    setTimeout(() => {
      setPlayheadPosition((prev) => prev + 0.1);
    }, nextFrameDelay);
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
      <div>
        <label>
          Read start/end line
          <input
            type="checkbox"
            checked={readStartEnd}
            onChange={() => {
              setReadStartEnd(!readStartEnd);
            }}
          />
        </label>
        <label>
          Read axes crossing
          <input
            type="checkbox"
            checked={readAxis}
            onChange={() => {
              setReadAxis(!readAxis);
            }}
          />
        </label>
        <button onClick={handlePressPlay} disabled={playing}>
          Play
        </button>
      </div>
    </>
  );
}
