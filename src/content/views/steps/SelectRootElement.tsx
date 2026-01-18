import { useState, useEffect } from "react";
import { useElementPicker } from "../useElementPicker";
import SelectedElementInfo from "../SelectedElementInfo";
import { PickedElement } from "../types";
import { calculateRootElementStats, RootElementStats } from "../algorithms/rootElementAlgorithms";

type Props = {
    onRootElementSelected: (element: HTMLElement | null, selector?: string) => void;
    rootElement: HTMLElement | null;
    rootSelector?: string;
}

export const SelectRootElement = ({rootElement, rootSelector, onRootElementSelected}: Props) => {
    const [pickedElement, setPickedElement] = useState<PickedElement | null>(null);
    const [picking, setPicking] = useState(false);
    const [stats, setStats] = useState<RootElementStats | null>(null);
    const [isEditingSelector, setIsEditingSelector] = useState(false);
    const [editedSelector, setEditedSelector] = useState('');
    const [selectorError, setSelectorError] = useState('');

    // Sync local state when rootElement changes or on mount

    useEffect(() => {
        console.log("root Element has changed");
        console.log(rootElement);
    }, [rootElement])

    useEffect(() => {
        if (rootElement) {
            // Recalculate stats
            const elementStats = calculateRootElementStats(rootElement);
            // Use the persisted selector from parent if available, otherwise use calculated one
            const selectorToUse = rootSelector || elementStats.selector;
            
            // Find index of the rootElement within all matching elements
            const allMatching = document.querySelectorAll(selectorToUse);
            const elementIndex = Array.from(allMatching).indexOf(rootElement);
            
            // Reconstruct pickedElement from rootElement
            const reconstructedPickedElement: PickedElement = {
                tagName: rootElement.tagName,
                id: rootElement.id || null,
                className: rootElement.className || null,
                outerHTML: rootElement.outerHTML,
                textContent: rootElement.textContent || '',
                href: rootElement.getAttribute('href'),
                src: rootElement.getAttribute('src'),
                selector: selectorToUse,
                index: elementIndex
            };
            setPickedElement(reconstructedPickedElement);
            
            setStats({
                ...elementStats,
                selector: selectorToUse
            });
            setEditedSelector(selectorToUse);
            setIsEditingSelector(false);
            setSelectorError('');
        } else if (!rootElement) {
            // Clear local state when root is cleared
            setPickedElement(null);
            setStats(null);
            setEditedSelector('');
            setIsEditingSelector(false);
            setSelectorError('');
        }
    }, [rootElement, rootSelector]);

    const {startPicker} = useElementPicker(
        (pickedElement) => {
            console.log('Root element picked - Selector:', pickedElement.selector, 'Index:', pickedElement.index);
            
            // Get the native element using selector and index
            const allMatching = document.querySelectorAll(pickedElement.selector);
            const nativeElement = allMatching[pickedElement.index] as HTMLElement;
            
            if (!nativeElement) {
                console.error('Could not find element with selector:', pickedElement.selector, 'at index:', pickedElement.index);
                return;
            }
            
            // Calculate stats for the selected root element
            const elementStats = calculateRootElementStats(nativeElement);
            // Use the selector from the picker
            const statsWithPickerSelector = {
                ...elementStats,
                selector: pickedElement.selector
            };
            onRootElementSelected(nativeElement, pickedElement.selector);
            setPickedElement(pickedElement);
            setPicking(false);
            
            setStats(statsWithPickerSelector);
            setEditedSelector(pickedElement.selector);
            setIsEditingSelector(false);
            setSelectorError('');
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
        setIsEditingSelector(false);
        setSelectorError('');
    }

    const handleEditSelector = () => {
        setIsEditingSelector(true);
        setSelectorError('');
    }

    const handleSaveSelector = () => {
        if (!editedSelector.trim()) {
            setSelectorError('Selector cannot be empty');
            return;
        }

        // Validate and query the selector
        try {
            const newSelectorElements = document.querySelectorAll(editedSelector);
            if (newSelectorElements.length === 0) {
                setSelectorError('Selector matches 0 elements on the page');
                return;
            }
            
            // Use first matched element as the new root
            const firstElement = newSelectorElements[0] as HTMLElement;
            
            // Recalculate stats with the new selector
            const newStats = calculateRootElementStats(firstElement);
            
            // Update picked element info
            const newPickedElement: PickedElement = {
                tagName: firstElement.tagName,
                id: firstElement.id || null,
                className: firstElement.className || null,
                outerHTML: firstElement.outerHTML,
                textContent: firstElement.textContent || '',
                href: firstElement.getAttribute('href'),
                src: firstElement.getAttribute('src'),
                selector: editedSelector,
                index: 0 // First element
            };
            setPickedElement(newPickedElement);
            
            // Update stats with custom selector
            setStats(() => {
             const state =  {
                ...newStats,
                selector: editedSelector,
                countOnPage: newSelectorElements.length
            }
            console.log("Updated stats:", state);
            return state;
        });

            // Notify parent with both element and selector
            onRootElementSelected(firstElement, editedSelector);
            
            setIsEditingSelector(false);
            setSelectorError('');
        } catch (error) {
            setSelectorError(`Invalid selector: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    const handleCancelEdit = () => {
        if (stats) {
            setEditedSelector(stats.selector);
        }
        setIsEditingSelector(false);
        setSelectorError('');
    }

    return (
        <div className="crx-ext-step-container">
            <div className="crx-ext-step-header">
                <h2>Step 1: Select Root Element</h2>
                <p className="crx-ext-step-description">
                    Choose the repeating container element that wraps each item you want to extract.
                </p>
            </div>

            {rootElement && pickedElement ? (
                <div className="crx-ext-root-element-card">
                    <div className="crx-ext-element-preview">
                        <h3>Selected Root Element</h3>
                        <SelectedElementInfo element={pickedElement} />
                    </div>
                    
                    {stats && (
                        <div className="crx-ext-element-stats">
                            <h4>Element Statistics</h4>
                            <div className="crx-ext-stats-grid">
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">Count on page:</span>
                                    <span className="crx-ext-stat-value">{stats.countOnPage}</span>
                                </div>
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">Tag:</span>
                                    <span className="crx-ext-stat-value">{stats.tagName}</span>
                                </div>
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">Has ID:</span>
                                    <span className="crx-ext-stat-value">{stats.hasId ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">Has Class:</span>
                                    <span className="crx-ext-stat-value">{stats.hasClassName ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">DOM Depth:</span>
                                    <span className="crx-ext-stat-value">{stats.depth}</span>
                                </div>
                                <div className="crx-ext-stat-item">
                                    <span className="crx-ext-stat-label">Direct Children:</span>
                                    <span className="crx-ext-stat-value">{stats.childrenCount}</span>
                                </div>
                                <div className="crx-ext-stat-item crx-ext-full-width">
                                    <span className="crx-ext-stat-label">Selector:</span>
                                    {isEditingSelector ? (
                                        <div className="crx-ext-selector-edit">
                                            <input
                                                type="text"
                                                value={editedSelector}
                                                onChange={(e) => {
                                                    setEditedSelector(e.target.value);
                                                    setSelectorError('');
                                                }}
                                                className="crx-ext-form-input"
                                                placeholder="e.g., .product-item, article.post, div#main"
                                            />
                                            {selectorError && (
                                                <div className="crx-ext-error-message">{selectorError}</div>
                                            )}
                                            <div className="crx-ext-selector-actions">
                                                <button 
                                                    className="crx-ext-btn crx-ext-btn-primary crx-ext-btn-small"
                                                    onClick={handleSaveSelector}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    className="crx-ext-btn crx-ext-btn-secondary crx-ext-btn-small"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="crx-ext-selector-view">
                                            <code className="crx-ext-stat-value">{editedSelector}</code>
                                            <button 
                                                className="crx-ext-btn crx-ext-btn-secondary crx-ext-btn-small crx-ext-edit-btn"
                                                onClick={handleEditSelector}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="crx-ext-action-buttons">
                        <button className="crx-ext-btn crx-ext-btn-secondary" onClick={handleClearRoot}>
                            Clear & Reselect
                        </button>
                    </div>
                </div>
            ) : (
                <div className="crx-ext-empty-state">
                    <p>No root element selected. Click the button below to start picking.</p>
                    <button 
                        className="crx-ext-btn crx-ext-btn-primary" 
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