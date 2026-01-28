# 🎨 STYLE GUIDE - ListCart Design System

> ✅ **USE FOR:** Styling and Tailwind decisions only. Read BOT_BRIEF.md first.

**Purpose:** Tailwind patterns, component styles, and design consistency rules.

---

## 🎨 COLOR PALETTE

### **Primary Colors**
```typescript
// Blue (Main brand)
bg-blue-50, bg-blue-100, ..., bg-blue-900
text-blue-600, border-blue-500

// Green (Success, earnings)
bg-green-50, text-green-600, border-green-500

// Red (Errors, danger)
bg-red-50, text-red-600, border-red-500

// Gray (Neutral)
bg-gray-50 to bg-gray-900 (dark mode support)
```

### **Gradient Patterns**
```typescript
// Hero sections
className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"

// Buttons/Cards
className="bg-gradient-to-r from-green-500 to-emerald-600"

// Subtle backgrounds
className="bg-gradient-to-br from-blue-50 to-indigo-50"
```

### **Dark Mode**
Always include dark mode variants:
```typescript
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

---

## 📐 SPACING SYSTEM

### **Padding/Margin Scale**
```
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

Common usage:
- p-4: Standard card padding
- p-6: Medium sections
- p-8: Large sections
- py-24: Section vertical spacing
- px-6: Container horizontal padding
```

### **Container Widths**
```typescript
// Standard container
className="max-w-7xl mx-auto px-6"

// Narrow content
className="max-w-3xl mx-auto px-6"

// Wide content
className="max-w-screen-2xl mx-auto px-6"
```

---

## 🧩 COMPONENT PATTERNS

### **Pattern 1: Card**
```typescript
<div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
    Card Title
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Card content
  </p>
</div>
```

### **Pattern 2: Button Primary**
```typescript
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Click Me
</button>
```

### **Pattern 3: Button Secondary**
```typescript
<button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors">
  Secondary Action
</button>
```

### **Pattern 4: Input Field**
```typescript
<input
  type="text"
  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
  placeholder="Enter text..."
  autoComplete="off"
/>
```

### **Pattern 5: Checkbox**
```typescript
<input
  type="checkbox"
  checked={value}
  onChange={handler}
  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
/>
```

### **Pattern 6: Section**
```typescript
<section className="py-24 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Section Title
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        Section description
      </p>
    </div>
    {/* Section content */}
  </div>
</section>
```

### **Pattern 7: Modal/Dialog**
```typescript
{showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Modal Title
      </h3>
      {/* Modal content */}
    </div>
  </div>
)}
```

---

## 📏 TYPOGRAPHY SCALE

```typescript
// Headings
text-5xl md:text-6xl  // Hero (48px → 60px)
text-4xl md:text-5xl  // Page title (36px → 48px)
text-3xl             // Section heading (30px)
text-2xl             // Subsection (24px)
text-xl              // Large body (20px)
text-lg              // Emphasis (18px)
text-base            // Default (16px)
text-sm              // Small (14px)
text-xs              // Tiny (12px)

// Font weights
font-normal          // 400
font-medium          // 500
font-semibold        // 600
font-bold            // 700
```

---

## 🎯 RESPONSIVE DESIGN

### **Breakpoints**
```typescript
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"

// Breakpoints:
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### **Grid Layouts**
```typescript
// Responsive columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Auto-fit
className="grid grid-cols-auto-fit-300 gap-6"
```

### **Flexbox**
```typescript
// Centered content
className="flex items-center justify-center"

// Space between
className="flex items-center justify-between"

// Vertical stack
className="flex flex-col space-y-4"

// Horizontal row
className="flex items-center space-x-4"
```

---

## 🎭 STATE STYLES

### **Selected/Active**
```typescript
className={`
  border rounded-lg p-4
  ${isSelected 
    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
  }
`}
```

### **Disabled**
```typescript
className={`
  px-4 py-2 bg-blue-600 text-white rounded-lg
  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
`}
disabled={isDisabled}
```

