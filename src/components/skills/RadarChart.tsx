"use client";

import { useId } from "react";
import type { Skill } from "@/lib/data/skills";

const VIEWBOX_WIDTH = 360;
const VIEWBOX_HEIGHT = 330;
const CENTER_X = VIEWBOX_WIDTH / 2;
const CENTER_Y = 158;
const RADIUS = 102;
const LEVELS = 5;

export function RadarChart({ skills }: { skills: Skill[] }) {
  const gradientId = useId().replace(/:/g, "");
  const angleStep = (Math.PI * 2) / Math.max(skills.length, 1);

  const axes = skills.map((skill, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = RADIUS + 30;
    const x = CENTER_X + RADIUS * Math.cos(angle);
    const y = CENTER_Y + RADIUS * Math.sin(angle);
    const labelX = CENTER_X + labelRadius * Math.cos(angle);
    const labelY = CENTER_Y + labelRadius * Math.sin(angle);
    const lines =
      skill.name.length > 10 && skill.name.includes(" ")
        ? skill.name.split(" ")
        : [skill.name];

    return { skill, angle, x, y, labelX, labelY, lines };
  });

  const dataPoints = axes.map((axis) => {
    const ratio = Math.min(Math.max(axis.skill.level, 1), LEVELS) / LEVELS;
    const x = CENTER_X + RADIUS * ratio * Math.cos(axis.angle);
    const y = CENTER_Y + RADIUS * ratio * Math.sin(axis.angle);
    return `${x},${y}`;
  });

  const gridPolygons = Array.from({ length: LEVELS }, (_, levelIndex) => {
    const ratio = (levelIndex + 1) / LEVELS;
    return axes
      .map(
        (axis) =>
          `${CENTER_X + RADIUS * ratio * Math.cos(axis.angle)},${
            CENTER_Y + RADIUS * ratio * Math.sin(axis.angle)
          }`
      )
      .join(" ");
  });

  const textAnchor = (x: number) => {
    if (Math.abs(x - CENTER_X) < 4) return "middle";
    return x > CENTER_X ? "start" : "end";
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Radar kompetensi inti"
        className="mx-auto h-auto w-full max-w-[370px]"
      >
        <title>Radar kompetensi inti</title>
        <desc>
          Visualisasi tingkat penguasaan {skills.length} kompetensi inti dengan
          skala 1 sampai 5.
        </desc>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-accent))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {gridPolygons.map((points, index) => (
          <polygon
            key={points}
            points={points}
            className="fill-none stroke-border"
            strokeWidth={index === LEVELS - 1 ? 1.4 : 1}
          />
        ))}

        {axes.map((axis) => (
          <line
            key={`axis-${axis.skill._id}`}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={axis.x}
            y2={axis.y}
            className="stroke-border"
            strokeWidth="1"
          />
        ))}

        <polygon
          points={dataPoints.join(" ")}
          fill={`url(#${gradientId})`}
          className="stroke-accent"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {axes.map((axis) => {
          const ratio = Math.min(Math.max(axis.skill.level, 1), LEVELS) / LEVELS;
          const pointX = CENTER_X + RADIUS * ratio * Math.cos(axis.angle);
          const pointY = CENTER_Y + RADIUS * ratio * Math.sin(axis.angle);

          return (
            <circle
              key={`point-${axis.skill._id}`}
              cx={pointX}
              cy={pointY}
              r="3.6"
              className="fill-accent stroke-card"
              strokeWidth="2"
            />
          );
        })}

        {axes.map((axis) => {
          const startY = axis.labelY - ((axis.lines.length - 1) * 12) / 2;

          return (
            <text
              key={`label-${axis.skill._id}`}
              x={axis.labelX}
              y={startY}
              textAnchor={textAnchor(axis.labelX)}
              className="fill-muted-foreground text-[10.5px] font-medium"
            >
              {axis.lines.map((line, index) => (
                <tspan
                  key={line}
                  x={axis.labelX}
                  y={startY + index * 12}
                >
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}

        <text
          x={CENTER_X}
          y={VIEWBOX_HEIGHT - 6}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] uppercase tracking-[0.18em]"
        >
          Skala 1–5
        </text>
      </svg>

      <table className="sr-only">
        <caption>Data kompetensi inti</caption>
        <thead>
          <tr>
            <th scope="col">Kompetensi</th>
            <th scope="col">Level</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill._id}>
              <th scope="row">{skill.name}</th>
              <td>{skill.level} dari {LEVELS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
