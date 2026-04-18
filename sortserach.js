(function () {
    'use strict';

    var pluginName = 'Search Tabs Manager';
    var pOrder = 'lampa_tabs_order';
    var pHide = 'lampa_tabs_hide';
    var pFound = 'lampa_tabs_found';

    // 1. Поле для сортування (пріоритети)
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: pOrder,
        type: 'input',
        name: 'Порядок вкладок пошуку',
        description: 'Введіть назви через кому (наприклад: TMDB, CUB, TraktTV). Ті, що не в списку, будуть в кінці.',
        default: 'TMDB, CUB'
    });

    // 2. Поле для приховування непотрібного
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: pHide,
        type: 'input',
        name: 'Приховати вкладки пошуку',
        description: 'Введіть назви вкладок, які треба сховати (наприклад: Anime, Spider).',
        default: ''
    });

    // 3. Поле-трекер (для відображення знайденого)
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: pFound,
        type: 'input',
        name: 'Знайдені вкладки (Історія)',
        description: 'Тут автоматично збираються всі вкладки, які завантажились під час пошуків. Можете копіювати їх звідси.',
        default: ''
    });

    function applyManager() {
        var observer = new MutationObserver(function() {
            // Шукаємо селектори вкладок пошуку
            var tabs = document.querySelectorAll('.search-modules .selector, .search__sources .selector');
            if (tabs.length === 0) return;

            // Отримуємо списки з налаштувань
            var orderList = Lampa.Storage.get(pOrder, '').split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
            var hideList = Lampa.Storage.get(pHide, '').split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
            
            // Отримуємо вже знайдені вкладки
            var foundSaved = Lampa.Storage.get(pFound, '');
            var foundArray = foundSaved ? foundSaved.split(',').map(function(s) { return s.trim(); }) : [];
            var isUpdated = false;

            tabs.forEach(function(tab) {
                // Очищаємо назву від цифр (кількості результатів) і пробілів
                var originalText = tab.textContent.replace(/[0-9]/g, '').trim();
                if (!originalText) return;
                
                var lowerText = originalText.toLowerCase();

                // КРОК 1: Записуємо нову вкладку, якщо її ще немає в історії
                if (foundArray.indexOf(originalText) === -1) {
                    foundArray.push(originalText);
                    isUpdated = true;
                }

                // КРОК 2: Перевіряємо, чи треба приховати вкладку
                var shouldHide = hideList.some(function(item) { return lowerText.indexOf(item) !== -1; });
                if (shouldHide) {
                    tab.style.display = 'none'; // Повністю ховаємо
                    return; // Зупиняємось для цієї вкладки
                } else {
                    tab.style.display = ''; // Повертаємо видимість (якщо змінили налаштування)
                }

                // КРОК 3: Сортуємо видимі вкладки
                var index = orderList.findIndex(function(item) { return lowerText.indexOf(item) !== -1; });
                if (index !== -1) {
                    tab.style.order = index;
                } else {
                    tab.style.order = 99; // Невідомі відправляємо в самий кінець
                }

                // Вмикаємо flexbox для батьківського контейнера, зберігаючи горизонтальний скрол
                var parent = tab.parentElement;
                if (parent && parent.style.display !== 'flex') {
                    parent.style.display = 'flex';
                    parent.style.flexWrap = 'nowrap';
                }
            });

            // Якщо виявили нові джерела — оновлюємо пам'ять і налаштування
            if (isUpdated) {
                var newFoundString = foundArray.join(', ');
                Lampa.Storage.set(pFound, newFoundString);
                
                // Динамічно оновлюємо текстове поле, якщо меню налаштувань зараз відкрите
                var inputEl = document.querySelector('input[name="'+pFound+'"]');
                if(inputEl) inputEl.value = newFoundString;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Запускаємо тільки після готовності Lampa
    if (window.appready) applyManager();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') applyManager(); });

})();
