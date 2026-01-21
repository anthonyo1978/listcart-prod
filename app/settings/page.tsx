'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'
import { ServicePackageBuilder } from '@/components/settings/ServicePackageBuilder'
import { FinanceCommissionSettings } from '@/components/settings/FinanceCommissionSettings'
import { ToastProvider } from '@/components/ui/toast'

export default function SettingsPage() {
  const [expandedSection, setExpandedSection] = useState<string>('')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section)
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        {/* User Menu - Top Right */}
        <div className="absolute top-6 right-6">
          <UserMenu />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ⚙️ Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure your ListCart preferences
                </p>
              </div>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Changes save automatically</span>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Service Package Builder */}
            <SettingsSection
              id="service-package"
              title="📦 Service Package Builder"
              description="Manage service categories and approved vendors"
              isExpanded={expandedSection === 'service-package'}
              onToggle={() => toggleSection('service-package')}
            >
              <ServicePackageBuilder />
            </SettingsSection>

            {/* Finance & Commission */}
            <SettingsSection
              id="finance"
              title="💰 Finance & Commission"
              description="Configure pricing, fees, and commission structures"
              isExpanded={expandedSection === 'finance'}
              onToggle={() => toggleSection('finance')}
            >
              <FinanceCommissionSettings />
            </SettingsSection>

            {/* Email Follow Up Rules */}
            <SettingsSection
              id="email"
              title="📧 Email Follow Up Rules"
              description="Automate email reminders and follow-up sequences"
              isExpanded={expandedSection === 'email'}
              onToggle={() => toggleSection('email')}
            >
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📧</div>
                <p className="text-lg font-medium mb-2">Email Follow Up Rules</p>
                <p className="text-sm">Set up automated email sequences for vendors and service providers.</p>
                <div className="mt-6 text-xs text-gray-400">Coming soon...</div>
              </div>
            </SettingsSection>

            {/* Automation & Agentic Support */}
            <SettingsSection
              id="automation"
              title="🤖 Automation & Agentic Support"
              description="AI-powered assistance and workflow automation"
              isExpanded={expandedSection === 'automation'}
              onToggle={() => toggleSection('automation')}
            >
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-lg font-medium mb-2">Automation & Agentic Support</p>
                <p className="text-sm">Enable AI agents to handle routine tasks and streamline your workflow.</p>
                <div className="mt-6 text-xs text-gray-400">Coming soon...</div>
              </div>
            </SettingsSection>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

interface SettingsSectionProps {
  id: string
  title: string
  description: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SettingsSection({
  id,
  title,
  description,
  isExpanded,
  onToggle,
  children,
}: SettingsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex-1 text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        <div className="ml-4">
          <svg
            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}
