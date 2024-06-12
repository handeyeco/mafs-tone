import { Mafs, Coordinates, Polygon, Theme } from "mafs";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import { getRandomInt } from "../helpers/math";

const data: number[] = [];
const notes: string[] = [
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
  "B5",
];

for (let i = 0; i < 10; i++) {
  data[i] = getRandomInt(0, 10);
}

const synth = new Tone.Synth().toDestination();

export default function BarChart() {
  const [speed, setSpeed] = useState(200);
  const [playIndex, setPlayIndex] = useState(-1);

  useEffect(() => {
    if (playIndex < 0) {
      return;
    }

    if (playIndex >= data.length) {
      setPlayIndex(-1);
      return;
    }

    const stepData = data[playIndex];
    const note = notes[stepData];

    const now = Tone.now();
    synth.triggerAttack(note, now);
    synth.triggerRelease(now + 0.1);

    setTimeout(() => {
      setPlayIndex((prev) => prev + 1);
    }, speed);
  }, [playIndex]);

  function handlePressPlay() {
    if (playIndex === -1) {
      setPlayIndex(0);
    }
  }

  function handleChangeTime(e) {
    setSpeed(e.target.value);
  }

  return (
    <>
      <Mafs
        preserveAspectRatio={false}
        viewBox={{
          x: [0, 10],
          y: [0, 10],
          padding: 0,
        }}
        width={600}
        height={600}
      >
        <Coordinates.Cartesian />
        {data.map((val, i) => {
          const x1 = i;
          const x2 = i + 1;
          const y1 = 0;
          const y2 = val;
          return (
            <Polygon
              points={[
                [x1, y1],
                [x1, y2],
                [x2, y2],
                [x2, y1],
              ]}
              color={playIndex === i ? Theme.red : Theme.blue}
              fillOpacity={0.75}
              key={`${val}+${i}`}
            />
          );
        })}
      </Mafs>
      <div>
        <button onClick={handlePressPlay} disabled={playIndex > -1}>
          Play
        </button>
        <label>
          Time per step
          <input
            type="range"
            min="50"
            max="300"
            value={speed}
            onChange={handleChangeTime}
          />
        </label>
      </div>
    </>
  );
}
