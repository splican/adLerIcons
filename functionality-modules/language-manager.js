// filepath: d:\01_CODE\AdLerIconRepo\language-manager.js
let currentLanguage = 'de';

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