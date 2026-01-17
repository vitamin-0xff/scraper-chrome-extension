# Utils Test Coverage

## Overview
Comprehensive unit tests for `resolveIdentifier`, `getIdentifierType`, and `toJsonKey` functions in [src/content/views/utils.ts](../src/content/views/utils.ts).

## Test Suite Summary

### `resolveIdentifier` - 19 tests

#### With Picked DOM Node (4 tests)
Tests when both root element and actual picked DOM node are provided:
- Generates nth-child path from root to picked node
- Handles deeply nested elements correctly
- Handles elements with siblings (correct nth-child index)
- Returns root tag when picked node is the root itself

#### Without Picked DOM Node (4 tests)
Tests class/text matching fallback when only PickedElement data is available:
- Matches elements by cleaned class names
- Matches by text content when classes are filtered
- Matches elements with multiple valid classes
- Handles pseudo-class removal in matching logic

#### Fallback to Cleaned Class/ID/Tag (7 tests)
Tests when no root element is provided:
- Returns cleaned class name
- Strips pseudo-classes from fallback
- Prefers id over class name
- Returns tag name when no class or id
- Handles pseudo-elements (::before, ::after)
- Filters out opacity modifiers (/70, /50)
- Returns first 3 classes when all are filtered

#### Edge Cases (4 tests)
- Handles element not contained in root
- Handles empty class name
- Handles whitespace-only class name
- Handles dot-separated class names

### `getIdentifierType` - 4 tests
- Returns "className" when element has cleaned class
- Returns "id" when element has id but no valid class
- Returns "tagName" when element has neither
- Ignores pseudo-classes when determining type

### `toJsonKey` - 6 tests
- Converts strings to valid JSON keys
- Replaces special characters with underscores
- Handles strings starting with numbers
- Handles empty or whitespace strings
- Preserves valid identifiers
- Handles multiple consecutive special characters

## Running Tests

```bash
# Run once
npm test

# Watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Key Behaviors Tested

1. **nth-child Path Generation**: Builds accurate CSS selector paths from root to target element
2. **Pseudo-class Removal**: Strips `:hover`, `:focus`, `::before`, etc. from class names
3. **Utility Class Filtering**: Removes Tailwind and other framework utility classes
4. **Fallback Logic**: Gracefully degrades when optimal information isn't available
5. **Edge Case Handling**: Robust behavior for empty, invalid, or unusual inputs
