import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    calculateRootElementStats,
    calculateElementCount,
    getElementDepth,
    generateSelector
} from '../src/content/views/algorithms/rootElementAlgorithms';

describe('Root Element Algorithms', () => {
    let testContainer: HTMLElement;

    beforeEach(() => {
        // Create a test DOM structure
        testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
    });

    afterEach(() => {
        document.body.removeChild(testContainer);
    });

    describe('calculateElementCount', () => {
        it('should count elements by class name', () => {
            testContainer.innerHTML = `
                <div class="product">Item 1</div>
                <div class="product">Item 2</div>
                <div class="product">Item 3</div>
            `;
            
            const productElement = testContainer.querySelector('.product') as HTMLElement;
            const count = calculateElementCount(productElement);
            
            expect(count).toBe(3);
        });

        it('should count sibling elements by tag name', () => {
            testContainer.innerHTML = `
                <div>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </div>
            `;
            
            const liElement = testContainer.querySelector('li') as HTMLElement;
            const count = calculateElementCount(liElement);
            
            expect(count).toBe(3);
        });

        it('should return 1 for unique elements', () => {
            testContainer.innerHTML = '<div class="unique-element">Only one</div>';
            
            const uniqueElement = testContainer.querySelector('.unique-element') as HTMLElement;
            const count = calculateElementCount(uniqueElement);
            
            expect(count).toBeGreaterThanOrEqual(1);
        });
    });

    describe('getElementDepth', () => {
        it('should calculate correct DOM depth', () => {
            testContainer.innerHTML = `
                <div>
                    <div>
                        <div id="deep-element"></div>
                    </div>
                </div>
            `;
            
            const deepElement = document.getElementById('deep-element') as HTMLElement;
            const depth = getElementDepth(deepElement);
            
            // Depth should be at least 3 (deep-element -> div -> div -> body)
            expect(depth).toBeGreaterThanOrEqual(3);
        });

        it('should return 0 for document.body', () => {
            const bodyDepth = getElementDepth(document.body);
            expect(bodyDepth).toBe(1); // body -> html
        });
    });

    describe('generateSelector', () => {
        it('should prioritize ID selector', () => {
            const element = document.createElement('div');
            element.id = 'my-id';
            element.className = 'my-class';
            
            const selector = generateSelector(element);
            expect(selector).toBe('#my-id');
        });

        it('should use class selector when no ID', () => {
            const element = document.createElement('div');
            element.className = 'class1 class2 class3';
            
            const selector = generateSelector(element);
            expect(selector).toMatch(/^\.class/);
        });

        it('should use tag name as fallback', () => {
            const element = document.createElement('span');
            
            const selector = generateSelector(element);
            expect(selector).toMatch(/^(span|.*:nth-child)/);
        });
    });

    describe('calculateRootElementStats', () => {
        it('should calculate all stats correctly', () => {
            testContainer.innerHTML = `
                <div id="root" class="product-item">
                    <h2>Title</h2>
                    <p>Description</p>
                    <a href="#">Link</a>
                </div>
            `;
            
            const rootElement = document.getElementById('root') as HTMLElement;
            const stats = calculateRootElementStats(rootElement);
            
            expect(stats).toHaveProperty('countOnPage');
            expect(stats).toHaveProperty('tagName');
            expect(stats).toHaveProperty('hasId');
            expect(stats).toHaveProperty('hasClassName');
            expect(stats).toHaveProperty('depth');
            expect(stats).toHaveProperty('childrenCount');
            expect(stats).toHaveProperty('selector');
            
            expect(stats.tagName).toBe('div');
            expect(stats.hasId).toBe(true);
            expect(stats.hasClassName).toBe(true);
            expect(stats.childrenCount).toBe(3);
        });

        it('should handle elements without ID or class', () => {
            testContainer.innerHTML = '<span>Text</span>';
            
            const span = testContainer.querySelector('span') as HTMLElement;
            const stats = calculateRootElementStats(span);
            
            expect(stats.hasId).toBe(false);
            expect(stats.hasClassName).toBe(false);
            expect(stats.tagName).toBe('span');
        });
    });
});
