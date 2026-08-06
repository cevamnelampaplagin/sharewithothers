(function() {
    'use strict';

    var selectedFile = null;

    Lampa.Lang.add({
        photo_search_title: {
            ru: 'Поиск по фото',
            uk: 'Пошук за фото',
            en: 'Search by photo'
        },
        // URL = https://mastermagic98.github.io/l_plugins/search_by_image.js
        photo_search_description: {
            ru: 'Поиск фильма или сериала по фотографии',
            uk: 'Пошук фільму або серіалу за фотографією',
            en: 'Search movie or series by photo'
        },
        photo_search_button: {
            ru: 'Поиск по фото',
            uk: 'Пошук за фото',
            en: 'Search by photo'
        },
        photo_search_send: {
            ru: 'Поиск',
            uk: 'Пошук',
            en: 'Search'
        },
        photo_search_close: {
            ru: 'Закрыть',
            uk: 'Закрити',
            en: 'Close'
        },
        photo_search_no_file: {
            ru: 'Сначала выберите или укажите ссылку на изображение',
            uk: 'Спочатку виберіть або вкажіть посилання на зображення',
            en: 'First select or provide an image link'
        },
        photo_search_identifying: {
            ru: 'Определяю фильм...',
            uk: 'Визначаю фільм...',
            en: 'Identifying movie...'
        },
        photo_search_searching_tmdb: {
            ru: 'Ищу в базе TMDB...',
            uk: 'Шукаю в базі TMDB...',
            en: 'Searching TMDB...'
        },
        photo_search_success: {
            ru: 'Найдено: ',
            uk: 'Знайдено: ',
            en: 'Found: '
        },
        photo_search_not_found: {
            ru: 'Фильм не найден. Попробуйте другое фото',
            uk: 'Фільм не знайдено. Спробуйте інше фото',
            en: 'Movie not found. Try another photo'
        },
        photo_search_network_error: {
            ru: 'Ошибка сети: ',
            uk: 'Помилка мережі: ',
            en: 'Network error: '
        },
        photo_search_click_hint: {
            ru: 'Нажмите, чтобы выбрать фото',
            uk: 'Натисніть, щоб вибрати фото',
            en: 'Click to select photo'
        },
        photo_search_upload_label: {
            ru: 'Загрузить изображение',
            uk: 'Завантажити зображення',
            en: 'Upload image'
        },
        photo_search_or_url: {
            ru: 'Или вставьте ссылку на фото',
            uk: 'Або вставте посилання на фото',
            en: 'Or paste image URL'
        },
        photo_search_downloading: {
            ru: 'Загрузка фото по ссылке...',
            uk: 'Завантаження фото за посиланням...',
            en: 'Downloading image from URL...'
        }
    });

    /* ══════════════════════════════════════════════
       INJECT CSS
    ══════════════════════════════════════════════ */
    function injectCSS() {
        if (document.getElementById('ps-css')) return;
        var s = document.createElement('style');
        s.id = 'ps-css';
        s.textContent = [
            '#ps-wrap{',
                'position:relative;',
                'width:300px;height:169px;',
                'margin:0 auto;',
                'border-radius:10px;',
                'overflow:hidden;',
                'cursor:pointer;',
                'background:#1a1a1a;',
                'display:flex;align-items:center;justify-content:center;',
            '}',
            '#ps-wrap::after{',
                'content:"";',
                'position:absolute;',
                'inset:0;',
                'border-radius:inherit;',
                'opacity:0;',
                'transition:opacity .2s;',
                'pointer-events:none;',
                'box-shadow:inset 0 0 0 3px #fff;',
            '}',
            '#ps-wrap.ps-hover::after{ opacity:.45; }',
            '#ps-wrap.ps-focus::after{ opacity:1;  }',
            '#ps-loader{',
                'display:none;',
                'flex-direction:column;',
                'align-items:center;',
                'gap:10px;',
                'pointer-events:none;',
            '}',
            '#ps-loader.ps-show{ display:flex; }',
            '#ps-loader-text{',
                'color:rgba(255,255,255,.6);',
                'font-size:13px;',
                'text-align:center;',
            '}',
            '.modal__footer{',
                'display:flex !important;',
                'justify-content:center !important;',
                'flex-wrap:wrap;',
                'gap:12px;',
            '}',
            '@media(max-width:600px){',
                '.modal__button{',
                    'flex:1 1 100%;',
                    'text-align:center !important;',
                    'justify-content:center;',
                '}',
            '}',
        ].join('');
        document.head.appendChild(s);
    }

    /* ══════════════════════════════════════════════
       TMDB HELPERS
    ══════════════════════════════════════════════ */
    function getTmdbLang() {
        var lang = Lampa.Storage.field('language') || 'en';
        var map = { ru:'ru-RU', uk:'uk-UA', en:'en-US', de:'de-DE', fr:'fr-FR', es:'es-ES', pl:'pl-PL', it:'it-IT', zh:'zh-CN' };
        return map[lang] || 'en-US';
    }

    function getTmdbApiKey() {
        try { if (Lampa.Api.key)     return Lampa.Api.key('tmdb'); } catch(e){}
        try { if (Lampa.Api.tmdbKey) return Lampa.Api.tmdbKey;      } catch(e){}
        return '4ef0d7355d9ffb5151e987764708ce96';
    }

    function startPlugin() {
        Lampa.Manifest.plugins = {
            type: 'other',
            version: '1.6.0',
            name: Lampa.Lang.translate('photo_search_title'),
            description: Lampa.Lang.translate('photo_search_description'),
            component: 'photo_search'
        };

        injectCSS();

        /* ── HEADER BUTTON ─────────────────────────── */
        function addHeaderButton() {
            if ($('.open--photo-search').length > 0) return;
            var searchButton = $('.head .open--search, .head__button.open--search');
            if (searchButton.length === 0) { setTimeout(addHeaderButton, 1000); return; }

            var svgIcon =
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9Z" fill="none" opacity="0.3"/>' +
                '<path d="M20 5H16.83L15 3H9L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z" fill="currentColor"/>' +
                '<circle cx="12" cy="13" r="3" fill="currentColor"/>' +
                '</svg>';

            var button = $(
                '<div class="head__action open--photo-search selector"' +
                ' title="' + Lampa.Lang.translate('photo_search_button') + '">' +
                svgIcon + '</div>'
            );
            searchButton.after(button);
            button.on('click', openPhotoSearchWindow);
        }

        /* ── MODAL ─────────────────────────────────── */
        function openPhotoSearchWindow() {
            selectedFile = null;

            var html = $(
                '<div class="scroll scroll--over">' +
                '  <div class="scroll__content">' +
                '    <div class="scroll__body">' +

                /* Зона прев'ю / завантаження файлу */
                '      <div id="ps-wrap" class="selector" style="position:relative;">' +
                '        <input type="file" id="ps-file-input" accept="image/*"' +
                '               style="position:absolute;inset:0;width:100%;height:100%;' +
                '                      opacity:0;cursor:pointer;z-index:2;' +
                '                      -webkit-appearance:none;">' +
                '        <div id="ps-inner"' +
                '             style="display:flex;flex-direction:column;align-items:center;' +
                '                    gap:8px;color:rgba(255,255,255,.55);font-size:24px;' +
                '                    font-weight:500;text-align:center;padding:0 16px;' +
                '                    pointer-events:none;position:relative;z-index:1;">' +
                '          <span>' + Lampa.Lang.translate('photo_search_upload_label') + '</span>' +
                '        </div>' +
                '        <div id="ps-loader"' +
                '             style="pointer-events:none;position:relative;z-index:1;">' +
                '          <div style="width:3em;height:3em;' +
                '                      background:url(./img/loader.svg) no-repeat 50% 50%;' +
                '                      background-size:contain;"></div>' +
                '          <div id="ps-loader-text"></div>' +
                '        </div>' +
                '      </div>' +

                /* Поле для URL */
                '      <div id="ps-url-wrap" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;padding:0 8px;max-width:300px;margin-left:auto;margin-right:auto;">' +
                '        <div style="text-align:center;color:rgba(255,255,255,.55);font-size:14px;">' + Lampa.Lang.translate('photo_search_or_url') + '</div>' +
                '        <input type="text" id="ps-url-input" class="selector" placeholder="https://..." ' +
                '               style="width:100%;padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);' +
                '                      background:rgba(0,0,0,0.3);color:#fff;outline:none;font-size:14px;box-sizing:border-box;">' +
                '      </div>' +

                /* Кнопки */
                '      <div class="modal__footer" style="margin-top:16px;justify-content:center;gap:12px;flex-wrap:wrap;">' +
                '        <div id="ps-btn-search" class="modal__button selector" style="text-align:center;">' + Lampa.Lang.translate('photo_search_send')  + '</div>' +
                '        <div id="ps-btn-close"  class="modal__button selector" style="text-align:center;">' + Lampa.Lang.translate('photo_search_close') + '</div>' +
                '      </div>' +

                '      <div id="ps-no-result"' +
                '           style="display:none;margin-top:12px;text-align:center;' +
                '                  color:rgba(255,255,255,.55);font-size:15px;padding:0 8px;">' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
            );

            Lampa.Modal.open({
                title: Lampa.Lang.translate('photo_search_title'),
                html: html,
                size: 'medium',
                onBack: function() { Lampa.Modal.close(); }
            });

            setTimeout(function() {
                var wrap      = document.getElementById('ps-wrap');
                var fileInput = document.getElementById('ps-file-input');
                var urlInput  = document.getElementById('ps-url-input');

                if (wrap) {
                    wrap.addEventListener('mouseenter', function() { wrap.classList.add('ps-hover'); });
                    wrap.addEventListener('mouseleave', function() { wrap.classList.remove('ps-hover'); });
                    wrap.addEventListener('focus',  function() { wrap.classList.add('ps-focus'); });
                    wrap.addEventListener('blur',   function() { wrap.classList.remove('ps-focus'); });
                }

                /* Обробка вибору файлу */
                if (fileInput) {
                    fileInput.addEventListener('change', function() {
                        var file = fileInput.files && fileInput.files[0];
                        if (!file) return;
                        selectedFile = file;

                        /* Очищаємо поле посилання, бо вибрано файл */
                        if (urlInput) urlInput.value = '';

                        var nr = document.getElementById('ps-no-result');
                        if (nr) nr.style.display = 'none';

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var inner = document.getElementById('ps-inner');
                            if (inner) {
                                inner.innerHTML =
                                    '<img src="' + e.target.result + '"' +
                                    ' style="max-width:100%;max-height:165px;border-radius:8px;' +
                                    '        display:block;pointer-events:none;">';
                            }
                            if (wrap) wrap.classList.add('ps-focus');
                        };
                        reader.readAsDataURL(file);
                    });
                }

                /* Обробка введення URL */
                if (urlInput) {
                    urlInput.addEventListener('input', function() {
                        var url = this.value.trim();
                        if (!url) return;
                        
                        /* Очищаємо вибраний файл, бо введено посилання */
                        if (fileInput) fileInput.value = '';
                        selectedFile = null;

                        var nr = document.getElementById('ps-no-result');
                        if (nr) nr.style.display = 'none';

                        /* Відмальовуємо прев'ю за URL */
                        var inner = document.getElementById('ps-inner');
                        if (inner) {
                            inner.innerHTML =
                                '<img src="' + url + '"' +
                                ' style="max-width:100%;max-height:165px;border-radius:8px;' +
                                '        display:block;pointer-events:none;" onerror="this.style.display=\'none\'">';
                        }
                        if (wrap) wrap.classList.add('ps-focus');
                    });
                }

                $('#ps-btn-search').on('click', sendImageToIdentifier);
                $('#ps-btn-close').on('click',  function() { Lampa.Modal.close(); });
            }, 100);
        }

        /* ── LOADER HELPERS ────────────────────────── */
        function showLoader(text) {
            var inner     = document.getElementById('ps-inner');
            var loader    = document.getElementById('ps-loader');
            var ltxt      = document.getElementById('ps-loader-text');
            var btnS      = document.getElementById('ps-btn-search');
            var fileInput = document.getElementById('ps-file-input');
            var urlInput  = document.getElementById('ps-url-input');
            
            if (inner)     inner.style.display = 'none';
            if (loader)    loader.classList.add('ps-show');
            if (ltxt)      ltxt.textContent = text || '';
            if (btnS)      { btnS.style.opacity = '.4'; btnS.style.pointerEvents = 'none'; }
            if (fileInput) fileInput.style.display = 'none';
            if (urlInput)  { urlInput.style.opacity = '.4'; urlInput.style.pointerEvents = 'none'; }
        }

        function updateLoaderText(text) {
            var ltxt = document.getElementById('ps-loader-text');
            if (ltxt) ltxt.textContent = text;
        }

        function hideLoader() {
            var inner     = document.getElementById('ps-inner');
            var loader    = document.getElementById('ps-loader');
            var btnS      = document.getElementById('ps-btn-search');
            var fileInput = document.getElementById('ps-file-input');
            var urlInput  = document.getElementById('ps-url-input');
            
            if (loader)    loader.classList.remove('ps-show');
            if (inner)     inner.style.display = '';
            if (btnS)      { btnS.style.opacity = '1'; btnS.style.pointerEvents = ''; }
            if (fileInput) fileInput.style.display = '';
            if (urlInput)  { urlInput.style.opacity = '1'; urlInput.style.pointerEvents = ''; }
        }

        function showNoResult(text) {
            hideLoader();
            var nr = document.getElementById('ps-no-result');
            if (nr) { nr.textContent = text; nr.style.display = 'block'; }
            Lampa.Noty.show(text);
        }

        /* ── STEP 1: MOVIE-IDENTIFIER ──────────────── */
        function sendImageToIdentifier() {
            var urlInput = document.getElementById('ps-url-input');
            var urlVal   = urlInput ? urlInput.value.trim() : '';

            if (!selectedFile && !urlVal) {
                Lampa.Noty.show(Lampa.Lang.translate('photo_search_no_file'));
                return;
            }

            var wrap = document.getElementById('ps-wrap');
            if (wrap) wrap.classList.remove('ps-focus');

            /* Головна функція відправки на сервер */
            function performRequest(fileToSend) {
                var formData = new FormData();
                /* Додаємо як Blob, якщо це завантажене з URL */
                formData.append('video', fileToSend, "image.jpg");

                fetch('https://movie-identifier.com/api/process-video-clip', {
                    method: 'POST',
                    body: formData
                })
                .then(function(r) { return r.text(); })
                .then(function(text) {
                    if (!text || text.toLowerCase().indexOf('not found') !== -1) {
                        showNoResult(Lampa.Lang.translate('photo_search_not_found'));
                        return;
                    }
                    var data;
                    try { data = JSON.parse(text); }
                    catch(e) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }

                    if (!data.filmData || data.filmData.toLowerCase().indexOf('not found') !== -1) {
                        showNoResult(Lampa.Lang.translate('photo_search_not_found'));
                        return;
                    }

                    var parsed;
                    try { parsed = JSON.parse(data.filmData); }
                    catch(e) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }

                    var results = Array.isArray(parsed) ? parsed : [parsed];
                    if (!results.length) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }

                    var best  = results[0];
                    var title = (best.name || best.title || '').trim();

                    if (!title) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }

                    updateLoaderText(Lampa.Lang.translate('photo_search_searching_tmdb'));
                    searchTmdb(title, best);
                })
                .catch(function(err) {
                    hideLoader();
                    Lampa.Noty.show(Lampa.Lang.translate('photo_search_network_error') + err.message);
                });
            }

            /* Якщо є посилання, спочатку завантажуємо зображення як Blob */
            if (urlVal && !selectedFile) {
                showLoader(Lampa.Lang.translate('photo_search_downloading'));

                var fetchImage = function(targetUrl) {
                    return fetch(targetUrl)
                        .then(function(res) {
                            if (!res.ok) throw new Error('HTTP ' + res.status);
                            return res.blob();
                        });
                };

                /* Пробуємо напряму, якщо блокує CORS — використовуємо проксі AllOrigins */
                fetchImage(urlVal)
                    .catch(function() {
                        return fetchImage('https://api.allorigins.win/raw?url=' + encodeURIComponent(urlVal));
                    })
                    .then(function(blob) {
                        updateLoaderText(Lampa.Lang.translate('photo_search_identifying'));
                        performRequest(blob);
                    })
                    .catch(function(err) {
                        hideLoader();
                        Lampa.Noty.show(Lampa.Lang.translate('photo_search_network_error') + 'URL Download Failed');
                    });
            } else {
                showLoader(Lampa.Lang.translate('photo_search_identifying'));
                performRequest(selectedFile);
            }
        }

        /* ══════════════════════════════════════════════
           STEP 2: TMDB SEARCH
        ══════════════════════════════════════════════ */
        function searchTmdb(title, identifierResult) {
            var lang   = getTmdbLang();
            var apiKey = getTmdbApiKey();

            var year     = identifierResult.year     || identifierResult.Year     || null;
            var director = identifierResult.director || identifierResult.Director || null;

            if (year) year = String(year).replace(/\D.*$/, '').trim();

            function buildUrl(withYear) {
                var u = 'https://api.themoviedb.org/3/search/multi' +
                        '?api_key='    + apiKey +
                        '&query='      + encodeURIComponent(title) +
                        '&language='   + lang +
                        '&page=1' +
                        '&include_adult=false';
                if (withYear && year) u += '&year=' + year;
                return u;
            }

            function scoreCard(card) {
                var score = 0;
                if (year) {
                    var releaseDate = card.release_date || card.first_air_date || '';
                    var cardYear = releaseDate ? String(releaseDate).slice(0, 4) : '';
                    if (cardYear === String(year)) score += 10;
                }
                return score;
            }

            function handleResults(results, usedYear) {
                results = results.filter(function(r) {
                    return r.media_type === 'movie' || r.media_type === 'tv';
                });

                if (!results.length && usedYear && year) {
                    fetch(buildUrl(false))
                    .then(function(r) { if (!r.ok) throw new Error('TMDB HTTP ' + r.status); return r.json(); })
                    .then(function(json) { handleResults((json && json.results) ? json.results : [], false); })
                    .catch(onTmdbError);
                    return;
                }

                if (!results.length) {
                    showNoResult(Lampa.Lang.translate('photo_search_not_found'));
                    return;
                }

                results.sort(function(a, b) { return scoreCard(b) - scoreCard(a); });
                var best = results[0];

                var confidence = identifierResult.confidence ? ' (' + identifierResult.confidence + '%)' : '';
                var infoStr    = [title, year, director].filter(Boolean).join(', ');
                Lampa.Noty.show(Lampa.Lang.translate('photo_search_success') + infoStr + confidence);

                hideLoader();
                Lampa.Modal.close();

                setTimeout(function() {
                    openFullCard(best);
                }, 300);
            }

            function onTmdbError(err) {
                hideLoader();
                Lampa.Modal.close();
                setTimeout(function() { fallbackSearch(title); }, 300);
            }

            fetch(buildUrl(true))
            .then(function(r) { if (!r.ok) throw new Error('TMDB HTTP ' + r.status); return r.json(); })
            .then(function(json) { handleResults((json && json.results) ? json.results : [], !!year); })
            .catch(onTmdbError);
        }

        /* ── OPEN FULL CARD ────────────────────────── */
        function openFullCard(card) {
            var method = card.media_type === 'tv' ? 'tv' : 'movie';
            if (!card.media_type) {
                method = card.original_name ? 'tv' : 'movie';
                card.media_type = method;
            }
            if (!card.title && card.name)  card.title = card.name;
            if (!card.name  && card.title) card.name  = card.title;

            Lampa.Activity.push({
                component : 'full',
                id        : card.id,
                method    : method,
                card      : card,
                source    : 'tmdb'
            });
        }

        /* ── FALLBACK ─────────────────────────────── */
        function fallbackSearch(title) {
            try {
                Lampa.Activity.push({
                    component  : 'search',
                    search     : title,
                    search_auto: true,
                    title      : title,
                    page       : 1
                });
            } catch(e) {
                try {
                    if (Lampa.Search && typeof Lampa.Search.open === 'function') {
                        Lampa.Search.open(title);
                    }
                } catch(e2) {}
            }
        }

        /* ── INIT ──────────────────────────────────── */
        if (window.appready) {
            addHeaderButton();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') addHeaderButton();
            });
        }
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
