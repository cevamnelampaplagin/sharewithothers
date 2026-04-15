(function() {
    'use strict';

    var selectedFile = null;

    Lampa.Lang.add({
        photo_search_title: { ru: 'Поиск по фото', uk: 'Пошук за фото', en: 'Search by photo' },
        photo_search_description: { ru: 'Поиск фильма или сериала по фотографии', uk: 'Пошук фільму або серіалу за фотографією', en: 'Search movie or series by photo' },
        photo_search_button: { ru: 'Поиск по фото', uk: 'Пошук за фото', en: 'Search by photo' },
        photo_search_send: { ru: 'Поиск', uk: 'Пошук', en: 'Search' },
        photo_search_close: { ru: 'Закрыть', uk: 'Закрити', en: 'Close' },
        photo_search_no_file: { ru: 'Сначала выберите или укажите ссылку на изображение', uk: 'Спочатку виберіть або вкажіть посилання на зображення', en: 'First select or provide an image link' },
        photo_search_identifying: { ru: 'Определяю фильм...', uk: 'Визначаю фільм...', en: 'Identifying movie...' },
        photo_search_searching_tmdb: { ru: 'Ищу в базе TMDB...', uk: 'Шукаю в базі TMDB...', en: 'Searching TMDB...' },
        photo_search_success: { ru: 'Найдено: ', uk: 'Знайдено: ', en: 'Found: ' },
        photo_search_not_found: { ru: 'Фильм не найден. Попробуйте другое фото', uk: 'Фільм не знайдено. Спробуйте інше фото', en: 'Movie not found. Try another photo' },
        photo_search_network_error: { ru: 'Ошибка сети: ', uk: 'Помилка мережі: ', en: 'Network error: ' },
        photo_search_upload_label: { ru: 'Загрузить изображение', uk: 'Завантажити зображення', en: 'Upload image' },
        photo_search_or_url: { ru: 'Или вставьте ссылку на фото', uk: 'Або вставте посилання на фото', en: 'Or paste image URL' },
        photo_search_downloading: { ru: 'Загрузка фото...', uk: 'Завантаження фото...', en: 'Downloading image...' }
    });

    function injectCSS() {
        if (document.getElementById('ps-css')) return;
        var s = document.createElement('style');
        s.id = 'ps-css';
        s.textContent = [
            '#ps-wrap{ position:relative; width:300px; height:169px; margin:0 auto; border-radius:10px; overflow:hidden; cursor:pointer; background:#1a1a1a; display:flex; align-items:center; justify-content:center; }',
            '#ps-wrap::after{ content:""; position:absolute; inset:0; border-radius:inherit; opacity:0; transition:opacity .2s; pointer-events:none; box-shadow:inset 0 0 0 3px #fff; }',
            '#ps-wrap.ps-focus::after{ opacity:1; }',
            '#ps-loader{ display:none; flex-direction:column; align-items:center; gap:10px; pointer-events:none; }',
            '#ps-loader.ps-show{ display:flex; }',
            '#ps-loader-text{ color:rgba(255,255,255,.6); font-size:13px; text-align:center; }',
            '.modal__footer{ display:flex !important; justify-content:center !important; flex-wrap:wrap; gap:12px; }'
        ].join('');
        document.head.appendChild(s);
    }

    function startPlugin() {
        Lampa.Manifest.plugins = {
            type: 'other',
            version: '1.6.2',
            name: Lampa.Lang.translate('photo_search_title'),
            description: Lampa.Lang.translate('photo_search_description'),
            component: 'photo_search'
        };

        injectCSS();

        function addHeaderButton() {
            if ($('.open--photo-search').length > 0) return;
            var searchButton = $('.head .open--search, .head__button.open--search');
            if (searchButton.length === 0) { setTimeout(addHeaderButton, 1000); return; }
            var button = $('<div class="head__action open--photo-search selector"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9Z" fill="currentColor" opacity="0.3"/><path d="M12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z" fill="currentColor"/></svg></div>');
            searchButton.after(button);
            button.on('click', openPhotoSearchWindow);
        }

        function openPhotoSearchWindow() {
            selectedFile = null;
            var html = $(
                '<div class="scroll scroll--over"><div class="scroll__content"><div class="scroll__body">' +
                '<div id="ps-wrap" class="selector">' +
                '<input type="file" id="ps-file-input" accept="image/*" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;z-index:2;">' +
                '<div id="ps-inner" style="display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,.55);font-size:24px;text-align:center;padding:0 16px;">' +
                '<span>' + Lampa.Lang.translate('photo_search_upload_label') + '</span></div>' +
                '<div id="ps-loader"><div style="width:3em;height:3em;background:url(./img/loader.svg) no-repeat 50% 50%;background-size:contain;"></div><div id="ps-loader-text"></div></div>' +
                '</div>' +
                '<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;padding:0 8px;max-width:300px;margin-left:auto;margin-right:auto;">' +
                '<div style="text-align:center;color:rgba(255,255,255,.55);font-size:14px;">' + Lampa.Lang.translate('photo_search_or_url') + '</div>' +
                '<input type="text" id="ps-url-input" class="selector" placeholder="https://..." style="width:100%;padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.3);color:#fff;outline:none;font-size:14px;">' +
                '</div>' +
                '<div class="modal__footer" style="margin-top:16px;">' +
                '<div id="ps-btn-search" class="modal__button selector">' + Lampa.Lang.translate('photo_search_send') + '</div>' +
                '<div id="ps-btn-close" class="modal__button selector">' + Lampa.Lang.translate('photo_search_close') + '</div>' +
                '</div>' +
                '</div></div></div>'
            );

            Lampa.Modal.open({
                title: Lampa.Lang.translate('photo_search_title'),
                html: html,
                size: 'medium',
                onBack: function() { Lampa.Modal.close(); }
            });

            setTimeout(function() {
                $('#ps-file-input').on('change', function() {
                    var file = this.files[0];
                    if (file) {
                        selectedFile = file;
                        $('#ps-url-input').val('');
                        var reader = new FileReader();
                        reader.onload = e => $('#ps-inner').html('<img src="'+e.target.result+'" style="max-width:100%;max-height:165px;border-radius:8px;">');
                        reader.readAsDataURL(file);
                    }
                });

                $('#ps-url-input').on('input', function() {
                    var url = $(this).val().trim();
                    if (url) {
                        selectedFile = null;
                        $('#ps-file-input').val('');
                        $('#ps-inner').html('<img src="'+url+'" style="max-width:100%;max-height:165px;border-radius:8px;">');
                    }
                });

                $('#ps-btn-search').on('click', sendImageToIdentifier);
                $('#ps-btn-close').on('click', () => Lampa.Modal.close());
            }, 100);
        }

        function sendImageToIdentifier() {
            var urlVal = $('#ps-url-input').val() ? $('#ps-url-input').val().trim() : '';
            if (!selectedFile && !urlVal) return Lampa.Noty.show(Lampa.Lang.translate('photo_search_no_file'));

            $('#ps-inner').hide();
            $('#ps-loader').addClass('ps-show');
            $('#ps-btn-search').css({'opacity': '.4', 'pointer-events': 'none'});

            function performRequest(fileBlob) {
                $('#ps-loader-text').text(Lampa.Lang.translate('photo_search_identifying'));
                var formData = new FormData();
                formData.append('video', fileBlob, "image.jpg");

                fetch('https://movie-identifier.com/api/process-video-clip', { method: 'POST', body: formData })
                .then(r => r.json())
                .then(data => {
                    var parsed = typeof data.filmData === 'string' ? JSON.parse(data.filmData) : data.filmData;
                    var result = Array.isArray(parsed) ? parsed[0] : parsed;
                    if (!result || (!result.title && !result.name)) throw new Error();
                    $('#ps-loader-text').text(Lampa.Lang.translate('photo_search_searching_tmdb'));
                    searchTmdb(result.name || result.title);
                })
                .catch(() => {
                    $('#ps-loader').removeClass('ps-show');
                    $('#ps-inner').show();
                    $('#ps-btn-search').css({'opacity': '1', 'pointer-events': ''});
                    Lampa.Noty.show(Lampa.Lang.translate('photo_search_not_found'));
                });
            }

            if (urlVal && !selectedFile) {
                $('#ps-loader-text').text(Lampa.Lang.translate('photo_search_downloading'));
                // Спроба через інший проксі (allorigins)
                fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(urlVal))
                .then(res => {
                    if (!res.ok) throw new Error();
                    return res.blob();
                })
                .then(blob => performRequest(blob))
                .catch(() => {
                    // Якщо проксі не допоміг, показуємо помилку
                    $('#ps-loader').removeClass('ps-show');
                    $('#ps-inner').show();
                    $('#ps-btn-search').css({'opacity': '1', 'pointer-events': ''});
                    Lampa.Noty.show(Lampa.Lang.translate('photo_search_network_error') + " (URL blocked by CORS)");
                });
            } else {
                performRequest(selectedFile);
            }
        }

        function searchTmdb(title) {
            var apiKey = '4ef0d7355d9ffb5151e987764708ce96';
            var lang = (Lampa.Storage.field('language') === 'uk' ? 'uk-UA' : 'ru-RU');
            fetch('https://api.themoviedb.org/3/search/multi?api_key=' + apiKey + '&query=' + encodeURIComponent(title) + '&language=' + lang)
            .then(r => r.json())
            .then(json => {
                Lampa.Modal.close();
                if (json.results && json.results[0]) {
                    var card = json.results[0];
                    Lampa.Activity.push({
                        component: 'full', id: card.id, method: card.media_type === 'tv' ? 'tv' : 'movie', card: card, source: 'tmdb'
                    });
                } else {
                    Lampa.Activity.push({ component: 'search', search: title, search_auto: true });
                }
            })
            .catch(() => {
                Lampa.Modal.close();
                Lampa.Activity.push({ component: 'search', search: title, search_auto: true });
            });
        }

        if (window.appready) addHeaderButton();
        else Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') addHeaderButton(); });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') startPlugin(); });
})();
