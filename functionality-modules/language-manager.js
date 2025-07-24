let currentLanguage = 'de';

// Hilfsfunktion für String-Interpolation
function formatString(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return values[key] !== undefined ? values[key] : match;
    });
}

// Sprache wechseln - ERWEITERT für neue Übersetzungen
function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Buttons aktualisieren
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Alle statischen Übersetzungen aktualisieren
    updateAllTranslations();
    
    // Icons neu generieren mit neuer Sprache
    if (typeof generateIconGrid === 'function') {
        generateIconGrid();
    }
    
    // Auswahl-Info aktualisieren
    if (typeof updateSelectionInfo === 'function') {
        updateSelectionInfo();
    }
    
    // Sprache in localStorage speichern
    localStorage.setItem('language', lang);
}

// Alle Übersetzungen aktualisieren
function updateAllTranslations() {
    // Standardelemente mit data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Spezielle Zähler aktualisieren
    updateDynamicCounts();
}

// Dynamische Zähler aktualisieren
function updateDynamicCounts() {
    // Icon-Gesamtzahl
    if (typeof iconDatabase !== 'undefined' && iconDatabase.length > 0) {
        const countElement = document.getElementById('download-count');
        if (countElement) {
            countElement.textContent = formatString(
                translations[currentLanguage].icon_count_format,
                { count: iconDatabase.length }
            );
        }
    }
    
    // Ausgewählte Icons
    if (typeof selectedIcons !== 'undefined') {
        const selectedCountElement = document.getElementById('selected-count');
        if (selectedCountElement) {
            selectedCountElement.textContent = formatString(
                translations[currentLanguage].selected_count_format,
                { count: selectedIcons.size }
            );
        }
        
        // Auswahl-Info
        const selectionInfoElement = document.getElementById('selection-info');
        if (selectionInfoElement && typeof iconDatabase !== 'undefined') {
            selectionInfoElement.textContent = formatString(
                translations[currentLanguage].selection_info_format,
                { 
                    selected: selectedIcons.size,
                    total: iconDatabase.length 
                }
            );
        }
    }
}

// Initiale Übersetzungen setzen (wird beim Laden aufgerufen)
function initializeTranslations() {
    const savedLanguage = localStorage.getItem('language') || 'de';
    currentLanguage = savedLanguage;
    
    // Sprachbuttons aktualisieren
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${savedLanguage}`).classList.add('active');
    
    // Alle Übersetzungen setzen
    updateAllTranslations();
}