'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrencyAUD } from '@/lib/services'
import { updateCartItemStatus } from '@/lib/actions'

type MessageReaction = {
  emoji: string
  count: number
  users: string[]
}

type Message = {
  id: string
  from: 'agent' | 'provider'
  fromName: string
  message: string
  timestamp: Date
  type?: 'quote' | 'question' | 'confirmation' | 'general'
  reactions?: MessageReaction[]
}

type ConversationThread = {
  serviceId: string
  serviceName: string
  providerName: string
  status: 'pending' | 'active' | 'quoted' | 'approved'
  unreadCount: number
  lastActivity: Date
  messages: Message[]
  latestQuote?: {
    amount: number
    availableDate: string
  }
}

// Initial outbound message for all threads
const initialMessage: Message = {
  id: '1',
  from: 'agent',
  fromName: 'Lee @ Estates',
  message: 'This is Lee @ Estates. I sent you a request from a valued vendor. Please let us know if you can do the job!',
  timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
  type: 'general',
}

// Full negotiation conversations (revealed when thread is opened)
// Simulating "a few days later" with realistic timestamps
const fullConversations: Record<string, Message[]> = {
  PHOTO_FLOORPLAN: [
    initialMessage,
    {
      id: '2',
      from: 'provider',
      fromName: 'Sarah (ProShot)',
      message: 'Hi Lee! 👋 Thanks for reaching out. Happy to help! Can you tell me about the property? How many bedrooms and any special features?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      type: 'question',
    },
    {
      id: '3',
      from: 'agent',
      fromName: 'Lee',
      message: 'Hey Sarah! It\'s 123 Main St - 4 bed, 2 bath family home. Beautiful pool in the backyard and recently renovated kitchen. Vendor wants to highlight those features 🏊‍♂️',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.5),
      type: 'general',
    },
    {
      id: '4',
      from: 'provider',
      fromName: 'Sarah (ProShot)',
      message: 'Perfect! Pool properties are my favorite to shoot 📸 Would twilight photos work? The pool area would look stunning at golden hour!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
      type: 'question',
    },
    {
      id: '5',
      from: 'agent',
      fromName: 'Lee',
      message: 'Love that idea! Yes please on twilight. Also, any pets we should know about? They have a golden retriever 🐕',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45),
      type: 'general',
    },
    {
      id: '6',
      from: 'provider',
      fromName: 'Sarah (ProShot)',
      message: 'Aw I LOVE golden retrievers! 🥰 No problem at all - I always bring treats. When were you thinking for the shoot?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'question',
    },
    {
      id: '7',
      from: 'agent',
      fromName: 'Lee',
      message: 'Vendor is flexible but hoping for next Tuesday if possible? They want to list ASAP',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      type: 'general',
    },
    {
      id: '8',
      from: 'provider',
      fromName: 'Sarah (ProShot)',
      message: 'Let me check my schedule... Yes! Tuesday works perfectly 🎉\n\nHere\'s my quote:\n\n📸 Full property shoot + floorplan: $450\n🌆 Twilight session: $120\n🎥 360° virtual tour: Included\n💰 TOTAL: $570 inc GST\n\n📅 Tuesday 15th Jan\n🕐 Day shoot: 10am-12pm\n🌅 Twilight: 5:30-6:30pm\n⏱️ Edited photos: 48hrs\n\nSound good?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      type: 'quote',
      reactions: [{ emoji: '👍', count: 1, users: ['Lee'] }],
    },
    {
      id: '9',
      from: 'agent',
      fromName: 'Lee',
      message: 'Perfect pricing! Virtual tour included is a great touch 🙌 Let me just confirm Tuesday with the vendor and I\'ll get back to you within the hour',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'general',
    },
    {
      id: '10',
      from: 'provider',
      fromName: 'Sarah (ProShot)',
      message: 'Sounds great! I\'ll pencil it in. Just ping me when confirmed and I\'ll lock it in officially 📅✨',
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      type: 'confirmation',
    },
  ],
  SIGNBOARD: [
    initialMessage,
    {
      id: '2',
      from: 'provider',
      fromName: 'Mike (Urban Signs)',
      message: 'Hey Lee! Got your request. I can definitely help with this. What size signboard were you thinking? And any specific branding requirements from Estates? 🪧',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      type: 'question',
    },
    {
      id: '3',
      from: 'agent',
      fromName: 'Lee',
      message: 'Hi Mike! Standard A-frame please. Property is 123 Main St. Need it installed by this Friday if possible. Can use our standard Estates branding.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 35),
      type: 'general',
    },
    {
      id: '4',
      from: 'provider',
      fromName: 'Mike (Urban Signs)',
      message: 'Friday works! I have your branding on file 👍 Standard size is 900x600mm. Couple of options:\n\n1️⃣ Basic A-frame: $280\n2️⃣ Premium with QR code: $350\n\nQR code links to online listing - getting really popular! What do you think?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      type: 'quote',
    },
    {
      id: '5',
      from: 'agent',
      fromName: 'Lee',
      message: 'QR code is a great idea! Let\'s go with premium. The vendor will love that tech touch 📱',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      type: 'general',
    },
    {
      id: '6',
      from: 'provider',
      fromName: 'Mike (Urban Signs)',
      message: 'Perfect choice! $350 inc GST. I\'ll install Friday morning around 9am. Just send me the listing URL when it\'s live and I\'ll program the QR code. Easy! 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: 'confirmation',
      reactions: [{ emoji: '🎯', count: 1, users: ['Lee'] }],
    },
  ],
  COPYWRITING: [
    initialMessage,
    {
      id: '2',
      from: 'provider',
      fromName: 'Emma (WordCraft)',
      message: 'Hi Lee! 👋 I\'d be delighted to craft copy for this listing. Tell me about what makes this property special? Any unique features or compelling stories?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40), // ~1.7 days ago
      type: 'question',
    },
    {
      id: '3',
      from: 'agent',
      fromName: 'Lee',
      message: 'Hey Emma! It\'s a lovely family home - 4 bed, 2 bath at 123 Main St. Renovated kitchen, beautiful pool, huge backyard. Walking distance to Northside Primary. Vendor has raised 3 kids here - lots of memories 🏡',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 39),
      type: 'general',
    },
    {
      id: '4',
      from: 'provider',
      fromName: 'Emma (WordCraft)',
      message: 'Oh I love the family story angle! 💙 That emotional connection really resonates with buyers. Would you like:\n\n1️⃣ Lifestyle-focused copy (emphasizing family life, schools, community)\n2️⃣ Features-focused (highlighting renovations, pool, space)\n3️⃣ Hybrid approach (best of both)\n\nI\'d recommend hybrid for this one!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'question',
    },
    {
      id: '5',
      from: 'agent',
      fromName: 'Lee',
      message: 'Hybrid sounds perfect! The vendor is pretty emotional about selling - want to honor that while showing off the amazing features',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      type: 'general',
    },
    {
      id: '6',
      from: 'provider',
      fromName: 'Emma (WordCraft)',
      message: 'Absolutely, I\'ll strike that balance beautifully ✨\n\n📝 Package includes:\n• Headline & opening hook\n• 200-250 word listing description\n• Key features bullet points\n• 2 rounds of revisions\n\n💰 $180 inc GST\n⏱️ Draft ready in 24 hours\n\nHow does that sound?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      type: 'quote',
    },
    {
      id: '7',
      from: 'agent',
      fromName: 'Lee',
      message: 'That\'s exactly what we need! Price is great and 24hr turnaround is perfect. Let\'s do it! 🙌',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: 'confirmation',
    },
    {
      id: '8',
      from: 'provider',
      fromName: 'Emma (WordCraft)',
      message: 'Wonderful! I\'m excited to write this one 📚 I\'ll have a draft to you tomorrow afternoon. If you have any specific phrases or emotional notes you want me to capture, just send them through!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'confirmation',
      reactions: [{ emoji: '🎉', count: 1, users: ['Lee'] }],
    },
  ],
}

