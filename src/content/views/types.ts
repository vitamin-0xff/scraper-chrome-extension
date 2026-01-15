export type PickedElement = {
  tagName: string
  id: string | null
  className: string | null
  outerHTML: string
  textContent: string
  href?: string | null
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
