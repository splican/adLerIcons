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
    iconDatabase.forEach(icon => selectedIcons.add(icon.id));
    
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
    const totalCount = iconDatabase.length;
    
    // Ausgewählte Anzahl aktualisieren
    const selectedCountElement = document.getElementById('selected-count');
    if (selectedCountElement) {
        selectedCountElement.textContent = `(${selectedCount} ${translations[currentLanguage].selected_count})`;
    }
    
    // Download-Button aktivieren/deaktivieren
    const downloadSelectedBtn = document.getElementById('download-selected-btn');
    if (downloadSelectedBtn) {
        downloadSelectedBtn.disabled = selectedCount === 0;
    }
    
    // Auswahl-Info aktualisieren
    const selectionInfo = document.getElementById('selection-info');
    if (selectionInfo) {
        selectionInfo.textContent = `${selectedCount} ${translations[currentLanguage].of} ${totalCount} ${translations[currentLanguage].selected_count}`;
    }
    
    // Gesamtzahl aktualisieren
    updateIconCount();
}

// Icon-Anzahl aktualisieren
function updateIconCount() {
    const countElement = document.getElementById('download-count');
    if (countElement) {
        countElement.textContent = `(${iconDatabase.length} Icons)`;
    }
}