(function() {
    'use strict';

    var selectedFile = null;

    Lampa.Lang.add({
        photo_search_title: { ru: 'Поиск по фото', uk: 'Пошук за фото', en: 'Search by photo' },
        photo_search_description: { ru: 'Поиск фильма или сериала по фотографии', uk: 'Пошук фільму або серіалу за фотографією', en: 'Search movie or series by photo' },
        photo_search_button: { ru: 'Поиск по фото', uk: 'Пошук за фото', en: 'Search by photo' },
        photo_search_send: { ru: 'Поиск', uk: 'Пошук', en: 'Search' },
        photo_search_close: { ru: 'Закрыть', uk: 'Закрити', en: 'Close' },
        photo_search_no_file: { ru: 'Сначала выберите изображение или укажите ссылку', uk: 'Спочатку виберіть зображення або вкажіть посилання', en: 'First select an image or provide a link' },
        photo_search_identifying: { ru: 'Определяю фильм...', uk: 'Визначаю фільм...', en: 'Identifying movie...' },
        photo_search_searching_tmdb: { ru: 'Ищу в базе TMDB...', uk: 'Шукаю в базі TMDB...', en: 'Searching TMDB...' },
        photo_search_success: { ru: 'Найдено: ', uk: 'Знайдено: ', en: 'Found: ' },
        photo_search_not_found: { ru: 'Фильм не найден. Попробуйте другое фото', uk: 'Фільм не знайдено. Спробуйте інше фото', en: 'Movie not found. Try another photo' },
        photo_search_network_error: { ru: 'Ошибка сети: ', uk: 'Помилка мережі: ', en: 'Network error: ' },
        photo_search_upload_label: { ru: 'Выбрать с устройства', uk: 'Вибрати з пристрою', en: 'Select from device' },
        // Нові переклади для поля URL
        photo_search_url_placeholder: { ru: 'Или вставьте ссылку на фото (URL)', uk: 'Або вставте посилання на фото (URL)', en: 'Or paste image URL' },
        photo_search_downloading_url: { ru: 'Загрузка фото по ссылке...', uk: 'Завантаження фото за посиланням...', en: 'Downloading photo from URL...' },
        photo_search_url_error: { ru: 'Не удалось загрузить фото по ссылке', uk: 'Не вдалося завантажити фото за посиланням', en: 'Failed to load photo from URL' }
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
                'width:100%; max-width: 300px; height:169px;',
                'margin:0 auto 12px;',
                'border-radius:10px;',
                'overflow:hidden;',
                'cursor:pointer;',
                'background:#1a1a1a;',
                'display:flex;align-items:center;justify-content:center;',
            '}',
            '#ps-wrap::after{',
                'content:""; position:absolute; inset:0; border-radius:inherit;',
                'opacity:0; transition:opacity .2s; pointer-events:none;',
                'box-shadow:inset 0 0 0 3px #fff;',
            '}',
            '#ps-wrap.ps-hover::after{ opacity:.45; }',
            '#ps-wrap.ps-focus::after{ opacity:1;  }',
            '#ps-loader{ display:none; flex-direction:column; align-items:center; gap:10px; pointer-events:none; }',
            '#ps-loader.ps-show{ display:flex; }',
            '#ps-loader-text{ color:rgba(255,255,255,.6); font-size:13px; text-align:center; }',
            /* Стилі для поля вводу URL */
            '.ps-url-input {',
                'width: 100%; max-width: 300px; margin: 0 auto 16px;',
                'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);',
                'color: #fff; padding: 12px 15px; border-radius: 8px;',
                'font-size: 14px; outline: none; transition: border 0.3s;',
                'display: block;',
            '}',
            '.ps-url-input:focus { border-color: #fff; }',
            '.modal__footer{ display:flex !important; justify-content:center !important; flex-wrap:wrap; gap:12px; }',
            '@media(max-width:600px){ .modal__button{ flex:1 1 100%; text-align:center !important; justify-content:center; } }'
        ].join('');
        document.head.appendChild(s);
    }

    function getTmdbLang() {
        var lang = Lampa.Storage.field('language') || 'en';
        var map = { ru:'ru-RU', uk:'uk-UA', en:'en-US' };
        return map[lang] || 'en-US';
    }

    function getTmdbApiKey() {
        try { if (Lampa.Api.key) return Lampa.Api.key('tmdb'); } catch(e){}
        try { if (Lampa.Api.tmdbKey) return Lampa.Api.tmdbKey; } catch(e){}
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

        function openPhotoSearchWindow() {
            selectedFile = null;

            var html = $(
                '<div class="scroll scroll--over">' +
                '  <div class="scroll__content">' +
                '    <div class="scroll__body" style="padding-top:10px;">' +

                /* Змінено на <label> для кращої сумісності з WebView */
                '      <label id="ps-wrap" for="ps-file-input" class="selector">' +
                '        <input type="file" id="ps-file-input" accept="image/*"' +
                '               style="display:none;">' + // Прихований нативно
                '        <div id="ps-inner"' +
                '             style="display:flex;flex-direction:column;align-items:center;' +
                '                    gap:8px;color:rgba(255,255,255,.8);font-size:18px;' +
                '                    font-weight:500;text-align:center;padding:0 16px;">' +
                '          <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>' +
                '          <span>' + Lampa.Lang.translate('photo_search_upload_label') + '</span>' +
                '        </div>' +
                '        <div id="ps-loader" style="position:relative;z-index:1;">' +
                '          <div style="width:3em;height:3em;background:url(./img/loader.svg) no-repeat 50% 50%;background-size:contain;"></div>' +
                '          <div id="ps-loader-text"></div>' +
                '        </div>' +
                '      </label>' +

                /* Альтернатива для Android ТВ / Додатків: Ввід URL */
                '      <input type="text" id="ps-url-input" class="ps-url-input selector" placeholder="' + Lampa.Lang.translate('photo_search_url_placeholder') + '" autocomplete="off">' +

                '      <div class="modal__footer">' +
                '        <div id="ps-btn-search" class="modal__button selector">' + Lampa.Lang.translate('photo_search_send')  + '</div>' +
                '        <div id="ps-btn-close"  class="modal__button selector">' + Lampa.Lang.translate('photo_search_close') + '</div>' +
                '      </div>' +
                '      <div id="ps-no-result" style="display:none;margin-top:12px;text-align:center;color:rgba(255,255,255,.55);font-size:15px;padding:0 8px;"></div>' +
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
                var wrap = document.getElementById('ps-wrap');
                var fileInput = document.getElementById('ps-file-input');
                var urlInput = document.getElementById('ps-url-input');

                if (wrap) {
                    wrap.addEventListener('mouseenter', function() { wrap.classList.add('ps-hover'); });
                    wrap.addEventListener('mouseleave', function() { wrap.classList.remove('ps-hover'); });
                    wrap.addEventListener('focus',  function() { wrap.classList.add('ps-focus'); });
                    wrap.addEventListener('blur',   function() { wrap.classList.remove('ps-focus'); });
                }

                if (fileInput) {
                    fileInput.addEventListener('change', function() {
                        var file = fileInput.files && fileInput.files[0];
                        if (!file) return;
                        selectedFile = file;
                        if(urlInput) urlInput.value = ''; // Очищаємо URL якщо вибрано файл

                        var nr = document.getElementById('ps-no-result');
                        if (nr) nr.style.display = 'none';

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var inner = document.getElementById('ps-inner');
                            if (inner) {
                                inner.innerHTML = '<img src="' + e.target.result + '" style="max-width:100%;max-height:165px;border-radius:8px;display:block;">';
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }

                $('#ps-btn-search').on('click', handleSearchClick);
                $('#ps-btn-close').on('click',  function() { Lampa.Modal.close(); });
            }, 100);
        }

        function showLoader(text) {
            var inner  = document.getElementById('ps-inner');
            var loader = document.getElementById('ps-loader');
            var ltxt   = document.getElementById('ps-loader-text');
            var btnS   = document.getElementById('ps-btn-search');
            if (inner)  inner.style.display = 'none';
            if (loader) loader.classList.add('ps-show');
            if (ltxt)   ltxt.textContent = text || '';
            if (btnS)   { btnS.style.opacity = '.4'; btnS.style.pointerEvents = 'none'; }
        }

        function updateLoaderText(text) {
            var ltxt = document.getElementById('ps-loader-text');
            if (ltxt) ltxt.textContent = text;
        }

        function hideLoader() {
            var inner  = document.getElementById('ps-inner');
            var loader = document.getElementById('ps-loader');
            var btnS   = document.getElementById('ps-btn-search');
            if (loader) loader.classList.remove('ps-show');
            if (inner)  inner.style.display = 'flex';
            if (btnS)   { btnS.style.opacity = '1'; btnS.style.pointerEvents = ''; }
        }

        function showNoResult(text) {
            hideLoader();
            var nr = document.getElementById('ps-no-result');
            if (nr) { nr.textContent = text; nr.style.display = 'block'; }
            Lampa.Noty.show(text);
        }

        /* ── ОБРОБКА КЛІКУ ПОШУКУ (File або URL) ────── */
        async function handleSearchClick() {
            var urlInput = document.getElementById('ps-url-input');
            var urlValue = urlInput ? urlInput.value.trim() : '';

            // Якщо є файл, йдемо напряму
            if (selectedFile) {
                sendImageToIdentifier(selectedFile);
                return;
            }

            // Якщо файлу немає, але є URL
            if (urlValue) {
                showLoader(Lampa.Lang.translate('photo_search_downloading_url'));
                try {
                    // Завантажуємо зображення у Blob (можуть бути обмеження CORS, але в Android додатку зазвичай пропускає)
                    var response = await fetch(urlValue);
                    if (!response.ok) throw new Error('Network response was not ok');
                    var blob = await response.blob();
                    
                    // Конвертуємо Blob у File для FormData
                    var fileFromUrl = new File([blob], "image.jpg", { type: blob.type || "image/jpeg" });
                    
                    // Відображаємо прев'ю
                    var inner = document.getElementById('ps-inner');
                    if (inner) {
                        inner.innerHTML = '<img src="' + urlValue + '" style="max-width:100%;max-height:165px;border-radius:8px;display:block;">';
                    }
                    
                    sendImageToIdentifier(fileFromUrl);
                } catch (e) {
                    console.error('[Movie-Identifier] URL Fetch Error:', e);
                    showNoResult(Lampa.Lang.translate('photo_search_url_error'));
                }
                return;
            }

            Lampa.Noty.show(Lampa.Lang.translate('photo_search_no_file'));
        }

        /* ── ВІДПРАВКА НА СЕРВЕР РОЗПІЗНАВАННЯ ──────── */
        function sendImageToIdentifier(fileData) {
            showLoader(Lampa.Lang.translate('photo_search_identifying'));

            var formData = new FormData();
            formData.append('video', fileData); // API очікує поле 'video'

            fetch('https://movie-identifier.com/api/process-video-clip', {
                method: 'POST',
                body: formData
            })
            .then(function(r) { return r.text(); })
            .then(function(text) {
                if (!text || text.toLowerCase().indexOf('not found') !== -1) {
                    showNoResult(Lampa.Lang.translate('photo_search_not_found')); return;
                }
                var data;
                try { data = JSON.parse(text); } catch(e) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }
                if (!data.filmData || data.filmData.toLowerCase().indexOf('not found') !== -1) {
                    showNoResult(Lampa.Lang.translate('photo_search_not_found')); return;
                }
                var parsed;
                try { parsed = JSON.parse(data.filmData); } catch(e) { showNoResult(Lampa.Lang.translate('photo_search_not_found')); return; }

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

        /* ── ПОШУК В TMDB ───────────────────────────── */
        function searchTmdb(title, identifierResult) {
            var lang   = getTmdbLang();
            var apiKey = getTmdbApiKey();
            var year     = identifierResult.year     || identifierResult.Year     || null;
            if (year) year = String(year).replace(/\D.*$/, '').trim();

            function buildUrl(withYear) {
                var u = 'https://api.themoviedb.org/3/search/multi?api_key=' + apiKey + '&query=' + encodeURIComponent(title) + '&language=' + lang + '&page=1&include_adult=false';
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
                results = results.filter(function(r) { return r.media_type === 'movie' || r.media_type === 'tv'; });

                if (!results.length && usedYear && year) {
                    fetch(buildUrl(false))
                    .then(function(r) { if (!r.ok) throw new Error('TMDB HTTP ' + r.status); return r.json(); })
                    .then(function(json) { handleResults((json && json.results) ? json.results : [], false); })
                    .catch(onTmdbError);
                    return;
                }

                if (!results.length) {
                    showNoResult(Lampa.Lang.translate('photo_search_not_found')); return;
                }

                results.sort(function(a, b) { return scoreCard(b) - scoreCard(a); });
                var best = results[0];
                var confidence = identifierResult.confidence ? ' (' + identifierResult.confidence + '%)' : '';
                
                Lampa.Noty.show(Lampa.Lang.translate('photo_search_success') + title + confidence);

                hideLoader();
                Lampa.Modal.close();
                setTimeout(function() { openFullCard(best); }, 300);
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

        function openFullCard(card) {
            var method = card.media_type === 'tv' ? 'tv' : 'movie';
            if (!card.media_type) {
                method = card.original_name ? 'tv' : 'movie';
                card.media_type = method;
            }
            if (!card.title && card.name)  card.title = card.name;
            if (!card.name  && card.title) card.name  = card.title;

            Lampa.Activity.push({ component : 'full', id : card.id, method : method, card : card, source : 'tmdb' });
        }

        function fallbackSearch(title) {
            try { Lampa.Activity.push({ component: 'search', search: title, search_auto: true, title: title, page: 1 }); } 
            catch(e) { try { if (Lampa.Search && typeof Lampa.Search.open === 'function') Lampa.Search.open(title); } catch(e2) {} }
        }

        if (window.appready) { addHeaderButton(); } else { Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') addHeaderButton(); }); }
    }

    if (window.appready) { startPlugin(); } else { Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') startPlugin(); }); }

})();
