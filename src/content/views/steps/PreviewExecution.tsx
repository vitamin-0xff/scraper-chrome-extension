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
    rootSelector: string;
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
    rootSelector,
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
            // Use the custom selector if available, otherwise generate one
            const selector = rootSelector || generateRootSelector(rootElement!);
            const preview = extractFromCurrentPage(selector, childElements);
            
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
            // Use the custom selector if available, otherwise generate one
            const selector = rootSelector || generateRootSelector(rootElement!);
            const startPage = getStartPage(paginationConfig!.pageParamValue);
            const maxPages = paginationConfig!.maxPages;
            const allData: ExtractedItem[] = [];

            for (let i = 0; i < maxPages; i++) {
                const pageNum = startPage + i;
                
                // Build and navigate to page
                const pageUrl = buildPageUrl(paginationConfig!, pageNum);
                
                // Fetch and extract from page
                const response = await fetch(pageUrl);
                if(!response.ok) {
                    console.warn("Bad request " + response.status);
                    continue;
                }
                
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract data from fetched page
                const rootElements = doc.querySelectorAll(selector);
                console.log()
                console.log(rootElement);
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
        <div className="crx-ext-step-container">
            <div className="crx-ext-step-header">
                <h2>Step 4: Preview & Execute</h2>
                <p className="crx-ext-step-description">
                    Preview sample data or execute full extraction across all pages.
                </p>
            </div>

            <div className="crx-ext-execution-panel">
                {/* Configuration Summary */}
                <div className="crx-ext-config-summary">
                    <h3>Configuration Summary</h3>
                    <div className="crx-ext-summary-items">
                        <div className="crx-ext-summary-item">
                            <span className="crx-ext-label">Root Elements:</span>
                            <span className="crx-ext-value">{rootElement?.tagName.toLowerCase() || 'None'}</span>
                        </div>
                        <div className="crx-ext-summary-item">
                            <span className="crx-ext-label">Child Fields:</span>
                            <span className="crx-ext-value">{childElements.length}</span>
                        </div>
                        <div className="crx-ext-summary-item">
                            <span className="crx-ext-label">Pages to Fetch:</span>
                            <span className="crx-ext-value">{paginationConfig?.maxPages || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {extractionState.error && (
                    <div className="crx-ext-error-message">
                        <strong>Error:</strong> {extractionState.error}
                    </div>
                )}

                {/* Preview Data */}
                {extractionState.previewData.length > 0 && (
                    <div className="crx-ext-preview-section">
                        <h3>Preview (First 5 Items)</h3>
                        <div className="crx-ext-data-table">
                            <div className="crx-ext-table-header">
                                {childElements.map(child => (
                                    <div key={child.id} className="crx-ext-table-cell">{child.name}</div>
                                ))}
                            </div>
                            {extractionState.previewData.map((item, idx) => (
                                <div key={idx} className="crx-ext-table-row">
                                    {childElements.map(child => (
                                        <div key={`${idx}-${child.id}`} className="crx-ext-table-cell">
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
                    <div className="crx-ext-progress-section">
                        <h3>Extraction Progress</h3>
                        <div className="crx-ext-progress-bar">
                            <div
                                className="crx-ext-progress-fill"
                                style={{
                                    width: `${(extractionState.currentPage / extractionState.totalPages) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <div className="crx-ext-progress-text">
                            Page {extractionState.currentPage} of {extractionState.totalPages}
                            ({extractionState.totalData.length} items extracted)
                        </div>
                    </div>
                )}

                {/* Results */}
                {extractionState.status === 'completed' && (
                    <div className="crx-ext-results-section">
                        <h3>Extraction Complete</h3>
                        <div className="crx-ext-results-summary">
                            <span>Total Items Extracted: <strong>{extractionState.totalData.length}</strong></span>
                        </div>
                        <div className="crx-ext-results-preview">
                            <h4>Sample Results</h4>
                            <pre>{JSON.stringify(extractionState.totalData.slice(0, 2), null, 2)}</pre>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="crx-ext-action-buttons">
                    <button
                        className="crx-ext-btn crx-ext-btn-primary"
                        onClick={validateAndPreview}
                        disabled={extractionState.status === 'extracting' || extractionState.status === 'previewing'}
                    >
                        Preview Data
                    </button>
                    <button
                        className="crx-ext-btn crx-ext-btn-primary"
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
                            className="crx-ext-btn crx-ext-btn-primary"
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
