// Icons als IMG-Tags generieren - ERWEITERT mit Checkboxen
async function generateIconGrid() {
    const iconGrid = document.querySelector('.icon-grid');
    iconGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Lade Icons...</div>';

    const iconCards = await Promise.all(iconDatabase.map(async (icon) => {
        const iconCard = document.createElement('div');
        iconCard.className = 'icon-card';
        iconCard.setAttribute('data-icon-id', icon.id);
        
        // SVG als Data URL laden
        const svgDataURL = await loadSVGAsDataURL(icon.filename);
        
        // Prüfen ob Icon ausgewählt ist
        const isSelected = selectedIcons.has(icon.id);
        if (isSelected) {
            iconCard.classList.add('selected');
        }
        
        iconCard.innerHTML = `
            <div class="icon-checkbox">
                <input type="checkbox" 
                       id="checkbox-${icon.id}" 
                       ${isSelected ? 'checked' : ''} 
                       onchange="toggleIconSelection('${icon.id}', this.checked)">
            </div>
            <div class="icon-preview">
                <img src="${svgDataURL}" alt="${icon.translations[currentLanguage].title}" />
            </div>
            <h3 class="icon-name">${icon.translations[currentLanguage].title}</h3>
            <p class="icon-description">${icon.translations[currentLanguage].desc}</p>
            <a href="#" class="download-btn" onclick="downloadIcon('${icon.filename}')">${currentLanguage === 'de' ? 'SVG herunterladen' : 'Download SVG'}</a>
        `;
        
        return iconCard;
    }));

    // Grid leeren und Icons hinzufügen
    iconGrid.innerHTML = '';
    iconCards.forEach(card => iconGrid.appendChild(card));
    
    // Auswahl-Info aktualisieren
    updateSelectionInfo();
}