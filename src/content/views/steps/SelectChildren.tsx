import { useState } from "react";
import { useElementPicker } from "../useElementPicker";
import { PickedElement, ChildElement, ElementType } from "../types";
import SelectedElementInfo from "../SelectedElementInfo";
import {
    detectElementType,
    generateRelativePath,
} from "../algorithms/childElementAlgorithms";

type Props = {
    rootElement: HTMLElement | null;
    childrenElements: ChildElement[];
    onChildElementAdded: (child: ChildElement) => void;
    onChildElementRemoved: (id: string) => void;
}

export const SelectChildren = ({
    rootElement,
    childrenElements,
    onChildElementAdded,
    onChildElementRemoved
}: Props) => {
    const [picking, setPicking] = useState(false);
    const [selectedChild, setSelectedChild] = useState<PickedElement | null>(null);
    const [childType, setChildType] = useState<ElementType>('text');
    const [childName, setChildName] = useState('');
    const [isList, setIsList] = useState(false);
    const [childPath, setChildPath] = useState('');
    const [extractOptions, setExtractOptions] = useState({
        extractText: true,
        extractHref: false,
        extractSrc: false,
        extractAlt: false,
    });

    const { startPicker } = useElementPicker(
        (pickedElement, nativeElement) => {
            setSelectedChild(pickedElement);
            const path = generateRelativePath(rootElement, nativeElement);
            setChildPath(path);
            
            // Auto-detect type based on element
            const detectedType = detectElementType(nativeElement);
            setChildType(detectedType);
            
            // Set default extraction options based on type
            setDefaultExtractionOptions(detectedType);
            
            setPicking(false);
        },
        (pickingNewStatus) => {
            setPicking(pickingNewStatus);
        }
    );

    const handleStartPicking = () => {
        if (picking || !rootElement) return;
        setPicking(true);
        startPicker();
    };

    const handleAddChild = () => {
        if (!selectedChild || !childName.trim() || !childPath.trim()) {
            alert('Please fill all required fields');
            return;
        }

        const childId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const newChild: ChildElement = {
            id: childId,
            name: childName.trim(),
            type: childType,
            path: childPath,
            isList,
            extractText: extractOptions.extractText,
            extractHref: extractOptions.extractHref,
            extractSrc: extractOptions.extractSrc,
            extractAlt: extractOptions.extractAlt,
        };

        onChildElementAdded(newChild);
        resetForm();
    };

    const resetForm = () => {
        setSelectedChild(null);
        setChildName('');
        setChildType('text');
        setChildPath('');
        setIsList(false);
        setExtractOptions({
            extractText: true,
            extractHref: false,
            extractSrc: false,
            extractAlt: false,
        });
    };

    const setDefaultExtractionOptions = (type: ElementType) => {
        switch (type) {
            case 'text':
                setExtractOptions({
                    extractText: true,
                    extractHref: false,
                    extractSrc: false,
                    extractAlt: false,
                });
                break;
            case 'link':
                setExtractOptions({
                    extractText: true,
                    extractHref: true,
                    extractSrc: false,
                    extractAlt: false,
                });
                break;
            case 'image':
                setExtractOptions({
                    extractText: false,
                    extractHref: false,
                    extractSrc: true,
                    extractAlt: true,
                });
                break;
        }
    };

    return (
        <div className="step-container">
            <div className="step-header">
                <h2>Step 2: Select Child Elements</h2>
                <p className="step-description">
                    Select the individual elements within each root element that you want to extract.
                </p>
            </div>

            {!rootElement ? (
                <div className="warning-message">
                    <p>Please complete Step 1 first. Select a root element to continue.</p>
                </div>
            ) : (
                <>
                    {/* Child Element Picker Form */}
                    <div className="child-form">
                        <div className="form-section">
                            <h3>Pick a Child Element</h3>
                            
                            {selectedChild && (
                                <div className="selected-child-preview">
                                    <h4>Selected Child Element</h4>
                                    <SelectedElementInfo element={selectedChild} />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Element Name</label>
                                <input
                                    type="text"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    placeholder="e.g., product_title, product_price"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Element Type</label>
                                    <select value={childType} onChange={(e) => {
                                        const newType = e.target.value as ElementType;
                                        setChildType(newType);
                                        setDefaultExtractionOptions(newType);
                                    }}>
                                        <option value="text">Text</option>
                                        <option value="link">Link</option>
                                        <option value="image">Image</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isList}
                                            onChange={(e) => setIsList(e.target.checked)}
                                        />
                                        Is List (Multiple per item)
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Unique Path</label>
                                <textarea
                                    value={childPath}
                                    onChange={(e) => setChildPath(e.target.value)}
                                    placeholder="Relative path from root element"
                                    rows={3}
                                />
                            </div>

                            {/* Extraction Options based on type */}
                            <div className="extraction-options">
                                <h4>Extract Options</h4>
                                
                                {(childType === 'text' || childType === 'link') && (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={extractOptions.extractText}
                                            onChange={(e) => setExtractOptions({
                                                ...extractOptions,
                                                extractText: e.target.checked
                                            })}
                                        />
                                        Extract Text Content
                                    </label>
                                )}

                                {childType === 'link' && (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={extractOptions.extractHref}
                                            onChange={(e) => setExtractOptions({
                                                ...extractOptions,
                                                extractHref: e.target.checked
                                            })}
                                        />
                                        Extract href Attribute
                                    </label>
                                )}

                                {childType === 'image' && (
                                    <>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={extractOptions.extractSrc}
                                                onChange={(e) => setExtractOptions({
                                                    ...extractOptions,
                                                    extractSrc: e.target.checked
                                                })}
                                            />
                                            Extract src Attribute
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={extractOptions.extractAlt}
                                                onChange={(e) => setExtractOptions({
                                                    ...extractOptions,
                                                    extractAlt: e.target.checked
                                                })}
                                            />
                                            Extract alt Attribute
                                        </label>
                                    </>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    className="btn btn-primary"
                                    disabled={picking}
                                    onClick={handleStartPicking}
                                >
                                    {picking ? "Picking..." : "Pick Child Element"}
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddChild}
                                    disabled={!selectedChild || !childName.trim()}
                                >
                                    Add Child
                                </button>
                                {selectedChild && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Children List */}
                    {childrenElements.length > 0 && (
                        <div className="children-list">
                            <h3>Selected Child Elements ({childrenElements.length})</h3>
                            <div className="list-container">
                                {childrenElements.map((child) => (
                                    <div key={child.id} className="child-item">
                                        <div className="child-header">
                                            <div className="child-info">
                                                <span className="child-name">{child.name}</span>
                                                <span className="child-type">{child.type}</span>
                                                {child.isList && <span className="child-list-badge">List</span>}
                                            </div>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => onChildElementRemoved(child.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="child-path">
                                            <code>{child.path}</code>
                                        </div>
                                        {(child.extractText || child.extractHref || child.extractSrc || child.extractAlt) && (
                                            <div className="child-extracts">
                                                {child.extractText && <span className="extract-badge">Text</span>}
                                                {child.extractHref && <span className="extract-badge">Href</span>}
                                                {child.extractSrc && <span className="extract-badge">Src</span>}
                                                {child.extractAlt && <span className="extract-badge">Alt</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// All algorithms are now in: src/content/views/algorithms/childElementAlgorithms.ts
