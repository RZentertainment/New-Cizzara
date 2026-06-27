'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const SERVICES = [
  "VIDEO\nPRODUCTION",
  "PHOTOGRAPHY",
  "SOUND &\nMUSIC\nPRODUCTION",
  "FILM\nPROMOTIONS &\nDISTRIBUTION",
  "BRANDING &\nCREATIVE\nDESIGN",
  "DIGITAL &\nSOCIAL MEDIA\nMARKETING",
  "WEBSITE\nDEVELOPMENT",
  "POST\nPRODUCTION\nSERVICES",
] as const;

const CENTER_IMAGE_URL =
  "https://cdn.cizzara.com/Cizzara-Latest/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2002_23_58%20PM.png";

// SVG coordinate system
const VIEWBOX           = 1000;
const CX                = VIEWBOX / 2;
const CY                = VIEWBOX / 2;
const OUTER_RADIUS      = 420;   // main ring outer edge
const INNER_RADIUS      = 195;   // center circle edge
const CENTER_RADIUS     = 188;   // center image clip
const ANGLE_STEP        = 360 / SERVICES.length; // 45°

// Outer label ring
const LABEL_RING_OUTER  = 492;
const LABEL_RING_INNER  = OUTER_RADIUS + 6;
const LABEL_TEXT_RADIUS = (LABEL_RING_OUTER + LABEL_RING_INNER) / 2;
const LABEL_TEXT        = "WHAT CIZZARA STUDIOS OFFERS";

// Tick ring just inside the label band
const TICK_RADIUS       = LABEL_RING_INNER - 10;
const TICK_COUNT        = 72; // one every 5°

// Text style
const FONT_SIZE         = 22;
const LINE_HEIGHT       = 28;
const FONT_FAMILY       = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const LETTER_SPACING    = "0.12em";

// Cinematic palette
const GOLD              = "#C8A96A";
const GOLD_LIGHT        = "#E2C98A";
const COPPER            = "#A7773F";
const RING_DARK         = "#0D0D0D";
const DIVIDER_COLOR     = "#C8A96A";
const TEXT_COLOR        = "#E8D5A3";
const DIVIDER_WIDTH     = 1.5;
const ROTATION_DURATION = 80;