### **Loading**
```typescript
className={`
  px-4 py-2 bg-blue-600 text-white rounded-lg
  ${isLoading ? 'opacity-75 cursor-wait' : 'hover:bg-blue-700'}
`}
```

---

## 🌈 VISUAL EFFECTS

### **Shadows**
```typescript
shadow-sm        // Subtle
shadow-md        // Default
shadow-lg        // Elevated
shadow-xl        // Prominent
shadow-2xl       // Dramatic
```

### **Hover Effects**
```typescript
// Scale up
hover:scale-105 transition-transform

// Shadow increase
hover:shadow-lg transition-shadow

// Color change
hover:bg-blue-700 transition-colors

// Combined
hover:scale-105 hover:shadow-xl transition-all
```

### **Transitions**
```typescript
transition-colors  // For color changes
transition-all     // For everything
transition-opacity // For fades
duration-200       // Fast (default)
duration-300       // Medium
duration-500       // Slow
```

---

## 🔤 COMMON UTILITY CLASSES

```typescript
// Truncate text
truncate

// Line clamp
line-clamp-2

// Aspect ratio
aspect-video, aspect-square

// Hide on mobile
hidden md:block

// Show only on mobile
block md:hidden

// Cursor
cursor-pointer, cursor-not-allowed, cursor-wait

// Select
select-none (prevent text selection)

// Backdrop
backdrop-blur-sm, backdrop-blur-md
```

---

## 📦 COMPONENT CONVENTIONS

### **Naming**
- PascalCase for components: `ServiceBuilder.tsx`
- camelCase for functions: `handleToggle`
- UPPER_SNAKE_CASE for constants: `RECOMMENDED_PACK_KEYS`

### **File Organization**
```
component-name/
├── ComponentName.tsx        (main component)
├── ComponentNameClient.tsx  (client version if needed)
└── types.ts                 (if complex types)
```

### **Props Interface**
```typescript
interface ComponentNameProps {
  title: string
  items: Item[]
  onAction?: () => void
  isLoading?: boolean
}

export function ComponentName({ 
  title, 
  items, 
  onAction, 
  isLoading = false 
}: ComponentNameProps) {
  // Component code
}
```

### **Client vs Server Components**
```typescript
// Client component (has hooks, event handlers)
'use client'
import { useState } from 'react'

// Server component (default, can use async)
// No directive needed
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

## 🎯 DESIGN PRINCIPLES

1. **Consistency** - Use existing patterns
2. **Dark Mode** - Always include `dark:` variants
3. **Accessibility** - Semantic HTML, ARIA labels
4. **Performance** - Avoid heavy animations
5. **Mobile-First** - Design for mobile, enhance for desktop
6. **Clarity** - Clear labels, obvious actions

---

## 🔍 FINDING EXISTING PATTERNS

**Before adding new styles:**
```bash
# Find how buttons are styled elsewhere
grep -r "button className" components/

# Find how cards are structured
grep -r "rounded-lg.*border" components/

# Find modal patterns
grep -r "fixed inset-0" components/
```

**Copy existing patterns** rather than inventing new ones!

---

## 🚀 QUICK STYLE CHANGES

### **Make Background Blue**
```typescript
// Find: bg-white
// Replace: bg-blue-50

// Or gradient
// Replace: bg-gradient-to-br from-blue-500 to-indigo-600
```

### **Make Text Bigger**
```typescript
// Find: text-xl
// Replace: text-2xl (or text-3xl for even bigger)
```

### **Add More Padding**
```typescript
// Find: p-4
// Replace: p-6 or p-8
```

### **Change Button Color**
```typescript
// Find: bg-blue-600 hover:bg-blue-700
// Replace: bg-green-600 hover:bg-green-700
```

---

## 📋 CHECKLIST BEFORE COMMIT

- [ ] Dark mode variants included?
- [ ] Responsive breakpoints if needed?
- [ ] Consistent with existing patterns?
- [ ] No hardcoded values (use Tailwind)?
- [ ] Transition effects for smooth UX?
- [ ] Clear, semantic class names?

---

**Golden Rule:** When in doubt, copy an existing pattern! 🎨✨

