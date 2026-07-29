import type { Hike } from "@/lib/types";

export default function HikeTable({ hikes }: { hikes: Hike[] }) {
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th className="n">Dist</th>
            <th className="n">Ascent</th>
            <th className="n">Time</th>
            <th className="n">High</th>
          </tr>
        </thead>
        <tbody>
          {hikes.map((h) => (
            <tr key={h.href}>
              <td>
                <a className="hike" href={h.href} target="_blank" rel="noreferrer">
                  {h.name} ↗
                </a>
                <span className="hike-meta">
                  {h.when} · {h.grade}
                </span>
                {h.note && <span className="fine">{h.note}</span>}
              </td>
              <td className="n">{h.km}</td>
              <td className="n">{h.ascent}</td>
              <td className="n">{h.time}</td>
              <td className="n">{h.high}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
