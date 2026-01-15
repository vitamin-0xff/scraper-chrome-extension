import type { PickedElement } from './types'
import { resolveIdentifier } from './utils'

type Props = {
  element: PickedElement
}

function SelectedElementInfo({ element }: Props) {
  return (
    <div
      style={{
        margin: '10px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '12px',
      }}
    >
      <strong>Selected:</strong>
      <p>&lt;{element.tagName.toLowerCase()}&gt;</p>
      <p><strong>Identifier:</strong> {resolveIdentifier(element)}</p>
      {element.href && (
        <p>
          <strong>Href:</strong> {element.href}
        </p>
      )}
      {element.textContent && (
        <p>
          <strong>Text:</strong> {element.textContent.substring(0, 100)}
        </p>
      )}
    </div>
  )
}

export default SelectedElementInfo
