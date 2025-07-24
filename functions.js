let currentLanguage = 'de';

        // SVG als Data URL laden - BESTE LÖSUNG (ohne Base64)
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

        // Icons als IMG-Tags generieren
        async function generateIconGrid() {
            const iconGrid = document.querySelector('.icon-grid');
            iconGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Lade Icons...</div>';

            const iconCards = await Promise.all(iconDatabase.map(async (icon) => {
                const iconCard = document.createElement('div');
                iconCard.className = 'icon-card';
                
                // SVG als Data URL laden
                const svgDataURL = await loadSVGAsDataURL(icon.filename);
                
                iconCard.innerHTML = `
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
        }

        function switchLanguage(lang) {
            currentLanguage = lang;
            document.documentElement.lang = lang;
            
            // Buttons aktualisieren
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById(`lang-${lang}`).classList.add('active');
            
            // Titel und Untertitel aktualisieren
            const titleTexts = {
                de: {
                    title: "AdLer Icon Repository",
                    subtitle: "Hochwertige SVG-Icons für deine Projekte. Kostenlos zum Download und sofort einsatzbereit für Web, Mobile und Print."
                },
                en: {
                    title: "AdLer Icon Repository",
                    subtitle: "High-quality SVG icons for your projects. Free to download and ready to use for web, mobile and print."
                }
            };
            
            document.querySelector('[data-translate="title"]').textContent = titleTexts[lang].title;
            document.querySelector('[data-translate="subtitle"]').textContent = titleTexts[lang].subtitle;
            
            // Icons neu generieren mit neuer Sprache
            generateIconGrid();
            
            // Sprache in localStorage speichern
            localStorage.setItem('language', lang);
        }

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
                const titleTexts = {
                    en: {
                        title: "AdLer Icon Repository",
                        subtitle: "High-quality SVG icons for your projects. Free to download and ready to use for web, mobile and print."
                    }
                };
                
                if (titleTexts[savedLanguage]) {
                    document.querySelector('[data-translate="title"]').textContent = titleTexts[savedLanguage].title;
                    document.querySelector('[data-translate="subtitle"]').textContent = titleTexts[savedLanguage].subtitle;
                }
            }
            
            await generateIconGrid();
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

        // Übersetzungen für den Download-Button
        const translations = {
            de: {
                download_all: 'Alle Icons als ZIP herunterladen',
                downloading: 'Lade Icons herunter...',
                preparing: 'Bereite ZIP-Datei vor...',
                complete: 'Download abgeschlossen!'
            },
            en: {
                download_all: 'Download All Icons as ZIP',
                downloading: 'Downloading icons...',
                preparing: 'Preparing ZIP file...',
                complete: 'Download complete!'
            }
        };

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

        // Einzelnes Icon herunterladen
        async function downloadSingleIcon(filename) {
            // Vermeide Duplizierung, indem die bestehende Funktion verwendet wird
            await downloadIcon(filename);
        }

        // Icon-Anzahl aktualisieren
        function updateIconCount() {
            const countElement = document.getElementById('download-count');
            if (countElement) {
                countElement.textContent = `(${iconDatabase.length} Icons)`;
            }
        }