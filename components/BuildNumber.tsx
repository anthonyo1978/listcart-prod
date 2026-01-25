'use client'

export function BuildNumber() {
  // This will be replaced at build time
  const buildNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'dev'
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString()

  return (
    <div className="fixed bottom-2 left-2 z-50 text-xs text-gray-400 dark:text-gray-600 font-mono opacity-50 hover:opacity-100 transition-opacity">
      <span title={`Build: ${buildNumber}\nTime: ${buildTime}`}>
        v{buildNumber}
      </span>
    </div>
  )
}

