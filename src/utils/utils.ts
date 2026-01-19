import type { PickedElement } from '../content/views/types'

/**
 * Remove pseudo-classes and pseudo-elements from a selector
 */
const removePseudoClasses = (selector: string): string => {
  if (!selector) return selector
  return selector.replace(/::[^\s.]+/g, '').replace(/:[^\s.]+/g, '').trim()
}

/**
 * Clean and deduplicate class names, filter out utility framework classes
 */
const cleanClassNames = (className: string): string => {
  if (!className) return ''
  
  const separator = className.includes('.') && !className.includes(' ') ? '.' : ' '
  const classes = className.split(separator).filter(Boolean)
  const uniqueClasses = [...new Set(classes)]
  
  const filtered = uniqueClasses.filter(cls => {
    if (cls === 'dark' || cls === 'light') return false
    if (/^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group|peer):/i.test(cls)) return false
    if (/^(transition|duration|ease|animate)-/i.test(cls)) return false
    if (/\/\d+$/.test(cls)) return false
    return true
  })
  
  if (filtered.length === 0) {
    return uniqueClasses.slice(0, 3).join(' ')
  }
  
  return filtered.slice(0, 5).join(' ')
}

/**
 * Build an nth-child selector path from root -> element
 */
const buildNthChildPath = (node: Element, root: Element): string => {
  const parts: string[] = []
  let current: Element | null = node

  while (current && current !== root) {
    const parent: Element | null = current.parentElement
    if (!parent) break
    const index = Array.from(parent.children).indexOf(current) + 1
    parts.unshift(`${current.tagName.toLowerCase()}:nth-child(${index})`)
    current = parent
  }

  return parts.join(' > ')
}

export const resolveIdentifier = (
  el: PickedElement,
  rootElement?: HTMLElement | null,
  pickedNode?: HTMLElement | null,
) => {
  // If we have both root and the actual picked DOM node, build a direct path
  if (rootElement && pickedNode && rootElement.contains(pickedNode)) {
    const path = buildNthChildPath(pickedNode, rootElement)
    const rootTag = rootElement.tagName.toLowerCase()
    return path ? `${rootTag} ${path}` : rootTag
  }

  // Otherwise, attempt to locate a matching node under root by class/text
  if (rootElement) {
    const className = el.className?.trim() || ''
    const requiredClasses = cleanClassNames(removePseudoClasses(className)).split(' ').filter(Boolean)
    const textContent = el.textContent?.trim() || ''

    const candidates = Array.from(rootElement.querySelectorAll(el.tagName || '*'))
    const matchCandidate = candidates.find(candidate => {
      const candidateClasses = (candidate.className || '').split(/\s+/)
      const hasAllClasses = requiredClasses.every(c => candidateClasses.includes(c))
      const textMatch = textContent ? candidate.textContent?.trim() === textContent : true
      return hasAllClasses && textMatch
    })

    if (matchCandidate) {
      const path = buildNthChildPath(matchCandidate, rootElement)
      const rootTag = rootElement.tagName.toLowerCase()
      return path ? `${rootTag} > ${path}` : rootTag
    }
  }

  // Fallback to cleaned class/id/tag
  const className = el.className?.trim() || ''
  const cleanedClassName = cleanClassNames(removePseudoClasses(className))
  return (cleanedClassName || el.tagName || '').toString()
}

export const getIdentifierType = (el: PickedElement): 'className' | 'id' | 'tagName' => {
  const cleanedClassName = cleanClassNames(removePseudoClasses(el.className?.trim() || ''))
  if (cleanedClassName) return 'className'
  return 'tagName'
}

export const toJsonKey = (raw: string) => {
  const cleaned = raw.trim().replace(/[^A-Za-z0-9_]/g, '_') || 'key'
  return cleaned.match(/^[A-Za-z_]/) ? cleaned : `_${cleaned}`
}
