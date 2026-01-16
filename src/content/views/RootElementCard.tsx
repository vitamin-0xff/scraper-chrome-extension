import type { SelectionItem } from './types'

type Props = {
  rootElement: SelectionItem
  onRemove: (id: string) => void
}

function RootElementCard({ rootElement, onRemove }: Props) {
  return (
    <div
    className='cont cont-fill s'
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className='header s' >Root Element</p>
          <p style={{ margin: 0, fontSize: '12px' }}>
            <strong>Name:</strong> {rootElement.name}
          </p>
          <p style={{ margin: 0, fontSize: '12px' }}>
            <strong>Tag:</strong> <code style={{ fontSize: '11px', color: '#e91e63' }}>&lt;{rootElement.tagName}&gt;</code>
          </p>
          <p style={{ margin: 0, fontSize: '12px' }}>
            <strong>Identifier:</strong> {rootElement.className} ({rootElement.identifierType})
          </p>
        </div>
        <button
          onClick={() => onRemove(rootElement.id)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default RootElementCard
