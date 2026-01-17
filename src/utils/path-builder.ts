/**
 * Returns all CSS-like paths for elements containing the exact text
 */
export function findTextPaths(
  root: HTMLElement,
  targetText: string
): string[] {
  const paths: string[] = []

  function traverse(element: HTMLElement, parentPath: string) {
    if (shouldSkip(element)) return

    // Normalize whitespace for comparison
    // const text = element.textContent?.replace(/\s+/g, ' ').trim()
    // if (text === targetText) {
    //   const path = buildPath(element, parentPath)
    //   paths.push(path)
    // }

    // Check direct text nodes only
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.replace(/\s+/g, ' ').trim()
        if (text?.toLocaleLowerCase().trim() === targetText.toLowerCase().trim()) {
          const path = buildPath(element, parentPath)
          paths.push(path)
        }
      }
    }


    // Recurse on children
    for (const child of Array.from(element.children)) {
      if (child instanceof HTMLElement) {
        traverse(child, buildPath(element, parentPath))
      }
    }
  }

  traverse(root, '')
  return paths
}

function shouldSkip(element: HTMLElement): boolean {
  const tag = element.tagName.toLowerCase()
  return ['script', 'style', 'noscript'].includes(tag)
}

function buildPath(element: HTMLElement, parentPath: string): string {
  const tag = element.tagName.toLowerCase()
  const index = getNthOfTypeIndex(element)
  const self = `${tag}:nth-of-type(${index})`
  return parentPath ? `${parentPath} > ${self}` : self
}

function getNthOfTypeIndex(element: HTMLElement): number {
  let index = 1
  let sibling = element.previousElementSibling
  while (sibling) {
    if (sibling.tagName === element.tagName) {
      index++
    }
    sibling = sibling.previousElementSibling
  }
  return index
}