/**
 * Data Extraction Engine
 * Executes extraction based on root element, child definitions, and pagination config
 */

import { ChildElement } from '../types';

export type PaginationConfig = {
    baseUrl: string;
    pageParam: string;
    pageParamValue: string;
    maxPages: number;
    otherParams: Record<string, string>;
};

export type ExtractedItem = Record<string, any>;

export type ExtractionResult = {
    page: number;
    items: ExtractedItem[];
    error?: string;
};

/**
 * Extract data from current page using CSS selectors
 */
export function extractFromCurrentPage(
    rootSelector: string,
    children: ChildElement[]
): ExtractedItem[] {
    const items: ExtractedItem[] = [];
    
    // Find all root elements
    const rootElements = document.querySelectorAll(rootSelector);
    
    rootElements.forEach((rootElement) => {
        const item: ExtractedItem = {};
        
        children.forEach((child) => {
            const value = extractChildValue(rootElement as HTMLElement, child);
            item[child.name] = value;
        });
        
        items.push(item);
    });
    
    return items;
}

/**
 * Extract value from a child element
 */
function extractChildValue(rootElement: HTMLElement, child: ChildElement): any {
    const selector = child.path;
    
    // Handle "self" selector
    if (selector === 'self') {
        return extractElementData(rootElement, child);
    }
    
    // Query within root element
    if (child.isList) {
        // Multiple elements
        const elements = Array.from(rootElement.querySelectorAll(selector));
        return elements.map(el => extractElementData(el as HTMLElement, child));
    } else {
        // Single element
        const element = rootElement.querySelector(selector);
        if (!element) return null;
        return extractElementData(element as HTMLElement, child);
    }
}

/**
 * Extract specific data from an element based on type
 */
function extractElementData(element: HTMLElement, child: ChildElement): any {
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
                const href = element.getAttribute('href') || 
                            (element as HTMLAnchorElement).href;
                data.href = href || null;
            }
            break;
            
        case 'image':
            if (child.extractSrc) {
                const src = element.getAttribute('src') || 
                           (element as HTMLImageElement).src;
                data.src = src || null;
            }
            if (child.extractAlt) {
                data.alt = element.getAttribute('alt') || null;
            }
            break;
    }
    
    // Return single value if only one extraction option is enabled
    const keys = Object.keys(data);
    if (keys.length === 1) {
        return data[keys[0]];
    }
    
    return keys.length === 0 ? null : data;
}

/**
 * Build absolute URL for a page
 */
export function buildPageUrl(config: PaginationConfig, pageNumber: number): string {
    const params = new URLSearchParams();
    
    // Add page parameter
    params.append(config.pageParam, String(pageNumber));
    
    // Add other parameters
    Object.entries(config.otherParams).forEach(([key, value]) => {
        params.append(key, value);
    });
    
    const queryString = params.toString();
    return `${config.baseUrl}${queryString ? '?' + queryString : ''}`;
}

/**
 * Calculate starting page number
 */
export function getStartPage(pageParamValue: string): number {
    const num = parseInt(pageParamValue);
    return isNaN(num) ? 1 : num;
}

/**
 * Validate extraction configuration
 */
export function validateConfig(
    rootElement: HTMLElement | null,
    children: ChildElement[],
    config: PaginationConfig | null
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!rootElement) {
        errors.push('Root element not selected');
    }
    
    if (!children || children.length === 0) {
        errors.push('No child elements selected');
    }
    
    if (!config) {
        errors.push('Pagination not configured');
    } else {
        if (!config.baseUrl.trim()) {
            errors.push('Base URL is empty');
        }
        if (!config.pageParam.trim()) {
            errors.push('Page parameter name is empty');
        }
        if (config.maxPages < 1) {
            errors.push('Max pages must be at least 1');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Extract root selector from HTMLElement
 * Uses the most specific selector available
 */
export function generateRootSelector(element: HTMLElement): string {
    // Try ID first
    if (element.id) {
        return `#${element.id}`;
    }
    
    // Try classes
    if (element.className && element.className.trim()) {
        const classes = element.className.trim().split(/\s+/);
        // Filter out Tailwind classes
        const semanticClasses = classes.filter(cls => {
            if (/^(sm|md|lg|xl|2xl|p-|m-|bg-|border-|text-|hover|focus)/i.test(cls)) {
                return false;
            }
            return true;
        });
        
        if (semanticClasses.length > 0) {
            return `.${semanticClasses.join('.')}`;
        }
    }
    
    // Fallback to tag with nth-child
    const parent = element.parentElement;
    if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        return `${element.tagName.toLowerCase()}:nth-child(${index})`;
    }
    
    return element.tagName.toLowerCase();
}
