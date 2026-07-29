import type { Pin } from "@/lib/types";

export default function PinTable({ pins }: { pins: Pin[] }) {
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            <th>Stop</th>
            <th>Where</th>
            <th className="n">Cost</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pins.map((pin, i) => (
            <tr key={i}>
              <td className="mono">{pin.when}</td>
              <td>
                {pin.what}
                {pin.sub && (
                  <>
                    <br />
                    <span className="fine">{pin.sub}</span>
                  </>
                )}
              </td>
              <td className="n">{pin.cost}</td>
              <td>
                <a className="go" href={pin.href} target="_blank" rel="noreferrer">
                  {pin.linkLabel}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
