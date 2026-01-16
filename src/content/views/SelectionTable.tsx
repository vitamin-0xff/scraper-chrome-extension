import type { SelectionItem } from './types'

type Props = {
  items: SelectionItem[];
  onRemove: (id: string) => void;
};

function SelectionTable({ items, onRemove }: Props) {
  const children = items.filter(item => item.role === 'child');
  
  if (!children.length) {
    return <p style={{ 
        fontSize: '12px', color: '#555',
        height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
     }}>No child elements yet.</p>;
  }

  return (
    <div className='cont cont-fill s' style={{
        maxHeight: 400,
        overflowY: 'auto',
    }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
          <th style={{ padding: '6px' }}>Name</th>
          <th style={{ padding: '6px' }}>Tag</th>
          <th style={{ padding: '6px' }}>Identifier</th>
          <th style={{ padding: '6px' }}>Type</th>
          <th style={{ padding: '6px' }}>Href</th>
          <th style={{ padding: '6px' }}>Array</th>
          <th style={{ padding: '6px', width: '80px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {children.map(item => (
          <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '6px', paddingLeft: '20px' }}>{item.name}</td>
            <td style={{ padding: '6px' }}>
              <code style={{ fontSize: '11px', color: '#e91e63' }}>&lt;{item.tagName}&gt;</code>
            </td>
            <td style={{ padding: '6px' }}>{item.className || '—'}</td>
            <td style={{ padding: '6px', fontSize: '11px', color: '#666' }}>{item.identifierType}</td>
            <td style={{ padding: '6px', maxWidth: '160px', wordBreak: 'break-all' }}>
              {item.href ? <a href={item.href} target="_blank" rel="noreferrer">link</a> : '—'}
            </td>
            <td style={{ padding: '6px' }}>{item.isItArrya ? 'Yes' : 'No'}</td>
            <td style={{ padding: '6px' }}>
              <button
                onClick={() => onRemove(item.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default SelectionTable;
