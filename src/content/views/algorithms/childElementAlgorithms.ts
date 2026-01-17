/**
 * Child Element Selection Algorithms
 * Algorithms for analyzing, detecting, and generating paths for child elements
 */

/**
 * Remove pseudo-classes and pseudo-elements from a selector
 * Examples: "btn:hover" -> "btn", "element::before" -> "element"
 */
export function removePseudoClasses(selector: string): string {
    if (!selector) return selector;
    return selector.replace(/::[^\s.]+/g, '').replace(/:[^\s.]+/g, '').trim();
}

/**
 * Clean Tailwind CSS utility classes and pseudo-classes
 * Keeps only semantic/component classes
 */
export function cleanTailwindClasses(className: string): string {
    if (!className || !className.trim()) return '';
    
    const classes = className.trim().split(/\s+/).filter(Boolean);
    const uniqueClasses = [...new Set(classes.map(c => removePseudoClasses(c)))];
    
    const filtered = uniqueClasses.filter(cls => {
        if (!cls) return false;
        // Filter out Tailwind utility classes
        if (cls === 'dark' || cls === 'light') return false;
        if (/^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group|peer):/i.test(cls)) return false;
        if (/^(transition|duration|ease|animate|p-|m-|px-|py-|pt-|pr-|pb-|pl-|mx-|my-|mt-|mr-|mb-|ml-|text-|bg-|border-|rounded-|shadow-|w-|h-|min-w-|min-h-|max-w-|max-h-|flex|grid|items-|justify-|content-|gap-|space-|place-|object-|overflow-|opacity-|z-|top-|left-|right-|bottom-|inset-|font-|leading-|tracking-|underline|decoration-|sr-only|visible|invisible|cursor-|select-|pointer-events-|resize-|list-|table-|order-|scale-|rotate-|translate-|skew-|origin-|ring-|stroke-|fill-)/i.test(cls)) return false;
        if (/\/\d+$/.test(cls)) return false;
        return true;
    });
    
    return filtered.join(' ');
}

export type ElementType = 'text' | 'image' | 'link';

/**
 * Detect the type of element based on its properties
 * Returns: 'text', 'link', or 'image'
 */
export function detectElementType(element: HTMLElement): ElementType {
    const tagName = element.tagName.toLowerCase();
    
    // Image detection
    if (tagName === 'img') {
        return 'image';
    }
    
    // Link detection
    if (tagName === 'a' || element.closest('a')) {
        return 'link';
    }
    
    // Check for href attribute
    if (element.getAttribute('href')) {
        return 'link';
    }
    
    // Check for src attribute (images or embeds)
    if (element.getAttribute('src')) {
        return 'image';
    }
    
    // Default to text
    return 'text';
}

type PathSegment = {
    tag: string;
    className?: string;
};

/**
 * Generate a relative path from root to target element
 * Only includes tag names and semantic classes (no Tailwind, no IDs)
 * Example: "div.product > h2.title > a"
 */
export function generateRelativePath(rootElement: HTMLElement | null, targetElement: HTMLElement): string {
    if (!rootElement) {
        return getAbsolutePath(targetElement);
    }
    
    // Check if target is a child of root
    if (!rootElement.contains(targetElement)) {
        return getAbsolutePath(targetElement);
    }
    
    // Build path from target up to root, then reverse
    const path: PathSegment[] = [];
    let current: HTMLElement | null = targetElement;
    
    // Traverse up from target until we reach root (exclusive of root)
    while (current && current !== rootElement) {
        path.unshift({
            tag: current.tagName.toLowerCase(),
            className: current.className,
        });
        current = current.parentElement;
    }
    
    // If we didn't reach root, fall back to absolute path
    if (current !== rootElement) {
        return getAbsolutePath(targetElement);
    }
    
    // If target is root itself
    if (path.length === 0) {
        return 'self';
    }
    
    // Build the relative path string
    const relativePath = path.map(segment => {
        if (segment.className && segment.className.trim()) {
            const cleanedClasses = cleanTailwindClasses(segment.className);
            if (cleanedClasses.trim()) {
                const firstClass = cleanedClasses.split(/\s+/)[0];
                return `${segment.tag}.${firstClass}`;
            }
        }
        return `${segment.tag}`;
    }).join(' > ');
    
    return relativePath || 'self';
}

/**
 * Generate an absolute path for an element
 */
export function getAbsolutePath(element: HTMLElement): string {
    const path = getElementPath(element);
    return path.map(segment => {
        if (segment.className && segment.className.trim()) {
            const cleanedClasses = cleanTailwindClasses(segment.className);
            if (cleanedClasses.trim()) {
                const firstClass = cleanedClasses.split(/\s+/)[0];
                return `.${firstClass}`;
            }
        }
        return `${segment.tag}`;
    }).join(' > ');
}

/**
 * Build a path array from document root to target element
 */
export function getElementPath(element: HTMLElement): PathSegment[] {
    const path: PathSegment[] = [];
    let current: HTMLElement | null = element;
    
    while (current && current !== document.body) {
        path.unshift({
            tag: current.tagName.toLowerCase(),
            ...(current.className && { className: current.className }),
        });
        current = current.parentElement;
    }
    
    return path;
}
