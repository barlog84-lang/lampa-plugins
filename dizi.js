/**
 * Плагин "Dizi (Турецкие сериалы)" для Lampa TV v1.0.1
 */

(function () {
    'use strict';

    function openCategories() {
        var today = new Date().toISOString().split('T')[0];

        var categories = [
            {
                title: '🔥 Популярные турецкие сериалы',
                url: 'discover/tv?with_original_language=tr&sort_by=popularity.desc'
            },
            {
                title: '🆕 Новинки и свежие серии',
                url: 'discover/tv?with_original_language=tr&sort_by=first_air_date.desc&first_air_date.lte=' + today
            },
            {
                title: '⭐ Топ по рейтингу',
                url: 'discover/tv?with_original_language=tr&sort_by=vote_average.desc&vote_count.gte=30'
            },
            {
                title: '🎭 Драмы',
                url: 'discover/tv?with_original_language=tr&with_genres=18&sort_by=popularity.desc'
            },
            {
                title: '❤️ Мелодрамы и романтика',
                url: 'discover/tv?with_original_language=tr&with_genres=10749&sort_by=popularity.desc'
            },
            {
                title: '😄 Комедии',
                url: 'discover/tv?with_original_language=tr&with_genres=35&sort_by=popularity.desc'
            },
            {
                title: '🕵️ Детективы и криминал',
                url: 'discover/tv?with_original_language=tr&with_genres=80&sort_by=popularity.desc'
            }
        ];

        Lampa.Select.show({
            title: 'Турецкие сериалы',
            items: categories,
            onSelect: function (selected) {
                Lampa.Activity.push({
                    url: selected.url,
                    title: selected.title,
                    component: 'category_full',
                    page: 1,
                    source: 'tmdb'
                });
            },
            onBack: function () {
                Lampa.Controller.toggle('menu');
            }
        });
    }

    function addMenuItem() {
        var menu = $('.menu .menu__list');
        if (!menu.length) return false;
        
        // Если пункт уже есть в меню - не дублируем
        if ($('.menu__item[data-action="dizi"]').length) return true;

        var item = $(`
            <li class="menu__item selector" data-action="dizi">
                <div class="menu__ico">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-9-1c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-4-4h8V7H8v5z"/>
                    </svg>
                </div>
                <div class="menu__text">Турецкие сериалы</div>
            </li>
        `);

        item.on('hover:enter click', function () {
            openCategories();
        });

        // Вставляем после пункта "Сериалы", "Релизы" или "Каталог"
        var target = menu.find('.menu__item[data-action="tv"], .menu__item[data-action="relise"], .menu__item[data-action="catalog"]');
        if (target.length) {
            target.first().after(item);
        } else {
            menu.append(item);
        }

        return true;
    }

    function startPlugin() {
        addMenuItem();

        // Повторяем попытки каждые 500мс в течение первых 10 секунд
        var attempts = 0;
        var interval = setInterval(function () {
            attempts++;
            if (addMenuItem() || attempts > 20) {
                clearInterval(interval);
            }
        }, 500);

        // Отслеживаем переходы по экранам
        Lampa.Listener.follow('activity,app', function () {
            setTimeout(addMenuItem, 100);
            setTimeout(addMenuItem, 500);
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
