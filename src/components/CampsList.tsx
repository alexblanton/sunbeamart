"use client";

import Link from "next/link";
import { useState } from "react";

export type CampCard = {
  id: string;
  name: string;
  kind: string;
  season: string;
  where: string;
  dates: string;
  time: string;
  ages: string;
  price: string;
  blurb: string;
  image: string;
  imagePos: string;
  spotsLeft: number;
};

const filters = [
  ["all", "All"],
  ["summer", "Summer camps"],
  ["fall", "Fall"],
  ["multi", "Multi-week programs"],
] as const;

export function CampsList({ camps }: { camps: CampCard[] }) {
  const [filter, setFilter] = useState<string>("all");
  const shown = camps.filter(
    (c) =>
      filter === "all" ||
      (filter === "summer" && c.season === "Summer") ||
      (filter === "fall" && c.season === "Fall") ||
      (filter === "multi" && c.kind === "Multi-week program"),
  );
  return (
    <>
      <div className="filters" role="group" aria-label="Filter camps">
        {filters.map(([id, label]) => (
          <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid-camps" style={{ marginTop: 32 }}>
        {shown.map((c) => (
          <article className="card" key={c.id}>
            <div style={{ position: "relative", height: 220 }}>
              <img src={c.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.imagePos }} />
              <span className="tag" style={{ position: "absolute", top: 14, left: 14 }}>{c.season}</span>
            </div>
            <div className="body" style={{ gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 26 }}>{c.name}</h2>
                <p className="muted" style={{ fontSize: 15 }}>{c.blurb}</p>
              </div>
              <dl className="facts">
                <div><dt>Dates</dt><dd>{c.dates}</dd></div>
                <div><dt>Time</dt><dd>{c.time}</dd></div>
                <div><dt>Where</dt><dd>{c.where}</dd></div>
                <div><dt>Ages</dt><dd>{c.ages}</dd></div>
              </dl>
              <div className="price-row">
                <div>
                  <div className="price">{c.price}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.spotsLeft ? "var(--sage)" : "#8a3a22" }}>
                    {c.spotsLeft ? `${c.spotsLeft} spots left` : "Full"}
                  </div>
                </div>
                {c.spotsLeft ? (
                  <Link href={`/register?camp=${c.id}`} className="btn">Register</Link>
                ) : (
                  <Link href="/contact" className="btn outline">Join waitlist</Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {shown.length === 0 && <p className="muted" style={{ marginTop: 32 }}>Nothing matches that filter yet.</p>}
    </>
  );
}
