# 🎯 CHANGE PLAYBOOK - Standard Operating Procedures

**Purpose:** Step-by-step guide for making changes safely and efficiently.

---

## 🚀 STANDARD WORKFLOW

### **Step 1: LOCATE**
```bash
# Find the file you need
grep -r "text you're looking for" app/
# or check BOT_MANIFEST.md

# Example: Finding the pricing section
grep -r "Transparent Pricing" app/
# → app/page.tsx:251
```

### **Step 2: READ**
```bash
# Read the file
cat app/page.tsx | head -300 | tail -50
# or use your editor
```

### **Step 3: EDIT**
```bash
# Make your change
# Use your editor or sed/awk if simple
nano app/page.tsx
```

### **Step 4: VERIFY**
```typescript
// Check syntax (optional - Vercel will catch errors)
npx tsc --noEmit
// or just visual inspection
```

### **Step 5: COMMIT**
```bash
git add app/page.tsx
git commit -m "UI: Change pricing section background to blue"
```

### **Step 6: PUSH**
```bash
git push origin main
```

### **Step 7: MONITOR**
- Vercel auto-deploys in ~2 minutes
- Check build logs if needed
- Test on production URL

---

## 📋 CHANGE TEMPLATES

### **TEMPLATE 1: Simple Text Change**
```bash
# 1. Locate
grep -r "old text" app/

# 2. Edit (using sed example)
sed -i 's/old text/new text/g' app/page.tsx

# 3. Commit & Push
git add app/page.tsx
git commit -m "UI: Update hero text to 'new text'"
git push origin main
```

### **TEMPLATE 2: CSS/Style Change**
```bash
# 1. Locate component
cat components/Navbar.tsx

# 2. Find className and modify
# Change: bg-white
# To: bg-blue-50

# 3. Commit & Push
git add components/Navbar.tsx
git commit -m "Style: Change navbar background to light blue"
git push origin main
```

### **TEMPLATE 3: Add New Element**
```bash
# 1. Locate insertion point
cat app/page.tsx | grep -A 5 "Hero Section"

# 2. Add new JSX
# Insert after line X

# 3. Commit & Push
git add app/page.tsx
git commit -m "UI: Add new CTA button to hero section"
git push origin main
```

---

## 🎨 COMMON CHANGE PATTERNS

### **Pattern 1: Change Background Color**
```typescript
// Before
<div className="bg-white">

// After
<div className="bg-blue-50">
```

**Tailwind Colors:**
- `bg-white` - white
- `bg-gray-50` to `bg-gray-900` - grays
- `bg-blue-500`, `bg-red-600`, etc. - colors
- `bg-gradient-to-r from-blue-500 to-purple-600` - gradients

### **Pattern 2: Change Text Color**
```typescript
// Before
<h1 className="text-gray-900">

// After
<h1 className="text-blue-600">
```

### **Pattern 3: Add Spacing**
```typescript
// Before
<div className="p-4">

// After
<div className="p-8"> // Double padding

// Options:
// p-0, p-1, p-2, p-4, p-6, p-8, p-12, p-16
// px-4 (horizontal), py-4 (vertical)
// pt-4 (top), pb-4 (bottom), pl-4 (left), pr-4 (right)
```

### **Pattern 4: Change Button Style**
```typescript
// Before
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

// After - Make larger and bolder
<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg">
```

### **Pattern 5: Update Hover State**
```typescript
// Before
<button className="hover:bg-gray-100">

// After - More dramatic hover
<button className="hover:bg-gray-200 hover:scale-105 transition-all">
```

---

## 🚨 GUARDRAILS & CHECKS

### **Before Editing - ASK:**

✅ **Safe to proceed if:**
- Changing text/copy
- Modifying CSS classes
- Adjusting layout/spacing
- Updating colors
- Adding simple UI elements

