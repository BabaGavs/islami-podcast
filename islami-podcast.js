// Islami Podcast Mobile App JavaScript

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Splash Screen
    const splashScreen = document.getElementById('splashScreen');
    const mainApp = document.getElementById('mainApp');
    
    // Show splash screen for 3 seconds, then fade out
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainApp.style.display = 'block';
            mainApp.style.opacity = '0';
            mainApp.style.transition = 'opacity 0.5s ease-in';
            
            setTimeout(() => {
                mainApp.style.opacity = '1';
            }, 100);
        }, 1000);
    }, 3000);
    
    // Page navigation functionality
    const audiobookPage = document.getElementById('audiobookPage');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    
    // Switch between pages
    function switchPage(targetPage) {
        // Hide all pages
        mainApp.style.display = 'none';
        audiobookPage.style.display = 'none';
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show target page and set active nav
        switch(targetPage) {
            case 'home':
                mainApp.style.display = 'block';
                document.querySelector('.nav-item:first-child').classList.add('active');
                break;
            case 'audiobookPage':
                audiobookPage.style.display = 'block';
                document.querySelector('.nav-item[data-page="audiobookPage"]').classList.add('active');
                break;
        }
    }
    
    // Add click handlers to navigation items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.dataset.page;
            switchPage(targetPage);
        });
    });
    
    // Settings button handlers
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            settingsModal.style.display = 'flex';
            settingsModal.style.opacity = '0';
            setTimeout(() => {
                settingsModal.style.opacity = '1';
                // Attach color palette event listeners when modal opens
                attachColorPaletteListeners();
            }, 100);
        });
    }
    
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', function() {
            settingsModal.style.opacity = '0';
            setTimeout(() => {
                settingsModal.style.display = 'none';
            }, 300);
        });
    }
    
    // Close modal on overlay click
    if (settingsModal) {
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal.querySelector('.modal-overlay')) {
                settingsModal.style.opacity = '0';
                setTimeout(() => {
                    settingsModal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Function to attach color palette listeners
    function attachColorPaletteListeners() {
        const colorPalettes = document.querySelectorAll('.color-palettes .color-palette');
        if (colorPalettes.length > 0) {
            colorPalettes.forEach(palette => {
                // Remove existing listener to prevent duplicates
                palette.removeEventListener('click', handleColorPaletteClick);
                // Add new listener
                palette.addEventListener('click', handleColorPaletteClick);
            });
        }
    }
    
    // Color palette click handler
    function handleColorPaletteClick() {
        const theme = this.dataset.theme;
        settings.theme = theme;
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        updateColorPaletteSelection(theme);
    }
    
    // Settings data
    const settings = {
        theme: localStorage.getItem('theme') || 'default',
        notifications: localStorage.getItem('notifications') === 'true',
        autoPlay: localStorage.getItem('autoPlay') === 'true'
    };
    
    // Initialize settings
    function initializeSettings() {
        // Set theme
        applyTheme(settings.theme);
        updateColorPaletteSelection(settings.theme);
        
        // Set checkboxes
        const notificationsEnabled = document.getElementById('notificationsEnabled');
        const autoPlayEnabled = document.getElementById('autoPlayEnabled');
        if (notificationsEnabled) notificationsEnabled.checked = settings.notifications;
        if (autoPlayEnabled) autoPlayEnabled.checked = settings.autoPlay;
    }
    
    // Apply theme
    function applyTheme(theme) {
        document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    }
    
    // Update color palette selection
    function updateColorPaletteSelection(theme) {
        const colorPalettes = document.querySelectorAll('.color-palettes .color-palette');
        colorPalettes.forEach(palette => {
            palette.classList.remove('active');
            if (palette.dataset.theme === theme) {
                palette.classList.add('active');
            }
        });
    }
    
    // Notification settings
    const notificationsEnabled = document.getElementById('notificationsEnabled');
    if (notificationsEnabled) {
        notificationsEnabled.addEventListener('change', function() {
            settings.notifications = this.checked;
            localStorage.setItem('notifications', this.checked);
        });
    }
    
    // Auto-play settings
    const autoPlayEnabled = document.getElementById('autoPlayEnabled');
    if (autoPlayEnabled) {
        autoPlayEnabled.addEventListener('change', function() {
            settings.autoPlay = this.checked;
            localStorage.setItem('autoPlay', this.checked);
        });
    }
    
    // Initialize settings on load
    initializeSettings();
    
    // Initialize mini player controls
    function initializeMiniPlayerControls() {
        const miniPlayBtn = document.getElementById('miniPlayBtn');
        if (miniPlayBtn) {
            miniPlayBtn.addEventListener('click', function() {
                if (isPlaying) {
                    pauseAudiobook();
                } else {
                    playAudiobook(currentChapter);
                }
            });
        }
    }
    initializeMiniPlayerControls();
    
    // Podcast navigation (scroll to categories)
    document.querySelectorAll('.nav-item').forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === 'Podcastlar') {
            item.addEventListener('click', function() {
                // Scroll to categories section on main page
                if (mainApp.style.display === 'none') {
                    switchPage('home');
                    setTimeout(() => {
                        const categoriesSection = document.querySelector('.categories-section');
                        if (categoriesSection) {
                            categoriesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 300);
                } else {
                    const categoriesSection = document.querySelector('.categories-section');
                    if (categoriesSection) {
                        categoriesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });
    
    // Audiobook functionality
    let currentAudio = null;
    let isPlaying = false;
    let playbackSpeed = 1;
    let currentChapter = null;
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    let currentSpeedIndex = 2; // Default to 1x
    
    // Play audiobook function
    function playAudiobook(audiobook) {
        console.log('Attempting to play:', audiobook.title);
        console.log('Audio file path:', audiobook.audioFile);
        
        // Check if browser supports audio
        if (!window.Audio) {
            alert('Tarayıcınız ses oynatmayı desteklemiyor.');
            return;
        }
        
        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        // Create new audio element
        currentAudio = new Audio();
        
        // Set up audio source
        currentAudio.src = audiobook.audioFile;
        currentAudio.preload = 'auto';
        currentAudio.playbackRate = playbackSpeed;
        
        // Store current chapter
        currentChapter = audiobook;
        
        // Add event listeners for debugging
        currentAudio.addEventListener('loadstart', () => {
            console.log('Audio loading started');
        });
        
        currentAudio.addEventListener('loadeddata', () => {
            console.log('Audio data loaded');
            updateProgressBar();
        });
        
        currentAudio.addEventListener('canplay', () => {
            console.log('Audio can play');
        });
        
        currentAudio.addEventListener('timeupdate', () => {
            updateProgressBar();
        });
        
        currentAudio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Audio error code:', currentAudio.error ? currentAudio.error.code : 'Unknown');
            console.error('Audio error message:', currentAudio.error ? currentAudio.error.message : 'Unknown');
            
            let errorMessage = 'Ses dosyası yüklenemedi.\n\n';
            if (currentAudio.error) {
                switch(currentAudio.error.code) {
                    case 1:
                        errorMessage += 'Hata: Ses oynatma iptal edildi.';
                        break;
                    case 2:
                        errorMessage += 'Hata: Ses dosyası bulunamadı veya ağ hatası.';
                        break;
                    case 3:
                        errorMessage += 'Hata: Ses dosyası bozuk veya desteklenmeyen format.';
                        break;
                    case 4:
                        errorMessage += 'Hata: Ses dosyası çalınamıyor (format veya codec sorunu).';
                        break;
                    default:
                        errorMessage += `Hata kodu: ${currentAudio.error.code}`;
                }
            }
            
            alert(errorMessage + '\n\nDosya yolu: ' + audiobook.audioFile);
        });
        
        // Try to play with user interaction
        const playPromise = currentAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    console.log(`Successfully playing: ${audiobook.title}`);
                    
                    // Update mini player
                    updateMiniPlayer(audiobook, true);
                    updateMiniPlayerControls();
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                    alert(`Ses çalınamadı: ${error.message}\n\nÇözüm önerileri:\n1. Sayfayı yenileyin ve tekrar deneyin\n2. Farklı tarayıcıda deneyin\n3. Ses dosyasını MP3 formatına çevirin`);
                });
        }
        
        // Handle audio end
        currentAudio.addEventListener('ended', () => {
            isPlaying = false;
            currentAudio = null;
            updateMiniPlayer(audiobook, false);
            updateMiniPlayerControls();
            
            // Reset play button (now in the list)
            const featuredPlayBtn = document.querySelector('.play-small-btn[data-audiobook="muhammed-hayati"]');
            if (featuredPlayBtn) {
                const icon = featuredPlayBtn.querySelector('svg');
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        });
    }
    
    // Pause audiobook function
    function pauseAudiobook() {
        if (currentAudio && isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            
            // Update mini player
            updateMiniPlayer(audiobookData.featured, false);
        }
    }
    
    // Update mini player function
    function updateMiniPlayer(audiobook, playing) {
        const miniPlayer = document.querySelector('.mini-player');
        if (miniPlayer) {
            if (playing) {
                miniPlayer.style.display = 'block';
                miniPlayer.querySelector('.mini-player-info h4').textContent = audiobook.title;
                miniPlayer.querySelector('.mini-player-info p').textContent = audiobook.author || 'Asr-ı Saadet';
            } else {
                miniPlayer.style.display = 'none';
            }
        }
    }
    
    // Update mini player controls
    function updateMiniPlayerControls() {
        const miniPlayBtn = document.getElementById('miniPlayBtn');
        if (miniPlayBtn && currentAudio) {
            if (isPlaying) {
                miniPlayBtn.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else {
                miniPlayBtn.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        }
    }
    
    // Update progress bar
    function updateProgressBar() {
        if (!currentAudio) return;
        
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        const totalTimeEl = document.getElementById('totalTime');
        
        if (progressFill) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressFill.style.width = progress + '%';
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(currentAudio.currentTime);
        }
        
        if (totalTimeEl) {
            totalTimeEl.textContent = formatTime(currentAudio.duration);
        }
    }
    
    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Initialize mini player controls
    function initializeMiniPlayerControls() {
        let rewindInterval = null;
        let forwardInterval = null;
        
        // Play/Pause button
        const miniPlayBtn = document.getElementById('miniPlayBtn');
        if (miniPlayBtn) {
            miniPlayBtn.addEventListener('click', () => {
                if (!currentAudio) return;
                
                if (isPlaying) {
                    currentAudio.pause();
                    isPlaying = false;
                } else {
                    currentAudio.play();
                    isPlaying = true;
                }
                updateMiniPlayerControls();
            });
        }
        
        // Rewind button (10 seconds back) - with press and hold
        const rewindBtn = document.getElementById('rewindBtn');
        if (rewindBtn) {
            // Single click - 10 seconds back
            rewindBtn.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 10);
                }
            });
            
            // Press and hold - continuous rewind
            rewindBtn.addEventListener('mousedown', () => {
                if (!currentAudio) return;
                
                rewindBtn.style.transform = 'scale(0.9)';
                rewindBtn.style.background = 'var(--primary-color)';
                
                rewindInterval = setInterval(() => {
                    if (currentAudio) {
                        currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 1);
                    }
                }, 100);
            });
            
            rewindBtn.addEventListener('mouseup', () => {
                if (rewindInterval) {
                    clearInterval(rewindInterval);
                    rewindInterval = null;
                }
                rewindBtn.style.transform = '';
                rewindBtn.style.background = 'var(--secondary-color)';
            });
            
            rewindBtn.addEventListener('mouseleave', () => {
                if (rewindInterval) {
                    clearInterval(rewindInterval);
                    rewindInterval = null;
                }
                rewindBtn.style.transform = '';
                rewindBtn.style.background = 'var(--secondary-color)';
            });
            
            // Touch events for mobile
            rewindBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!currentAudio) return;
                
                rewindBtn.style.transform = 'scale(0.9)';
                rewindBtn.style.background = 'var(--primary-color)';
                
                rewindInterval = setInterval(() => {
                    if (currentAudio) {
                        currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 1);
                    }
                }, 100);
            });
            
            rewindBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (rewindInterval) {
                    clearInterval(rewindInterval);
                    rewindInterval = null;
                }
                rewindBtn.style.transform = '';
                rewindBtn.style.background = 'var(--secondary-color)';
            });
        }
        
        // Forward button (10 seconds forward) - with press and hold
        const forwardBtn = document.getElementById('forwardBtn');
        if (forwardBtn) {
            // Single click - 10 seconds forward
            forwardBtn.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 10);
                }
            });
            
            // Press and hold - continuous forward
            forwardBtn.addEventListener('mousedown', () => {
                if (!currentAudio) return;
                
                forwardBtn.style.transform = 'scale(0.9)';
                forwardBtn.style.background = 'var(--primary-color)';
                
                forwardInterval = setInterval(() => {
                    if (currentAudio) {
                        currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 1);
                    }
                }, 100);
            });
            
            forwardBtn.addEventListener('mouseup', () => {
                if (forwardInterval) {
                    clearInterval(forwardInterval);
                    forwardInterval = null;
                }
                forwardBtn.style.transform = '';
                forwardBtn.style.background = 'var(--secondary-color)';
            });
            
            forwardBtn.addEventListener('mouseleave', () => {
                if (forwardInterval) {
                    clearInterval(forwardInterval);
                    forwardInterval = null;
                }
                forwardBtn.style.transform = '';
                forwardBtn.style.background = 'var(--secondary-color)';
            });
            
            // Touch events for mobile
            forwardBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!currentAudio) return;
                
                forwardBtn.style.transform = 'scale(0.9)';
                forwardBtn.style.background = 'var(--primary-color)';
                
                forwardInterval = setInterval(() => {
                    if (currentAudio) {
                        currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 1);
                    }
                }, 100);
            });
            
            forwardBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (forwardInterval) {
                    clearInterval(forwardInterval);
                    forwardInterval = null;
                }
                forwardBtn.style.transform = '';
                forwardBtn.style.background = 'var(--secondary-color)';
            });
        }
        
        // Speed control button
        const speedBtn = document.getElementById('speedBtn');
        if (speedBtn) {
            speedBtn.addEventListener('click', () => {
                currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
                playbackSpeed = speeds[currentSpeedIndex];
                
                if (currentAudio) {
                    currentAudio.playbackRate = playbackSpeed;
                }
                
                speedBtn.textContent = playbackSpeed + 'x';
            });
        }
        
        // Close mini player button
        const closeMiniPlayer = document.getElementById('closeMiniPlayer');
        if (closeMiniPlayer) {
            closeMiniPlayer.addEventListener('click', () => {
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }
                isPlaying = false;
                
                const miniPlayer = document.querySelector('.mini-player');
                if (miniPlayer) {
                    miniPlayer.style.display = 'none';
                }
                
                // Reset main play button (now in the list)
                const featuredPlayBtn = document.querySelector('.play-small-btn[data-audiobook="muhammed-hayati"]');
                if (featuredPlayBtn) {
                    const icon = featuredPlayBtn.querySelector('svg');
                    icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
                }
            });
        }
        
        // Progress bar click to seek
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                if (!currentAudio) return;
                
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickX / width;
                
                currentAudio.currentTime = percentage * currentAudio.duration;
            });
        }
    }
    
    const audiobookData = {
        featured: {
            title: "Hz. Muhammed'in Hayatı",
            author: "Asr-ı Saadet",
            description: "Peygamberimizin doğumundan vefatına kadar olan hayatını anlatan kapsamlı eser.",
            duration: "8 saat 45 dakika",
            chapters: [
                { id: 1, title: "Fil Vakası - Peygamberimizin Doğumu", duration: "18:02", file: "/audio/hz-muhammed-hayati.mp3" },
                { id: 2, title: "Anneye Veda", duration: "21:39", file: "/audio/hz-muhammed-hayati-2.mp3" },
                { id: 3, title: "Şam Yolculuğu", duration: "15:07", file: "/audio/hz-muhammed-hayati-3.mp3" },
                { id: 4, title: "Hz. Hatice ile Evlilik", duration: "19:05", file: "/audio/hz-muhammed-hayati-4.mp3" },
                { id: 5, title: "Zeyd ile Tanışma", duration: "13:47", file: "/audio/hz-muhammed-hayati-5.mp3" },
                { id: 6, title: "İlk Vahiy", duration: "16:37", file: "/audio/hz-muhammed-hayati-6.mp3" },
                { id: 7, title: "Bölüm 7: Mekke Dönemi", duration: "24:45", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 8, title: "Bölüm 8: Hicret", duration: "17:20", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 9, title: "Bölüm 9: Medine'ye Varış", duration: "15:50", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 10, title: "Bölüm 10: Medine Devleti", duration: "20:15", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 11, title: "Bölüm 11: Bedir Savaşı", duration: "18:30", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 12, title: "Bölüm 12: Uhud Savaşı", duration: "22:40", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 13, title: "Bölüm 13: Hendek Savaşı", duration: "19:25", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 14, title: "Bölüm 14: Hendek Sonrası", duration: "16:55", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 15, title: "Bölüm 15: Mute Savaşı", duration: "14:20", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 16, title: "Bölüm 16: Hayber Fethi", duration: "17:35", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 17, title: "Bölüm 17: Mekke'nin Fethi", duration: "25:10", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 18, title: "Bölüm 18: Huneyn Savaşı", duration: "16:45", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 19, title: "Bölüm 19: Tabuk Seferi", duration: "18:20", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 20, title: "Bölüm 20: Veda Haccı", duration: "23:15", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 21, title: "Bölüm 21: Son Günler", duration: "19:40", file: "./audio/hz-muhammed-hayati.mp3" },
                { id: 22, title: "Bölüm 22: Vefat", duration: "21:05", file: "./audio/hz-muhammed-hayati.mp3" }
            ],
            cover: "📕",
            audioFile: "/audio/hz-muhammed-hayati.mp3" // İndirdiğiniz MP3 dosyasının yolu
        },
        recent: [
            {
                title: "Sahabe Hayatları",
                author: "İlhami Güler",
                duration: "6 saat 20 dakika",
                date: "2 gün önce",
                cover: "📗"
            },
            {
                title: "İslam'da Sabır",
                author: "Ali Ünal",
                duration: "4 saat 15 dakika",
                date: "1 hafta önce",
                cover: "📘"
            },
            {
                title: "Dua ve Zikir",
                author: "Necdet Subaşı",
                duration: "3 saat 30 dakika",
                date: "2 hafta önce",
                cover: "📙"
            }
        ]
    };
    
    // Category navigation for audiobooks
    const audiobookCategories = document.querySelectorAll('.audiobook-categories .category-card');
    audiobookCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(44, 95, 45, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Here you could filter audiobooks by category
            console.log(`Category clicked: ${categoryName}`);
        });
    });
    
    // Featured audiobook play button (now in the list)
    const featuredPlayBtn = document.querySelector('.play-small-btn[data-audiobook="muhammed-hayati"]');
    if (featuredPlayBtn) {
        featuredPlayBtn.addEventListener('click', function() {
            console.log('Play button clicked');
            
            // Toggle chapter list visibility
            const chapterList = document.getElementById('chapterList');
            const isOpen = chapterList.style.display !== 'none';
            
            if (isOpen) {
                // Close chapter list
                chapterList.style.display = 'none';
            } else {
                // Open chapter list
                chapterList.style.display = 'block';
                
                // Populate chapters if not already populated
                if (chapterList.querySelector('.chapters-container').children.length === 0) {
                    populateChapters();
                }
            }
        });
    } else {
        console.error('Play button not found');
    }
    
    // Populate chapters function
    function populateChapters() {
        const chaptersContainer = document.getElementById('chaptersContainer');
        if (!chaptersContainer) return;
        
        const chapters = audiobookData.featured.chapters;
        chaptersContainer.innerHTML = '';
        
        chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.dataset.chapterId = chapter.id;
            
            chapterItem.innerHTML = `
                <div class="chapter-info">
                    <div class="chapter-number">${chapter.id}</div>
                    <div class="chapter-title">${chapter.title}</div>
                </div>
                <div class="chapter-duration">${chapter.duration}</div>
            `;
            
            // Add click event to play chapter
            chapterItem.addEventListener('click', function() {
                playChapter(chapter);
            });
            
            chaptersContainer.appendChild(chapterItem);
        });
    }
    
    // Play chapter function
    function playChapter(chapter) {
        console.log('Playing chapter:', chapter.title);
        
        // Update active chapter
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeChapter = document.querySelector(`[data-chapter-id="${chapter.id}"]`);
        if (activeChapter) {
            activeChapter.classList.add('active');
        }
        
        // Create audio object for chapter
        const chapterAudio = {
            title: chapter.title,
            author: audiobookData.featured.author,
            audioFile: chapter.file
        };
        
        // Play the chapter
        playAudiobook(chapterAudio);
        
        // Update main play button (now in the list)
        const featuredPlayBtn = document.querySelector('.play-small-btn[data-audiobook="muhammed-hayati"]');
        if (featuredPlayBtn) {
            const icon = featuredPlayBtn.querySelector('svg');
            icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        }
    }
    
    // Recent audiobooks play buttons
    const recentPlayBtns = document.querySelectorAll('.audiobook-item .play-small-btn');
    recentPlayBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Toggle play/pause icon
            const icon = this.querySelector('svg');
            if (icon.innerHTML.includes('M8 5v14l11-7z')) {
                icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else {
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
            
            // Here you would start playing the selected audiobook
            console.log('Playing audiobook:', audiobookData.recent[index].title);
        });
    });
    
    // Continue listening functionality
    const continueListeningBtn = document.getElementById('continueListening');
    if (continueListeningBtn) {
        continueListeningBtn.addEventListener('click', function() {
            // Here you would continue playing the last audiobook
            console.log('Continuing to listen to last audiobook');
        });
    }
    
    // Quran data (Arabic only)
    const quranData = {
        1: {
            name: 'Fatiha',
            verses: [
                'بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ',
                'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                'الرَّحْمَٰنِ الرَّحِيمِ',
                'مَالِكِ يَوْمِ الدِّينِ',
                'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
                'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
                'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
            ]
        },
        36: {
            name: 'Yasin',
            verses: [
                'يسٓ',
                'وَالْقُرْآنِ الْحَكِيمِ',
                'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
                'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ',
                'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ',
                'لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ',
                'لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ',
                'إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُم مُّقْمَحُونَ'
            ]
        },
        55: {
            name: 'Rahman',
            verses: [
                'الرَّحْمَٰنُ',
                'عَلَّمَ الْقُرْآنَ',
                'خَلَقَ الْإِنسَانَ',
                'عَلَّمَهُ الْبَيَانَ',
                'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ',
                'وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ',
                'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ',
                'أَلَّا تَطْغَوْا فِي الْمِيزَانِ'
            ]
        },
        67: {
            name: 'Mülk',
            verses: [
                'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
                'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
                'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
                'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
                'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ'
            ]
        }
    };
    
    // Surah card click handlers
    const surahCards = document.querySelectorAll('.surah-card');
    const surahSelector = document.querySelector('.surah-selector');
    const quranViewer = document.getElementById('quranViewer');
    const quranVerses = document.getElementById('quranVerses');
    const currentSurahName = document.getElementById('currentSurahName');
    const backToSurahs = document.getElementById('backToSurahs');
    
    surahCards.forEach(card => {
        card.addEventListener('click', function() {
            const surahId = this.getAttribute('data-surah');
            loadSurah(surahId);
        });
    });
    
    function loadSurah(surahId) {
        const surah = quranData[surahId];
        if (!surah) return;
        
        // Update header
        currentSurahName.textContent = surah.name;
        
        // Clear and load verses
        quranVerses.innerHTML = '';
        
        surah.verses.forEach((verse, index) => {
            const verseElement = document.createElement('div');
            verseElement.className = 'quran-verse-full';
            verseElement.innerHTML = `
                <div class="verse-number">Ayet ${index + 1}</div>
                <div class="arabic-verse-full">${verse}</div>
            `;
            quranVerses.appendChild(verseElement);
        });
        
        // Show viewer, hide selector
        surahSelector.style.display = 'none';
        quranViewer.style.display = 'block';
        quranViewer.style.opacity = '0';
        quranViewer.style.transform = 'translateY(20px)';
        quranViewer.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            quranViewer.style.opacity = '1';
            quranViewer.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Back button handler
    backToSurahs.addEventListener('click', function() {
        quranViewer.style.display = 'none';
        surahSelector.style.display = 'block';
        surahSelector.style.opacity = '0';
        surahSelector.style.transform = 'translateY(20px)';
        surahSelector.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            surahSelector.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Simple Hijri date calculation (approximate)
    function calculateHijriDate(date) {
        const miladiYear = date.getFullYear();
        const miladiMonth = date.getMonth() + 1;
        const miladiDay = date.getDate();
        
        // Approximate Hijri year calculation
        const hijriYear = Math.round((miladiYear - 622) * 1.0307);
        
        // Approximate day and month calculation
        const yearStart = new Date(miladiYear, 0, 1);
        const dayOfYear = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24));
        const hijriDayOfYear = Math.floor(dayOfYear * 1.0307) % 354;
        
        // Simple month calculation
        const hijriMonthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
        let hijriMonth = 1;
        let hijriDay = hijriDayOfYear + 1;
        
        for (let i = 0; i < hijriMonthLengths.length; i++) {
            if (hijriDay > hijriMonthLengths[i]) {
                hijriDay -= hijriMonthLengths[i];
                hijriMonth++;
            } else {
                break;
            }
        }
        
        return {
            day: hijriDay,
            month: hijriMonth,
            year: hijriYear
        };
    }
    
    // Update small calendars immediately and then every minute
    updateSmallCalendars();
    setInterval(updateSmallCalendars, 60000);
    
    // Prayer times modal functionality
    const prayerTimesBtn = document.getElementById('prayerTimesBtn');
    const prayerTimesModal = document.getElementById('prayerTimesModal');
    const closePrayerModal = document.getElementById('closePrayerModal');
    const citySelect = document.getElementById('citySelect');
    const hijriMonthSelect = document.getElementById('hijriMonthSelect');
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Prayer times data for different cities
    const prayerTimesData = {
        istanbul: {
            baseTimes: { imsak: '05:30', sabah: '05:45', ogle: '13:47', ikindi: '16:30', aksam: '19:15', yatsi: '20:45' }
        },
        ankara: {
            baseTimes: { imsak: '05:25', sabah: '05:40', ogle: '13:45', ikindi: '16:35', aksam: '19:20', yatsi: '20:50' }
        },
        izmir: {
            baseTimes: { imsak: '05:35', sabah: '05:50', ogle: '13:50', ikindi: '16:25', aksam: '19:10', yatsi: '20:40' }
        },
        bursa: {
            baseTimes: { imsak: '05:32', sabah: '05:47', ogle: '13:48', ikindi: '16:32', aksam: '19:18', yatsi: '20:48' }
        },
        adana: {
            baseTimes: { imsak: '05:20', sabah: '05:35', ogle: '13:35', ikindi: '16:20', aksam: '19:05', yatsi: '20:35' }
        },
        antalya: {
            baseTimes: { imsak: '05:38', sabah: '05:53', ogle: '13:52', ikindi: '16:28', aksam: '19:12', yatsi: '20:42' }
        }
    };
    
    // Open prayer modal
    prayerTimesBtn.addEventListener('click', function() {
        prayerTimesModal.style.display = 'flex';
        prayerTimesModal.style.opacity = '0';
        setTimeout(() => {
            prayerTimesModal.style.opacity = '1';
        }, 100);
        generateCalendar();
        updatePrayerTimesDisplay();
    });
    
    // Close prayer modal
    closePrayerModal.addEventListener('click', function() {
        prayerTimesModal.style.opacity = '0';
        setTimeout(() => {
            prayerTimesModal.style.display = 'none';
        }, 300);
    });
    
    // Close modal on overlay click
    prayerTimesModal.addEventListener('click', function(e) {
        if (e.target === prayerTimesModal.querySelector('.modal-overlay')) {
            prayerTimesModal.style.opacity = '0';
            setTimeout(() => {
                prayerTimesModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Update prayer times when city changes
    citySelect.addEventListener('change', updatePrayerTimesDisplay);
    
    // Generate calendar
    function generateCalendar() {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        calendarGrid.innerHTML = '';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (day === currentDay) {
                dayElement.classList.add('today');
            }
            
            // Simulate prayer times for each day
            const prayerTime = simulatePrayerTime(day);
            
            dayElement.innerHTML = `
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-day-prayer">${prayerTime}</div>
            `;
            
            dayElement.addEventListener('click', function() {
                showDayPrayerTimes(day);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Simulate prayer time for a specific day
    function simulatePrayerTime(day) {
        const baseMinutes = 13 * 60 + 47; // 13:47 in minutes
        const variation = Math.sin(day * 0.1) * 10; // Small variation
        const totalMinutes = baseMinutes + variation;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Update prayer times display
    function updatePrayerTimesDisplay() {
        const selectedCity = citySelect.value;
        const times = prayerTimesData[selectedCity].baseTimes;
        
        document.getElementById('imsakTime').textContent = times.imsak;
        document.getElementById('sabahTime').textContent = times.sabah;
        document.getElementById('ogleTime').textContent = times.ogle;
        document.getElementById('ikindiTime').textContent = times.ikindi;
        document.getElementById('aksamTime').textContent = times.aksam;
        document.getElementById('yatsiTime').textContent = times.yatsi;
    }
    
    // Show prayer times for specific day
    function showDayPrayerTimes(day) {
        const selectedCity = citySelect.value;
        const baseTimes = prayerTimesData[selectedCity].baseTimes;
        
        // Add some variation based on day
        const dayVariation = Math.sin(day * 0.1) * 5;
        
        const updatedTimes = {};
        for (const [prayer, time] of Object.entries(baseTimes)) {
            const [hours, minutes] = time.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + dayVariation;
            const newHours = Math.floor(totalMinutes / 60);
            const newMinutes = Math.floor(totalMinutes % 60);
            updatedTimes[prayer] = `${newHours}:${newMinutes.toString().padStart(2, '0')}`;
        }
        
        // Update display with selected day's times
        document.getElementById('imsakTime').textContent = updatedTimes.imsak;
        document.getElementById('sabahTime').textContent = updatedTimes.sabah;
        document.getElementById('ogleTime').textContent = updatedTimes.ogle;
        document.getElementById('ikindiTime').textContent = updatedTimes.ikindi;
        document.getElementById('aksamTime').textContent = updatedTimes.aksam;
        document.getElementById('yatsiTime').textContent = updatedTimes.yatsi;
    }
    
    // Category navigation functionality
    const categoryNavItems = document.querySelectorAll('.nav-item:not([data-page]):not(#prayerTimesBtn)');
    categoryNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const span = this.querySelector('span');
            if (span && span.textContent === 'Kategoriler') {
                // Scroll to categories section
                const categoriesSection = document.querySelector('.categories-section');
                if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (span && span.textContent === 'Ana Sayfa') {
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    // Player functionality (mini player toggle)
    const playerNavItems = document.querySelectorAll('.nav-item');
    playerNavItems.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === 'Oynatıcı') {
            item.addEventListener('click', function() {
                const miniPlayer = document.querySelector('.mini-player');
                if (miniPlayer) {
                    if (miniPlayer.style.display === 'none' || !miniPlayer.style.display) {
                        miniPlayer.style.display = 'block';
                        miniPlayer.style.opacity = '0';
                        miniPlayer.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            miniPlayer.style.opacity = '1';
                            miniPlayer.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        miniPlayer.style.opacity = '0';
                        miniPlayer.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            miniPlayer.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }
    });
    
    // Continue listening functionality
    const continueBtns = document.querySelectorAll('.continue-btn');
    continueBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle play/pause icon
            const icon = this.querySelector('svg');
            if (icon.innerHTML.includes('M8 5v14l11-7z')) {
                icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else {
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
            
            // Show mini player
            const miniPlayer = document.querySelector('.mini-player');
            if (miniPlayer.style.display === 'none' || !miniPlayer.style.display) {
                miniPlayer.style.display = 'block';
                miniPlayer.style.opacity = '0';
                miniPlayer.style.transform = 'translateY(20px)';
                miniPlayer.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    miniPlayer.style.opacity = '1';
                    miniPlayer.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    });
    
    // Prayer times functionality
    function updatePrayerTimes() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;
        
        // Prayer times (in minutes from midnight)
        const prayerTimes = {
            imsak: 5 * 60 + 30,      // 05:30
            sabah: 5 * 60 + 45,      // 05:45
            ogle: 13 * 60 + 47,      // 13:47
            ikindi: 16 * 60 + 30,    // 16:30
            aksam: 19 * 60 + 15,     // 19:15
            yatsi: 20 * 60 + 45      // 20:45
        };
        
        let currentPrayer = null;
        let nextPrayer = null;
        
        // Find current and next prayer
        if (currentTime >= prayerTimes.yatsi || currentTime < prayerTimes.imsak) {
            currentPrayer = { name: 'Yatsı', time: '20:45', status: 'Geçti' };
            nextPrayer = { name: 'İmsak', time: '05:30' };
        } else if (currentTime >= prayerTimes.aksam) {
            currentPrayer = { name: 'Akşam', time: '19:15', status: 'Şu an' };
            nextPrayer = { name: 'Yatsı', time: '20:45' };
        } else if (currentTime >= prayerTimes.ikindi) {
            currentPrayer = { name: 'İkindi', time: '16:30', status: 'Geçti' };
            nextPrayer = { name: 'Akşam', time: '19:15' };
        } else if (currentTime >= prayerTimes.ogle) {
            currentPrayer = { name: 'Öğle', time: '13:47', status: 'Şu an' };
            nextPrayer = { name: 'İkindi', time: '16:30' };
        } else if (currentTime >= prayerTimes.sabah) {
            currentPrayer = { name: 'Sabah', time: '05:45', status: 'Geçti' };
            nextPrayer = { name: 'Öğle', time: '13:47' };
        } else {
            currentPrayer = { name: 'İmsak', time: '05:30', status: 'Şu an' };
            nextPrayer = { name: 'Sabah', time: '05:45' };
        }
        
        // Update current prayer display
        const currentPrayerElement = document.querySelector('.current-prayer');
        if (currentPrayerElement) {
            currentPrayerElement.querySelector('h3').textContent = currentPrayer.name;
            currentPrayerElement.querySelector('.prayer-time').textContent = currentPrayer.time;
            currentPrayerElement.querySelector('.prayer-status').textContent = currentPrayer.status;
        }
    }
    
    // Update prayer times immediately and then every minute
    updatePrayerTimes();
    setInterval(updatePrayerTimes, 60000);
    
    // Quran Arabic text toggle functionality
    const quranToggleBtn = document.querySelector('.quran-toggle-btn');
    let arabicVisible = false;
    
    quranToggleBtn.addEventListener('click', function() {
        arabicVisible = !arabicVisible;
        const arabicVerses = document.querySelectorAll('.arabic-verse');
        
        arabicVerses.forEach(verse => {
            verse.style.display = arabicVisible ? 'block' : 'none';
        });
        
        this.textContent = arabicVisible ? 'Türkçe' : 'Arapça';
        
        // Add animation effect
        arabicVerses.forEach((verse, index) => {
            if (arabicVisible) {
                verse.style.opacity = '0';
                verse.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    verse.style.transition = 'all 0.5s ease';
                    verse.style.opacity = '1';
                    verse.style.transform = 'translateY(0)';
                }, 100 * index);
            }
        });
    });
    
    // Play button functionality
    const playButtons = document.querySelectorAll('.play-btn, .play-small-btn, .mini-play-btn');
    const miniPlayer = document.querySelector('.mini-player');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle mini player visibility
            if (miniPlayer.style.display === 'none' || !miniPlayer.style.display) {
                miniPlayer.style.display = 'block';
                miniPlayer.style.opacity = '0';
                miniPlayer.style.transform = 'translateY(20px)';
                miniPlayer.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    miniPlayer.style.opacity = '1';
                    miniPlayer.style.transform = 'translateY(0)';
                }, 100);
            }
            
            // Toggle play/pause icon
            const icon = this.querySelector('svg');
            if (icon.innerHTML.includes('M8 5v14l11-7z')) {
                icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else {
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        });
    });
    
    // Category card interactions
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(44, 95, 45, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        // Create search overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 20%;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        searchOverlay.innerHTML = `
            <div style="width: 90%; max-width: 400px;">
                <input type="text" placeholder="Podcast ara..." style="
                    width: 100%;
                    padding: 1rem;
                    border: none;
                    border-radius: 2rem;
                    background: white;
                    font-size: 1rem;
                    outline: none;
                ">
                <button id="closeSearch" style="
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(searchOverlay);
        
        setTimeout(() => {
            searchOverlay.style.opacity = '1';
        }, 100);
        
        const closeSearch = document.getElementById('closeSearch');
        const searchInput = searchOverlay.querySelector('input');
        
        closeSearch.addEventListener('click', () => {
            searchOverlay.style.opacity = '0';
            setTimeout(() => {
                searchOverlay.remove();
            }, 300);
        });
        
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.style.opacity = '0';
                setTimeout(() => {
                    searchOverlay.remove();
                }, 300);
            }
        });
        
        searchInput.focus();
    });
    
    // Menu functionality
    const menuBtn = document.querySelector('.menu-btn');
    menuBtn.addEventListener('click', function() {
        // Create side menu
        const sideMenu = document.createElement('div');
        sideMenu.className = 'side-menu';
        sideMenu.style.cssText = `
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100%;
            background: white;
            z-index: 1001;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            transition: left 0.3s ease;
            overflow-y: auto;
        `;
        
        sideMenu.innerHTML = `
            <div style="padding: 2rem 1rem; border-bottom: 1px solid #e8e2d5;">
                <h3 style="color: #2c5f2d; margin-bottom: 0.5rem;">İslami Podcast</h3>
                <p style="color: #666; font-size: 0.875rem;">Kaliteli dini içerikler</p>
            </div>
            <div style="padding: 1rem;">
                <button class="menu-item" style="display: block; width: 100%; padding: 0.75rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; transition: background 0.3s ease;">
                    📖 Tüm Podcastler
                </button>
                <button class="menu-item" style="display: block; width: 100%; padding: 0.75rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; transition: background 0.3s ease;">
                    ⭐ Favoriler
                </button>
                <button class="menu-item" style="display: block; width: 100%; padding: 0.75rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; transition: background 0.3s ease;">
                    📱 İndirilenler
                </button>
                <button class="menu-item" style="display: block; width: 100%; padding: 0.75rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; transition: background 0.3s ease;">
                    ⚙️ Ayarlar
                </button>
                <button class="menu-item" style="display: block; width: 100%; padding: 0.75rem; text-align: left; border: none; background: none; border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; transition: background 0.3s ease;">
                    ❓ Yardım
                </button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(sideMenu);
        
        setTimeout(() => {
            sideMenu.style.left = '0';
            overlay.style.opacity = '1';
        }, 100);
        
        const closeMenu = () => {
            sideMenu.style.left = '-300px';
            overlay.style.opacity = '0';
            setTimeout(() => {
                sideMenu.remove();
                overlay.remove();
            }, 300);
        };
        
        overlay.addEventListener('click', closeMenu);
        
        const menuItems = sideMenu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                closeMenu();
            });
            
            item.addEventListener('mouseenter', function() {
                this.style.background = '#f4e4c1';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.background = 'none';
            });
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate podcast loading
    const podcastItems = document.querySelectorAll('.podcast-item');
    podcastItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
    
    // Category cards animation
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // Touch gestures for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                // Swipe up - could be used for navigation
                console.log('Swipe up');
            } else {
                // Swipe down - could be used to dismiss mini player
                if (miniPlayer.style.display === 'block') {
                    miniPlayer.style.opacity = '0';
                    miniPlayer.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        miniPlayer.style.display = 'none';
                    }, 300);
                }
            }
        }
    }
    
    // Full Screen Player Functionality
    const fullScreenPlayer = document.getElementById('fullScreenPlayer');
    const collapsePlayerBtn = document.getElementById('collapsePlayerBtn');
    const playBtnLarge = document.getElementById('playBtnLarge');
    const progressBarFull = document.getElementById('progressBarFull');
    const progressFillFull = document.getElementById('progressFillFull');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeFull = document.getElementById('currentTimeFull');
    const totalTimeFull = document.getElementById('totalTimeFull');
    const playerTitle = document.getElementById('playerTitle');
    const playerAuthor = document.getElementById('playerAuthor');
    const speedBtnFull = document.getElementById('speedBtnFull');
    const toggleChaptersBtn = document.getElementById('toggleChaptersBtn');
    const chapterListFull = document.getElementById('chapterListFull');
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');
    
    let isDragging = false;
    let isFullScreenOpen = false;
    
    // Open full screen player when clicking on mini player
    if (miniPlayer) {
        miniPlayer.addEventListener('click', function(e) {
            // Don't open if clicking on controls
            if (e.target.closest('.mini-player-controls') || e.target.closest('.mini-player-extra')) {
                return;
            }
            openFullScreenPlayer();
        });
    }
    
    function openFullScreenPlayer() {
        if (!currentChapter) return;
        
        isFullScreenOpen = true;
        fullScreenPlayer.style.display = 'flex';
        fullScreenPlayer.classList.add('show');
        
        // Update player info
        playerTitle.textContent = currentChapter.title;
        playerAuthor.textContent = currentChapter.author || 'Asr-ı Saadet';
        
        // Update play button
        updateFullScreenPlayButton();
        
        // Update progress
        updateFullScreenProgress();
        
        // Populate chapters
        populateChapterList();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeFullScreenPlayer() {
        isFullScreenOpen = false;
        fullScreenPlayer.classList.remove('show');
        setTimeout(() => {
            fullScreenPlayer.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Collapse button handler
    if (collapsePlayerBtn) {
        collapsePlayerBtn.addEventListener('click', closeFullScreenPlayer);
    }
    
    // Large play button handler
    if (playBtnLarge) {
        playBtnLarge.addEventListener('click', () => {
            if (!currentAudio) return;
            
            if (isPlaying) {
                pauseAudiobook();
            } else {
                currentAudio.play();
                isPlaying = true;
            }
            updateFullScreenPlayButton();
            updateMiniPlayerControls();
        });
    }
    
    function updateFullScreenPlayButton() {
        if (playBtnLarge) {
            if (isPlaying) {
                playBtnLarge.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
            } else {
                playBtnLarge.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        }
    }
    
    // Progress bar functionality
    function updateFullScreenProgress() {
        if (!currentAudio) return;
        
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressFillFull.style.width = progress + '%';
        currentTimeFull.textContent = formatTime(currentAudio.currentTime);
        totalTimeFull.textContent = formatTime(currentAudio.duration);
    }
    
    // Progress bar drag functionality
    if (progressBarFull) {
        progressBarFull.addEventListener('click', function(e) {
            if (!currentAudio) return;
            
            const rect = progressBarFull.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = percent * currentAudio.duration;
            updateFullScreenProgress();
        });
        
        // Drag functionality
        progressHandle.addEventListener('mousedown', startDragging);
        progressHandle.addEventListener('touchstart', startDragging);
    }
    
    function startDragging(e) {
        e.preventDefault();
        isDragging = true;
        
        const moveHandler = (e) => {
            if (!isDragging || !currentAudio) return;
            
            const rect = progressBarFull.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            currentAudio.currentTime = percent * currentAudio.duration;
            updateFullScreenProgress();
        };
        
        const endHandler = () => {
            isDragging = false;
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', endHandler);
    }
    
    // Speed control
    if (speedBtnFull) {
        speedBtnFull.addEventListener('click', () => {
            if (!currentAudio) return;
            
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
            playbackSpeed = speeds[currentSpeedIndex];
            currentAudio.playbackRate = playbackSpeed;
            speedBtnFull.textContent = playbackSpeed + 'x';
            
            // Update mini player speed button too
            const miniSpeedBtn = document.getElementById('speedBtn');
            if (miniSpeedBtn) {
                miniSpeedBtn.textContent = playbackSpeed + 'x';
            }
        });
    }
    
    // Chapter list toggle
    if (toggleChaptersBtn) {
        toggleChaptersBtn.addEventListener('click', () => {
            chapterListFull.classList.toggle('expanded');
            toggleChaptersBtn.classList.toggle('active');
        });
    }
    
    // Populate chapter list
    function populateChapterList() {
        if (!audiobookData || !audiobookData.featured || !audiobookData.featured.chapters) return;
        
        chapterListFull.innerHTML = '';
        
        audiobookData.featured.chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item-full';
            if (currentChapter && currentChapter.id === chapter.id) {
                chapterItem.classList.add('active');
            }
            
            chapterItem.innerHTML = `
                <div class="chapter-info-full">
                    <h5>${chapter.title}</h5>
                    <p>Bölüm ${chapter.id}</p>
                </div>
                <div class="chapter-duration-full">${chapter.duration}</div>
            `;
            
            chapterItem.addEventListener('click', () => {
                playChapter(chapter);
            });
            
            chapterListFull.appendChild(chapterItem);
        });
    }
    
    // Play specific chapter
    function playChapter(chapter) {
        const chapterWithAudio = {
            ...chapter,
            audioFile: chapter.file,
            author: audiobookData.featured.author
        };
        
        playAudiobook(chapterWithAudio);
        updateFullScreenPlayButton();
        
        // Update active state in chapter list
        document.querySelectorAll('.chapter-item-full').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    }
    
    // Previous/Next chapter buttons
    if (prevChapterBtn) {
        prevChapterBtn.addEventListener('click', () => {
            if (!currentChapter || !audiobookData.featured.chapters) return;
            
            const currentIndex = audiobookData.featured.chapters.findIndex(ch => ch.id === currentChapter.id);
            if (currentIndex > 0) {
                const prevChapter = audiobookData.featured.chapters[currentIndex - 1];
                playChapter(prevChapter);
            }
        });
    }
    
    if (nextChapterBtn) {
        nextChapterBtn.addEventListener('click', () => {
            if (!currentChapter || !audiobookData.featured.chapters) return;
            
            const currentIndex = audiobookData.featured.chapters.findIndex(ch => ch.id === currentChapter.id);
            if (currentIndex < audiobookData.featured.chapters.length - 1) {
                const nextChapter = audiobookData.featured.chapters[currentIndex + 1];
                playChapter(nextChapter);
            }
        });
    }
    
    // Update existing audio event listeners to also update full screen player
    function updateExistingAudioListeners() {
        if (currentAudio) {
            // Remove existing timeupdate listener to avoid duplicates
            currentAudio.removeEventListener('timeupdate', updateProgressBar);
            
            // Add new timeupdate listener that updates both players
            currentAudio.addEventListener('timeupdate', () => {
                updateProgressBar();
                if (isFullScreenOpen) {
                    updateFullScreenProgress();
                }
            });
            
            // Update ended listener
            currentAudio.addEventListener('ended', () => {
                isPlaying = false;
                currentAudio = null;
                updateMiniPlayer(audiobookData.featured, false);
                updateMiniPlayerControls();
                updateFullScreenPlayButton();
                
                if (isFullScreenOpen) {
                    closeFullScreenPlayer();
                }
            });
        }
    }
    
    // Modify the existing playAudiobook function to update full screen player
    const originalPlayAudiobook = playAudiobook;
    playAudiobook = function(audiobook) {
        originalPlayAudiobook(audiobook);
        updateExistingAudioListeners();
        
        if (isFullScreenOpen) {
            playerTitle.textContent = audiobook.title;
            playerAuthor.textContent = audiobook.author || 'Asr-ı Saadet';
            updateFullScreenPlayButton();
            populateChapterList();
        }
    };
    
    // Handle escape key to close full screen player
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFullScreenOpen) {
            closeFullScreenPlayer();
        }
    });
    
    // Handle swipe down to close full screen player
    fullScreenPlayer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    fullScreenPlayer.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchEndY - touchStartY;
        
        if (swipeDistance > 100) { // Swipe down more than 100px
            closeFullScreenPlayer();
        }
    });
    
    // Audio simulation (placeholder for actual audio implementation)
    class AudioPlayer {
        constructor() {
            this.isPlaying = false;
            this.currentTime = 0;
            this.duration = 0;
        }
        
        play() {
            this.isPlaying = true;
            console.log('Playing audio...');
        }
        
        pause() {
            this.isPlaying = false;
            console.log('Paused audio...');
        }
        
        seek(time) {
            this.currentTime = time;
            console.log(`Seeking to ${time} seconds`);
        }
    }
    
    const audioPlayer = new AudioPlayer();
    
    // Make audioPlayer globally accessible
    window.audioPlayer = audioPlayer;
});