// ─── Helper ───────────────────────────────────────────────────────────────────
function arcPath(
  cx: number, cy: number, r: number,
  startAngleDeg: number, endAngleDeg: number
): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(startAngleDeg));
  const sy = cy + r * Math.sin(toRad(startAngleDeg));
  const ex = cx + r * Math.cos(toRad(endAngleDeg));
  const ey = cy + r * Math.sin(toRad(endAngleDeg));
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ─── Component ────────────────────────────────────────────────────────────────
const ServiceRotation: React.FC = () => {

  const segments = useMemo(() =>
    SERVICES.map((label, i) => {
      const startAngle = i * ANGLE_STEP;
      const endAngle   = startAngle + ANGLE_STEP;
      const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
      const lx1 = CX + INNER_RADIUS * Math.cos(toRad(startAngle));
      const ly1 = CY + INNER_RADIUS * Math.sin(toRad(startAngle));
      const lx2 = CX + OUTER_RADIUS * Math.cos(toRad(startAngle));
      const ly2 = CY + OUTER_RADIUS * Math.sin(toRad(startAngle));
      const lines = label.split('\n');
      return { i, startAngle, endAngle, lx1, ly1, lx2, ly2, lines };
    }),
  []);

  // Tick marks for the precision ring
  const ticks = useMemo(() =>
    Array.from({ length: TICK_COUNT }, (_, i) => {
      const angle = (i * 360) / TICK_COUNT;
      const isMajor = i % 9 === 0; // every 45° = segment boundary
      const innerR = isMajor ? TICK_RADIUS - 14 : TICK_RADIUS - 7;
      const outerR = TICK_RADIUS;
      const p1 = polarToXY(CX, CY, innerR, angle);
      const p2 = polarToXY(CX, CY, outerR, angle);
      return { p1, p2, isMajor };
    }),
  []);

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: 'min(700px, 100vw)', aspectRatio: '1 / 1' }}
    >

      {/* ══ STATIC OUTER LABEL RING ══ */}
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        width="100%" height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Gold radial gradient for label band */}
          <radialGradient id="label-band-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#1C1812" />
            <stop offset="100%" stopColor="#0A0906" />
          </radialGradient>

          {/* Gold shimmer linear gradient for text */}
          <linearGradient id="gold-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={COPPER}     />
            <stop offset="40%"  stopColor={GOLD_LIGHT} />
            <stop offset="60%"  stopColor={GOLD}       />
            <stop offset="100%" stopColor={COPPER}     />
          </linearGradient>

          {/* Outer glow filter */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Label arc paths */}
          <path id="label-arc-top"    d={arcPath(CX, CY, LABEL_TEXT_RADIUS, -152, 152)} fill="none" />
          <path id="label-arc-bottom" d={arcPath(CX, CY, LABEL_TEXT_RADIUS, 205, 335)}  fill="none" />
        </defs>

        {/* Label band — evenodd donut (interior stays transparent) */}
        <path
          fillRule="evenodd"
          fill="url(#label-band-grad)"
          d={[
            `M ${CX - LABEL_RING_OUTER} ${CY}`,
            `A ${LABEL_RING_OUTER} ${LABEL_RING_OUTER} 0 1 1 ${CX + LABEL_RING_OUTER} ${CY}`,
            `A ${LABEL_RING_OUTER} ${LABEL_RING_OUTER} 0 1 1 ${CX - LABEL_RING_OUTER} ${CY}`,
            `M ${CX - LABEL_RING_INNER} ${CY}`,
            `A ${LABEL_RING_INNER} ${LABEL_RING_INNER} 0 1 0 ${CX + LABEL_RING_INNER} ${CY}`,
            `A ${LABEL_RING_INNER} ${LABEL_RING_INNER} 0 1 0 ${CX - LABEL_RING_INNER} ${CY}`,
          ].join(' ')}
        />

        {/* Outer gold border */}
        <circle cx={CX} cy={CY} r={LABEL_RING_OUTER} fill="none" stroke={GOLD} strokeWidth={1.2} opacity={0.7} />
        {/* Inner gold border */}
        <circle cx={CX} cy={CY} r={LABEL_RING_INNER} fill="none" stroke={GOLD} strokeWidth={1.2} opacity={0.5} />

        {/* Arched label — "WHAT CIZZARA STUDIOS OFFERS" */}
        <text
          fill="#ffffff"
          fontSize={20}
          fontFamily={FONT_FAMILY}
          fontWeight={600}
          letterSpacing="0.28em"
          textAnchor="middle"
        >
          <textPath href="#label-arc-top" startOffset="50%">
            {LABEL_TEXT}
          </textPath>
        </text>

        {/* Bottom arc — diamond separators */}
        <text
          fill={GOLD}
          fontSize={14}
          fontFamily="serif"
          fontWeight={400}
          letterSpacing="0.7em"
          textAnchor="middle"
          opacity={0.5}
        >
          <textPath href="#label-arc-bottom" startOffset="50%">
            ◆ · · · · · · · · · · · · ◆
          </textPath>
        </text>
      </svg>

      {/* ══ ROTATING WHEEL ══ */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: ROTATION_DURATION, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          width="100%" height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Matte dark gunmetal ring fill */}
            <radialGradient id="ring-grad" cx="50%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#1A1A1A" />
              <stop offset="60%"  stopColor="#111111" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>

            {/* Brushed metallic highlight sweep */}
            <linearGradient id="metal-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="rgba(200,169,106,0)"   />
              <stop offset="30%"  stopColor="rgba(200,169,106,0.06)"/>
              <stop offset="50%"  stopColor="rgba(200,169,106,0.12)"/>
              <stop offset="70%"  stopColor="rgba(200,169,106,0.06)"/>
              <stop offset="100%" stopColor="rgba(200,169,106,0)"   />
            </linearGradient>

            {/* Inner ring accent gradient */}
            <radialGradient id="inner-ring-grad" cx="50%" cy="50%" r="50%">
              <stop offset="80%"  stopColor="#0A0A0A" />
              <stop offset="100%" stopColor="#1A1508" />
            </radialGradient>

            {/* Gold glow filter for dividers */}
            <filter id="divider-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Segment text paths */}
            {segments.map(({ i, startAngle, endAngle }) => {
              const bandHeight = OUTER_RADIUS - INNER_RADIUS;
              const lines = SERVICES[i].split('\n');
              const totalLines = lines.length;
              return lines.map((_, li) => {
                const lineSpacing  = LINE_HEIGHT;
                const totalTextH   = totalLines * lineSpacing;
                const startOffset  = (bandHeight - totalTextH) / 2 + lineSpacing / 2;
                const radialOffset = startOffset + li * lineSpacing;
                const lineRadius   = OUTER_RADIUS - radialOffset;
                const linePath     = arcPath(CX, CY, lineRadius, startAngle + 3, endAngle - 3);
                return (
                  <path key={`p-${i}-${li}`} id={`arc-${i}-l${li}`} d={linePath} fill="none" />
                );
              });
            })}

            {/* Aperture notch clip — subtle chamfered edges on dividers */}
            <marker id="gold-dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
              <circle cx="2" cy="2" r="1.5" fill={GOLD} opacity="0.8" />
            </marker>
          </defs>

          {/* ── Main ring body ── */}
          <circle cx={CX} cy={CY} r={OUTER_RADIUS} fill="url(#ring-grad)" />

          {/* ── Brushed metal overlay ── */}
          <circle cx={CX} cy={CY} r={OUTER_RADIUS} fill="url(#metal-sweep)" />

          {/* ── Precision tick marks ── */}
          {ticks.map(({ p1, p2, isMajor }, ti) => (
            <line
              key={`tick-${ti}`}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={GOLD}
              strokeWidth={isMajor ? 1.2 : 0.6}
              opacity={isMajor ? 0.6 : 0.25}
            />
          ))}

          {/* ── Outer precision ring lines ── */}
          <circle cx={CX} cy={CY} r={OUTER_RADIUS}       fill="none" stroke={GOLD}   strokeWidth={1.5} opacity={0.8} />
          <circle cx={CX} cy={CY} r={OUTER_RADIUS - 18}  fill="none" stroke={GOLD}   strokeWidth={0.5} opacity={0.25} />
          <circle cx={CX} cy={CY} r={TICK_RADIUS - 18}   fill="none" stroke={COPPER} strokeWidth={0.4} opacity={0.3} />

          {/* ── Punch out center hole ── */}
          <circle cx={CX} cy={CY} r={INNER_RADIUS} fill="url(#inner-ring-grad)" />

          {/* ── Gold divider lines (aperture blades) ── */}
          {segments.map(({ i, lx1, ly1, lx2, ly2 }) => (
            <g key={`div-${i}`}>
              {/* Glow layer */}
              <line
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                stroke={GOLD} strokeWidth={3}
                opacity={0.15}
                filter="url(#divider-glow)"
              />
              {/* Sharp line */}
              <line
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                stroke={GOLD} strokeWidth={DIVIDER_WIDTH}
                opacity={0.7}
              />
              {/* Gold dot at inner junction */}
              <circle
                cx={lx1} cy={ly1}
                r={4} fill={GOLD} opacity={0.6}
              />
            </g>
          ))}

          {/* ── Inner ring accent border ── */}
          <circle cx={CX} cy={CY} r={INNER_RADIUS}      fill="none" stroke={GOLD}   strokeWidth={1.5} opacity={0.8} />
          <circle cx={CX} cy={CY} r={INNER_RADIUS + 12} fill="none" stroke={COPPER} strokeWidth={0.5} opacity={0.3} />

          {/* ── Engraved segment text ── */}
          {segments.map(({ i, startAngle, endAngle, lines }) => {
            const bandHeight  = OUTER_RADIUS - INNER_RADIUS;
            const totalLines  = lines.length;
            const lineSpacing = LINE_HEIGHT;
            const totalTextH  = totalLines * lineSpacing;
            const startOff    = (bandHeight - totalTextH) / 2 + lineSpacing / 2;

            return lines.map((line, li) => (
              <React.Fragment key={`t-${i}-${li}`}>
                {/* Engraved shadow (dark, slightly offset inward) */}
                <text
                  fontSize={FONT_SIZE - 1}
                  fontFamily={FONT_FAMILY}
                  fontWeight={500}
                  letterSpacing={LETTER_SPACING}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(0,0,0,0.6)"
                >
                  <textPath href={`#arc-${i}-l${li}`} startOffset="50%">
                    {line}
                  </textPath>
                </text>
                {/* Gold engraved text */}
                <text
                  fontSize={FONT_SIZE}
                  fontFamily={FONT_FAMILY}
                  fontWeight={500}
                  letterSpacing={LETTER_SPACING}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={TEXT_COLOR}
                  opacity={0.92}
                >
                  <textPath href={`#arc-${i}-l${li}`} startOffset="50%">
                    {line}
                  </textPath>
                </text>
              </React.Fragment>
            ));
          })}
        </svg>
      </motion.div>

      {/* ══ STATIC CENTER IMAGE ══ */}
      <div
        className="absolute z-10 rounded-full overflow-hidden"
        style={{
          width:         `${(CENTER_RADIUS * 2 / VIEWBOX) * 100}%`,
          aspectRatio:   '1 / 1',
          border:        `2px solid ${GOLD}`,
          boxShadow:     `0 0 24px rgba(200,169,106,0.25), 0 0 60px rgba(200,169,106,0.1), inset 0 0 20px rgba(0,0,0,0.8)`,
          background:    '#050505',
          pointerEvents: 'none',
        }}
      >
        {/* Cinematic vignette overlay */}
        <div
          className="absolute inset-0 z-10 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <img
          src={CENTER_IMAGE_URL}
          alt="Cizzara Studio"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.88) contrast(1.1) saturate(0.85)' }}
        />
      </div>

    </div>
  );
};

export default ServiceRotation;