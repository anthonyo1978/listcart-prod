'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { CartSearchBox } from '@/components/CartSearchBox'
import { useState, useEffect } from 'react'

const HERO_TEXT = 'Automate and monetise the listing process'
const FLIP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function FlipHero() {
  const [displayChars, setDisplayChars] = useState<string[]>(() =>
    Array.from(HERO_TEXT, (ch) =>
      ch === ' ' ? ' ' : FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)]
    )
  )
  const [settled, setSettled] = useState<boolean[]>(() =>
    Array.from(HERO_TEXT, () => false)
  )

  useEffect(() => {
    const totalLetters = HERO_TEXT.replace(/ /g, '').length
    const perLetterDelay = 40
    const flipsPerChar = 6
    const flipInterval = 50

    let letterIndex = 0
    const timeouts: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < HERO_TEXT.length; i++) {
      if (HERO_TEXT[i] === ' ') continue
      const delay = letterIndex * perLetterDelay
      const charIdx = i

      for (let f = 0; f < flipsPerChar; f++) {
        timeouts.push(
          setTimeout(() => {
            setDisplayChars((prev) => {
              const next = [...prev]
              next[charIdx] =
                FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)]
              return next
            })
          }, delay + f * flipInterval)
        )
      }

      timeouts.push(
        setTimeout(() => {
          setDisplayChars((prev) => {
            const next = [...prev]
            next[charIdx] = HERO_TEXT[charIdx]
            return next
          })
          setSettled((prev) => {
            const next = [...prev]
            next[charIdx] = true
            return next
          })
        }, delay + flipsPerChar * flipInterval)
      )

      letterIndex++
    }

    const totalDuration =
      (totalLetters - 1) * perLetterDelay + flipsPerChar * flipInterval
    timeouts.push(
      setTimeout(() => {
        setDisplayChars(Array.from(HERO_TEXT))
        setSettled(Array.from(HERO_TEXT, () => true))
      }, totalDuration + 100)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl inline-block">
      {displayChars.map((ch, i) => (
        <span
          key={i}
          className={
            ch === ' '
              ? 'inline-block w-[0.3em]'
              : `inline-block transition-transform duration-75 ${
                  settled[i] ? '' : 'flip-tick'
                }`
          }
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h1>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Animations for floating cart icons */}
      <style>{`
        @keyframes float-right {
          0% { transform: translateX(-10%) translateY(0); }
          50% { transform: translateX(110%) translateY(-20px); }
          100% { transform: translateX(-10%) translateY(0); }
        }
        @keyframes float-left {
          0% { transform: translateX(110%) translateY(0); }
          50% { transform: translateX(-10%) translateY(-15px); }
          100% { transform: translateX(110%) translateY(0); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes flip-tick {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        .flip-tick {
          animation: flip-tick 0.1s ease-in-out;
        }
        @keyframes bunny-hop {
          0%, 100% { transform: translateY(0) translateX(0); }
          15% { transform: translateY(-12px) translateX(20px); }
          30% { transform: translateY(0) translateX(40px); }
          45% { transform: translateY(-12px) translateX(60px); }
          60% { transform: translateY(0) translateX(80px); }
          75% { transform: translateY(-12px) translateX(60px); }
          90% { transform: translateY(0) translateX(40px); }
        }
      `}</style>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Main Headline */}
            <FlipHero />

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-lg">
              The all-in-one platform that transforms property listing coordination from hours of email chaos into minutes of streamlined collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/create"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Create Your First ListCart
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById('features')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 bg-yellow-500/20 backdrop-blur-sm text-white font-semibold rounded-full text-lg border-2 border-white/50 hover:bg-blue-500/30 hover:scale-105 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>

            {/* Search Box */}
            <div className="pt-8">
              <p className="text-blue-100 text-sm mb-3">Or access an existing ListCart:</p>
              <CartSearchBox />
            </div>
          </div>
        </div>

        {/* Floating cart icons in hero */}
        <div className="absolute bottom-24 left-0 right-0 overflow-hidden pointer-events-none opacity-20">
          <div style={{ animation: 'float-right 18s ease-in-out infinite' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-36 left-0 right-0 overflow-hidden pointer-events-none opacity-15">
          <div style={{ animation: 'float-left 22s ease-in-out infinite' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
        </div>

        {/* Animated hopping bunny */}
        <div className="absolute bottom-20 left-8 pointer-events-none opacity-30" style={{ animation: 'bunny-hop 4s ease-in-out infinite' }}>
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <ellipse cx="12" cy="18" rx="6" ry="4" />
            <circle cx="12" cy="10" r="5" />
            <ellipse cx="9" cy="4" rx="1.5" ry="4" />
            <ellipse cx="15" cy="4" rx="1.5" ry="4" />
            <circle cx="10" cy="9" r="0.8" fill="currentColor" opacity="0.6" />
            <circle cx="14" cy="9" r="0.8" fill="currentColor" opacity="0.6" />
            <ellipse cx="12" cy="11" rx="0.8" ry="0.5" opacity="0.6" />
            <circle cx="5" cy="18" r="2" />
          </svg>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Vendor Chaos Section – the coordination whirlwind ListCart tames */}
      <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
        <style>{`
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
          }
          @keyframes orbit-reverse {
            from { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
            to   { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          }
          @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50%      { transform: scale(1.08); opacity: 0.25; }
          }
        `}</style>

        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            One Listing. Dozens of Moving Parts.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Photographers, cleaners, painters, gardeners, signboard installers, stylists&mdash;every listing is a whirlwind of coordination. ListCart brings order to the chaos.
          </p>
        </div>

        {/* Orbit ring with vendor icons */}
        <div className="relative mx-auto w-72 h-72 md:w-[26rem] md:h-[26rem]">
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 dark:border-indigo-800" style={{ animation: 'pulse-ring 4s ease-in-out infinite' }} />
          <div className="absolute inset-6 rounded-full border border-indigo-100 dark:border-indigo-900" />

          {/* Centre house icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2" />
              </svg>
            </div>
          </div>

          {/* Orbiting vendor icons – outer ring (clockwise) */}
          {[
            { label: 'Photographer', delay: '0s', color: 'from-amber-400 to-orange-500', path: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Cleaner', delay: '-3s', color: 'from-cyan-400 to-teal-500', path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            { label: 'Painter', delay: '-6s', color: 'from-pink-400 to-rose-500', path: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
            { label: 'Signboard', delay: '-9s', color: 'from-emerald-400 to-green-500', path: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
            { label: 'Repairs', delay: '-12s', color: 'from-violet-400 to-purple-500', path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Gardener', delay: '-15s', color: 'from-lime-400 to-green-500', path: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
          ].map((v, i) => (
            <div
              key={v.label}
              className="absolute inset-0 flex items-center justify-center"
              style={{ '--orbit-r': '8rem', animation: `orbit 18s linear infinite`, animationDelay: v.delay } as React.CSSProperties}
            >
              <div className="group relative">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center shadow-lg`}>
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.path} />
                  </svg>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{v.label}</span>
              </div>
            </div>
          ))}

          {/* Inner counter-rotating ring with remaining vendors */}
          {[
            { label: 'Stylist', delay: '0s', color: 'from-fuchsia-400 to-pink-500', path: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
            { label: 'Copywriter', delay: '-4s', color: 'from-sky-400 to-blue-500', path: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            { label: 'Decorator', delay: '-8s', color: 'from-yellow-400 to-amber-500', path: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V11l4.523-4.523a3.75 3.75 0 015.304 5.304L13.927 18.18' },
          ].map((v) => (
            <div
              key={v.label}
              className="absolute inset-0 flex items-center justify-center"
              style={{ '--orbit-r': '5rem', animation: `orbit-reverse 14s linear infinite`, animationDelay: v.delay } as React.CSSProperties}
            >
              <div className="group relative">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center shadow-md`}>
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.path} />
                  </svg>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{v.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Agents Love ListCart
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From 4-6 hours to 20 minutes. That's the ListCart difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                All Conversations in One Place
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                WhatsApp-style chat threads keep every negotiation organized and visible. No more scattered email chains.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Real-Time Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vendors respond with quotes, availability, and questions instantly. See everything at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                One-Click Approvals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Accept quotes instantly. Automated invoicing with transparent pricing. No more back-and-forth delays.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Complete Audit Trail
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every conversation, quote, and decision documented for compliance and reference.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Save Hours Per Listing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                What used to take 4-6 hours of coordination now takes just 20 minutes. Book more listings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your Trusted Network
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your preferred service providers. Build templates. Streamline your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated cart divider */}
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden h-16">
        <div className="absolute inset-0 flex items-center justify-center gap-32 opacity-10 dark:opacity-20 pointer-events-none">
          {/* Person pushing cart - left */}
          <div style={{ animation: 'bob 3s ease-in-out infinite' }}>
            <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="8" cy="4" r="2" />
              <path d="M11 6H6l-1 6h4l1 4h2l-1-4 2-4H11zM16 10h-2l-.5 2H16l1 4h2l-1-4h2l-1-2h-3z" />
            </svg>
          </div>
          {/* Cart icon - center */}
          <div style={{ animation: 'bob 4s ease-in-out infinite 1s' }}>
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          {/* Person pushing cart - right */}
          <div style={{ animation: 'bob 3.5s ease-in-out infinite 0.5s' }}>
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="8" cy="4" r="2" />
              <path d="M11 6H6l-1 6h4l1 4h2l-1-4 2-4H11zM16 10h-2l-.5 2H16l1 4h2l-1-4h2l-1-2h-3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fancy Cars Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Drive Your Success
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Top agents know that image matters. Save time with ListCart and spend it doing what you love.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Porsche */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all hover:scale-105">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏎️</div>
              <h3 className="text-xl font-bold text-white mb-2">Porsche 911</h3>
              <p className="text-gray-400 text-sm">The classic choice for agents who close deals fast.</p>
              <div className="absolute top-4 right-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Mercedes */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚗</div>
              <h3 className="text-xl font-bold text-white mb-2">Mercedes S-Class</h3>
              <p className="text-gray-400 text-sm">Luxury and comfort for those long property tours.</p>
              <div className="absolute top-4 right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Range Rover */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all hover:scale-105">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚙</div>
              <h3 className="text-xl font-bold text-white mb-2">Range Rover</h3>
              <p className="text-gray-400 text-sm">Command the road like you command the market.</p>
              <div className="absolute top-4 right-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Time saved = more listings = fancy car fund 💰
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-yellow-500">
        <div className="max-w-5xl mx-auto px-6">
          {/* Limited Time Promo Banner */}
          <div className="mb-10 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl blur opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-orange-500 rounded-2xl p-6 shadow-2xl border-4 border-white/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl md:text-6xl animate-bounce">🔥</div>
                  <div className="text-center md:text-left">
                    <div className="text-white font-black text-2xl md:text-3xl tracking-tight">
                      20% OFF YEARLY PLANS
                    </div>
                    <div className="text-yellow-200 font-semibold text-lg">
                      Sign up by next week - Don't miss out!
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-white/40">
                    <div className="text-white/80 text-xs uppercase tracking-widest">Limited Time</div>
                    <div className="text-white font-bold text-xl">ENDS SOON</div>
                  </div>
                  <Link
                    href="/create"
                    className="px-6 py-3 bg-white text-red-600 font-bold rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    Claim Offer Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              💰 Monetize Every Listing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Turn your service coordination into a revenue stream
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero: Agent Earning Potential */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl text-white">
              <div className="flex items-center mb-4">
                <svg className="w-10 h-10 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold">You Set Your Commission</h3>
              </div>
              <p className="text-green-100 mb-6 text-lg">
                Add your own markup (1%, 2%, 5%... you decide!) and earn on every service you coordinate.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="text-sm text-green-100 mb-2">Example earning:</div>
                <div className="text-3xl font-bold mb-2">$100-$500+</div>
                <div className="text-sm text-green-100">per listing, based on your commission rate</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Full control over your pricing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Transparent to vendors</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-200 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Passive income on every listing</span>
                </li>
              </ul>
            </div>

            {/* Simple Platform Fee Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Fee</h4>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">5%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Simple, transparent fee per cart. No monthly subscription. No hidden costs.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quick Example:</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Services total:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$1,000</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Your 2% commission:</span>
                    <span className="font-semibold">+$20</span>
                  </div>
                  <div className="flex justify-between text-blue-600 dark:text-blue-400">
                    <span>Platform 5% fee:</span>
                    <span className="font-semibold">+$50</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2"></div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Vendor receives:</span>
                    <span>$1,070</span>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    ✓ You earn $20 | Platform earns $50 | Vendor paid in full
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg">
                Start Earning Today
              </button>
            </div>
          </div>

          {/* Old pricing cards removed - keeping commented for reference */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" style={{display: 'none'}}>
            {/* Starter Plan */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Up to 5 ListCarts/month</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Basic communication hub</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Email support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Unlimited ListCarts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Advanced communication hub</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-white mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Custom templates</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Multi-agency support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">API access</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Contact Sales
              </button>
            </div>
          </div> {/* End of hidden old pricing cards */}
        </div>
      </section>

      {/* Animated cart divider */}
      <div className="relative bg-white dark:bg-gray-900 overflow-hidden h-16">
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center pointer-events-none">
          <div className="w-full" style={{ animation: 'float-right 15s ease-in-out infinite' }}>
            <svg className="w-8 h-8 text-indigo-400/30" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="7" cy="4" r="2" />
              <path d="M10 6H5l-1 6h4l1 4h2l-1-4 2-4H10zM15 10h-2l-.5 2H15l1 4h2l-1-4h2l-1-2h-3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Product Roadmap
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Here's what we're building next
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Roadmap Item 1 */}
            <div className="relative pl-8 pb-12 border-l-4 border-green-500">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-green-500"></div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q1 2026 - MVP Launch ✅</h3>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                    Launched
                  </span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Core service package builder</li>
                  <li>• WhatsApp-style communication hub</li>
                  <li>• Vendor management & approvals</li>
                  <li>• Automated invoicing</li>
                </ul>
              </div>
            </div>

            {/* Roadmap Item 2 */}
            <div className="relative pl-8 pb-12 border-l-4 border-blue-500">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-yellow-500"></div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q2 2026 - Integrations</h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                    In Progress
                  </span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Calendar sync (Google, Outlook)</li>
                  <li>• Payment gateway integration</li>
                  <li>• CRM connections (REX, Box+Dice)</li>
                  <li>• SMS notifications</li>
                </ul>
              </div>
            </div>

            {/* Roadmap Item 3 */}
            <div className="relative pl-8 pb-12 border-l-4 border-purple-500">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-purple-500"></div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q3 2026 - AI & Automation</h3>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                    Planned
                  </span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• AI-powered vendor recommendations</li>
                  <li>• Smart scheduling optimization</li>
                  <li>• Automated follow-ups</li>
                  <li>• Predictive pricing insights</li>
                </ul>
              </div>
            </div>

            {/* Roadmap Item 4 */}
            <div className="relative pl-8 pb-12 border-l-4 border-gray-300 dark:border-gray-600">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q4 2026 - Enterprise</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                    Future
                  </span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Agentic phone call follow up</li>
                  <li>• Job bidding windows</li>
                  <li>• Service provider broker within broker idea</li>
                </ul>
              </div>
            </div>

            {/* Top 5 Customer Ideas */}
            <div className="relative pl-8 border-l-4 border-gradient-to-b from-yellow-400 to-orange-500">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"></div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-lg border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">💡</span> Top 5 Customer Ideas
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-semibold animate-pulse">
                    Community Picks
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your ideas, our priority. Click to vote!</p>
                <div className="space-y-3">
                  {[
                    { rank: 1, idea: 'Seasonal landing pages', icon: '🎄', votes: 342 },
                    { rank: 2, idea: 'Payment reminders & nudges', icon: '💸', votes: 287 },
                    { rank: 3, idea: 'Auto mail branding agent', icon: '✉️', votes: 251 },
                    { rank: 4, idea: 'Cart sounds', icon: '🔔', votes: 198 },
                    { rank: 5, idea: 'Light bulbs (smart notifications)', icon: '💡', votes: 156 },
                  ].map((item) => (
                    <div
                      key={item.rank}
                      className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border border-transparent hover:border-yellow-300 dark:hover:border-yellow-600"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        item.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        item.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                        item.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                        'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}>
                        {item.rank}
                      </div>
                      <span className="text-xl">{item.icon}</span>
                      <span className="flex-1 font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {item.idea}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{item.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Resources & Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to succeed with ListCart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="#"
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow border border-blue-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive guides and tutorials</p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow border border-purple-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
        </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step video walkthroughs</p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow border border-green-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">FAQs and troubleshooting</p>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow border border-orange-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Live Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chat with our team</p>
            </a>
          </div>
        </div>
      </section>

      {/* Animated cart divider */}
      <div className="relative bg-white dark:bg-gray-900 overflow-hidden h-16">
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center pointer-events-none">
          <div className="w-full" style={{ animation: 'float-left 20s ease-in-out infinite' }}>
            <svg className="w-8 h-8 text-purple-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built by Agents, for Agents
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We know the pain of coordinating vendors because we've lived it. ListCart was born from countless hours of email chaos, missed follow-ups, and the frustration of watching deals slow down while waiting for quotes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-blue-100">
                To give real estate agents back their most valuable resource: time. We believe coordination shouldn't be the bottleneck in closing deals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Our Promise</h3>
              <p className="text-blue-100">
                Every feature we build is tested by working agents. We ship fast, listen closely, and never stop improving.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-100 mb-6">Want to be part of the journey?</p>
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Join Our Beta Program
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real testimonials from definitely real people*
            </p>
          </div>

          <div className="relative">
            <div
              className="flex gap-6"
              style={{
                animation: 'scroll-left 30s linear infinite',
                width: 'max-content'
              }}
            >
              {[
                {
                  name: 'Barry "Big Bucks" Henderson',
                  role: 'Real Estate Agent, Gold Coast',
                  quote: "Before ListCart, I was 5'6\". Now I'm 6'2\". Coincidence? I think not. Also made $400k last quarter.",
                  avatar: 'BH'
                },
                {
                  name: 'Denise McPhotographer',
                  role: 'Property Photographer',
                  quote: "I used to spend 3 hours a day on emails. Now I spend that time counting my money and learning salsa dancing. I've won two trophies.",
                  avatar: 'DM'
                },
                {
                  name: 'Trevor the Painter',
                  role: 'Premium Painting Services',
                  quote: "My wife left me because I was always stressed about coordinating jobs. She came back after I started using ListCart. We renewed our vows in Bali.",
                  avatar: 'TP'
                },
                {
                  name: 'Sandra Luxington III',
                  role: 'Luxury Property Specialist',
                  quote: "ListCart didn't just save my business, it saved my hairline. My dermatologist is baffled. Hair is growing back thicker than ever.",
                  avatar: 'SL'
                },
                {
                  name: 'Keith "The Dream" Sellers',
                  role: 'Independent Agent',
                  quote: "I showed ListCart to my dog and now he's a licensed real estate agent. He closed three deals last month. Good boy, Biscuit.",
                  avatar: 'KS'
                },
                {
                  name: 'Megan Cleansworth',
                  role: 'Elite Cleaning Co.',
                  quote: "Used to get jobs through carrier pigeons. Now I use ListCart. The pigeons work for me now as quality inspectors.",
                  avatar: 'MC'
                },
                {
                  name: 'Bruce "Signboard" Williams',
                  role: 'Signboard Installation Pro',
                  quote: "I was going to retire, but ListCart made my job so easy I'm working until I'm 150. Doctor says it's possible now.",
                  avatar: 'BW'
                },
                {
                  name: 'Fiona Gardenia',
                  role: 'Garden Styling Expert',
                  quote: "Since using ListCart, my plants have started growing twice as fast. Unrelated? My accountant says otherwise.",
                  avatar: 'FG'
                },
                // Duplicate for seamless loop
                {
                  name: 'Barry "Big Bucks" Henderson',
                  role: 'Real Estate Agent, Gold Coast',
                  quote: "Before ListCart, I was 5'6\". Now I'm 6'2\". Coincidence? I think not. Also made $400k last quarter.",
                  avatar: 'BH'
                },
                {
                  name: 'Denise McPhotographer',
                  role: 'Property Photographer',
                  quote: "I used to spend 3 hours a day on emails. Now I spend that time counting my money and learning salsa dancing. I've won two trophies.",
                  avatar: 'DM'
                },
                {
                  name: 'Trevor the Painter',
                  role: 'Premium Painting Services',
                  quote: "My wife left me because I was always stressed about coordinating jobs. She came back after I started using ListCart. We renewed our vows in Bali.",
                  avatar: 'TP'
                },
                {
                  name: 'Sandra Luxington III',
                  role: 'Luxury Property Specialist',
                  quote: "ListCart didn't just save my business, it saved my hairline. My dermatologist is baffled. Hair is growing back thicker than ever.",
                  avatar: 'SL'
                },
                {
                  name: 'Keith "The Dream" Sellers',
                  role: 'Independent Agent',
                  quote: "I showed ListCart to my dog and now he's a licensed real estate agent. He closed three deals last month. Good boy, Biscuit.",
                  avatar: 'KS'
                },
                {
                  name: 'Megan Cleansworth',
                  role: 'Elite Cleaning Co.',
                  quote: "Used to get jobs through carrier pigeons. Now I use ListCart. The pigeons work for me now as quality inspectors.",
                  avatar: 'MC'
                },
                {
                  name: 'Bruce "Signboard" Williams',
                  role: 'Signboard Installation Pro',
                  quote: "I was going to retire, but ListCart made my job so easy I'm working until I'm 150. Doctor says it's possible now.",
                  avatar: 'BW'
                },
                {
                  name: 'Fiona Gardenia',
                  role: 'Garden Styling Expert',
                  quote: "Since using ListCart, my plants have started growing twice as fast. Unrelated? My accountant says otherwise.",
                  avatar: 'FG'
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
            *Results may vary. Height increases not clinically verified. No pigeons were harmed. Biscuit is a very good boy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">ListCart</h4>
              <p className="text-sm">
                Where listing services meet simplicity.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ListCart. Built with ❤️ for real estate agents.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
