type Props = {
  activeTab: 'pick' | 'table' | 'pagination'
  onTabChange: (tab: 'pick' | 'table' | 'pagination') => void
}

function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px', margin: '10px' }}>
      <button
        onClick={() => onTabChange('pick')}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: activeTab === 'pick' ? '#3498db' : '#fff',
          color: activeTab === 'pick' ? '#fff' : '#000',
          cursor: 'pointer',
        }}
      >
        Picker
      </button>
      <button
        onClick={() => onTabChange('table')}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: activeTab === 'table' ? '#3498db' : '#fff',
          color: activeTab === 'table' ? '#fff' : '#000',
          cursor: 'pointer',
        }}
      >
        Table
      </button>
      <button
        onClick={() => onTabChange('pagination')}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: activeTab === 'pagination' ? '#3498db' : '#fff',
          color: activeTab === 'pagination' ? '#fff' : '#000',
          cursor: 'pointer',
        }}
      >
        Pagination
      </button>
    </div>
  )
}

export default TabNav
