let currentLanguage = 'de';
let selectedIcons = new Set(); // Set für ausgewählte Icons

// Übersetzungen für alle Texte
const translations = {
    de: {
        download_all: 'Alle Icons als ZIP herunterladen',
        download_selected: 'Ausgewählte Icons herunterladen',
        downloading: 'Lade Icons herunter...',
        preparing: 'Bereite ZIP-Datei vor...',
        complete: 'Download abgeschlossen!',
        select_all: 'Alle auswählen',
        deselect_all: 'Alle abwählen',
        selected_count: 'ausgewählt',
        of: 'von',
        title: "AdLer Icon Repository",
        subtitle: "Hochwertige SVG-Icons für deine Projekte. Kostenlos zum Download und sofort einsatzbereit für Web, Mobile und Print.",
        subtitletext: "Alle im Projekt entstandenen Icons werden hier zum kostenfreien Download angeboten. Alle Icons stehen unter der MIT-License und sind frei verfügbar und nutzbar."
    },
    en: {
        download_all: 'Download All Icons as ZIP',
        download_selected: 'Download Selected Icons',
        downloading: 'Downloading icons...',
        preparing: 'Preparing ZIP file...',
        complete: 'Download complete!',
        select_all: 'Select All',
        deselect_all: 'Deselect All',
        selected_count: 'selected',
        of: 'of',
        title: "AdLer Icon Repository",
        subtitle: "High-quality SVG icons for your projects. Free to download and ready to use for web, mobile and print.",
        subtitletext: "All icons created in the project are offered here for free download. All icons are under the MIT license and are freely available and usable."
    }
};

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

// Alle Icons als ZIP herunterladen
async function downloadAllIcons() {
    const downloadBtn = document.getElementById('download-all-btn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Button deaktivieren und Status anzeigen
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].downloading}</span>`;
        
        // Progress-Bar erstellen
        const progressContainer = document.createElement('div');
        progressContainer.className = 'download-progress';
        progressContainer.innerHTML = '<div class="download-progress-bar"></div>';
        progressContainer.style.display = 'block';
        downloadBtn.parentNode.appendChild(progressContainer);
        
        const progressBar = progressContainer.querySelector('.download-progress-bar');
        
        // ZIP-Objekt erstellen
        const zip = new JSZip();
        const iconFolder = zip.folder('adler-icons');
        
        // Alle Icons laden
        const totalIcons = iconDatabase.length;
        let loadedIcons = 0;
        
        for (const icon of iconDatabase) {
            try {
                const response = await fetch(`icons/${icon.filename}`);
                if (response.ok) {
                    const svgContent = await response.text();
                    iconFolder.file(icon.filename, svgContent);
                }
                
                loadedIcons++;
                const progress = (loadedIcons / totalIcons) * 100;
                progressBar.style.width = progress + '%';
                
            } catch (error) {
                console.warn(`Fehler beim Laden von ${icon.filename}:`, error);
            }
        }
        
        // README-Datei hinzufügen
        const readmeContent = `# AdLer Icon Repository

Diese ZIP-Datei enthält ${totalIcons} SVG-Icons aus dem AdLer Projekt.

## Lizenz
Alle Icons stehen unter der MIT-Lizenz und sind frei verwendbar.

## Verwendung
Die SVG-Dateien können direkt in Web-, Mobile- und Print-Projekten verwendet werden.

