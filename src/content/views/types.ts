export type PickedElement = {
  tagName: string
  className: string | null
  outerHTML: string
  textContent: string
  href?: string | null
  src?: string | null
  selector: string
  index: number
}

export type ElementType = 'text' | 'image' | 'link'

export type ChildElement = {
  id: string
  name: string
  type: ElementType
  path: string
  isList: boolean
  // Type-specific fields
  extractText?: boolean  // for text and link types
  extractHref?: boolean  // for link type
  extractSrc?: boolean   // for image type
  extractAlt?: boolean   // for image type
}

export type SelectionItem = {
  id: string
  name: string
  className: string
  tagName: string
  isItArrya: boolean
  href?: string | null
  role: 'root' | 'child'
  parentId?: string | null
  identifierType: 'className' | 'id' | 'tagName'
}
