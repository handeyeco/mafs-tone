import BarChart from "./experiments/bar-chart";
import LineChart from "./experiments/line-chart";
import AxisChart from "./experiments/axis-chart";
import IntersectionChart from "./experiments/intersection-chart";
import PlotChart from "./experiments/plot-chart";
import SineChart from "./experiments/sine-chart";
import InteractiveChart from "./experiments/interactive-chart";
import SpeechSynthChart from "./experiments/speech-synth-chart";
import XYDirectionChart from "./experiments/x-y-direction-chart";
import SpaceChart from "./experiments/space-chart";
import PointsChart from "./experiments/points-chart";
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
          (the audio library) in order to{" "}
          <a href="https://en.wikipedia.org/wiki/Sonification">sonify</a>{" "}
          charts.
        </p>
        <p>
          The data for most of the charts are randomly generated when the page
          loads. Most examples have options to adjust aspects of the generated
          audio and all of them have a play button to trigger playback. No
          charts are pre-rendered, they're generated live thanks to Mafs;
          similarly no audio is pre-recorded, it's all generated live thanks to
          Tone.
        </p>
        <p>
          Occassionally things freeze up for a few milliseconds. This is likely
          due to using setTimeout rather than than something like{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">
            requestAnimationFrame
          </a>{" "}
          which would require more work for proper tweening.{" "}
          requestAnimationFrame would be better for a production application,
          but I chose setTimeout while prototyping for simplicity.
        </p>
        <h3>Table of Contents</h3>
        <ul>
          <li>
            <a href="#market-research">Market Research</a>
          </li>
          <li>
            <a href="#simple-example">Simple Example</a>
          </li>
          <li>
            <a href="#understanding-space">Understanding Space</a>
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
          <li>
            <a href="#arbitrary-points">Arbitrary Points</a>
          </li>
          <li>
            <a href="#x-vs-y-direction">Time: X vs Y Direction</a>
          </li>
          <li>
            <a href="#speech-synthesis">Speech Synthesis</a>
          </li>
          <li>
            <a href="#conclusion">Conclusion</a>
          </li>
        </ul>
        <p>
          <b>
            The source for these examples can be found in{" "}
            <a href="https://github.com/handeyeco/mafs-tone">this repository</a>
            .
          </b>
        </p>
      </div>

      <div className="text-card">
        <h2 id="market-research">Market Research</h2>
        <p>
          I'm not going into detail about <i>what</i> data sonicification is,
          this document is a set of open-source <i>examples</i> about combining
          Mafs with Tone. However I'll share the resources and applications that
          influenced these experiments.
        </p>
        <ul>
          <li>
            <a href="https://mlaetsc.hcommons.org/2023/01/18/data-sonification-for-beginners/">
              Data Sonification for Beginners
            </a>
            : a great overview with some non-code solutions for sonification.
          </li>
          <li>
            <a href="https://github.com/highcharts/sonification-studio">
              Highcharts Sonification Studio
            </a>
            : an open-source collaboration between the Georgia Institute of
            Technology and Highcharts
          </li>
          <li>
            <a href="https://github.com/highcharts/highcharts/tree/master/ts/Extensions/Sonification">
              Highcharts Sonification code
            </a>
            : the code that drives Highcharts' sonification extension is also
            open-source (different than Highcharts Sonification Studio)
          </li>
          <li>
            <a href="https://github.com/sonifydata/twotone">TwoTone</a>: an
            open-source data sonification and data-driven music web app
          </li>
          <li>
            <a href="https://www.desmos.com/calculator">Desmos Calculator</a>: I
            don't think it's open-source, but it's a wonderful example of
            dynamic charts with sonification
          </li>
          <li>
            <a href="https://www.perkins.org/resource/sonification-sounds-meaning-activity/">
              Sonification: Sounds with Meaning Activity
            </a>
            : great article on sonification by the Perkins School for the
            Blind...without visuals. Great way to build empathy for learners
            with limited or no visibility
          </li>
          <li>
            <a href="https://sonification.de/handbook/">
              The Sonification Handbook
            </a>
            : an OpenAccess book on sonification
          </li>
        </ul>
        <p>Some random cool things:</p>
        <ul>
          <li>
            <a href="https://www.nasa.gov/universe/data-sonification-a-new-cosmic-triad-of-sound/">
              Data Sonification: A New Cosmic Triad of Sound
            </a>
            : sonifying images of space
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=3PJxUPvz9Oo">
              Sonification of Tohoku Earthquake
            </a>
            : sonifying an earthquake
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=kEIi45KPlFQ">
              MusLib Gate Count FY18 by Shift
            </a>
            : sonifying library visits
          </li>
          <li>
            <a href="https://datadrivendj.com/">Data-Driven DJ</a>: a series of
            music experiments that combine data, algorithms, and borrowed sounds
          </li>
        </ul>
      </div>
      <div className="experiment-container">
        <h2 id="simple-example">Simple Example</h2>
        <p>My MVP for combining Mafs with Tone.</p>
        <p>
          The chart is made up of a set of Polygon elements positioned to look
          like a basic bar chart. A speed setting controls the interval timeout
          for moving through the data points and the value of the data points is
          mapped to the C Major scale.
        </p>
        <BarChart />
      </div>
      <div className="experiment-container">
        <h2 id="understanding-space">Understanding Space</h2>
        <p>
          Before we go much further, we should talk about how sound works. Sound
          is typically played in stereo; laptops, headphones, and most music
          venues work in the stereo realm. That's because, at most, humans have
          two ears to hear with.
        </p>
        <p>
          However we interpret this stereo signal in terms of three dimensional
          space: we can tell the difference between someone talking to our face
          vs a car honking behind us vs the sound of a party down the street. We
          can also differentiate more subtle differences: we can distinguish a
          flute playing middle C and a piano playing middle C.
        </p>
        <p>
          A lot goes into making things sound the way they do, but I like to
          explain the fundamentals in terms of an x/y plane where x is
          left/right and y is near/far. In this example I use a number of tools
          to simulate these two axes.
        </p>
        <ul>
          <li>
            <b>panning:</b> the position of the sound in the stereo field. If
            the sound is coming more from the left speaker, it sounds like the
            sound is to my left.
          </li>
          <li>
            <b>frequency:</b> low frequencies travel better than high
            frequencies, so we interpret sounds with more low frequency as being
            further away. In the example I use a <i>low-pass filter</i> to
            remove high frequencies as the sound is pushed backwards.
          </li>
          <li>
            <b>reverb:</b> reverb is the sound as it bounces off of surfaces -
            think of a long hall with tiled floors. The futher away something
            is, the more time the sound has to bounce off of things; for that
            reason we interpret sounds with reverb as being further away.
          </li>
          <li>
            <b>amplitude:</b> we interpret quieter things as being further away,
            so by controlling volume we can simulate a change in distance.
          </li>
        </ul>
        <SpaceChart />
      </div>
      <div className="experiment-container">
        <h2 id="basic-line-chart">Basic Line Chart</h2>
        <p>
          In this example we randomly generate an upward line chart. The x-axis
          is mapped to time and reinforced with panning between left and right
          speakers. The y-axis is mapped to pitch - lower pitch is a lower
          number, higher pitch is a higher number. White noise is played when y
          is a negative number.
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
          ; I just didn't want to try to figure out the math for that while
          prototyping.
        </p>
        <LineChart />
      </div>
      <div className="experiment-container">
        <h2 id="hearing-axes">Hearing Axes</h2>
        <p>
          In the previous example, we added context around negative vs positive
          numbers by adding white noise. In this example we add additional
          context: a background beat for when the playhead crosses a tick on the
          x-axis and short notes for when the line crosses the x-axis (C5) or
          the y-axis (E5).
        </p>
        <p>
          This example can sound overwhelming with everything turned on,
          hopefully showcasing the need for an interactive UI that allows users
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
          line was given a unique{" "}
          <a href="https://en.wikipedia.org/wiki/Timbre">timbre</a> by using
          different oscillator waveforms. To allow a user to focus on the
          individual lines, there are three play buttons: two buttons to play
          the individual lines and one button to play both lines simultaneously.
        </p>
        <IntersectionChart />
      </div>
      <div className="experiment-container">
        <h2 id="parabola">Parabola</h2>
        <p>
          Because we're using discrete steps to sonify the lines, it's
          essentially the same code to convert more complex waveforms; for
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
          Since the chart and the audio is generated live, there's really no
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
      <div className="experiment-container">
        <h2 id="arbitrary-points">Arbitrary Points</h2>
        <p>
          So far, we've been dealing with a fixed number of elements on a chart.
          That works well for most of our use cases, but there are situations
          where we don't know in advance what elements we'll need.
        </p>
        <p>
          In this example there's a button that lets us add additional points to
          an existing chart. In order to handle this smoothly, we let each point
          handle its own sound: when we cross a point we tell the it to play and
          the Point component itself spins up a Tone synth and triggers a note
          with a frequency based on its current y value. Each point connects to
          a shared panner to reinforce the x value, but likely in a production
          setting each point would manage its own panner too.
        </p>
        <PointsChart />
      </div>
      <div className="experiment-container">
        <h2 id="x-vs-y-direction">Time: X vs Y Direction</h2>
        <p>
          To this point we've been taking for granted that the x-axis is
          represented as time and the y-axis is represented as pitch. This is
          useful for horizontal and diagonal lines, but it doesn't do much for
          vertical lines.
        </p>
        <p>
          In this example the user has the option: play left-to-right or
          bottom-to-top.
        </p>
        <XYDirectionChart />
      </div>
      <div className="experiment-container">
        <h2 id="speech-synthesis">Speech Synthesis</h2>
        <p>
          Modern browsers support the{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API">
            Web Speech API
          </a>{" "}
          which can be used to generate spoken text. Unfortunately dispatching
          "utterances" (as they're called) has a significant lag which makes the
          API difficult to use in this kind of time sensitive system. Safari
          seems to cache generated speech which is useful on subsequent listens,
          but is still problematic on the initial listen. We can speed things up
          with pre-recorded audio, but we exchange speed for flexibility and
          support for{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang">
            internationalization
          </a>
          .
        </p>
        <p>
          In this example we pause for speech at the start and end of the line
          and when the line crosses the x- or y-axis.
        </p>
        <SpeechSynthChart />
      </div>

      <div className="text-card">
        <h2 id="conclusion">Conclusion</h2>
        <p>
          For the most part, this is all pretty straight-forward to implement.
          The bulk of the code in each file is handling play state (which could
          be abstracted into a hook) and doing sound design in Tone (which could
          could be abstracted into generators). There was also some complexity
          in meshing the declarative nature of React and Mafs with the
          imperative style of Tone - which the Web Audio API itself is also very
          imperative.
        </p>
        <p>As mentioned, I see two opportunities for improvement:</p>
        <ol>
          <li>
            Replacing setTimeout with something like requestAnimationFrame.
            setTimeout puts the callback on the queue, so the <i>soonest</i> the
            next frame will play is the given timeout. With
            requestAnimationFrame we could run the callback much more frequently
            and "tween" between frames.
          </li>
          <li>
            When playing lines, rather than playing a short note each frame we
            could play one long note for the full duration of the line and
            modulate the pitch of the note as the line moves through y-axis.
            This would require some extra math, but would hopefully be less
            resource intensive.
          </li>
        </ol>
        <p>
          Both Mafs (
          <a href="https://bundlephobia.com/package/mafs@0.18.8">93.9kB</a>) and
          Tone (
          <a href="https://bundlephobia.com/package/tone@15.0.4">78.4kB</a>) are
          optional: charts could be done with SVG and audio could be done with
          the Web Audio API. However I think they both pull their weight: Mafs
          makes charting a breeze and Tone's built-in instruments abstract away
          most of the low-level audio programming.
        </p>
        <p>
          I don't know who actually got this far, but thanks for reading! Hope
          it helps!
        </p>
      </div>
    </div>
  );
}
