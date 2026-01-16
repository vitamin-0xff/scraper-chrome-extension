/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useReducer } from 'react'
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
  fetching: boolean
  onMaxNumberOfPagesChange?: (value: number | null) => void
}

// type ExtractedData = {
//   [key: string]: any
// }

// type PreviewResult = {
//   rootCount: number
//   childCounts: { [key: string]: number }
//   samples: ExtractedData[]
//   error?: string
// }

const reducer = (
    state: {[key: string]: Input},
    action: {[key: string]: Input},
) => {
    return {...state, ...action};
}

function PreviewExecute({ rootElement, children, baseUrl, pageParam, maxNumberOfPages, fetching, onMaxNumberOfPagesChange, executeCallback }: Props) {
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

    // Reserved for future preview modal feature - stubbed implementation
    useEffect(() => {
        // Reserved for future preview modal feature
        // const executePreviewStub = async () => { ... }
        // Stubbed: executePreviewStub will be implemented when preview modal is added
        void rootElement; // Reference rootElement to satisfy linter
    }, [rootElement, children]);

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
                    className='form-input'
                    style={{
                        flex: 2,
                    }}
                />
                <input
                    type="text"
                    value={pageParam || ''}
                    placeholder="Page Parameter"
                    readOnly
                    className='form-input'
                    style={{
                        flex: 1,
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
                    disabled={fetching}
                >
                    {fetching ? 'Fetching Preview...' : 'Execute Preview'}
                </button>
            </div>
        </div>
    )

}

export default PreviewExecute