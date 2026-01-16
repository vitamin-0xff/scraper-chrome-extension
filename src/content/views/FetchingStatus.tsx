import { useEffect, useState } from 'react'

type Props = {
  fetching: boolean
  currentPage: number | null
  elementCount: number
  totalElements?: number
  error?: string | null
  onCancel?: () => void
}

function FetchingStatus({ fetching, currentPage, elementCount, totalElements, error, onCancel }: Props) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!fetching) {
      setElapsedTime(0)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [fetching])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const progress = totalElements ? Math.round((elementCount / totalElements) * 100) : 0

  if (!fetching && elementCount === 0) {
    return null
  }

  return (
    <div
      style={{
        margin: '10px',
        padding: '12px',
        backgroundColor: fetching ? '#e3f2fd' : '#e8f5e9',
        borderRadius: '4px',
        border: `2px solid ${error ? '#c0392b' : fetching ? '#2196f3' : '#27ae60'}`,
        borderLeft: `4px solid ${error ? '#c0392b' : fetching ? '#2196f3' : '#27ae60'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {fetching && (
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #2196f3',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          )}
          <span style={{ fontWeight: 'bold', color: fetching ? '#1976d2' : '#27ae60' }}>
            {fetching ? 'Fetching Data...' : 'Fetch Complete'}
          </span>
        </div>
        {fetching && onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '4px 8px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <div style={{ fontSize: '12px', color: '#555' }}>
        {currentPage !== null && (
          <p style={{ margin: '4px 0' }}>
            <strong>Current Page:</strong> {currentPage}
          </p>
        )}
        <p style={{ margin: '4px 0' }}>
          <strong>Elements Fetched:</strong> {elementCount}
          {totalElements && ` / ${totalElements}`}
        </p>
        {fetching && (
          <p style={{ margin: '4px 0' }}>
            <strong>Elapsed Time:</strong> {formatTime(elapsedTime)}
          </p>
        )}
      </div>

      {totalElements && fetching && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Progress</span>
            <span style={{ fontSize: '11px', color: '#666' }}>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#ddd',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#2196f3',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#fadbd8',
            color: '#c0392b',
            borderRadius: '3px',
            fontSize: '12px',
            borderLeft: '3px solid #c0392b',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {!fetching && elementCount > 0 && !error && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#27ae60' }}>
          ✓ Successfully fetched {elementCount} element{elementCount !== 1 ? 's' : ''}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default FetchingStatus
