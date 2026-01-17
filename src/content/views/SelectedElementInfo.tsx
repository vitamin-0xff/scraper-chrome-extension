import type { PickedElement } from './types'
import { resolveIdentifier } from '../../utils/utils'

type Props = {
  element: PickedElement
}

function SelectedElementInfo({ element }: Props) {
  return (
    <div
        className='cont cont-fill s'
    >
      
      <p className='s'>
        <strong>Selected: </strong>
        &lt;{element.tagName.toLowerCase()}&gt;</p>
      <p className='s'><strong>Identifier:</strong> {resolveIdentifier(element)}</p>
      {element.href && (
        <p className='s'>
          <strong>Href:</strong> {element.href}
        </p>
      )}
      {element.textContent && (
        <p className='s'>
          <strong>Text:</strong> {element.textContent.substring(0, 100)}
        </p>
      )}
    </div>
  )
}

export default SelectedElementInfo
