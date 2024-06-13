import { Mafs, Text, Theme, useMovablePoint, Circle } from "mafs";
import { useState, useEffect } from "react";
import * as Tone from "tone";
import { map } from "../helpers/math";

function playNote(x: number, y: number) {
  const pan = map(x, -10, 10, -1, 1);
  const panner = new Tone.Panner(pan).toDestination();

  const wet = map(y, -10, 10, 0, 0.75);
  const freeverb = new Tone.Freeverb({
    wet,
    roomSize: 0.8,
  }).connect(panner);

  const filt = map(y, 10, -10, 200, 8000);
  const filter = new Tone.Filter(filt, "lowpass").connect(freeverb);

  const synth = new Tone.Synth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0.5,
    },
  }).connect(filter);

  synth.triggerAttackRelease(1000, 0.1);
}

export default function SpaceChart() {
  const [playing, setPlaying] = useState(false);
  const position = useMovablePoint([0, 0], {
    constrain: ([x, y]) => {
      let newX = x;
      let newY = y;
      if (x > 10) newX = 10;
      if (x < -10) newX = -10;
      if (y > 10) newY = 10;
      if (y < -10) newY = -10;
      return [newX, newY];
    },
  });

  useEffect(() => {
    if (!playing) {
      return;
    }

    playNote(...position.point);

    setTimeout(() => {
      setPlaying(false);
    }, 500);
  }, [playing]);

  function handlePressPlay() {
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
        <Text x={0} y={9} attach="n">
          Far
        </Text>
        <Text x={0} y={-9} attach="s">
          Near
        </Text>
        <Text x={-9} y={0} attach="e">
          Left
        </Text>
        <Text x={9} y={0} attach="w">
          Right
        </Text>

        <Circle center={position.point} radius={1} color={Theme.pink} />
        {position.element}
      </Mafs>
      <button onClick={handlePressPlay} disabled={playing}>
        Play
      </button>
    </>
  );
}
