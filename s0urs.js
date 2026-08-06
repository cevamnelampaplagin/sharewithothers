(function () {
    'use strict';

    if (window.UniversalStreamingPlugin && window.UniversalStreamingPlugin.__init) return;
    window.UniversalStreamingPlugin = { __init: true };

    // Локалізація
    Lampa.Lang.add({
        streaming_menu_main: { en: 'Streaming', uk: 'Стрімінг' },
        streaming_menu_select_region: { en: 'Change Region', uk: 'Змінити регіон' },
        streaming_menu_providers: { en: 'Providers', uk: 'Провайдери' },
        streaming_menu_movies: { en: 'Movies', uk: 'Фільми' },
        streaming_menu_tv: { en: 'TV Shows', uk: 'Серіали' },
        streaming_new_movies: { en: 'New Movies', uk: 'Нові фільми' },
        streaming_new_tv: { en: 'New TV Shows', uk: 'Нові серіали' },
        streaming_popular_movies: { en: 'Popular Movies', uk: 'Популярні фільми' },
        streaming_popular_tv: { en: 'Popular TV Shows', uk: 'Популярні серіали' },
        streaming_top_rated_movies: { en: 'Top Rated Movies', uk: 'Високий рейтинг (фільми)' },
        streaming_top_rated_tv: { en: 'Top Rated TV Shows', uk: 'Високий рейтинг (серіали)' },
        streaming_genre_action: { en: 'Action', uk: 'Бойовики' },
        streaming_genre_comedy: { en: 'Comedy', uk: 'Комедії' },
        streaming_genre_drama: { en: 'Drama', uk: 'Драми' },
        streaming_genre_horror: { en: 'Horror', uk: 'Жахи' },
        streaming_genre_documentary: { en: 'Documentary', uk: 'Документальне' },
        streaming_genre_scifi: { en: 'Sci-Fi', uk: 'Фантастика' }
    });

    // Список доступних регіонів (можна розширювати)
    var REGIONS = [
        { code: 'UA', name: 'Україна' },
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'PL', name: 'Polska' },
        { code: 'DE', name: 'Deutschland' },
        { code: 'FR', name: 'France' }
    ];

    var DEFAULT_REGION = 'UA';

    // Збереження/читання регіону
    function getRegion() {
        return Lampa.Storage.get('streaming_region', DEFAULT_REGION);
    }
    function setRegion(code) {
        Lampa.Storage.set('streaming_region', code);
    }

    // Універсальні шаблони категорій для провайдера
    function getProviderCategories(providerId, region) {
        var cats = [];

        // Фільми
        cats.push({
            title: Lampa.Lang.translate('streaming_new_movies'),
            url: 'discover/movie',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'primary_release_date.desc',
                'primary_release_date.lte': '{current_date}',
                'vote_count.gte': '20'
            }
        });
        cats.push({
            title: Lampa.Lang.translate('streaming_popular_movies'),
            url: 'discover/movie',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'popularity.desc',
                'vote_count.gte': '50'
            }
        });
        cats.push({
            title: Lampa.Lang.translate('streaming_top_rated_movies'),
            url: 'discover/movie',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'vote_average.desc',
                'vote_count.gte': '300',
                'vote_average.gte': '7.0'
            }
        });

        // Серіали
        cats.push({
            title: Lampa.Lang.translate('streaming_new_tv'),
            url: 'discover/tv',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'first_air_date.desc',
                'first_air_date.lte': '{current_date}',
                'vote_count.gte': '20'
            }
        });
        cats.push({
            title: Lampa.Lang.translate('streaming_popular_tv'),
            url: 'discover/tv',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'popularity.desc',
                'vote_count.gte': '50'
            }
        });
        cats.push({
            title: Lampa.Lang.translate('streaming_top_rated_tv'),
            url: 'discover/tv',
            params: {
                with_watch_providers: providerId,
                watch_region: region,
                sort_by: 'vote_average.desc',
                'vote_count.gte': '200',
                'vote_average.gte': '7.5'
            }
        });

        return cats;
    }

    // Формування URL для категорії з підстановкою дати
    function buildCategoryUrl(cat) {
        var params = [];
        params.push('api_key=' + Lampa.TMDB.key());
        params.push('language=' + Lampa.Storage.get('language', 'uk'));
        for (var key in cat.params) {
            var val = cat.params[key];
            if (val === '{current_date}') {
                var d = new Date();
                val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
            }
            params.push(key + '=' + val);
        }
        return Lampa.TMDB.api(cat.url + '?' + params.join('&'));
    }

    // Компонент для перегляду категорії (аналог StudiosView)
    function StreamingView(object) {
        var comp = new Lampa.InteractionCategory(object);
        var network = new Lampa.Reguest();

        comp.create = function () {
            var _this = this;
            network.silent(buildCategoryUrl(object), function (json) {
                _this.build(json);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (obj, resolve, reject) {
            var cat = obj;
            cat.params = cat.params || {};
            var url = buildCategoryUrl(cat).replace(/page=\d+/, 'page=' + obj.page);
            network.silent(url, resolve, reject);
        };

        return comp;
    }

    // Головне меню: вибір регіону або перехід до списку провайдерів
    function showMainMenu() {
        var items = [
            {
                title: Lampa.Lang.translate('streaming_menu_providers'),
                action: 'providers'
            },
            {
                title: Lampa.Lang.translate('streaming_menu_select_region') + ' (' + getRegion() + ')',
                action: 'select_region'
            }
        ];

        Lampa.Select.show({
            title: Lampa.Lang.translate('streaming_menu_main'),
            items: items,
            onSelect: function (item) {
                if (item.action === 'providers') showProvidersMenu();
                else if (item.action === 'select_region') showRegionMenu();
            },
            onBack: function () {
                Lampa.Controller.toggle('content');
            }
        });
    }

    // Меню вибору регіону
    function showRegionMenu() {
        var items = REGIONS.map(function (r) {
            return { title: r.name, regionCode: r.code };
        });

        Lampa.Select.show({
            title: Lampa.Lang.translate('streaming_menu_select_region'),
            items: items,
            onSelect: function (item) {
                setRegion(item.regionCode);
                Lampa.Noty.show('Регіон змінено на ' + item.title);
                showMainMenu();
            },
            onBack: showMainMenu
        });
    }

    // Отримання списку провайдерів і показ меню
    function showProvidersMenu() {
        var region = getRegion();
        var url = Lampa.TMDB.api('watch/providers/tv?watch_region=' + region);

        Lampa.Activity.loader(true);
        $.getJSON(url, function (data) {
            Lampa.Activity.loader(false);
            var providers = data.results || [];
            var items = providers.map(function (p) {
                return {
                    title: p.provider_name,
                    providerId: p.provider_id,
                    logo: p.logo_path ? Lampa.TMDB.image('w92' + p.logo_path) : null,
                    isProvider: true,
                    action: 'select_provider'
                };
            });

            Lampa.Select.show({
                title: Lampa.Lang.translate('streaming_menu_providers') + ' (' + region + ')',
                items: items,
                onSelect: function (item) {
                    if (item.action === 'select_provider') {
                        showProviderCategories(item.providerId, item.title);
                    }
                },
                onBack: showMainMenu
            });
        }).fail(function () {
            Lampa.Activity.loader(false);
            Lampa.Noty.show('Не вдалося отримати список провайдерів');
            showMainMenu();
        });
    }

    // Показ підкатегорій для обраного провайдера
    function showProviderCategories(providerId, providerName) {
        var region = getRegion();
        var cats = getProviderCategories(providerId, region);

        var items = cats.map(function (cat) {
            return {
                title: cat.title,
                catData: cat
            };
        });

        Lampa.Select.show({
            title: providerName,
            items: items,
            onSelect: function (item) {
                Lampa.Activity.push({
                    title: providerName + ' - ' + item.title,
                    component: 'streaming_view',
                    url: item.catData.url,
                    params: item.catData.params,
                    page: 1
                });
            },
            onBack: showProvidersMenu
        });
    }

    // Реєстрація компонентів і кнопки в меню
    function initPlugin() {
        Lampa.Component.add('streaming_view', StreamingView);

        // Кнопка в головному меню
        var icon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>';
        var menuItem = $('<li class="menu__item selector" data-action="streaming_main">' +
            '<div class="menu__ico">' + icon + '</div>' +
            '<div class="menu__text">' + Lampa.Lang.translate('streaming_menu_main') + '</div>' +
            '</li>');

        menuItem.on('hover:enter', showMainMenu);
        $('.menu .menu__list').eq(0).append(menuItem);
    }

    if (window.appready) initPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') initPlugin(); });

})();