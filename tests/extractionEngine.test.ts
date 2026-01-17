import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    extractFromCurrentPage,
    buildPageUrl,
    getStartPage,
    validateConfig,
    generateRootSelector,
    type PaginationConfig,
} from '../src/content/views/algorithms/extractionEngine';
import type { ChildElement } from '../src/content/views/types';

describe('Extraction Engine', () => {
    let testContainer: HTMLElement;

    beforeEach(() => {
        testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
    });

    afterEach(() => {
        document.body.removeChild(testContainer);
    });

    describe('buildPageUrl', () => {
        it('should build URL with page parameter', () => {
            const config: PaginationConfig = {
                baseUrl: 'https://example.com/products',
                pageParam: 'page',
                pageParamValue: '1',
                maxPages: 10,
                otherParams: {},
            };

            const url = buildPageUrl(config, 2);
            expect(url).toContain('page=2');
        });

        it('should include additional parameters', () => {
            const config: PaginationConfig = {
                baseUrl: 'https://example.com/products',
                pageParam: 'page',
                pageParamValue: '1',
                maxPages: 10,
                otherParams: { sort: 'newest', filter: 'active' },
            };

            const url = buildPageUrl(config, 1);
            expect(url).toContain('page=1');
            expect(url).toContain('sort=newest');
            expect(url).toContain('filter=active');
        });

        it('should handle different page parameter names', () => {
            const config: PaginationConfig = {
                baseUrl: 'https://example.com/items',
                pageParam: 'p',
                pageParamValue: '0',
                maxPages: 5,
                otherParams: {},
            };

            const url = buildPageUrl(config, 3);
            expect(url).toContain('p=3');
        });
    });

    describe('getStartPage', () => {
        it('should parse start page from string', () => {
            expect(getStartPage('1')).toBe(1);
            expect(getStartPage('10')).toBe(10);
            expect(getStartPage('0')).toBe(0);
        });

        it('should return 1 for invalid input', () => {
            expect(getStartPage('abc')).toBe(1);
            expect(getStartPage('')).toBe(1);
        });
    });

    describe('extractFromCurrentPage', () => {
        it('should extract text from elements', () => {
            testContainer.innerHTML = `
                <div class="product">
                    <h2 class="title">Product 1</h2>
                    <p class="price">$10</p>
                </div>
                <div class="product">
                    <h2 class="title">Product 2</h2>
                    <p class="price">$20</p>
                </div>
            `;

            const children: ChildElement[] = [
                {
                    id: '1',
                    name: 'title',
                    type: 'text',
                    path: 'h2.title',
                    isList: false,
                    extractText: true,
                },
                {
                    id: '2',
                    name: 'price',
                    type: 'text',
                    path: 'p.price',
                    isList: false,
                    extractText: true,
                },
            ];

            const result = extractFromCurrentPage('.product', children);

            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Product 1');
            expect(result[0].price).toBe('$10');
            expect(result[1].title).toBe('Product 2');
            expect(result[1].price).toBe('$20');
        });

        it('should extract link href', () => {
            testContainer.innerHTML = `
                <div class="item">
                    <a href="/product/1" class="link">Product Link</a>
                </div>
            `;

            const children: ChildElement[] = [
                {
                    id: '1',
                    name: 'url',
                    type: 'link',
                    path: 'a.link',
                    isList: false,
                    extractText: false,
                    extractHref: true,
                },
            ];

            const result = extractFromCurrentPage('.item', children);

            expect(result[0].url).toContain('/product/1');
        });

        it('should extract image src', () => {
            testContainer.innerHTML = `
                <div class="item">
                    <img src="/images/product.jpg" alt="Product" class="img"/>
                </div>
            `;

            const children: ChildElement[] = [
                {
                    id: '1',
                    name: 'image',
                    type: 'image',
                    path: 'img.img',
                    isList: false,
                    extractSrc: true,
                    extractAlt: false,
                },
            ];

            const result = extractFromCurrentPage('.item', children);

            expect(result[0].image).toContain('/images/product.jpg');
        });

        it('should handle list items', () => {
            testContainer.innerHTML = `
                <div class="product">
                    <ul>
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                    </ul>
                </div>
            `;

            const children: ChildElement[] = [
                {
                    id: '1',
                    name: 'features',
                    type: 'text',
                    path: 'ul li',
                    isList: true,
                    extractText: true,
                },
            ];

            const result = extractFromCurrentPage('.product', children);

            expect(result[0].features).toBeInstanceOf(Array);
            expect(result[0].features).toHaveLength(3);
            expect(result[0].features[0]).toBe('Feature 1');
        });
    });

    describe('validateConfig', () => {
        const mockRoot = document.createElement('div');
        const mockChildren: ChildElement[] = [
            {
                id: '1',
                name: 'test',
                type: 'text',
                path: 'div',
                isList: false,
                extractText: true,
            },
        ];
        const mockConfig: PaginationConfig = {
            baseUrl: 'https://example.com',
            pageParam: 'page',
            pageParamValue: '1',
            maxPages: 10,
            otherParams: {},
        };

        it('should validate complete configuration', () => {
            const validation = validateConfig(mockRoot, mockChildren, mockConfig);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should detect missing root element', () => {
            const validation = validateConfig(null, mockChildren, mockConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('Root element not selected');
        });

        it('should detect missing children', () => {
            const validation = validateConfig(mockRoot, [], mockConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('No child elements selected');
        });

        it('should detect missing pagination config', () => {
            const validation = validateConfig(mockRoot, mockChildren, null);
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('Pagination not configured');
        });

        it('should detect invalid max pages', () => {
            const invalidConfig = { ...mockConfig, maxPages: 0 };
            const validation = validateConfig(mockRoot, mockChildren, invalidConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors).toContain('Max pages must be at least 1');
        });
    });

    describe('generateRootSelector', () => {
        it('should prefer ID selector', () => {
            const element = document.createElement('div');
            element.id = 'my-root';
            element.className = 'container product-list';

            const selector = generateRootSelector(element);
            expect(selector).toBe('#my-root');
        });

        it('should use semantic classes', () => {
            const element = document.createElement('div');
            element.className = 'product-item p-4 bg-white';

            const selector = generateRootSelector(element);
            expect(selector).toContain('product-item');
        });

        it('should filter out Tailwind classes', () => {
            const element = document.createElement('div');
            element.className = 'p-4 m-2 bg-white product';

            const selector = generateRootSelector(element);
            expect(selector).not.toContain('p-4');
            expect(selector).not.toContain('m-2');
        });

        it('should use tag name as fallback', () => {
            const element = document.createElement('article');

            const selector = generateRootSelector(element);
            expect(selector).toBeTruthy();
        });
    });
});
