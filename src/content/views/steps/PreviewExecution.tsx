import { useState } from "react";
import { ChildElement } from "../types";
import {
    validateConfig,
    generateRootSelector,
    extractFromCurrentPage,
    buildPageUrl,
    getStartPage,
    type PaginationConfig as PaginationConfigType,
    type ExtractedItem,
} from "../algorithms/extractionEngine";

type Props = {
    rootElement: HTMLElement | null;
    childElements: ChildElement[];
    paginationConfig: PaginationConfigType | null;
}

type ExtractionState = {
    status: 'idle' | 'previewing' | 'extracting' | 'completed' | 'error';
    previewData: ExtractedItem[];
    totalData: ExtractedItem[];
    currentPage: number;
    totalPages: number;
    error: string | null;
}

export const PreviewExecution = ({
    rootElement,
    childElements,
    paginationConfig,
}: Props) => {
    const [extractionState, setExtractionState] = useState<ExtractionState>({
        status: 'idle',
        previewData: [],
        totalData: [],
        currentPage: 0,
        totalPages: 0,
        error: null,
    });

    const validateAndPreview = () => {
        const validation = validateConfig(rootElement, childElements, paginationConfig);
        
        if (!validation.valid) {
            setExtractionState(prev => ({
                ...prev,
                status: 'error',
                error: validation.errors.join(', '),
            }));
            return;
        }

        setExtractionState(prev => ({
            ...prev,
            status: 'previewing',
            error: null,
        }));

        try {
            const rootSelector = generateRootSelector(rootElement!);
            const preview = extractFromCurrentPage(rootSelector, childElements);
            
            setExtractionState(prev => ({
                ...prev,
                status: 'idle',
                previewData: preview.slice(0, 5), // Show first 5 items
                totalPages: paginationConfig!.maxPages,
            }));
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            setExtractionState(prev => ({
                ...prev,
                status: 'error',
                error: `Preview failed: ${errorMsg}`,
            }));
        }
    };

    const executeExtraction = async () => {
        const validation = validateConfig(rootElement, childElements, paginationConfig);
        
        if (!validation.valid) {
            setExtractionState(prev => ({
                ...prev,
                status: 'error',
                error: validation.errors.join(', '),
            }));
            return;
        }

        setExtractionState(prev => ({
            ...prev,
            status: 'extracting',
            error: null,
            totalData: [],
            currentPage: 0,
        }));

        try {
            const rootSelector = generateRootSelector(rootElement!);
            const startPage = getStartPage(paginationConfig!.pageParamValue);
            const maxPages = paginationConfig!.maxPages;
            const allData: ExtractedItem[] = [];

            for (let i = 0; i < maxPages; i++) {
                const pageNum = startPage + i;
                
                // Build and navigate to page
                const pageUrl = buildPageUrl(paginationConfig!, pageNum);
                
                // Fetch and extract from page
                const response = await fetch(pageUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract data from fetched page
                const rootElements = doc.querySelectorAll(rootSelector);
                rootElements.forEach((rootElem) => {
                    const item: ExtractedItem = {};
                    childElements.forEach((child) => {
                        const selector = child.path;
                        const targetElem = selector === 'self' 
                            ? rootElem 
                            : rootElem.querySelector(selector);
                        
                        if (targetElem) {
                            item[child.name] = extractElementValue(targetElem as HTMLElement, child);
                        }
                    });
                    allData.push(item);
                });

                // Update progress
                setExtractionState(prev => ({
                    ...prev,
                    currentPage: i + 1,
                    totalData: [...allData],
                }));

                // Add delay between requests (be nice to servers)
                if (i < maxPages - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            setExtractionState(prev => ({
                ...prev,
                status: 'completed',
                totalData: allData,
            }));
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            setExtractionState(prev => ({
                ...prev,
                status: 'error',
                error: `Extraction failed: ${errorMsg}`,
            }));
        }
    };

    const downloadData = () => {
        if (extractionState.totalData.length === 0) return;

        const json = JSON.stringify(extractionState.totalData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Step 4: Preview & Execute</h2>
                <p className="step-description">
                    Preview sample data or execute full extraction across all pages.
                </p>
            </div>

            <div className="execution-panel">
                {/* Configuration Summary */}
                <div className="config-summary">
                    <h3>Configuration Summary</h3>
                    <div className="summary-items">
                        <div className="summary-item">
                            <span className="label">Root Elements:</span>
                            <span className="value">{rootElement?.tagName.toLowerCase() || 'None'}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Child Fields:</span>
                            <span className="value">{childElements.length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Pages to Fetch:</span>
                            <span className="value">{paginationConfig?.maxPages || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {extractionState.error && (
                    <div className="error-message">
                        <strong>Error:</strong> {extractionState.error}
                    </div>
                )}

                {/* Preview Data */}
                {extractionState.previewData.length > 0 && (
                    <div className="preview-section">
                        <h3>Preview (First 5 Items)</h3>
                        <div className="data-table">
                            <div className="table-header">
                                {childElements.map(child => (
                                    <div key={child.id} className="table-cell">{child.name}</div>
                                ))}
                            </div>
                            {extractionState.previewData.map((item, idx) => (
                                <div key={idx} className="table-row">
                                    {childElements.map(child => (
                                        <div key={`${idx}-${child.id}`} className="table-cell">
                                            <code>{formatValue(item[child.name])}</code>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extraction Progress */}
                {extractionState.status === 'extracting' && (
                    <div className="progress-section">
                        <h3>Extraction Progress</h3>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${(extractionState.currentPage / extractionState.totalPages) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            Page {extractionState.currentPage} of {extractionState.totalPages}
                            ({extractionState.totalData.length} items extracted)
                        </div>
                    </div>
                )}

                {/* Results */}
                {extractionState.status === 'completed' && (
                    <div className="results-section">
                        <h3>Extraction Complete</h3>
                        <div className="results-summary">
                            <span>Total Items Extracted: <strong>{extractionState.totalData.length}</strong></span>
                        </div>
                        <div className="results-preview">
                            <h4>Sample Results</h4>
                            <pre>{JSON.stringify(extractionState.totalData.slice(0, 2), null, 2)}</pre>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={validateAndPreview}
                        disabled={extractionState.status === 'extracting' || extractionState.status === 'previewing'}
                    >
                        Preview Data
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={executeExtraction}
                        disabled={
                            extractionState.status === 'extracting' ||
                            extractionState.previewData.length === 0
                        }
                    >
                        {extractionState.status === 'extracting' ? 'Extracting...' : 'Execute Extraction'}
                    </button>
                    {extractionState.status === 'completed' && (
                        <button
                            className="btn btn-primary"
                            onClick={downloadData}
                        >
                            Download JSON
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function extractElementValue(element: HTMLElement, child: ChildElement): any {
    const data: any = {};
    
    switch (child.type) {
        case 'text':
            if (child.extractText) {
                data.text = element.textContent?.trim() || null;
            }
            break;
        case 'link':
            if (child.extractText) {
                data.text = element.textContent?.trim() || null;
            }
            if (child.extractHref) {
                const href = element.getAttribute('href') || (element as HTMLAnchorElement).href;
                data.href = href || null;
            }
            break;
        case 'image':
            if (child.extractSrc) {
                const src = element.getAttribute('src') || (element as HTMLImageElement).src;
                data.src = src || null;
            }
            if (child.extractAlt) {
                data.alt = element.getAttribute('alt') || null;
            }
            break;
    }
    
    const keys = Object.keys(data);
    if (keys.length === 1) {
        return data[keys[0]];
    }
    
    return keys.length === 0 ? null : data;
}

function formatValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value.length > 50 ? value.substring(0, 50) + '...' : value;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}
