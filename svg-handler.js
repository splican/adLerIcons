// SVG als Data URL laden (ohne unescape)
async function loadSVGAsDataURL(filename) {
    try {
        const response = await fetch(`icons/${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const svgText = await response.text();
        
        // Direkt als URL-encoded SVG (moderner und effizienter)
        const encoded = encodeURIComponent(svgText);
        return `data:image/svg+xml,${encoded}`;
    } catch (error) {
        console.warn(`Fehler beim Laden von ${filename}:`, error);
        return 'data:image/svg+xml,%3Csvg viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3C/svg%3E';
    }
}