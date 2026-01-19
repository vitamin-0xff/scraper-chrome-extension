/**
 * Root Element Selection Algorithms
 * Algorithms for analyzing and selecting root container elements
 */

import { isSemanticClass } from "./extractionEngine";

export type RootElementStats = {
    countOnPage: number;
    tagName: string;
    hasId: boolean;
    hasClassName: boolean;
    depth: number;
    childrenCount: number;
    selector: string;
}

/**
 * Calculate statistics for a root element
 * Includes count, depth, children count, and generated selector
 */
export function calculateRootElementStats(element: HTMLElement): RootElementStats {
    const tagName = element.tagName.toLowerCase();
    const hasId = !!element.id;
    const hasClassName = !!element.className && element.className.trim().length > 0;
    
    const countOnPage = calculateElementCount(element);
    const depth = getElementDepth(element);
    const childrenCount = element.children.length;
    const selector = generateSelector(element);
    
    return {
        countOnPage,
        tagName,
        hasId,
        hasClassName,
        depth,
        childrenCount,
        selector
    };
}

/**
 * Count similar elements on the page using multiple strategies
 * Strategy 1: Class name matching
 * Strategy 2: Parent + tag name
 * Strategy 3: Tag name document-wide
 */
export function calculateElementCount(element: HTMLElement): number {
    const selector = generateSelector(element); 
    const allSimilar = document.querySelectorAll(selector);
    return allSimilar.length;
}

/**
 * Calculate the DOM depth of an element (distance from root)
 */
export function getElementDepth(element: HTMLElement): number {
    let depth = 0;
    let current: HTMLElement | null = element;
    
    while (current.parentElement) {
        depth++;
        current = current.parentElement;
    }
    
    return depth;
}

/**
 * Generate a unique CSS selector for an element
 * Priority: ID > Classes > Tag + nth-child
 */
export function generateSelector(element: HTMLElement): string {
    if (element.className) {
        const classes = element.className.trim().split(/\s+/).filter(isSemanticClass).slice(0, 3).join('.');
        if(classes)
        return `${element.tagName.toLowerCase()}.${classes}`;
    }
    
    const parent = element.parentElement;
    if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        return `${element.tagName.toLowerCase()}:nth-child(${index})`;
    }
    
    return element.tagName.toLowerCase();
}
