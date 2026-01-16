export const isDataValid = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false
    if (data.baseUrl && typeof data.baseUrl !== 'string') return false
    if (data.pageParam && typeof data.pageParam !== 'string') return false
    if (data.maxNumberOfPages && typeof data.maxNumberOfPages !== 'number') return false
    // continue the validation as mentioned above for other fields if necessary

    const validateSelectionItem = (item: any): boolean => {
        if (typeof item !== 'object') return false
        if (typeof item.name !== 'string' || item.name.length === 0) return false
        if (typeof item.className !== 'string' || item.className.length === 0) return false
        if (typeof item.tagName !== 'string' || item.tagName.length === 0) return false
        return true
    }
    if (data.rootElement && !validateSelectionItem(data.rootElement)) return false
    if (data.savedSelections && !Array.isArray(data.savedSelections)) return false
    for (const item of data.savedSelections) {
        if (!validateSelectionItem(item)) return false
    }    

  return true
}