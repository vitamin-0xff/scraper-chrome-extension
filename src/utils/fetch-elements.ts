import { parseHTML } from "linkedom";
import { cleanUpString } from "./string-clean";

export type FetchResult = {
  p: {
    page: number;
    elementNumber: number;
    totalElementsOnPage: number;
  };
  data: Record<string, any>;
};

export type FetchErrorEvent = {
  type: 'error';
  page: number;
  message: string;
  error: Error;
};

export async function* fetchElements(data: {
  maxNumberOfPages: number;
  baseUrl: string;
  pageParam: string;
  rootElement: any;
  savedSelections: any[];
  otherParams?: string[] | null;
}): AsyncGenerator<FetchResult | FetchErrorEvent, void, unknown> {
  try {
    if (!data.baseUrl) {
      throw new Error('Base URL is required for fetching');
    }

    if (!data.pageParam) {
      throw new Error('Page parameter is required for fetching');
    }

    if (!data.rootElement) {
      throw new Error('Root element is required for fetching');
    }

    if (!data.savedSelections || data.savedSelections.length === 0) {
      throw new Error('At least one child selection is required for fetching');
    }

    const listOfElements: any[] = [];
    const maxPages = Math.max(1, data.maxNumberOfPages || 1);

    for (let page = 1; page <= maxPages; page++) {
      try {
        // Add delay between requests
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

        // Build URL with parameters
        const pageUrl = new URL(data.baseUrl);
        pageUrl.searchParams.set(data.pageParam, page.toString());

        // Add any other parameters
        if (data.otherParams && Array.isArray(data.otherParams)) {
          data.otherParams.forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              pageUrl.searchParams.set(key.trim(), value.trim());
            }
          });
        }

        console.log(`Fetching page ${page}: ${pageUrl.toString()}`);

        const pageResponse = await fetch(pageUrl.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!pageResponse.ok) {
          throw new Error(
            `HTTP Error ${pageResponse.status}: ${pageResponse.statusText}`
          );
        }

        const pageData = await pageResponse.text();
        if (!pageData || pageData.trim().length === 0) {
          throw new Error('Empty response received');
        }

        // Parse HTML
        const dom = parseHTML(pageData);
        const doc = dom.document;

        // Build root selector
        const rootSelector = buildSelector(data.rootElement);
        const elements = doc.querySelectorAll(rootSelector);

        if (elements.length === 0) {
          console.warn(`No elements found on page ${page} with selector: ${rootSelector}`);
        }

        let elementsCountOfPage = 0;

        for (const el of elements) {
          elementsCountOfPage++;
          const element: Record<string, any> = {};

          // Extract data from child selections
          for (const selection of data.savedSelections) {
            try {
              const childSelector = buildSelector(selection);
              const children = el.querySelectorAll(childSelector);

              if (selection.isItArrya) {
                // If it's an array, collect all values
                element[selection.name] = Array.from(children).map(child =>
                  extractValue(child as HTMLElement, selection)
                );
              } else {
                // If not an array, get the first match
                if (children.length > 0) {
                  element[selection.name] = extractValue(
                    children[0] as HTMLElement,
                    selection
                  );
                } else {
                  element[selection.name] = null;
                }
              }
            } catch (selectionError) {
              console.error(`Error extracting selection ${selection.name}:`, selectionError);
              element[selection.name] = null;
            }
          }

          yield {
            p: {
              page,
              elementNumber: elementsCountOfPage,
              totalElementsOnPage: elements.length,
            },
            data: element,
          };

          listOfElements.push(element);
        }

        console.log(`Page ${page}: Extracted ${elementsCountOfPage} elements`);
      } catch (pageError) {
        const errorMessage = pageError instanceof Error ? pageError.message : String(pageError);
        console.error(`Error on page ${page}:`, errorMessage);

        yield {
          type: 'error',
          page,
          message: errorMessage,
          error: pageError instanceof Error ? pageError : new Error(errorMessage),
        };
      }
    }

    console.log(`Fetching complete. Total elements: ${listOfElements.length}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Fatal error during fetch:', errorMessage);

    yield {
      type: 'error',
      page: 0,
      message: errorMessage,
      error: error instanceof Error ? error : new Error(errorMessage),
    };
  }
}

/**
 * Build CSS selector from selection item
 */
function buildSelector(item: any): string {
  if (!item) return 'div';

  if (item.identifierType === 'className' && item.className) {
    // Handle multiple classes
    const classes = item.className.split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      return `.${classes.join('.')}`;
    }
  }

  if (item.identifierType === 'id' && item.className) {
    return `#${item.className}`;
  }

  return item.tagName || 'div';
}

/**
 * Extract value from HTML element based on selection type
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractValue(el: HTMLElement, _selection: any): string | {href: string, text: string} | null {
  try {
    const tagName = el.tagName?.toLowerCase();

    // For links, get href and text
    if (tagName === 'a') {
      const href = (el as any).href;
      return {
        text: cleanUpString(el.textContent || ''),
        href: href || null,
      } 
    }

    // For images, get src
    if (tagName === 'img') {
      return (el as any).src || null;
    }

    // For other elements, get text content
    return cleanUpString(el.textContent || '') || null;
  } catch (error) {
    console.error('Error extracting value:', error);
    return null;
  }
}