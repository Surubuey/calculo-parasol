import { useMemo } from "react";
import SunCalc from "suncalc3";

const LAT = -34.9053128;
const LNG = -56.1505879;

export default function YearTable({ stepX = 3.5, stepY = 0.5 }) {
  const cells = useMemo(() => {
    const cells = [];
    for (let hour = 0; hour < 24; hour += stepY) {
      const row = [];
      if (hour > 5 && hour < 20.5) {
        for (let dayOfYear = 0; dayOfYear < 365; dayOfYear += stepX) {
          const date = new Date();
          date.setMonth(0);
          date.setDate(Math.round(dayOfYear) + 1);
          date.setHours(Math.floor(hour));
          date.setMinutes((hour % 1) * 60);
          const sunPosition = SunCalc.getPosition(date, LAT, LNG);
          row.push({
            date,
            az: (sunPosition.azimuth * 180) / Math.PI,
            alt: (sunPosition.altitude * 180) / Math.PI,
          });
        }
        cells.push(row);
      }
    }
    return cells;
  }, [stepX, stepY]);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      {/* <thead>
        <tr>
          <th />
          {cells[0].map((cell, index) => (
            <th key={index} style={{ padding: 10, textAlign: "center" }}>
              {cell.date.getDate()}/{cell.date.getMonth() + 1}{" "}
            </th>
          ))}
        </tr>
      </thead> */}
      <tbody>
        {cells.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {/* <th style={{ textAlign: "right" }}>
              {row[0].date.getHours()}:
              {("0" + row[0].date.getMinutes()).slice(-2)}
            </th> */}
            {row.map((cell, cellIndex) => (
              <Cell key={cellIndex} {...cell} stepX={stepX} stepY={stepY} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cell(cell) {
  const hue = Math.max(0, Math.min(360, 270 - Math.max(0, cell.alt) * 4));
  const sat = 100 + (50 * cell.alt) / 90 + 50;
  const lum = (50 * cell.alt) / 90;
  const backgroundColor = `hsl(${hue}deg ${sat}% ${lum}%)`; // hsl(0deg 100% 50%)

  return (
    <td
      style={{
        padding: 0,
        // border: "1px solid #888",
        textAlign: "center",
        backgroundColor,
      }}
      title={cell.date.toLocaleString("es-UY", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "America/Montevideo",
      })}
    >
      <div
        style={{
          minWidth: `calc(100vw * ${cell.stepX} / 365)`,
          minHeight: `calc(100vh * ${cell.stepY} / 24)`,
        }}
      />
      {/* {cell.alt >= 0 ? `${cell.alt.toFixed(2)}°` : "-"} */}
      {/* {cell.alt >= 0
    ? `${cell.az.toFixed(2)}°\n${cell.alt.toFixed(2)}°`
    : "-"} */}
    </td>
  );
}
