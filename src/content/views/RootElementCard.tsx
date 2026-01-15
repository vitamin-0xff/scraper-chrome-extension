import type { SelectionItem } from './types'

type Props = {
  rootElement: SelectionItem
  onRemove: (id: string) => void
}

function RootElementCard({ rootElement, onRemove }: Props) {
  return (
    <div
      style={{
        margin: '10px',
        padding: '10px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        border: '1px solid #4caf50',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, marginBottom: '4px', color: '#2e7d32' }}>Root Element</h4>
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
