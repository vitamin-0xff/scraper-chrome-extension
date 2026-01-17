export type TextPathNode = {
    text: string
    path: string
}

export function extractTextPaths(root: HTMLElement): TextPathNode[] {
    const results: TextPathNode[] = []
    traverse(root, '', results)
    return results
}

function traverse(
    element: HTMLElement,
    parentPath: string,
    out: TextPathNode[]
): void {
    if (shouldSkip(element)) return

    const path = buildPath(element, parentPath)

    if (isTextElement(element)) {
        const text = element.textContent?.replace(/\s+/g, ' ').trim()
        if (text) {
            out.push({
                text,
                path
            })
        }
    }

    for (const child of Array.from(element.children)) {
        if (child instanceof HTMLElement) {
            traverse(child, path, out)
        }
    }
}

function shouldSkip(element: HTMLElement): boolean {
    const tag = element.tagName.toLowerCase()

    if (['script', 'style', 'noscript'].includes(tag)) {
        return true
    }

    // Skip explicitly hidden via inline style ONLY
    const inlineStyle = element.getAttribute('style') || ''
    if (
        /display\s*:\s*none/i.test(inlineStyle) ||
        /visibility\s*:\s*hidden/i.test(inlineStyle)
    ) {
        return true
    }

    return false
}

function isTextElement(element: HTMLElement): boolean {
    return ['p', 'span', 'a', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b'].includes(element.tagName.toLowerCase())
}


function buildPath(element: HTMLElement, parentPath: string): string {
    const tag = element.tagName.toLowerCase()

    const index = getNthOfTypeIndex(element)
    const self = `${tag}:nth-of-type(${index})`

    return parentPath ? `${parentPath} > ${self}` : self
}

function getNthOfTypeIndex(element: HTMLElement): number {
    let index = 1
    let sibling = element.previousElementSibling

    while (sibling) {
        if (sibling.tagName === element.tagName) {
            index++
        }
        sibling = sibling.previousElementSibling
    }

    return index
}



