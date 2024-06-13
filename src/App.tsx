import BarChart from "./experiments/bar-chart";
import LineChart from "./experiments/line-chart";
import AxisChart from "./experiments/axis-chart";
import IntersectionChart from "./experiments/intersection-chart";
import PlotChart from "./experiments/plot-chart";
import SineChart from "./experiments/sine-chart";
import InteractiveChart from "./experiments/interactive-chart";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <h1>Mafs + Tone: Sonification of Charts</h1>
      <div className="text-card">
        <h2>Introduction</h2>
        <p>
          These are some hackathon-style prototypes done in a couple of days as
          an example of how to combine <a href="https://mafs.dev/">Mafs</a> (the
          charting library) and <a href="https://tonejs.github.io/">Tone</a>{" "}
          (the audio library).
        </p>
        <p>
          The data for most of the charts are randomly generated. Most examples
          have settings to adjust the audio and all of them have a play button
          to trigger playback. No charts are pre-rendered, they're generated
          live thanks for Mafs. No audio is pre-recorded, it's all generated
          live thanks to Tone.
        </p>
        <p>
          Occassionally things freeze up for a few milliseconds. This is likely
          due to use setTimeout rather than than something like{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">
            requestAnimationFrame
          </a>{" "}
          which would require more work for proper tweening.{" "}
          requestAnimationFrame would be better for a production application,
          but I chose setTimeout while prototyping for simplicity.
        </p>
        <h3>Example Index</h3>
        <ul className="table-of-contents">
          <li>
            <a href="#simple-example">Simple Example</a>
          </li>
          <li>
            <a href="#basic-line-chart">Basic Line Chart</a>
          </li>
          <li>
            <a href="#hearing-axes">Hearing Axes</a>
          </li>
          <li>
            <a href="#intersections">Intersections</a>
          </li>
          <li>
            <a href="#parabola">Parabola</a>
          </li>
          <li>
            <a href="#sine">Sine</a>
          </li>
          <li>
            <a href="#interactive-line">Interactive Line</a>
          </li>
        </ul>
      </div>
      <div className="experiment-container">
        <h2 id="simple-example">Simple Example</h2>
        <p>
          This was my starting point since I imagined that working with discrete
          steps would be easier.
        </p>
        <p>
          The chart is made up of a set of Polygon elements positioned to look
          like a basic bar chart. A speed setting controls the interval timeout
          for moving through the data points and the value of the data points is
          mapped to the C Major scale.
        </p>
        <BarChart />
      </div>
      <div className="experiment-container">
        <h2 id="basic-line-chart">Basic Line Chart</h2>
        <p>
          In this example we randomly generate an upward line chart. The x-axis
          is mapped to time and the y-axis is mapped to pitch - lower pitch is a
          lower number, higher pitch is a higher number. White noise is played
          when y is a negative number.
        </p>
        <p>
          While this might sound like a single note bending upward, it's
          currently implemented as a series of discrete notes being played in
          rapid succession. This is likely an area for improvement: it would
          probably be more performant to have a single note and modulate its
          pitch using something like{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/linearRampToValueAtTime">
            linearRampToValueAtTime
          </a>
          ; I just didn't want to try to figure out the math for that.
        </p>
        <LineChart />
      </div>
      <div className="experiment-container">
        <h2 id="hearing-axes">Hearing Axes</h2>
        <p>
          In the previous example, we highlighted the need for context in
          regards to negative vs positive numbers. In this example we add
          additional context: a background beat for when the playhead crosses a
          tick on the x-axis and two notes for when the line crosses the x-axis
          (C5) or the y-axis (E5).
        </p>
        <p>
          This example can sound overwhelming with everything turned on,
          hopefully showcasing the need to an interactive UI that allows users
          to selectively enable/disable individual audio elements.
        </p>
        <AxisChart />
      </div>
      <div className="experiment-container">
        <h2 id="intersections">Intersections</h2>
        <p>
          This example illustrates multiple lines on a single chart, along with
          a point where the lines intersect.
        </p>
        <p>
          In order to allow users to differentiate between the two lines, each
          line has a unique timbre due to using different oscillator waveforms.
          To allow a user to focus on the individual lines, there are three play
          buttons: two buttons to play the individual lines and one button to
          play both lines simultaneously.
        </p>
        <IntersectionChart />
      </div>
      <div className="experiment-container">
        <h2 id="parabola">Parabola</h2>
        <p>
          Because we're using discrete steps to sonify the lines, it's
          essentially the same steps to convert more complex waveforms; for
          example a randomly generated parabola.
        </p>
        <p>
          In this example we're using a sine wave for the line, we play notes
          when crossing the x-axis (sawtooth wave, E5) or y-axis (square wave,
          C5), and we add white noise when we have a negative y.
        </p>
        <PlotChart />
      </div>
      <div className="experiment-container">
        <h2 id="sine">Sine</h2>
        <p>
          A randomly generated sine. Pretty much the same concept at the
          parabola, but it looks and sounds cooler.
        </p>
        <SineChart />
      </div>
      <div className="experiment-container">
        <h2 id="interactive-line">Interactive Line</h2>
        <p>
          Since the chart and the sound are generated live, there's really no
          difference between generating sound for an interactive element vs a
          static element.
        </p>
        <p>
          In this example I have a static line, an interactive line, and buttons
          to play them individually or together. In order to differentiate them
          sonically, I use timbre and volume: the static line is a quiet sine
          wave and the interactive line is a louder sawtooth wave (with unison
          to thicken the sound).
        </p>
        <p>
          Note that if the lines intersect, we'll play a little blip to indicate
          that intersection.
        </p>
        <InteractiveChart />
      </div>
    </div>
  );
}
