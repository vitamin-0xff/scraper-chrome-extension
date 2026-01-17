# Element Selection Algorithms

This directory contains all the core algorithms for selecting and analyzing DOM elements.

## Files

### `rootElementAlgorithms.ts`
Algorithms for analyzing and selecting root container elements.

**Functions:**
- `calculateRootElementStats(element)` - Calculate comprehensive statistics about an element
- `calculateElementCount(element)` - Count similar elements using 3 strategies
- `getElementDepth(element)` - Calculate DOM depth
- `generateSelector(element)` - Generate unique CSS selector

**Tests:** `tests/rootElementAlgorithms.test.ts`

### `childElementAlgorithms.ts`
Algorithms for analyzing child elements and generating relative paths.

**Functions:**
- `removePseudoClasses(selector)` - Remove pseudo-classes and elements
- `cleanTailwindClasses(className)` - Filter out Tailwind CSS utility classes
- `detectElementType(element)` - Detect element type (text, link, image)
- `generateRelativePath(root, target)` - Generate path relative to root
- `getAbsolutePath(element)` - Generate absolute element path
- `getElementPath(element)` - Build element path array

**Tests:** `tests/childElementAlgorithms.test.ts`

## Running Tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Algorithm Details

### Count Element Strategy
Uses 3-tier approach:
1. Match by class name
2. Match by parent + tag name (siblings)
3. Match by tag name (document-wide)

### Tailwind Class Cleaning
Removes:
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- State variants: `hover:`, `focus:`, `active:`, `disabled:`
- Common utilities: `p-`, `m-`, `text-`, `bg-`, `flex:`, etc.
- Opacity modifiers: `/50`, `/75`, etc.

Keeps: Custom semantic classes like `product-card`, `item-title`

### Path Generation
Generates clean relative paths:
- Removes IDs (prone to change)
- Uses class names and tag names only
- Cleans Tailwind and pseudo-classes
- Format: `div.product > h2.title > a`

### Element Type Detection
Prioritizes:
1. Tag name (img → image, a → link)
2. Element relationships (inside a tag → link)
3. Attributes (href → link, src → image)
4. Default: text
