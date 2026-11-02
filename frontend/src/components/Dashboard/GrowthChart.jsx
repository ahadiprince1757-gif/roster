import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { ageAtDate, formatNumber } from '../../utils/calculations';
import { getExpectedWeightForDay } from '../../data/standardGrowth';

const GrowthChart = ({ height = 240 }) => {
  const { farmData, theme } = useFarm();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const rawWeights = [...farmData.weights].sort((a, b) => a.date.localeCompare(b.date));

  if (!rawWeights.length) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.85rem',
        }}
      >
        No weight records yet. Add a flock sample to plot growth curve.
      </div>
    );
  }

  const breedKey = farmData.batch.breed || 'Cobb 500';

  const dataPoints = rawWeights.map((w) => {
    const day = farmData.batch.date ? ageAtDate(w.date, farmData.batch.date) || 1 : 1;
    const standardWeight = getExpectedWeightForDay(breedKey, day);
    return {
      ...w,
      day,
      standardWeight,
      diff: w.avg - standardWeight,
      diffPercent: ((w.avg - standardWeight) / standardWeight) * 100,
    };
  });

  const maxDay = Math.max(42, ...dataPoints.map((d) => d.day));
  const maxWeightVal = Math.max(3000, ...dataPoints.map((d) => Math.max(d.avg, d.standardWeight))) * 1.1;

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const svgWidth = 650;
  const svgHeight = height;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (day) => paddingLeft + (day / maxDay) * chartWidth;
  const getY = (weight) => paddingTop + chartHeight - (weight / maxWeightVal) * chartHeight;

  // Standard benchmark curve
  const standardSteps = [0, 7, 14, 21, 28, 35, 42].filter((d) => d <= maxDay);
  if (!standardSteps.includes(maxDay)) standardSteps.push(maxDay);
  const standardPath = standardSteps
    .map((day, idx) => {
      const x = getX(day);
      const y = getY(getExpectedWeightForDay(breedKey, day));
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Actual curve
  const actualPath = dataPoints
    .map((p, idx) => {
      const x = getX(p.day);
      const y = getY(p.avg);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Area fill
  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];
  const areaPath = `
    ${actualPath}
    L ${getX(lastPoint.day)} ${paddingTop + chartHeight}
    L ${getX(firstPoint.day)} ${paddingTop + chartHeight}
    Z
  `;

  const yTicks = [500, 1500, 2500];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Minimal Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)' }}></span>
          <span>Flock Average</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '1px', background: 'var(--text-tertiary)' }}></span>
          <span>{breedKey} Target</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="appleAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-primary)" stopOpacity={theme === 'dark' ? 0.15 : 0.05} />
            <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Quiet Dotted Y-Ticks */}
        {yTicks.map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={svgWidth - paddingRight}
                y2={y}
                stroke="var(--border-hairline)"
                strokeDasharray="2 3"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fill="var(--text-tertiary)"
                fontFamily="inherit"
              >
                {val}g
              </text>
            </g>
          );
        })}

        {/* Standard Target Line */}
        <path
          d={standardPath}
          fill="none"
          stroke="var(--text-tertiary)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />

        {/* Area */}
        <path d={areaPath} fill="url(#appleAreaGrad)" />

        {/* Actual Line */}
        <path
          d={actualPath}
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((point) => {
          const cx = getX(point.day);
          const cy = getY(point.avg);
          const isHovered = hoveredPoint?.id === point.id;

          return (
            <g
              key={point.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 3.5}
                fill="var(--bg-surface)"
                stroke="var(--text-primary)"
                strokeWidth="2"
                style={{ transition: 'r 0.1s ease' }}
              />
              <text
                x={cx}
                y={svgHeight - 10}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill="var(--text-tertiary)"
                fontFamily="inherit"
              >
                D{point.day}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(getX(hoveredPoint.day) / svgWidth) * 100}%`,
            top: `${(getY(hoveredPoint.avg) / svgHeight) * 100}%`,
            transform: 'translate(-50%, -125%)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            boxShadow: 'var(--shadow-float)',
            fontSize: '0.78rem',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 600 }}>Day {hoveredPoint.day}: {formatNumber(hoveredPoint.avg)}g</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
            Target: {formatNumber(hoveredPoint.standardWeight)}g ({hoveredPoint.diff >= 0 ? '+' : ''}{formatNumber(hoveredPoint.diffPercent, 1)}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthChart;
