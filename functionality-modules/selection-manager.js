let selectedIcons = new Set(); // Set für ausgewählte Icons

// Icon-Auswahl umschalten
function toggleIconSelection(iconId, isSelected) {
    const iconCard = document.querySelector(`[data-icon-id="${iconId}"]`);
    
    if (isSelected) {
        selectedIcons.add(iconId);
        iconCard.classList.add('selected');
    } else {
        selectedIcons.delete(iconId);
        iconCard.classList.remove('selected');
    }
    
    updateSelectionInfo();
}

// Alle Icons auswählen
function selectAllIcons() {
    selectedIcons.clear();
    if (typeof iconDatabase !== 'undefined') {
        iconDatabase.forEach(icon => selectedIcons.add(icon.id));
    }
    
    // Alle Checkboxen aktivieren
    document.querySelectorAll('.icon-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Alle Karten als ausgewählt markieren
    document.querySelectorAll('.icon-card').forEach(card => {
        card.classList.add('selected');
    });
    
    updateSelectionInfo();
}

// Alle Icons abwählen
function deselectAllIcons() {
    selectedIcons.clear();
    
    // Alle Checkboxen deaktivieren
    document.querySelectorAll('.icon-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Alle Karten als nicht ausgewählt markieren
    document.querySelectorAll('.icon-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    updateSelectionInfo();
}

// Auswahl-Informationen aktualisieren
function updateSelectionInfo() {
    const selectedCount = selectedIcons.size;
    const totalCount = typeof iconDatabase !== 'undefined' ? iconDatabase.length : 0;
    
    // Ausgewählte Anzahl aktualisieren mit Übersetzung
    const selectedCountElement = document.getElementById('selected-count');
    if (selectedCountElement) {
        selectedCountElement.textContent = formatString(
            translations[currentLanguage].selected_count_format,
            { count: selectedCount }
        );
    }
    
    // Download-Button aktivieren/deaktivieren
    const downloadSelectedBtn = document.getElementById('download-selected-btn');
    if (downloadSelectedBtn) {
        downloadSelectedBtn.disabled = selectedCount === 0;
    }
    
    // Auswahl-Info aktualisieren mit Übersetzung
    const selectionInfo = document.getElementById('selection-info');
    if (selectionInfo) {
        selectionInfo.textContent = formatString(
            translations[currentLanguage].selection_info_format,
            { selected: selectedCount, total: totalCount }
        );
    }
    
    // Gesamtzahl aktualisieren
    updateIconCount();
}

// Icon-Anzahl aktualisieren
function updateIconCount() {
    const countElement = document.getElementById('download-count');
    if (countElement && typeof iconDatabase !== 'undefined') {
        countElement.textContent = formatString(
            translations[currentLanguage].icon_count_format,
            { count: iconDatabase.length }
        );
    }
}