// Gespeicherte Sprache laden und Icons generieren
document.addEventListener('DOMContentLoaded', async function() {
    // Übersetzungen initialisieren
    initializeTranslations();
    
    // Icons generieren
    if (typeof generateIconGrid === 'function') {
        await generateIconGrid();
    }
    
    // Auswahl-Info aktualisieren
    if (typeof updateSelectionInfo === 'function') {
        updateSelectionInfo();
    }
    
    console.log('AdLer Icon Repository loaded successfully');
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
    
    if (typeof iconDatabase !== 'undefined') {
        iconDatabase.push(newIcon);
        if (typeof generateIconGrid === 'function') {
            generateIconGrid();
        }
        console.log(`Icon "${id}" wurde hinzugefügt!`);
    }
};