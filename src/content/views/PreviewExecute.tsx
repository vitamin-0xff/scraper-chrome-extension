import { useMemo, useReducer, useState } from 'react'
import type { SelectionItem } from './types'
import SelectionTable from './SelectionTable'
import { Input, RowInput } from '@/components/RowInput'

type Props = {
  rootElement: SelectionItem | null
  children: SelectionItem[]
  baseUrl?: string
  pageParam?: string
  otherParams?: string[] | null
  maxNumberOfPages?: number
  executeCallback: () => Promise<void>
  onMaxNumberOfPagesChange?: (value: number | null) => void
}

type ExtractedData = {
  [key: string]: any
}

type PreviewResult = {
  rootCount: number
  childCounts: { [key: string]: number }
  samples: ExtractedData[]
  error?: string
}

const reducer = (
    state: {[key: string]: Input},
    action: {[key: string]: Input},
) => {
    return {...state, ...action};
}

function PreviewExecute({ rootElement, children, baseUrl, pageParam, maxNumberOfPages, onMaxNumberOfPagesChange, executeCallback }: Props) {
    const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [inputReducer, setInputReducer] = useReducer<{ [key: string]: Input}, any>(reducer, {
        "maxPages": {
            uniqueKey: 'maxPages',
            value: maxNumberOfPages?.toString() || '',
            placeholder: 'e.g., 5',
            label: 'Max Pages',
        }
    });

    const handleInputChange = (inputUniquekey: string, newValue: string) => {
        setInputReducer({
            [inputUniquekey]: {
                ...inputReducer[inputUniquekey],
                value: newValue,
            }
        });
    };

    const inputElements = useMemo(() => Object.values(inputReducer), [inputReducer]);

    useMemo(() => {
        const maxPagesInput = inputReducer['maxPages'];
        const parsedValue = parseInt(maxPagesInput.value);
        if (!isNaN(parsedValue)) {
            onMaxNumberOfPagesChange?.(parsedValue);
        }else {
            onMaxNumberOfPagesChange?.(0);
        }

    }, [inputElements]);

    const handleExecutePreview = async () => {
        if (!rootElement) {
            setError('Root element is not defined.')
            return
        }
        setIsLoading(true)
        setError(null)
        setPreviewResult(null)
        try {
            // Simulate fetching and processing data
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Dummy preview result for demonstration
            const dummyResult: PreviewResult = {
                rootCount: 10,
                childCounts: children.reduce((acc, child) => {
                    acc[child.name] = 10
                    return acc
                }, {} as { [key: string]: number }),
                samples: [
                    children.reduce((acc, child) => {
                        acc[child.name] = `Sample data for ${child.name}`
                        return acc
                    }, {} as ExtractedData)
                ]
            }
            setPreviewResult(dummyResult)
        } catch (err) {
            setError('An error occurred during preview execution.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <SelectionTable items={children} onRemove={() => {}} />
            {
            baseUrl && pageParam ? (
            <div className="" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                <input
                    type="text"
                    value={baseUrl || ''}
                    placeholder="Base URL"
                    readOnly
                    style={{
                        flex: 2,
                        padding: '8px',
                        border: '1px solid #ccc',
                        color: '#555',
                        borderRadius: '4px',
                        fontSize: 14,
                    }}
                />
                <input
                    type="text"
                    value={pageParam || ''}
                    placeholder="Page Parameter"
                    readOnly
                    style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        color: '#555',
                        borderRadius: '4px',
                        fontSize: 14,
                    }}
                />
            </div>
                ) : (
                    <div style={{
                        marginTop: 10,
                    }} className='content-center'>
                        <p style={{
                            fontSize: 11,
                        }}>
                            <strong>Note:</strong> Base URL and Page Parameter are not set.
                        </p>
                    </div>
                )
            }

            <RowInput inputProps={inputElements} onChange={handleInputChange} />
            <div style={{ margin: '10px 0' }}>
                <button
                    onClick={async () => {
                        await executeCallback();
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    disabled={isLoading || !rootElement}
                >
                    {isLoading ? 'Executing Preview...' : 'Execute Preview'}
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )

}

export default PreviewExecute