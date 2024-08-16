import CircularSlider from "react-circular-slider-svg";
import YearTable from "./components/YearTable";
import { useMemo, useState } from "react";

function App() {
  const [normalAz, setNormalAz] = useState(45);
  const [normalAlt, setNormalAlt] = useState(0);
  const [verticalDepth, setVerticalDepth] = useState(0.6);
  const [horizontalDepth, setHorizontalDepth] = useState(0.6);

  const normal = useMemo(() => {
    return {
      az: normalAz, // (normalAz * Math.PI) / 180,
      alt: normalAlt, // ((normalAlt) * Math.PI) / 180,
    };
  }, [normalAz, normalAlt]);

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <label
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {Math.round(normalAz)}°
          </label>
          <CircularSlider
            size={200}
            trackWidth={4}
            minValue={-180}
            maxValue={180}
            startAngle={0}
            endAngle={360}
            angleType={{
              direction: "cw",
              axis: "-y",
            }}
            handle1={{
              value: normalAz,
              onChange: (v) => setNormalAz(v),
            }}
            arcColor="lime"
            arcBackgroundColor="lime"
          />
        </div>
        <div style={{ position: "relative" }}>
          <label
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {Math.round(normalAlt)}°
          </label>
          <CircularSlider
            size={200}
            trackWidth={4}
            minValue={0}
            maxValue={180}
            startAngle={90}
            endAngle={270}
            angleType={{
              direction: "ccw",
              axis: "-y",
            }}
            handle1={{
              value: normalAlt,
              onChange: (v) => setNormalAlt(v),
            }}
            arcColor="lime"
            arcBackgroundColor="lime"
          />
        </div>
        <div>
          <label>Vert: {parseFloat(verticalDepth).toFixed(3)}</label>
          <input
            type="range"
            min={0}
            step={0.1}
            max={3}
            value={verticalDepth}
            onChange={(e) => setVerticalDepth(e.target.value)}
          />
        </div>
        <div>
          <label>Hor: {parseFloat(horizontalDepth).toFixed(3)}</label>
          <input
            type="range"
            min={0}
            step={0.1}
            max={3}
            value={horizontalDepth}
            onChange={(e) => setHorizontalDepth(e.target.value)}
          />
        </div>
      </div>

      <YearTable
        normal={normal}
        stepX={7}
        stepY={0.5}
        verticalDepth={verticalDepth}
        horizontalDepth={horizontalDepth}
      />
    </div>
  );
}

export default App;