❌ **Stop and ask if:**
- File is `lib/actions.ts`
- File is `prisma/schema.prisma`
- File is in `app/api/`
- File is `.env*` (you won't see it anyway)
- Adding new database queries
- Changing authentication logic
- Modifying payment/billing code

### **After Editing - CHECK:**

1. **Syntax:** Does the code look right?
2. **Matching brackets:** `{`, `}`, `(`, `)` all closed?
3. **Quotes:** All strings properly quoted?
4. **TypeScript:** No obvious type errors?

### **After Pushing - MONITOR:**

1. Check Vercel deployment status
2. Look for build errors
3. If build fails, read error message and fix
4. Test on production after deploy

---

## 🔧 TROUBLESHOOTING

### **Build Fails - Common Issues**

**Error: "Type error: Property X does not exist"**
```
Fix: Check TypeScript types
- Did you use the right prop name?
- Is the component expecting different props?
```

**Error: "Unexpected token"**
```
Fix: Syntax error
- Missing closing bracket?
- Unclosed string?
- Comma in wrong place?
```

**Error: "Cannot find module"**
```
Fix: Import error
- Check import path
- Is component exported?
- Typo in filename?
```

### **Fix & Retry**
```bash
# Fix the issue locally
git add .
git commit -m "Fix: Correct syntax error in previous commit"
git push origin main
```

---

## 📝 COMMIT MESSAGE GUIDE

### **Format**
```
Type: Brief description (under 60 chars)

Optional body with more context.
```

### **Types**
- `UI:` - Visual changes to user interface
- `Fix:` - Bug fixes
- `Style:` - CSS/styling only (no logic change)
- `Refactor:` - Code restructure (no feature change)
- `Perf:` - Performance improvements
- `Docs:` - Documentation updates
- `Feat:` - New feature (rare for bot)

### **Good Examples**
```
UI: Change hero background to gradient blue

Style: Update button hover states for better UX

Fix: Correct alignment of pricing cards on mobile

UI: Add margin to navbar logo for better spacing

Style: Increase font size of hero text to 5xl

UI: Change CTA button color to match brand
```

### **Bad Examples**
```
changed stuff                    // Too vague
Updated the page                 // What page? What update?
asdf                            // Meaningless
Fixed bug                       // What bug?
```

---

## 🎯 QUICK REFERENCE CARDS

### **Card 1: Simple CSS Change**
```bash
1. grep -r "classname" app/           # Find
2. nano app/page.tsx                  # Edit
3. Change bg-white → bg-blue-50       # Modify
4. git add app/page.tsx               # Stage
5. git commit -m "Style: Change bg"   # Commit
6. git push origin main               # Deploy
```

### **Card 2: Text Update**
```bash
1. grep -r "old text" app/            # Find
2. sed -i 's/old/new/g' app/page.tsx  # Replace
3. git add app/page.tsx               # Stage
4. git commit -m "UI: Update text"    # Commit
5. git push origin main               # Deploy
```

### **Card 3: Add Element**
```bash
1. cat app/page.tsx | grep -A 10 "section" # Find spot
2. nano app/page.tsx                  # Edit
3. Insert new JSX at line X           # Add
4. git add app/page.tsx               # Stage
5. git commit -m "UI: Add new CTA"    # Commit
6. git push origin main               # Deploy
```

---

## ⚡ SPEED TIPS

1. **Use BOT_MANIFEST.md** first - don't search blindly
2. **Read STYLE_GUIDE.md** for Tailwind patterns
3. **Commit often** - small changes are safer
4. **Clear messages** - future you will thank you
5. **Push immediately** - don't batch changes
6. **Watch first deploy** - learn the timing
7. **Trust TypeScript** - if it compiles, it usually works

---

## 🚫 ANTI-PATTERNS (Don't Do This)

❌ **Making multiple unrelated changes in one commit**
```
"Updated navbar, pricing, footer, and fixed bug"
// Split into 4 commits!
```

❌ **Pushing without commit message**
```
git commit -m "update"
// Be specific!
```

❌ **Editing files you don't understand**
```
// If you don't know what lib/actions.ts does, ASK FIRST
```

❌ **Changing database schema directly**
```
// prisma/schema.prisma is HIGH-RISK
// Always ask before touching
```

❌ **Batch testing multiple changes**
```
// Make one change, test, then next change
// Don't make 10 changes and hope they all work
```

---

## ✅ BEST PRACTICES

✅ **One logical change per commit**
✅ **Test after each deploy**
✅ **Read code before editing**
✅ **Ask when uncertain**
✅ **Document complex changes** (in commit body)
✅ **Follow existing patterns** (consistency matters)
✅ **Use version tags** (v-xxxxxxx in bottom-left corner)

---

**Remember:** You're fast because you're careful. Careful because you're fast. Balance speed with safety! 🎯🚀

