'use client'

import { useState, useEffect } from 'react'

export function WalkingCat() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <>
      <style>{`
        @keyframes walk-across {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes leg-walk {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes tail-sway {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes body-bob {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          75% { transform: translateY(-3px); }
        }
        .cat-container {
          /* Animation runs once per page load - forwards keeps the cat off-screen after completion */
          animation: walk-across 12s linear forwards;
        }
        .cat-body {
          animation: body-bob 0.4s ease-in-out infinite;
        }
        .front-leg-left {
          animation: leg-walk 0.4s ease-in-out infinite;
          transform-origin: top center;
        }
        .front-leg-right {
          animation: leg-walk 0.4s ease-in-out infinite 0.2s;
          transform-origin: top center;
        }
        .back-leg-left {
          animation: leg-walk 0.4s ease-in-out infinite 0.1s;
          transform-origin: top center;
        }
        .back-leg-right {
          animation: leg-walk 0.4s ease-in-out infinite 0.3s;
          transform-origin: top center;
        }
        .cat-tail {
          animation: tail-sway 0.8s ease-in-out infinite;
          transform-origin: bottom left;
        }
      `}</style>
      <div
        className="fixed bottom-0 left-0 pointer-events-none z-40"
        style={{ width: '50vw', height: '50vh' }}
      >
        <div className="cat-container w-full h-full">
          <svg
            viewBox="0 0 200 150"
            className="w-full h-full cat-body"
            style={{ maxHeight: '50vh' }}
          >
            {/* Tabby cat - orange with darker stripes */}

            {/* Tail */}
            <g className="cat-tail">
              <path
                d="M25 85 Q5 70 15 50 Q20 45 25 55 Q30 75 35 80"
                fill="#E87C24"
                stroke="#C66A1E"
                strokeWidth="1"
              />
              {/* Tail stripes */}
              <path d="M18 60 Q22 58 24 65" stroke="#8B4513" strokeWidth="2" fill="none" />
              <path d="M15 52 Q20 50 22 58" stroke="#8B4513" strokeWidth="2" fill="none" />
            </g>

            {/* Back legs */}
            <g className="back-leg-left">
              <rect x="45" y="95" width="14" height="35" rx="5" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />
              <ellipse cx="52" cy="130" rx="8" ry="5" fill="#F4A460" />
            </g>
            <g className="back-leg-right">
              <rect x="60" y="95" width="14" height="35" rx="5" fill="#D97020" stroke="#C66A1E" strokeWidth="1" />
              <ellipse cx="67" cy="130" rx="8" ry="5" fill="#DEB887" />
            </g>

            {/* Body - chubby oval */}
            <ellipse cx="95" cy="80" rx="55" ry="35" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />

            {/* Body stripes */}
            <path d="M60 65 Q70 60 75 75" stroke="#8B4513" strokeWidth="3" fill="none" />
            <path d="M80 55 Q90 50 95 65" stroke="#8B4513" strokeWidth="3" fill="none" />
            <path d="M100 55 Q110 50 115 65" stroke="#8B4513" strokeWidth="3" fill="none" />
            <path d="M120 60 Q130 55 135 70" stroke="#8B4513" strokeWidth="3" fill="none" />

            {/* White belly */}
            <ellipse cx="95" cy="95" rx="40" ry="18" fill="#FFF8DC" opacity="0.9" />

            {/* Front legs */}
            <g className="front-leg-left">
              <rect x="120" y="95" width="14" height="35" rx="5" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />
              <ellipse cx="127" cy="130" rx="8" ry="5" fill="#F4A460" />
            </g>
            <g className="front-leg-right">
              <rect x="135" y="95" width="14" height="35" rx="5" fill="#D97020" stroke="#C66A1E" strokeWidth="1" />
              <ellipse cx="142" cy="130" rx="8" ry="5" fill="#DEB887" />
            </g>

            {/* Head */}
            <circle cx="160" cy="60" r="30" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />

            {/* Head stripes */}
            <path d="M145 45 Q155 40 160 50" stroke="#8B4513" strokeWidth="2.5" fill="none" />
            <path d="M155 38 Q165 33 170 43" stroke="#8B4513" strokeWidth="2.5" fill="none" />

            {/* Ears */}
            <polygon points="138,35 145,55 130,50" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />
            <polygon points="140,40 145,52 133,48" fill="#FFB6C1" />
            <polygon points="182,35 175,55 190,50" fill="#E87C24" stroke="#C66A1E" strokeWidth="1" />
            <polygon points="180,40 175,52 187,48" fill="#FFB6C1" />

            {/* Face */}
            {/* White muzzle */}
            <ellipse cx="170" cy="70" rx="15" ry="12" fill="#FFF8DC" />

            {/* Eyes */}
            <ellipse cx="152" cy="55" rx="6" ry="7" fill="#90EE90" />
            <ellipse cx="152" cy="55" rx="3" ry="5" fill="#000" />
            <circle cx="150" cy="53" r="1.5" fill="#FFF" />

            <ellipse cx="175" cy="55" rx="6" ry="7" fill="#90EE90" />
            <ellipse cx="175" cy="55" rx="3" ry="5" fill="#000" />
            <circle cx="173" cy="53" r="1.5" fill="#FFF" />

            {/* Nose */}
            <polygon points="165,65 168,70 162,70" fill="#FFB6C1" />

            {/* Mouth */}
            <path d="M165 70 Q165 75 160 78" stroke="#8B4513" strokeWidth="1.5" fill="none" />
            <path d="M165 70 Q165 75 170 78" stroke="#8B4513" strokeWidth="1.5" fill="none" />

            {/* Whiskers */}
            <line x1="145" y1="68" x2="125" y2="63" stroke="#333" strokeWidth="1" />
            <line x1="145" y1="72" x2="125" y2="72" stroke="#333" strokeWidth="1" />
            <line x1="145" y1="76" x2="125" y2="81" stroke="#333" strokeWidth="1" />
            <line x1="185" y1="68" x2="200" y2="63" stroke="#333" strokeWidth="1" />
            <line x1="185" y1="72" x2="200" y2="72" stroke="#333" strokeWidth="1" />
            <line x1="185" y1="76" x2="200" y2="81" stroke="#333" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </>
  )
}
