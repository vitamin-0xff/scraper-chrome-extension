# Extractor Chrome Extension

A powerful Chrome extension for selecting, managing, and exporting DOM elements from web pages. Built with React, TypeScript, and Vite.

## Overview

Extractor allows you to:
- **Pick elements** from any webpage with an intuitive element picker
- **Organize selections** with root elements and child hierarchies
- **Store metadata** including element type, CSS selectors, and custom names
- **Export configurations** for data extraction workflows

## Core Features

### Element Picker
- Click "Pick Element" to activate the interactive element picker
- Hover over elements to see them highlighted with a red outline
- Hover tooltips display the element's identifier (className/id/tagName)
- Press ESC to cancel picking

### Selection Management
- **Root Elements**: Designate one element as the root/container
- **Child Elements**: Select multiple child elements under the root
- **Automatic Tagging**: Stores element type (`<div>`, `<a>`, `<span>`, etc.)
- **Identifier Priority**: Detects and stores element identifiers in order of priority:
  1. CSS class name (`.className`)
  2. Element ID (`#id`)
  3. HTML tag name (`div`, `span`, etc.)

### Name Sanitization
- Custom names are automatically converted to JSON-safe keys
- Removes special characters and replaces them with underscores
- Handles names starting with numbers by prefixing with underscore
- Example: `"Product Title"` → `"Product_Title"`

### Data Storage
Each selection stores:
- **Name**: JSON-safe custom identifier
- **Tag**: HTML element type
- **Identifier**: Class name, ID, or tag name
- **Identifier Type**: Which type was used (className/id/tagName)
- **Href**: URL for links
- **Role**: root or child element
- **Array Flag**: Whether element represents an array/list

### UI Tabs
- **Picker Tab**: Element selection interface
- **Table Tab**: View and manage all saved selections

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Usage Guide

### Basic Workflow

1. **Open the Extension**: Click the extension icon in the Chrome toolbar
2. **Pick Elements**:
   - Click "Pick Element" button
   - Hover over elements to preview them
   - Click to select
   - ESC to cancel
3. **Name Your Selection**: Enter a custom name (auto-sanitized to JSON-safe format)
4. **Check Array Flag**: Toggle if element represents a collection
5. **Set as Root or Child**: First element becomes root, subsequent elements are children
6. **View Results**: Switch to "Table" tab to see all selections

### Example: Extracting Product Data

```
Root Element: <div class="product-card">
├─ Product Name: <h2 class="product-title">
├─ Price: <span class="product-price">
├─ Link: <a class="product-link">
└─ Images: <img class="product-image"> (Array flag: Yes)
```

## Project Structure

```
src/
├── background.ts                 # Service worker for message routing
├── content/
│   ├── main.tsx                 # Content script entry point
│   └── views/
│       ├── App.tsx              # Main component (186 lines - refactored)
│       ├── App.css              # Styling
│       ├── types.ts             # TypeScript type definitions
│       ├── utils.ts             # Utility functions
│       ├── useElementPicker.ts   # Custom hook for element picking logic
│       ├── TabNav.tsx            # Tab navigation component
│       ├── RootElementCard.tsx   # Root element display card
│       ├── SelectedElementInfo.tsx # Selected element preview
│       ├── SelectionForm.tsx     # Form for saving selections
│       └── SelectionTable.tsx    # Table view of selections
├── assets/                      # Static assets
├── popup/                       # Extension popup UI
└── devtools/                    # DevTools page (future expansion)

manifest.config.ts              # Chrome extension manifest configuration
vite.config.ts                  # Vite build configuration
```

## Architecture & Implementation Details

### Element Picking System
- **`useElementPicker.ts` Hook**: Encapsulates all picking logic with mouse tracking, highlighting, and tooltip positioning
- **Data Attributes**: Uses `data-element-picker-hover` attribute for highlighting instead of class names to avoid style conflicts
- **Tooltip**: Follows cursor with identifier information displayed as `identifier (type)`

### Type System (TypeScript)
```typescript
type PickedElement = {
  tagName: string              // HTML element type
  id: string | null            // Element ID attribute
  className: string | null     // CSS classes
  outerHTML: string            // Element markup
  textContent: string          // Text content
  href?: string | null         // URL for links
}

type SelectionItem = {
  id: string                   // Unique identifier
  name: string                 // JSON-safe custom name
  className: string            // Element identifier
  tagName: string              // HTML tag type
  identifierType: 'className' | 'id' | 'tagName'
  href?: string | null         // URL reference
  role: 'root' | 'child'       // Element role
  parentId?: string | null     // Reference to parent
  isItArrya: boolean           // Array flag
}
```

### Validation & Constraints
- **Duplicate Names**: Prevents saving selections with duplicate names
- **Single Root**: Only one root element allowed per extraction schema
- **JSON-Key Sanitization**: All names automatically converted to valid JavaScript identifiers
- **Identifier Priority**: System automatically determines which identifier to use

### Component Architecture
- **App.tsx** (186 lines): Main state management and composition layer
- **Refactored Components**: 7 focused, reusable components for UI composition
- **Custom Hooks**: Element picker logic isolated in `useElementPicker.ts`
- **Utility Functions**: Shared logic in `utils.ts` (identifier resolution, sanitization)

## Technology Stack

- **React 18+**: UI framework with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with HMR
- **CRXJS**: Chrome extension bundling
- **Chrome APIs**: 
  - `chrome.runtime.onMessage` - Message passing
  - `chrome.tabs.sendMessage` - Background to content communication
  - DOM APIs - Element selection and manipulation

## Roadmap & Future Enhancements

### High Priority
- [ ] **Data Persistence**: Save selections to Chrome storage
- [ ] **Export/Import**: JSON configuration export/import
- [ ] **Live Preview**: Real-time data extraction preview
- [ ] **Copy to Clipboard**: Copy selectors and configs

### Medium Priority
- [ ] **Better CSS Selectors**: Generate robust compound selectors
- [ ] **Keyboard Shortcuts**: Global extension shortcuts
- [ ] **Multiple Schemas**: Support different extraction patterns
- [ ] **Inline Editing**: Edit selections in table view

### Advanced Features
- [ ] **XPath Support**: Alternative to CSS selectors
- [ ] **Nested Objects**: Support hierarchical data structures
- [ ] **Text Extraction**: Regex patterns for text parsing
- [ ] **CSV Export**: Export extracted data

## Known Issues & Notes

- Extension icon requires proper `crx.svg` asset
- DevTools integration not currently used (native inspector API limitations)
- Works best with stable class names and IDs

## Contributing

Contributions welcome! Areas for improvement:
- CSS selector robustness
- Data export formats
- UI/UX enhancements
- Performance optimization

## License

MIT
