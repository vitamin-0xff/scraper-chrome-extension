/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string = 'data.json'): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading JSON:', error);
    throw new Error('Failed to download JSON file');
  }
}

/**
 * Generate a filename with timestamp
 */
export function generateFilename(baseName: string = 'extracted-data'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const time = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
  return `${baseName}_${timestamp}_${time}.json`;
}
