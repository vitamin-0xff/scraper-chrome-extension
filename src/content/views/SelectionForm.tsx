import { toJsonKey } from './utils'

type Props = {
  customName: string
  isArray: boolean
  hasRootElement: boolean
  canAddSelection: boolean
  onNameChange: (name: string) => void
  onArrayChange: (isArray: boolean) => void
  onAddSelection: () => void
}

function SelectionForm({
  customName,
  isArray,
  canAddSelection,
  onNameChange,
  onArrayChange,
  onAddSelection,
}: Props) {
  return (
    <div
      style={{
        width: 768,
        margin: '10px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #ddd',
      }}
    >
      <div className='mb-1' style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <h3 style={{ marginTop: 0 }}>Save selection</h3>
        <p className='text-sm m-0 text-gray-500'>
          (First selection root)
        </p>
      </div>
      <input
        type="text"
        value={customName}
        placeholder="Name (JSON key safe)"
        onChange={e => onNameChange(toJsonKey(e.target.value))}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px' }}>
        <input
          type="checkbox"
          checked={isArray}
          onChange={e => onArrayChange(e.target.checked)}
        />
        Array
      </label>
      <button
        onClick={onAddSelection}
        disabled={!canAddSelection}
        style={{
          padding: '8px 12px',
          backgroundColor: canAddSelection ? '#3498db' : '#999',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: canAddSelection ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
        }}
      >
        Add to table
      </button>
    </div>
  )
}

export default SelectionForm
