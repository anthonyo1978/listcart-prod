import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const AGENT_EMAIL = 'lee.sales@estates.com.au' // Hardcoded for MVP

// GET /api/settings/finance - Get finance settings
export async function GET() {
  try {
    let settings = await prisma.agentSettings.findUnique({
      where: { agentEmail: AGENT_EMAIL },
    })

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.agentSettings.create({
        data: {
          agentEmail: AGENT_EMAIL,
          globalCommissionPercent: 0,
          autoApplyCommission: false,
        },
      })
    }

    return NextResponse.json({
      globalCommissionPercent: settings.globalCommissionPercent,
      autoApplyCommission: settings.autoApplyCommission,
    })
  } catch (error) {
    console.error('Error fetching finance settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/finance - Update finance settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { globalCommissionPercent, autoApplyCommission } = body

    const settings = await prisma.agentSettings.upsert({
      where: { agentEmail: AGENT_EMAIL },
      update: {
        globalCommissionPercent,
        autoApplyCommission,
      },
      create: {
        agentEmail: AGENT_EMAIL,
        globalCommissionPercent,
        autoApplyCommission,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating finance settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

