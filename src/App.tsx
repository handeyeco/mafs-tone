import BarChart from "./experiments/bar-chart";
import LineChart from "./experiments/line-chart";
import AxisChart from "./experiments/axis-chart";
import IntersectionChart from "./experiments/intersection-chart";
import PlotChart from "./experiments/plot-chart";
import SineChart from "./experiments/sine-chart";
import InteractiveChart from "./experiments/interactive-chart";
import "./App.css";

const experiments = [
  // BarChart,
  // LineChart,
  // AxisChart,
  // IntersectionChart,
  // PlotChart,
  // SineChart,
  InteractiveChart,
];

export default function App() {
  return (
    <>
      {experiments.map((ExpComp, i) => (
        <div className="experiment-container" key={i}>
          <ExpComp />
        </div>
      ))}
    </>
  );
}
