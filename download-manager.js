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