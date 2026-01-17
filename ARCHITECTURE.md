# Project Architecture & Step-Based Flow

## Overview
A Chrome extension for intelligent web scraping with a 3-step sequential workflow for element selection and pagination configuration.

## Architecture

### Step 1: Select Root Element
**File:** `src/content/views/steps/SelectRootElement.tsx`

- Identifies the repeating container element
- Uses element picker to highlight elements on page
- Calculates and displays comprehensive statistics:
  - Count on page (similar elements)
  - DOM depth
  - Direct children count
  - Semantic selector

**Algorithms Used:**
- `calculateElementCount()` - 3-tier counting strategy
- `getElementDepth()` - DOM tree depth calculation
- `generateSelector()` - Unique CSS selector generation
- `calculateRootElementStats()` - Complete statistics

### Step 2: Select Child Elements
**File:** `src/content/views/steps/SelectChildren.tsx`

- Selects individual data points within root elements
- Supports 3 element types: Text, Link, Image
- Generates unique relative paths from root
- Configurable extraction options per type

**Features:**
- Automatic element type detection
- Path preview and editing
- List vs Single element toggle
- Type-specific extraction options:
  - **Text:** Extract text content
  - **Link:** Extract text + href
  - **Image:** Extract src + alt attributes

**Algorithms Used:**
- `detectElementType()` - Auto-detect element type
- `generateRelativePath()` - Path relative to root
- `cleanTailwindClasses()` - Remove utility classes
- `removePseudoClasses()` - Clean selectors

### Step 3: Configure Pagination
**File:** `src/content/views/steps/SelectPagination.tsx`

- Set up URL structure for multi-page iteration
- Configure page parameters and additional query params
- Live URL preview showing first, second, and last page URLs

**Configuration:**
- Base URL
- Page parameter name (e.g., "page", "p", "offset")
- Starting value
- Maximum pages to fetch
- Additional query parameters

## Data Flow

```
App.tsx (State Manager)
├── rootNativeElement: HTMLElement
├── childElements: ChildElement[]
├── paginationConfig: PaginationConfig
│
├── SelectRootElement
│   └── onRootElementSelected(element)
│
├── SelectChildren
│   ├── onChildElementAdded(child)
│   └── onChildElementRemoved(id)
│
└── SelectPagination
    └── onConfigChange(config)
```

## Algorithms Directory

**Location:** `src/content/views/algorithms/`

### rootElementAlgorithms.ts
- `calculateRootElementStats()` - Main stats calculator
- `calculateElementCount()` - Count similar elements
- `getElementDepth()` - Calculate DOM depth
- `generateSelector()` - Create unique selectors

### childElementAlgorithms.ts
- `detectElementType()` - Identify element type
- `removePseudoClasses()` - Clean pseudo-classes
- `cleanTailwindClasses()` - Remove utility classes
- `generateRelativePath()` - Create relative paths
- `getAbsolutePath()` - Create absolute paths
- `getElementPath()` - Build path array

## Testing

**Test Files:**
- `tests/rootElementAlgorithms.test.ts` - 20+ tests
- `tests/childElementAlgorithms.test.ts` - 25+ tests

**Run Tests:**
```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Types

**ChildElement:**
```typescript
{
  id: string
  name: string
  type: 'text' | 'link' | 'image'
  path: string
  isList: boolean
  extractText?: boolean
  extractHref?: boolean
  extractSrc?: boolean
  extractAlt?: boolean
}
```

**PaginationConfig:**
```typescript
{
  baseUrl: string
  pageParam: string
  pageParamValue: string
  maxPages: number
  otherParams: Record<string, string>
}
```

## Key Features

1. **Smart Element Detection**
   - Automatic type detection (text/link/image)
   - Count similar elements on page
   - DOM depth analysis

2. **Clean Path Generation**
   - Removes IDs (prone to change)
   - Filters Tailwind CSS classes
   - Removes pseudo-classes/elements
   - Relative to root element

3. **Sequential Workflow**
   - Step 1: Root element selection
   - Step 2: Child element configuration
   - Step 3: Pagination setup

4. **Comprehensive Testing**
   - 45+ unit tests
   - DOM manipulation tests
   - Algorithm validation

## Next Steps

1. Implement data extraction logic
2. Add preview/execution step
3. Implement multi-page fetching
4. Add data export (JSON, CSV)
5. Create storage/history of configurations
6. Add URL pattern detection for pagination
