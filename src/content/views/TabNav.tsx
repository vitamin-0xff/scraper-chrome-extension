type Props = {
  activeTab: 'pick' | 'table' | 'preview' | 'pagination'
  onTabChange: (tab: 'pick' | 'table' | 'preview' | 'pagination') => void
}

function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px'}} className="s">
      <button
        onClick={() => onTabChange('pick')}
        className={"btn " + (activeTab === 'pick' ? ' active-a' : ' not-active')}
      >
        Picker
      </button>
      <button
        onClick={() => onTabChange('table')}
        className={"btn " + (activeTab === 'table' ? ' active-a' : ' not-active')}
      >
        Table
      </button>
      <button
        onClick={() => onTabChange('pagination')}
        className={"btn " + (activeTab === 'pagination' ? ' active-a' : ' not-active')}
      >
        Pagination
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={"btn " + (activeTab === 'preview' ? ' active-a' : ' not-active')}
      >
        Preview & Execute
      </button>
    </div>
  )
}

export default TabNav