## Weitere Informationen
Besuchen Sie das AdLer Icon Repository für weitere Details und Updates.

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
`;
        
        zip.file('README.txt', readmeContent);
        
        // Status aktualisieren
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].preparing}</span>`;
        
        // ZIP generieren und herunterladen
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Download starten
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adler-icons.zip';
        a.click();
        URL.revokeObjectURL(url);
        
        // Erfolg anzeigen
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].complete}</span>`;
        
        // Nach 2 Sekunden zurücksetzen
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
            progressContainer.remove();
        }, 2000);
        
    } catch (error) {
        console.error('Fehler beim ZIP-Download:', error);
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
        alert('Fehler beim Erstellen der ZIP-Datei');
    }
}

// Ausgewählte Icons als ZIP herunterladen
async function downloadSelectedIcons() {
    if (selectedIcons.size === 0) {
        alert(currentLanguage === 'de' ? 'Bitte wählen Sie mindestens ein Icon aus.' : 'Please select at least one icon.');
        return;
    }
    
    const downloadBtn = document.getElementById('download-selected-btn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Button deaktivieren und Status anzeigen
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].downloading}</span>`;
        
        // Progress-Bar erstellen
        const progressContainer = document.createElement('div');
        progressContainer.className = 'download-progress';
        progressContainer.innerHTML = '<div class="download-progress-bar"></div>';
        progressContainer.style.display = 'block';
        downloadBtn.parentNode.appendChild(progressContainer);
        
        const progressBar = progressContainer.querySelector('.download-progress-bar');
        
        // ZIP-Objekt erstellen
        const zip = new JSZip();
        const iconFolder = zip.folder('adler-selected-icons');
        
        // Nur ausgewählte Icons laden
        const selectedIconsArray = iconDatabase.filter(icon => selectedIcons.has(icon.id));
        const totalIcons = selectedIconsArray.length;
        let loadedIcons = 0;
        
        for (const icon of selectedIconsArray) {
            try {
                const response = await fetch(`icons/${icon.filename}`);
                if (response.ok) {
                    const svgContent = await response.text();
                    iconFolder.file(icon.filename, svgContent);
                }
                
                loadedIcons++;
                const progress = (loadedIcons / totalIcons) * 100;
                progressBar.style.width = progress + '%';
                
            } catch (error) {
                console.warn(`Fehler beim Laden von ${icon.filename}:`, error);
            }
        }
        
        // README-Datei hinzufügen
        const readmeContent = `# AdLer Icon Repository - Ausgewählte Icons

Diese ZIP-Datei enthält ${totalIcons} ausgewählte SVG-Icons aus dem AdLer Projekt.

## Enthaltene Icons:
${selectedIconsArray.map(icon => `- ${icon.filename} (${icon.translations[currentLanguage].title})`).join('\n')}

## Lizenz
Alle Icons stehen unter der MIT-Lizenz und sind frei verwendbar.

## Verwendung
Die SVG-Dateien können direkt in Web-, Mobile- und Print-Projekten verwendet werden.

## Weitere Informationen
Besuchen Sie das AdLer Icon Repository für weitere Details und Updates.

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
`;
        
        zip.file('README.txt', readmeContent);
        
        // Status aktualisieren
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].preparing}</span>`;
        
        // ZIP generieren und herunterladen
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Download starten
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adler-selected-icons-${totalIcons}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Erfolg anzeigen
        downloadBtn.innerHTML = `<span>${translations[currentLanguage].complete}</span>`;
        
        // Nach 2 Sekunden zurücksetzen
        setTimeout(() => {
            downloadBtn.disabled = selectedIcons.size === 0;
            downloadBtn.innerHTML = originalText;
            progressContainer.remove();
        }, 2000);
        
    } catch (error) {
        console.error('Fehler beim ZIP-Download:', error);
        downloadBtn.disabled = selectedIcons.size === 0;
        downloadBtn.innerHTML = originalText;
        alert('Fehler beim Erstellen der ZIP-Datei');
    }
}

// Einzelnes Icon herunterladen
async function downloadIcon(filename) {
    try {
        const response = await fetch(`icons/${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download-Fehler:', error);
        alert('Fehler beim Download der Datei');
    }
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
    
    // Alle Übersetzungen aktualisieren
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Titel und Untertitel aktualisieren
    document.querySelector('[data-translate="title"]').textContent = translations[lang].title;
    document.querySelector('[data-translate="subtitle"]').textContent = translations[lang].subtitle;
    document.querySelector('[data-translate="subtitletext"]').textContent = translations[lang].subtitletext;
    
    // Icons neu generieren mit neuer Sprache
    generateIconGrid();
    
    // Auswahl-Info aktualisieren
    updateSelectionInfo();
    
    // Sprache in localStorage speichern
    localStorage.setItem('language', lang);
}

// Gespeicherte Sprache laden und Icons generieren
document.addEventListener('DOMContentLoaded', async function() {
    const savedLanguage = localStorage.getItem('language') || 'de';
    currentLanguage = savedLanguage;
    
    if (savedLanguage !== 'de') {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${savedLanguage}`).classList.add('active');
        
        // Titel sofort aktualisieren
        document.querySelector('[data-translate="title"]').textContent = translations[savedLanguage].title;
        document.querySelector('[data-translate="subtitle"]').textContent = translations[savedLanguage].subtitle;
        document.querySelector('[data-translate="subtitletext"]').textContent = translations[savedLanguage].subtitletext;
    }
    
    await generateIconGrid();
    updateSelectionInfo();
});

// Admin-Funktion zum einfachen Hinzufügen neuer Icons
window.addIcon = function(id, filename, deTitle, deDesc, enTitle, enDesc) {
    const newIcon = {
        id: id,
        filename: filename,
        translations: {
            de: { title: deTitle, desc: deDesc },
            en: { title: enTitle, desc: enDesc }
        }
    };
    iconDatabase.push(newIcon);
    generateIconGrid();
    console.log(`Icon "${id}" wurde hinzugefügt!`);
};