// Mock data for demonstration - keyed by serviceKey
const mockThreads: ConversationThread[] = [
  {
    serviceId: 'PHOTO_FLOORPLAN',
    serviceName: 'Photography + Floorplan',
    providerName: 'ProShot Studios',
    status: 'pending',
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago (just sent)
    messages: [initialMessage],
  },
  {
    serviceId: 'SIGNBOARD',
    serviceName: 'Signboard',
    providerName: 'Urban Signs Co',
    status: 'pending',
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago (just sent)
    messages: [initialMessage],
  },
  {
    serviceId: 'COPYWRITING',
    serviceName: 'Copywriting',
    providerName: 'WordCraft Property',
    status: 'pending',
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago (just sent)
    messages: [initialMessage],
  },
]

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Waiting', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: '⏳' },
    active: { label: 'In Discussion', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: '💬' },
    quoted: { label: 'Quote Received', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: '✅' },
    approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', icon: '🎉' },
  }[status] || config.pending

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}

function Avatar({ name, type }: { name: string; type: 'agent' | 'provider' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
        type === 'agent'
          ? 'bg-blue-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      {initials}
    </div>
  )
}

function MessageBubble({ 
  message, 
  onReact 
}: { 
  message: Message
  onReact: (messageId: string, emoji: string) => void
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const isAgent = message.from === 'agent'
  const isQuote = message.type === 'quote'

  const quickEmojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥']

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'} mb-3 group relative`}>
      {/* Avatar - Provider side only */}
      {!isAgent && (
        <div className="mr-2">
          <Avatar name={message.fromName} type="provider" />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isAgent ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Name - Always show in group chat style */}
        {!isAgent && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 px-1">
            {message.fromName.split('(')[0].trim()}
          </span>
        )}
        
        {/* Message Bubble */}
        <div className="relative">
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isAgent
                ? 'bg-blue-500 text-white rounded-br-sm'
                : isQuote
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-gray-900 dark:text-white rounded-bl-sm'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-sm'
            }`}
          >
            {isQuote && (
              <div className="flex items-center mb-2 pb-2 border-b border-green-300 dark:border-green-600">
                <span className="text-lg mr-2">💰</span>
                <span className="font-semibold text-green-700 dark:text-green-300 text-sm">
                  Quote Provided
                </span>
              </div>
            )}
            <p className="text-sm whitespace-pre-line leading-relaxed">{message.message}</p>
            
            {/* Time stamp - WhatsApp style, bottom right */}
            <div className={`text-xs mt-1 text-right ${isAgent ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString('en-AU', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
              {isAgent && (
                <span className="ml-1">
                  <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                  </svg>
                </span>
              )}
            </div>
          </div>

          {/* Reaction Button - Shows on hover */}
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`absolute ${isAgent ? '-left-8' : '-right-8'} top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 shadow-md`}
            title="React to message"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Emoji Picker Popup */}
          {showReactionPicker && (
            <div className={`absolute ${isAgent ? 'left-0' : 'right-0'} -bottom-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-xl px-2 py-1.5 flex space-x-1 z-10 animate-in fade-in zoom-in-95 duration-200`}>
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji)
                    setShowReactionPicker(false)
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 text-lg transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Reactions Display */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isAgent ? 'justify-end' : 'justify-start'}`}>
              {message.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => onReact(message.id, reaction.emoji)}
                  className="inline-flex items-center space-x-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  title={reaction.users.join(', ')}
                >
                  <span className="text-sm">{reaction.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avatar - Agent side */}
      {isAgent && (
        <div className="ml-2">
          <Avatar name={message.fromName} type="agent" />
        </div>
      )}
    </div>
  )
}

export function ServiceCommunicationHub({ 
  cartStatus, 
  cartId
}: { 
  cartStatus: string
  cartId: string
}) {
  const [expandedThread, setExpandedThread] = useState<string | null>(null)
  const [threads, setThreads] = useState<ConversationThread[]>(mockThreads)
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({})
  const [isAccepting, setIsAccepting] = useState<string | null>(null)
  const [priceModalThread, setPriceModalThread] = useState<ConversationThread | null>(null)
  const [finalPrice, setFinalPrice] = useState('')
  const [isPending, startTransition] = useTransition()
  const [loadingThread, setLoadingThread] = useState<string | null>(null)
  const router = useRouter()

  // Handle thread expansion - load full conversation
  const handleThreadToggle = (threadId: string) => {
    if (expandedThread === threadId) {
      // Collapse
      setExpandedThread(null)
    } else {
      // Expand - reveal full conversation if available
      const fullConversation = fullConversations[threadId]
      if (fullConversation && fullConversation.length > 1) {
        // Show loading state briefly for realism
        setLoadingThread(threadId)
        setTimeout(() => {
          setThreads((prevThreads) =>
            prevThreads.map((t) => {
              if (t.serviceId === threadId) {
                // Load full conversation and update status with service-specific details
                let latestQuote = undefined
                let lastActivityTime = new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago default
                
                if (threadId === 'PHOTO_FLOORPLAN') {
                  latestQuote = { amount: 57000, availableDate: '15 Jan 2026' }
                  lastActivityTime = new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
                } else if (threadId === 'SIGNBOARD') {
                  latestQuote = { amount: 35000, availableDate: 'Friday 10 Jan' }
                  lastActivityTime = new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
                } else if (threadId === 'COPYWRITING') {
                  latestQuote = { amount: 18000, availableDate: 'Tomorrow' }
                  lastActivityTime = new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
                }
                
                return {
                  ...t,
                  messages: fullConversation,
                  status: 'quoted',
                  unreadCount: 1,
                  lastActivity: lastActivityTime,
                  latestQuote,
                }
              }
              return t
            })
          )
          setLoadingThread(null)
          setExpandedThread(threadId)
        }, 800) // Brief delay to show loading
      } else {
        // No full conversation available, just expand
        setExpandedThread(threadId)
      }
    }
  }

  // Only show if cart has been sent to providers
  if (!['SENT', 'VENDOR_APPROVED', 'INVOICE_SENT', 'PAID'].includes(cartStatus)) {
    return null
  }

  const handleAcceptProvider = (thread: ConversationThread) => {
    // Show price modal first
    setPriceModalThread(thread)
    setFinalPrice(thread.latestQuote ? (thread.latestQuote.amount / 100).toFixed(2) : '')
  }

  const handleConfirmAcceptance = async () => {
    if (!priceModalThread || !finalPrice) return

    const priceCents = Math.round(parseFloat(finalPrice) * 100)
    setIsAccepting(priceModalThread.serviceId)
    
    try {
      // Update the thread status and add the final price
      setThreads((prevThreads) =>
        prevThreads.map((t) =>
          t.serviceId === priceModalThread.serviceId
            ? { 
                ...t, 
                status: 'approved' as const,
                latestQuote: t.latestQuote ? { ...t.latestQuote, amount: priceCents } : undefined
              }
            : t
        )
      )

      // Add a system message to the chat
      const systemMessage: Message = {
        id: `sys-${Date.now()}`,
        from: 'agent',
        fromName: 'System',
        message: `✅ ${priceModalThread.providerName} has been accepted for ${priceModalThread.serviceName}!\n\nFinal agreed price: ${formatCurrencyAUD(priceCents)}\n\nThe service provider has been notified and will proceed with the booking.`,
        timestamp: new Date(),
        type: 'confirmation',
      }

      setThreads((prevThreads) =>
        prevThreads.map((t) =>
          t.serviceId === priceModalThread.serviceId
            ? { ...t, messages: [...t.messages, systemMessage] }
            : t
        )
      )

      // Close modal
      setPriceModalThread(null)
      setFinalPrice('')

      // Refresh the page to update the main service builder
      router.refresh()
    } catch (error) {
      console.error('Failed to accept provider:', error)
    } finally {
      setIsAccepting(null)
    }
  }

  const handleSendMessage = (threadId: string) => {
    const message = messageInputs[threadId]?.trim()
    if (!message) return

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.serviceId === threadId) {
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            from: 'agent',
            fromName: 'Lee',
            message: message,
            timestamp: new Date(),
            type: 'general',
          }
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
            lastActivity: new Date(),
          }
        }
        return thread
      })
    )

    // Clear input
    setMessageInputs((prev) => ({ ...prev, [threadId]: '' }))
  }

  const handleReact = (threadId: string, messageId: string, emoji: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.serviceId === threadId) {
          return {
            ...thread,
            messages: thread.messages.map((msg) => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || []
                const existingReaction = reactions.find((r) => r.emoji === emoji)

                if (existingReaction) {
                  // Toggle reaction - remove if already reacted
                  if (existingReaction.users.includes('Lee')) {
                    return {
                      ...msg,
                      reactions: reactions
                        .map((r) =>
                          r.emoji === emoji
                            ? {
                                ...r,
                                count: r.count - 1,
                                users: r.users.filter((u) => u !== 'Lee'),
                              }
                            : r
                        )
                        .filter((r) => r.count > 0),
                    }
                  } else {
                    // Add user to existing reaction
                    return {
                      ...msg,
                      reactions: reactions.map((r) =>
                        r.emoji === emoji
                          ? { ...r, count: r.count + 1, users: [...r.users, 'Lee'] }
                          : r
                      ),
                    }
                  }
                } else {
                  // New reaction
                  return {
                    ...msg,
                    reactions: [...reactions, { emoji, count: 1, users: ['Lee'] }],
                  }
                }
              }
              return msg
            }),
          }
        }
        return thread
      })
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Service Provider Communications
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {expandedThread 
                ? '✨ Active conversation - Negotiation in progress' 
                : '📨 All providers notified - Click any service below to view conversation'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area - Show all threads, highlight selected */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4 space-y-3">
          {threads.map((thread) => {
            // Thread is dormant if it only has the initial message (hasn't been expanded yet)
            const isDormant = thread.messages.length === 1
            const isExpanded = expandedThread === thread.serviceId
            const isLoading = loadingThread === thread.serviceId
            
            return (
            <div
              key={thread.serviceId}
              className={`rounded-lg border overflow-hidden transition-all duration-300 ${
                isExpanded
                  ? 'bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 shadow-lg ring-2 ring-blue-200 dark:ring-blue-900' 
                  : isDormant
                  ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-70 hover:opacity-90'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Thread Summary */}
              <button
                onClick={() => handleThreadToggle(thread.serviceId)}
                disabled={loadingThread === thread.serviceId}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {thread.serviceName}
                      </h4>
                      {isExpanded && thread.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                          {thread.unreadCount}
                        </span>
                      )}
                      {isDormant && !loadingThread && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full">
                          📤 Request sent
                        </span>
                      )}
                      {loadingThread === thread.serviceId && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse">
                          ⚡ Loading conversation...
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={isDormant ? "text-gray-500 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"}>
                        {thread.providerName}
                      </span>
                      {!isDormant && (
                        <>
                          <span className="text-gray-400">•</span>
                          <StatusBadge status={thread.status} />
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">
                            {getRelativeTime(thread.lastActivity)}
                          </span>
                        </>
                      )}
                      {isDormant && !loadingThread && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Click to view demo
                          </span>
                        </>
                      )}
                    </div>
                    {thread.latestQuote && (
                      <div className="mt-2 text-sm font-semibold text-green-700 dark:text-green-400">
                        💰 Latest quote: {formatCurrencyAUD(thread.latestQuote.amount)} • Available {thread.latestQuote.availableDate}
                      </div>
                    )}
                  </div>
                  {loadingThread === thread.serviceId ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedThread === thread.serviceId ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* Conversation Messages - WhatsApp Group Style */}
                {expandedThread === thread.serviceId && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-500">
                    {/* Group Chat Header - WhatsApp style */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {/* Group Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {thread.serviceName.charAt(0)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {thread.serviceName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <span>You, {thread.providerName}</span>
                          </div>
                        </div>

                        {/* Accept Provider Button */}
                        {thread.status === 'quoted' && (
                          <button
                            onClick={() => handleAcceptProvider(thread)}
                            disabled={isAccepting === thread.serviceId}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {isAccepting === thread.serviceId ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Accepting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Accept Provider</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Approved Badge */}
                        {thread.status === 'approved' && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Accepted</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chat Messages Area - WhatsApp beige background */}
                    <div 
                      className="p-4 max-h-96 overflow-y-auto"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundColor: '#f0f2f5'
                      }}
                    >
                      {/* Date separator - WhatsApp style */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg shadow-sm">
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Today
                          </span>
                        </div>
                      </div>

                      {thread.messages.map((message) => (
                        <MessageBubble 
                          key={message.id} 
                          message={message} 
                          onReact={(messageId, emoji) => handleReact(thread.serviceId, messageId, emoji)}
                        />
                      ))}

                      {/* Typing indicator (mock) */}
                      {thread.status === 'active' && thread.unreadCount === 0 && (
                        <div className="flex justify-start mb-3">
                          <div className="mr-2">
                            <Avatar name={thread.providerName} type="provider" />
                          </div>
                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Reply - WhatsApp input style */}
                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleSendMessage(thread.serviceId)
                        }}
                        className="flex items-center space-x-2"
                      >
                        {/* Emoji button */}
                        <button 
                          type="button"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                          title="Add emoji"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>

                        {/* Input field */}
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={messageInputs[thread.serviceId] || ''}
                          onChange={(e) => setMessageInputs((prev) => ({ ...prev, [thread.serviceId]: e.target.value }))}
                          className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoComplete="off"
                        />

                        {/* Attachment button */}
                        <button 
                          type="button"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                          title="Attach file"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>

                        {/* Send button */}
                        <button
                          type="submit"
                          disabled={!messageInputs[thread.serviceId]?.trim()}
                          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Send message"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </form>
                      <p className="text-xs text-gray-400 mt-1.5 text-center">
                        ✨ Interactive demo - messages persist during session
                      </p>
                    </div>
                  </div>
                )}
            </div>
            )
          })}
        </div>
      </div>

      {/* Price Confirmation Modal */}
      {priceModalThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Final Price
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {priceModalThread.serviceName} - {priceModalThread.providerName}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {priceModalThread.latestQuote && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Provider's Quote
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrencyAUD(priceModalThread.latestQuote.amount)}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Available: {priceModalThread.latestQuote.availableDate}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Final Agreed Price (AUD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    className="w-full pl-8 pr-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enter the final negotiated price including GST
                </p>
              </div>

              {finalPrice && parseFloat(finalPrice) > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Final price:
                    </span>
                    <span className="text-lg font-bold text-green-900 dark:text-green-100">
                      {formatCurrencyAUD(Math.round(parseFloat(finalPrice) * 100))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setPriceModalThread(null)
                  setFinalPrice('')
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcceptance}
                disabled={!finalPrice || parseFloat(finalPrice) <= 0 || isAccepting === priceModalThread.serviceId}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isAccepting === priceModalThread.serviceId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Accept & Confirm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

