import React from 'react'

const TEMPLATES = [
  // Aurora — indigo to violet
  {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    circle1: 'rgba(255,255,255,0.10)',
    circle2: 'rgba(255,255,255,0.06)',
    dot: 'rgba(255,255,255,0.12)',
    textColor: '#ffffff',
    subColor: 'rgba(255,255,255,0.7)',
  },
  // Sunset — gold to coral
  {
    bg: 'linear-gradient(135deg, #f6d365 0%, #e8603c 100%)',
    circle1: 'rgba(255,255,255,0.14)',
    circle2: 'rgba(255,200,80,0.18)',
    dot: 'rgba(255,255,255,0.15)',
    textColor: '#fff8f0',
    subColor: 'rgba(255,255,255,0.75)',
  },
  // Cerulean — sky to deep ocean
  {
    bg: 'linear-gradient(135deg, #0093E9 0%, #0a5e8a 100%)',
    circle1: 'rgba(255,255,255,0.10)',
    circle2: 'rgba(0,200,220,0.15)',
    dot: 'rgba(255,255,255,0.12)',
    textColor: '#f0faff',
    subColor: 'rgba(255,255,255,0.7)',
  },
  // Forest — teal to emerald
  {
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    circle1: 'rgba(255,255,255,0.12)',
    circle2: 'rgba(0,0,0,0.07)',
    dot: 'rgba(255,255,255,0.14)',
    textColor: '#f0fff4',
    subColor: 'rgba(255,255,255,0.75)',
  },
  // Obsidian — deep navy to ink
  {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    circle1: 'rgba(99,102,241,0.20)',
    circle2: 'rgba(139,92,246,0.14)',
    dot: 'rgba(148,163,244,0.10)',
    textColor: '#e0e0ff',
    subColor: 'rgba(224,224,255,0.6)',
  },
] as const

function hashTitle(title: string): number {
  let h = 0
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(h)
}

export function GeneratedCover({
  title,
  className,
  style,
}: {
  title: string
  className?: string
  style?: React.CSSProperties
}) {
  const t = TEMPLATES[hashTitle(title) % TEMPLATES.length]

  return (
    <div
      className={className}
      style={{
        background: t.bg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '8% 7% 7%',
        aspectRatio: '1200 / 630',
        ...style,
      }}
    >
      {/* Large circle — top right */}
      <div
        style={{
          position: 'absolute',
          top: '-18%',
          right: '-10%',
          width: '58%',
          paddingBottom: '58%',
          borderRadius: '50%',
          background: t.circle1,
          pointerEvents: 'none',
        }}
      />
      {/* Small circle — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-16%',
          left: '-8%',
          width: '42%',
          paddingBottom: '42%',
          borderRadius: '50%',
          background: t.circle2,
          pointerEvents: 'none',
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${t.dot} 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
          pointerEvents: 'none',
        }}
      />
      {/* Title */}
      <div style={{ position: 'relative', zIndex: 1, width: '85%' }}>
        <p
          style={{
            color: t.textColor,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            fontSize: 'clamp(16px, 3.2vw, 30px)',
            fontWeight: 700,
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: '-0.01em',
            textShadow: '0 1px 4px rgba(0,0,0,0.18)',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </p>
      </div>
    </div>
  )
}
