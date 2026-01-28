'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { CartSearchBox } from '@/components/CartSearchBox'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundColor: "#ffff00",
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              Stop More Juggling Vendors.
              <br />
              <span className="text-blue-200">Start Closing Deals.</span>
            </h1>

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

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-yellow-500">
        <div className="max-w-5xl mx-auto px-6">
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
            <div className="relative pl-8 border-l-4 border-gray-300 dark:border-gray-600">
              <div className="absolute left-0 top-0 transform -translate-x-[9px] w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Q4 2026 - Enterprise</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                    Future
                  </span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Multi-agency workflows</li>
                  <li>• Advanced analytics & reporting</li>
                  <li>• White-label options</li>
                  <li>• API for custom integrations</li>
                </ul>
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
