import { Mafs, Coordinates, Line, Theme, vec, MovablePoint } from "mafs";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getRandomInt, map } from "../helpers/math";

const panner = new Tone.Panner().toDestination();

type PointProps = {
  play: boolean;
  point: vec.Vector2;
  onMove: (newPoint: vec.Vector2) => void;
};

function Point(props: PointProps) {
  const { play, point, onMove } = props;

  useEffect(() => {
    if (play) {
      try {
        const synth = new Tone.Synth({
          oscillator: {
            type: "triangle",
          },
          envelope: {
            attack: 0.001,
            decay: 0,
            sustain: 1,
            release: 0.8,
          },
        }).connect(panner);

        const freq = map(point[1], -10, 10, 200, 1000);
        synth.triggerAttackRelease(freq, 0.05);
      } catch (err) {
        console.error(err);
      }
    }
  }, [play]);

  return (
    <MovablePoint
      point={point}
      color={Theme.blue}
      constrain={([x, y]) => {
        let newX = x;
        let newY = y;
        if (x > 10) newX = 10;
        if (x < -10) newX = -10;
        if (y > 10) newY = 10;
        if (y < -10) newY = -10;
        return [newX, newY];
      }}
      onMove={onMove}
    />
  );
}

export default function LineChart() {
  const [points, setPoints] = useState<Array<vec.Vector2>>([[0, 0]]);
  const [playheadPosition, setPlayheadPosition] = useState(-10);
  const prevX = useRef<number>(-10);
  const [playing, setPlaying] = useState(false);

  function handleMovePoint(pointIndex: number, newPoint: vec.Vector2) {
    // deep copy to avoid mutating array
    const clone = JSON.parse(JSON.stringify(points));
    clone[pointIndex] = newPoint;
    setPoints(clone);
  }

  function addPoint() {
    const randPoint: vec.Vector2 = [getRandomInt(-9, 10), getRandomInt(-9, 10)];
    // deep copy to avoid mutating array
    const clone = JSON.parse(JSON.stringify(points));
    clone.push(randPoint);
    setPoints(clone);
  }

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (playheadPosition > 10) {
      setPlaying(false);
      prevX.current = -10;
      setPlayheadPosition(-10);
      return;
    }

    try {
      panner.set({ pan: map(playheadPosition, -10, 10, -1, 1) });
    } catch (err) {
      console.error(err);
    }

    prevX.current = playheadPosition;

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
        {points.map((point, i) => (
          <Point
            key={i}
            point={point}
            play={prevX.current < point[0] && playheadPosition > point[0]}
            onMove={(newPoint) => {
              handleMovePoint(i, newPoint);
            }}
          />
        ))}

        {playing && (
          <Line.Segment
            point1={[playheadPosition, -10]}
            point2={[playheadPosition, 10]}
            color={Theme.red}
          />
        )}
      </Mafs>
      <div>
        <button onClick={addPoint} disabled={playing}>
          Add Point
        </button>
        <button onClick={handlePressPlay} disabled={playing}>
          Play
        </button>
      </div>
    </>
  );
}
