import { useMemo } from "react";
import SunCalc from "suncalc3";

const LAT = -34.9053128;
const LNG = -56.1505879;

export default function YearTable({
  stepX = 3.5,
  stepY = 0.5,
  normal = { az: 0, alt: Math.HALF_PI },
  verticalDepth = 1,
  horizontalDepth = 1,
}) {
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
          const az = (sunPosition.azimuth * 180) / Math.PI;
          const alt = (sunPosition.altitude * 180) / Math.PI;
          const relativeAzRadians =
            sunPosition.azimuth - (normal.az / 180) * Math.PI;
          const relativeAltRadians =
            sunPosition.altitude - (normal.alt / 180) * Math.PI;
          const relativeAz = az - normal.az;
          const relativeAlt = alt - normal.alt;
          const normalAltRadians = (normal.alt / 180) * Math.PI;
          // θu,v=cos−1[cos(El1)cos(El2)cos(Az1−Az2)+sin(El1)sin(El2)].
          const relAngle = Math.acos(
            Math.cos(normalAltRadians) *
              Math.cos(sunPosition.altitude) *
              Math.cos(relativeAzRadians) +
              Math.sin(normalAltRadians) * Math.sin(sunPosition.altitude)
          );
          const shadowHorizontalAlt =
            Math.tan(relAngle) < 0
              ? 1
              : Math.min(1, Math.tan(relAngle) * horizontalDepth);
          const shadowVerticalAlt = Math.tan(relativeAzRadians) * verticalDepth;
          row.push({
            date,
            az,
            alt,
            relativeAz,
            relativeAlt,
            shadowHorizontalAlt,
            shadowVerticalAlt,
            relAngle,
            relAngleGrad: (relAngle * 180) / Math.PI,
          });
        }
        cells.push(row);
      }
    }
    return cells;
  }, [stepX, stepY, normal, horizontalDepth, verticalDepth]);

  return (
    <>
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
    </>
  );
}

function Cell(cell) {
  const relAngle = 90 - cell.relAngleGrad;
  const hue = Math.max(0, Math.min(360, 270 - Math.max(0, relAngle) * 4));
  const sat = 100 + (50 * relAngle) / 90 + 50;
  const lum = (50 * relAngle) / 90;
  const backgroundColor =
    Math.abs(relAngle) < 90 && cell.alt > 0
      ? `hsl(${hue}deg ${sat}% ${lum}%)`
      : "black"; // hsl(0deg 100% 50%)

  return (
    <td
      style={{
        padding: 0,
        // border: "1px solid #888",
        textAlign: "center",
        backgroundColor,
        position: "relative",
      }}
      title={
        cell.date.toLocaleString("es-UY", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZone: "America/Montevideo",
        }) +
        ` ${cell.az.toFixed(2)}° ${cell.alt.toFixed(
          2
        )}° ${cell.relativeAz.toFixed(2)}° ${cell.relAngleGrad.toFixed(
          2
        )}° ${relAngle}`
      }
    >
      <div
        style={{
          minWidth: `calc(100vw * ${cell.stepX} / 365)`,
          minHeight: `calc(100vh * ${cell.stepY} / 24)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `calc(100vh * ${cell.stepY * cell.shadowHorizontalAlt} / 24)`,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `calc(100vh * ${cell.stepY * cell.shadowHorizontalAlt} / 24)`,
          left: cell.shadowVerticalAlt < 0 ? 0 : "auto",
          right: cell.shadowVerticalAlt > 0 ? 0 : "auto",
          width: `calc(100vh * ${
            cell.stepY * Math.abs(cell.shadowVerticalAlt)
          } / 24)`,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      />
      {/* {cell.alt >= 0 ? `${cell.alt.toFixed(2)}°` : "-"} */}
      {/* {cell.alt >= 0
    ? `${cell.az.toFixed(2)}°\n${cell.alt.toFixed(2)}°`
    : "-"} */}
    </td>
  );
}
