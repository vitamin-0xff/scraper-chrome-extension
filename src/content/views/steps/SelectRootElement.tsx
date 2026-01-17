import { useState, useEffect } from "react";
import { useElementPicker } from "../useElementPicker";
import SelectedElementInfo from "../SelectedElementInfo";
import { PickedElement } from "../types";
import { calculateRootElementStats, RootElementStats } from "../algorithms/rootElementAlgorithms";

type Props = {
    onRootElementSelected: (element: HTMLElement) => void;
    rootElement: HTMLElement | null;
}

export const SelectRootElement = ({rootElement, onRootElementSelected}: Props) => {
    const [pickedElement, setPickedElement] = useState<PickedElement | null>(null);
    const [picking, setPicking] = useState(false);
    const [stats, setStats] = useState<RootElementStats | null>(null);

    // Sync local state when rootElement changes or on mount
    useEffect(() => {
        if (rootElement && !pickedElement) {
            // Reconstruct pickedElement from rootElement
            const reconstructedPickedElement: PickedElement = {
                tagName: rootElement.tagName,
                id: rootElement.id || null,
                className: rootElement.className || null,
                outerHTML: rootElement.outerHTML,
                textContent: rootElement.textContent || '',
                href: rootElement.getAttribute('href'),
                src: rootElement.getAttribute('src'),
            };
            setPickedElement(reconstructedPickedElement);
            
            // Recalculate stats
            const elementStats = calculateRootElementStats(rootElement);
            setStats(elementStats);
        } else if (!rootElement) {
            // Clear local state when root is cleared
            setPickedElement(null);
            setStats(null);
        }
    }, [rootElement, pickedElement]);

    const {startPicker} = useElementPicker(
        (pickedElement, nativeElement) => {
            onRootElementSelected(nativeElement);
            setPickedElement(pickedElement);
            setPicking(false);
            
            // Calculate stats for the selected root element
            const elementStats = calculateRootElementStats(nativeElement);
            setStats(elementStats);
        },
        (pickingNewStatus) => {
            setPicking(pickingNewStatus);
        }
    );

    const handleStartPicking = () => {
        if(picking) return;
        setPicking(true);
        startPicker();
    }

    const handleClearRoot = () => {
        onRootElementSelected(null as any);
        setPickedElement(null);
        setStats(null);
    }

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Step 1: Select Root Element</h2>
                <p className="step-description">
                    Choose the repeating container element that wraps each item you want to extract.
                </p>
            </div>

            {rootElement && pickedElement ? (
                <div className="root-element-card">
                    <div className="element-preview">
                        <h3>Selected Root Element</h3>
                        <SelectedElementInfo element={pickedElement} />
                    </div>
                    
                    {stats && (
                        <div className="element-stats">
                            <h4>Element Statistics</h4>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Count on page:</span>
                                    <span className="stat-value">{stats.countOnPage}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Tag:</span>
                                    <span className="stat-value">{stats.tagName}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Has ID:</span>
                                    <span className="stat-value">{stats.hasId ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Has Class:</span>
                                    <span className="stat-value">{stats.hasClassName ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">DOM Depth:</span>
                                    <span className="stat-value">{stats.depth}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Direct Children:</span>
                                    <span className="stat-value">{stats.childrenCount}</span>
                                </div>
                                <div className="stat-item full-width">
                                    <span className="stat-label">Selector:</span>
                                    <code className="stat-value">{stats.selector}</code>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={handleClearRoot}>
                            Clear & Reselect
                        </button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <p>No root element selected. Click the button below to start picking.</p>
                    <button 
                        className="btn btn-primary" 
                        disabled={picking} 
                        onClick={handleStartPicking}
                    >
                        {picking ? "Picking... (Press Esc to cancel)" : "Pick Root Element"}
                    </button>
                </div>
            )}
        </div>
    );
}

// All algorithms moved to rootElementAlgorithms.ts
// See: src/content/views/algorithms/rootElementAlgorithms.ts