export type StatusTab = 'root' | 'children' | 'pagination' | 'preview'
type Props = {
  activeTab: StatusTab
  onTabChange: (tab: StatusTab) => void
}

function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px'}} className="crx-ext-s">
      <button
        onClick={() => onTabChange('root')}
        className={"crx-ext-btn " + (activeTab === 'root' ? ' crx-ext-active-a' : ' crx-ext-not-active')}
      >
        Root
      </button>
      <button
        onClick={() => onTabChange('children')}
        className={"crx-ext-btn " + (activeTab === 'children' ? ' crx-ext-active-a' : ' crx-ext-not-active')}
      >
        Children
      </button>

      <button
        onClick={() => onTabChange('pagination')}
        className={"crx-ext-btn " + (activeTab === 'pagination' ? ' crx-ext-active-a' : ' crx-ext-not-active')}
      >
        Pagination
      </button>

      <button
        onClick={() => onTabChange('preview')}
        className={"crx-ext-btn " + (activeTab === 'preview' ? ' crx-ext-active-a' : ' crx-ext-not-active')}
      >
        Preview
      </button>
    </div>
  )
}

export default TabNav
