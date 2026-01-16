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
        className='cont cont-fill s'
    >
      <div className='card'>
        <h3 className='header'>Save selection</h3>
        <p className='header-note'>
          (First selection root)
        </p>
      </div>
      <input
        type="text"
        value={customName}
        placeholder="Name (JSON key safe)"
        onChange={e => onNameChange(toJsonKey(e.target.value))}
        className='form-input bs'
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px' }}>
        <input
          type="checkbox"
          checked={isArray}
          className='bs'
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
