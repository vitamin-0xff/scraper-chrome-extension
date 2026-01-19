import { useState, useEffect } from "react";
import { usePaginationStore } from "../store";
import { type PaginationConfig } from "../algorithms/extractionEngine";

export const SelectPagination = () => {
    const paginationConfig = usePaginationStore((state) => state.paginationConfig);
    const setPaginationConfig = usePaginationStore((state) => state.setPaginationConfig);
    
    const [baseUrl, setBaseUrl] = useState(paginationConfig?.baseUrl || '');
    const [pageParam, setPageParam] = useState(paginationConfig?.pageParam || 'page');
    const [pageParamValue, setPageParamValue] = useState(paginationConfig?.pageParamValue || '1');
    const [maxPages, setMaxPages] = useState(paginationConfig?.maxPages || 10);
    const [otherParams, setOtherParams] = useState<string[]>([]);
    const [newParamKey, setNewParamKey] = useState('');
    const [newParamValue, setNewParamValue] = useState('');

    useEffect(() => {
        if (paginationConfig) {
            setBaseUrl(paginationConfig.baseUrl);
            setPageParam(paginationConfig.pageParam);
            setPageParamValue(paginationConfig.pageParamValue);
            setMaxPages(paginationConfig.maxPages);
            // Reconstruct otherParams from the config object
            const params = Object.entries(paginationConfig.otherParams || {})
                .map(([key, value]) => `${key}=${value}`);
            setOtherParams(params);
        }
    }, [paginationConfig]);

    const handleAddParam = () => {
        if (newParamKey.trim() && newParamValue.trim()) {
            setOtherParams(prev => [...prev, `${newParamKey}=${newParamValue}`]);
            setNewParamKey('');
            setNewParamValue('');
        }
    };

    const handleRemoveParam = (index: number) => {
        setOtherParams(prev => prev.filter((_, i) => i !== index));
    };

    const handleApplyConfig = () => {
        const config: PaginationConfig = {
            baseUrl,
            pageParam,
            pageParamValue,
            maxPages,
            otherParams: otherParams.reduce((acc, param) => {
                const [key, value] = param.split('=');
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>),
        };
        setPaginationConfig(config);
    };

    const isValid = baseUrl.trim() && pageParam.trim() && maxPages > 0;

    return (
        <div className="crx-ext-step-container">
            <div className="crx-ext-step-header">
                <h2>Step 3: Configure Pagination</h2>
                <p className="crx-ext-step-description">
                    Set up how to iterate through multiple pages of results.
                </p>
            </div>

            <div className="crx-ext-pagination-form">
                <div className="crx-ext-form-section">
                    <h3>URL Configuration</h3>

                    <div className="crx-ext-form-group">
                        <label>Base URL</label>
                        <input
                            type="url"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://example.com/products"
                        />
                    </div>

                    <div className="crx-ext-form-row">
                        <div className="crx-ext-form-group">
                            <label>Page Parameter Name</label>
                            <input
                                type="text"
                                value={pageParam}
                                onChange={(e) => setPageParam(e.target.value)}
                                placeholder="e.g., page, p, offset"
                            />
                        </div>

                        <div className="crx-ext-form-group">
                            <label>Starting Value</label>
                            <input
                                type="text"
                                value={pageParamValue}
                                onChange={(e) => setPageParamValue(e.target.value)}
                                placeholder="1 or 0"
                            />
                        </div>

                        <div className="crx-ext-form-group">
                            <label>Max Pages</label>
                            <input
                                type="number"
                                value={maxPages}
                                onChange={(e) => setMaxPages(parseInt(e.target.value) || 1)}
                                min="1"
                            />
                        </div>
                    </div>

                    <h3>Additional Parameters</h3>

                    <div className="crx-ext-params-input">
                        <div className="crx-ext-form-row">
                            <div className="crx-ext-form-group">
                                <label>Parameter Name</label>
                                <input
                                    type="text"
                                    value={newParamKey}
                                    onChange={(e) => setNewParamKey(e.target.value)}
                                    placeholder="e.g., sort, filter"
                                />
                            </div>

                            <div className="crx-ext-form-group">
                                <label>Parameter Value</label>
                                <input
                                    type="text"
                                    value={newParamValue}
                                    onChange={(e) => setNewParamValue(e.target.value)}
                                    placeholder="e.g., newest, active"
                                />
                            </div>

                            <button
                                className="crx-ext-btn crx-ext-btn-primary"
                                onClick={handleAddParam}
                                disabled={!newParamKey.trim() || !newParamValue.trim()}
                            >
                                Add Param
                            </button>
                        </div>
                    </div>

                    {otherParams.length > 0 && (
                        <div className="crx-ext-params-list">
                            <h4>Added Parameters</h4>
                            <div className="crx-ext-param-items">
                                {otherParams.map((param, index) => (
                                    <div key={index} className="crx-ext-param-item">
                                        <code>{param}</code>
                                        <button
                                            className="crx-ext-btn crx-ext-btn-delete"
                                            onClick={() => handleRemoveParam(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="crx-ext-config-preview">
                        <h4>URL Preview</h4>
                        <div className="crx-ext-preview-urls">
                            <code className="crx-ext-preview-url">
                                {baseUrl}?{pageParam}={pageParamValue}
                                {otherParams.length > 0 && (
                                    <>
                                        &amp;{otherParams.join('&amp;')}
                                    </>
                                )}
                            </code>
                            <code className="crx-ext-preview-url">
                                {baseUrl}?{pageParam}={parseInt(pageParamValue) + 1}
                                {otherParams.length > 0 && (
                                    <>
                                        &amp;{otherParams.join('&amp;')}
                                    </>
                                )}
                            </code>
                            <code className="crx-ext-preview-url">
                                {baseUrl}?{pageParam}={parseInt(pageParamValue) + maxPages - 1}
                                {otherParams.length > 0 && (
                                    <>
                                        &amp;{otherParams.join('&amp;')}
                                    </>
                                )}
                            </code>
                        </div>
                    </div>

                    <div className="crx-ext-form-actions">
                        <button
                            className={`crx-ext-btn  ${paginationConfig ? 'crx-ext-btn-secondary' : 'crx-ext-btn-primary'}`}
                            onClick={handleApplyConfig}
                            disabled={!isValid}
                        >
                            Apply Configuration
                        </button>
                        {
                            paginationConfig && (
                                <button
                                    className={"crx-ext-btn crx-ext-btn-primary " + paginationConfig ? 'crx-ext-btn-primary' : 'crx-ext-btn-disabled'}
                                    onClick={() => setPaginationConfig(undefined)}
                                    disabled={!isValid}
                                >
                                   Reset Configuration
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
