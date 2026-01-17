# Quick Start Guide

## Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## How to Use the Extension

### Step 1: Select Root Element
1. Open the extension popup
2. Click **"Pick Root Element"** button
3. Click on a repeating container element on the page (e.g., product card)
4. Extension shows:
   - Count of similar elements
   - Element statistics
   - Semantic selector
5. Element stays selected when switching tabs

### Step 2: Select Child Elements
1. Navigate to **"Children"** tab
2. For each data point you want to extract:
   - Click **"Pick Child Element"**
   - Click on the element to extract (title, price, link, etc.)
   - Type a name (e.g., "product_title")
   - Type adjusts automatically based on type (Text/Link/Image)
   - Configure extraction options based on type
   - Click **"Add Child"**
3. All selected children appear in a list below

### Step 3: Configure Pagination
1. Navigate to **"Pagination"** tab
2. Enter base URL: `https://example.com/products`
3. Set page parameter: `page` (or `p`, `offset`, etc.)
4. Set starting value: `1` (or `0`)
5. Set max pages: `10` (how many pages to fetch)
6. Add extra parameters if needed (sort, filter, etc.)
7. Preview shows actual URLs that will be fetched
8. Click **"Apply Configuration"**

## Element Types

### Text
- Extracts: Text content
- Auto-detects: Most elements with text

### Link
- Extracts: Text content + href
- Auto-detects: `<a>` tags or elements with href

### Image
- Extracts: src + alt attributes
- Auto-detects: `<img>` tags or elements with src

## Configuration Format

URLs will be constructed as:
```
{baseUrl}?{pageParam}={startValue}&{otherParams}
```

Example:
```
https://example.com/products?page=1&sort=newest&filter=active
https://example.com/products?page=2&sort=newest&filter=active
https://example.com/products?page=3&sort=newest&filter=active
```

## Data Flow

1. **Root Element**: Identifies repeating containers
2. **Child Elements**: Identifies data within containers
3. **Pagination**: Sets up multi-page iteration

When you execute extraction:
- For each page (1 to maxPages):
  - Fetch page URL
  - Find all root elements
  - Extract child elements from each root
  - Combine into dataset

## Tips

### Finding the Right Root Element
- Look for repeating structures
- Should contain all child elements you want
- Usually a div, li, tr, or article
- Count should be > 1

### Creating Clean Paths
- Paths are relative to root element
- Tailwind classes automatically filtered
- IDs are excluded (too specific)
- Format: `tag.class > tag.class`

### Configurable Extraction
- Text: Best for headings, descriptions
- Links: For URLs and navigation
- Images: For image URLs and alt text
- Toggle "Is List" for multiple items per root

## Troubleshooting

### Element not picking
- Ensure root element is selected first
- ESC to cancel picking mode
- Click elsewhere and retry

### Paths not generating
- Make sure target is inside root element
- Try clicking parent element
- Check browser console for errors

### Tests failing
```bash
npm run test -- --reporter=verbose
```

## File Structure

```
src/content/views/
├── App.tsx (Main container)
├── steps/
│   ├── SelectRootElement.tsx
│   ├── SelectChildren.tsx
│   └── SelectPagination.tsx
├── algorithms/
│   ├── rootElementAlgorithms.ts
│   └── childElementAlgorithms.ts
└── App.css (All styles)

tests/
├── rootElementAlgorithms.test.ts
└── childElementAlgorithms.test.ts
```

## Next Development

To add more features:

1. Create new step component in `src/content/views/steps/`
2. Add to TabNav options
3. Import and add to App.tsx
4. Create algorithms if needed in `src/content/views/algorithms/`
5. Add tests in `tests/`

## Architecture Principles

- **Separation of Concerns**: Algorithms separate from components
- **Type Safety**: Full TypeScript support
- **Testability**: All algorithms have unit tests
- **Scalability**: Easy to add new steps and algorithms
- **Maintainability**: Clear naming and documentation

## Support

See `ARCHITECTURE.md` for detailed architecture
See `PROGRESS.md` for completed features
See `src/content/views/algorithms/README.md` for algorithm details
