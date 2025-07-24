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