import type { PickedElement } from './types'

export const resolveIdentifier = (el: PickedElement) => 
  (el.className?.trim() || el.id || el.tagName || '').toString()

export const getIdentifierType = (el: PickedElement): 'className' | 'id' | 'tagName' => {
  if (el.className?.trim()) return 'className'
  if (el.id) return 'id'
  return 'tagName'
}

export const toJsonKey = (raw: string) => {
  const cleaned = raw.trim().replace(/[^A-Za-z0-9_]/g, '_') || 'key'
  return cleaned.match(/^[A-Za-z_]/) ? cleaned : `_${cleaned}`
}
