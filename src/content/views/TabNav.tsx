export type StatusTab = 'root' | 'children' | 'pagination' | 'preview'
type Props = {
  activeTab: StatusTab
  onTabChange: (tab: StatusTab) => void
}

function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px'}} className="s">
      <button
        onClick={() => onTabChange('root')}
        className={"btn " + (activeTab === 'root' ? ' active-a' : ' not-active')}
      >
        Root
      </button>
      <button
        onClick={() => onTabChange('children')}
        className={"btn " + (activeTab === 'children' ? ' active-a' : ' not-active')}
      >
        Children
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
        Preview
      </button>
    </div>
  )
}

export default TabNav
