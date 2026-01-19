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

// Filter out Tailwind/utility classes to build valid selectors
export function isSemanticClass(cls: string): boolean {
    if (!cls) return false;
    // Drop responsive/state prefixes
    if (/^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group|peer|dark):/i.test(cls)) return false;
    // Drop common utility prefixes (padding, margin, colors, layout, etc.)
    if (/^(transition|duration|ease|animate|p-|m-|px-|py-|pt-|pr-|pb-|pl-|mx-|my-|mt-|mr-|mb-|ml-|text-|bg-|border-|rounded-|shadow-|w-|h-|min-w-|min-h-|max-w-|max-h-|flex|grid|items-|justify-|content-|gap-|space-|place-|object-|overflow-|opacity-|z-|top-|left-|right-|bottom-|inset-|font-|leading-|tracking-|underline|decoration-|sr-only|visible|invisible|cursor-|select-|pointer-events-|resize-|list-|table-|order-|scale-|rotate-|translate-|skew-|origin-|ring-|stroke-|fill-|from-|to-|via-)/i.test(cls)) {
        return false;
    }
    // Drop classes containing slashes or extra modifiers (e.g., from-blue-50/40)
    if (/[/:]/.test(cls)) return false;
    return true;
}

/**
 * Extract data from current page using CSS selectors
 */
export function extractFromCurrentPage(
    rootSelector: string,
    children: ChildElement[]
): ExtractedItem[] {
    const items: ExtractedItem[] = [];
    
    try {
        const rootElements = document.querySelectorAll(rootSelector);
        rootElements.forEach((rootElement) => {
            const item: ExtractedItem = {};
            children.forEach((child) => {
                try {
                    const value = extractChildValue(rootElement as HTMLElement, child);
                    item[child.name] = value;
                } catch (error) {
                    console.warn(`Invalid child selector "${child.path}": ${error}`);
                    item[child.name] = null;
                }
            });
            items.push(item);
        });
    } catch (error) {
        console.error(`Invalid root selector "${rootSelector}": ${error}`);
        throw error;
    }
    
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

    try {
        if (child.isList) {
            const elements = Array.from(rootElement.querySelectorAll(selector));
            return elements.map(el => extractElementData(el as HTMLElement, child));
        } else {
            const element = rootElement.querySelector(selector);
            if (!element) return null;
            return extractElementData(element as HTMLElement, child);
        }
    } catch (error) {
        console.warn(`Invalid selector "${selector}": ${error}`);
        return null;
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
    config?: PaginationConfig
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
        const semanticClasses = classes.filter(isSemanticClass);
        
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
