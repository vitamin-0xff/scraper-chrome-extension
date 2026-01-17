import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    removePseudoClasses,
    cleanTailwindClasses,
    detectElementType,
    generateRelativePath,
    getAbsolutePath,
    getElementPath
} from '../src/content/views/algorithms/childElementAlgorithms';

describe('Child Element Algorithms', () => {
    let testContainer: HTMLElement;

    beforeEach(() => {
        testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
    });

    afterEach(() => {
        document.body.removeChild(testContainer);
    });

    describe('removePseudoClasses', () => {
        it('should remove pseudo-classes', () => {
            expect(removePseudoClasses('btn:hover')).toBe('btn');
            expect(removePseudoClasses('link:focus')).toBe('link');
            expect(removePseudoClasses('text:active')).toBe('text');
        });

        it('should remove pseudo-elements', () => {
            expect(removePseudoClasses('element::before')).toBe('element');
            expect(removePseudoClasses('element::after')).toBe('element');
        });

        it('should handle multiple pseudo-classes', () => {
            expect(removePseudoClasses('btn:hover:focus')).toBe('btn');
        });

        it('should return empty string for empty input', () => {
            expect(removePseudoClasses('')).toBe('');
        });
    });

    describe('cleanTailwindClasses', () => {
        it('should remove Tailwind utility classes', () => {
            const result = cleanTailwindClasses('product-card p-4 bg-white border rounded');
            expect(result).toContain('product-card');
            expect(result).not.toContain('p-4');
            expect(result).not.toContain('bg-white');
        });

        it('should remove responsive prefixes', () => {
            const result = cleanTailwindClasses('sm:text-lg md:text-xl lg:text-2xl');
            expect(result).toBe('');
        });

        it('should remove state variants', () => {
            const result = cleanTailwindClasses('hover:shadow-lg focus:ring-2 active:bg-blue-600');
            expect(result).toBe('');
        });

        it('should keep semantic classes', () => {
            const result = cleanTailwindClasses('product-item item-title price-label');
            expect(result).toContain('product-item');
            expect(result).toContain('item-title');
            expect(result).toContain('price-label');
        });

        it('should deduplicate classes', () => {
            const result = cleanTailwindClasses('product product card card');
            const classes = result.split(' ').filter(Boolean);
            expect(classes).toEqual(['product', 'card']);
        });

        it('should handle empty input', () => {
            expect(cleanTailwindClasses('')).toBe('');
            expect(cleanTailwindClasses('   ')).toBe('');
        });
    });

    describe('detectElementType', () => {
        it('should detect image elements', () => {
            const img = document.createElement('img');
            expect(detectElementType(img)).toBe('image');
        });

        it('should detect link elements', () => {
            const a = document.createElement('a');
            expect(detectElementType(a)).toBe('link');
        });

        it('should detect text elements by default', () => {
            const span = document.createElement('span');
            expect(detectElementType(span)).toBe('text');
        });

        it('should detect link by href attribute', () => {
            const element = document.createElement('div');
            element.setAttribute('href', 'https://example.com');
            expect(detectElementType(element)).toBe('link');
        });

        it('should detect image by src attribute', () => {
            const element = document.createElement('div');
            element.setAttribute('src', 'image.jpg');
            expect(detectElementType(element)).toBe('image');
        });

        it('should detect link when inside a tag', () => {
            const a = document.createElement('a');
            const span = document.createElement('span');
            a.appendChild(span);
            document.body.appendChild(a);
            
            expect(detectElementType(span)).toBe('link');
            
            document.body.removeChild(a);
        });
    });

    describe('getElementPath', () => {
        it('should build correct path array', () => {
            testContainer.innerHTML = `
                <div class="wrapper">
                    <div class="inner">
                        <span id="target">Text</span>
                    </div>
                </div>
            `;
            
            const target = document.getElementById('target') as HTMLElement;
            const path = getElementPath(target);
            
            expect(path[path.length - 1].tag).toBe('span');
        });
    });

    describe('generateRelativePath', () => {
        it('should generate relative path from root', () => {
            testContainer.innerHTML = `
                <div class="root">
                    <div class="container">
                        <h2 class="title">Title</h2>
                    </div>
                </div>
            `;
            
            const root = testContainer.querySelector('.root') as HTMLElement;
            const target = testContainer.querySelector('.title') as HTMLElement;
            
            const path = generateRelativePath(root, target);
            expect(path).toContain('div');
            expect(path).toContain('h2');
        });

        it('should return self for direct child', () => {
            testContainer.innerHTML = `
                <div id="root">
                    <span id="target">Text</span>
                </div>
            `;
            
            const root = document.getElementById('root') as HTMLElement;
            const target = document.getElementById('target') as HTMLElement;
            
            const path = generateRelativePath(root, target);
            expect(path).toMatch(/span|self/);
        });

        it('should return absolute path if target not in root', () => {
            testContainer.innerHTML = '<div id="root"></div>';
            const root = testContainer.querySelector('#root') as HTMLElement;
            const target = document.createElement('div');
            target.className = 'external';
            
            const path = generateRelativePath(root, target);
            expect(path).toBeTruthy();
        });

        it('should clean Tailwind classes in path', () => {
            testContainer.innerHTML = `
                <div class="root">
                    <div class="product-item p-4 bg-white">
                        <h2 class="title text-lg">Title</h2>
                    </div>
                </div>
            `;
            
            const root = testContainer.querySelector('.root') as HTMLElement;
            const target = testContainer.querySelector('.title') as HTMLElement;
            
            const path = generateRelativePath(root, target);
            expect(path).toContain('product-item');
            expect(path).toContain('title');
            expect(path).not.toContain('p-4');
            expect(path).not.toContain('bg-white');
        });
    });

    describe('getAbsolutePath', () => {
        it('should generate absolute path', () => {
            testContainer.innerHTML = `
                <div class="wrapper">
                    <span class="text">Content</span>
                </div>
            `;
            
            const span = testContainer.querySelector('.text') as HTMLElement;
            const path = getAbsolutePath(span);
            
            expect(path).toContain('span');
            expect(path).toContain('text');
        });
    });
});
