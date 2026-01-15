import { PickedElement } from "./types";
import { useElementPicker } from "./useElementPicker";
import { useState } from "react";

type Propos = {
    elementPicked?: PickedElement;
}

export const FetchPatternDetection = () => {
    const LOG = (...data: any[]) => {
        console.log('Fetch pattern detected', ...data);
    }
    const [elementPicked, setElementPicked] = useState<PickedElement | null>(null);
    const [isPickingElement, setIsPickingElement] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const [pageParam, setPageParam] = useState('');
    const [otherParams, setOtherParams] = useState<string[] | null>(null);

    const handleElementPicked = (element: PickedElement) => {
        setIsPickingElement(false);
        setPageParam('');
        setBaseUrl('');
        setOtherParams(null);
        if (!element) return;
        if (!element.href) {
            LOG('Picked element has no href, cannot detect pattern.', element);
            return;
        };
        const url = new URL(element.href, window.location.href);
        const params = new URLSearchParams(url.search);
        let detectedParam = '';
        params.forEach((value, key) => {
            if (/\b(page|p|pg|pagination)\b/i.test(key)) {
                detectedParam = key;
            }
        });
        setBaseUrl(url.origin + url.pathname);
        setPageParam(detectedParam);
        setElementPicked(element);
        const otherParamsArr: string[] = [];
        params.forEach((value, key) => {
            if (key !== detectedParam) {
                otherParamsArr.push(`${key}=${value}`);
            }
        });
        setOtherParams(otherParamsArr.length > 0 ? otherParamsArr : null);
    }
    const { startPicker } = useElementPicker(handleElementPicked, setIsPickingElement)
    return (
        <div style={{
            width: 768
        }}>
            <button
                onClick={startPicker}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isPickingElement ? '#ff6b6b' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                }}
            >
                {isPickingElement ? 'Picking... (ESC to cancel)' : 'Pick Element'}
            </button>
            <small style={{ display: 'block', marginTop: 12 }} className="text-sm block">Pattern Detection (should be a link with page param, aka page, p..)</small>
            <div className="form-group" style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                <div className="form-item">
                    <label className="form-label" htmlFor="base-url">Base Url</label>
                    <input className="form-input" value={baseUrl} type="text" name="base-url" onChange={(e) => setBaseUrl(e.currentTarget.value)} />
                </div>
                <div className="form-item">
                    <label className="form-label" htmlFor="detected-page-param">Detected Page Param</label>
                    <input className="form-input" value={pageParam} type="text" name="detected-page-param" onChange={(e) => setPageParam(e.currentTarget.value)} />
                </div>
                {
                    otherParams && otherParams.length > 0 && (
                        <div className="form-item">
                            <label className="form-label" htmlFor="detected-page-param">Other Params</label>
                            <input disabled className="form-input" value={otherParams?.join(",")} type="text" name="detected-page-param" onChange={(e) => setPageParam(e.currentTarget.value)} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}