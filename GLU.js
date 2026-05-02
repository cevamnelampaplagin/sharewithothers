(function () {
    'use strict';
// orig URL = http://skaz.tv/g.js
    if (window.lampa_games_plugin) return;
    window.lampa_games_plugin = true;

    var GAMES_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor"><path d="M21 6c-1.7 0-3.2.7-4.3 1.7L16 8.3l-.7-.6C14.2 6.7 12.7 6 11 6 7.1 6 4 9.1 4 13c0 5.5 8.7 11.5 11.4 13.2.4.2.8.2 1.2 0C19.3 24.5 28 18.5 28 13c0-3.9-3.1-7-7-7zm-9 9H9v3H7v-3H4v-2h3v-3h2v3h3v2zm6 1c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm0 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/></svg>';

    // ============================================================
    //                     ЗАГАЛЬНА ІНФРАСТРУКТУРА
    // ============================================================

    var GAMES_LIST = [
        { id: 'snake',    title: 'Змійка',           desc: 'Класична змійка' },
        { id: 'tetris',   title: 'Тетрис',           desc: 'Збирайте лінії з падаючих фігурок' },
        { id: 'pacman',   title: 'Pac-Man',          desc: 'Збирай очки, тікай від привидів' },
        { id: 'tron',     title: 'Трон',             desc: 'Двоє на одному полі, не врізайтеся в стежку' },
        { id: 'seabattle',title: 'Морський бій',      desc: 'Битва проти компютера ' },
        { id: 'tictac',   title: 'Хрестики-нолики',  desc: 'Класика 3х3' },
        { id: 'flappy',   title: 'Flappy Bird',      desc: 'Літай і не влучай у труби' },
        { id: 'doodle',   title: 'Doodle Jump',      desc: 'Стрибайте на платформи' },
        { id: 'arkanoid', title: 'Арканоїд',         desc: 'Розбий всі блоки мячем' },
        { id: 'tanks',    title: 'Танчики',          desc: 'Захищати штаб, знищувати ворогів' },
        { id: 'memory',   title: 'Memory',           desc: 'Знайдіть усі пари карт' },
        { id: 'invaders', title: 'Space Invaders',   desc: 'Збити прибульців із космосу' },
        { id: 'crossy',   title: 'Crossy Road',      desc: 'Біжи вперед, не потрапляй під машини' },
        { id: 'minesweeper', title: 'MineSweeper',         desc: 'Знайди всі міни, не будучи підірваними' },
        { id: 'checkers', title: 'Шашки',            desc: 'Класика проти компютера' },
        { id: 'match3',   title: 'Три в ряд',         desc: 'Міняйте камені, збирайте лінії' },
        { id: 'platformer', title: 'Ленаріо',         desc: 'Біжи, стрибай, перемагай ворогів' }
    ];

    // SVG-іконки для кожної гри (60x60)
    var GAME_ICONS = {
        snake:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                '<rect x="10" y="10" width="8" height="8" fill="#66bb6a"/>' +
                '<rect x="18" y="10" width="8" height="8" fill="#43a047"/>' +
                '<rect x="26" y="10" width="8" height="8" fill="#43a047"/>' +
                '<rect x="26" y="18" width="8" height="8" fill="#43a047"/>' +
                '<rect x="26" y="26" width="8" height="8" fill="#43a047"/>' +
                '<rect x="34" y="26" width="8" height="8" fill="#43a047"/>' +
                '<rect x="42" y="26" width="8" height="8" fill="#43a047"/>' +
                '<circle cx="46" cy="46" r="5" fill="#e53935"/>' +
                '<rect x="11" y="12" width="2" height="2" fill="#000"/>' +
                '<rect x="15" y="12" width="2" height="2" fill="#000"/>' +
            '</svg>',
        tetris:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                '<rect x="6"  y="22" width="10" height="10" fill="#00bcd4"/>' +
                '<rect x="16" y="22" width="10" height="10" fill="#00bcd4"/>' +
                '<rect x="26" y="22" width="10" height="10" fill="#00bcd4"/>' +
                '<rect x="36" y="22" width="10" height="10" fill="#00bcd4"/>' +
                '<rect x="6"  y="42" width="10" height="10" fill="#ffeb3b"/>' +
                '<rect x="16" y="42" width="10" height="10" fill="#ffeb3b"/>' +
                '<rect x="6"  y="32" width="10" height="10" fill="#ffeb3b"/>' +
                '<rect x="16" y="32" width="10" height="10" fill="#ffeb3b"/>' +
                '<rect x="36" y="42" width="10" height="10" fill="#9c27b0"/>' +
                '<rect x="46" y="42" width="10" height="10" fill="#9c27b0"/>' +
                '<rect x="36" y="32" width="10" height="10" fill="#f44336"/>' +
                '<rect x="46" y="22" width="10" height="10" fill="#4caf50"/>' +
            '</svg>',
        pacman:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#000"/>' +
                '<path d="M 30 30 L 50 18 A 16 16 0 1 0 50 42 Z" fill="#ffeb3b"/>' +
                '<circle cx="36" cy="22" r="2" fill="#000"/>' +
                '<circle cx="12" cy="30" r="2" fill="#fff"/>' +
                '<circle cx="6"  cy="30" r="1.5" fill="#fff"/>' +
                '<path d="M 50 42 q 0 -10 5 -10 q 5 0 5 10 l -2 -2 l -2 2 l -2 -2 l -2 2 l -2 -2 z" fill="#f44336"/>' +
                '<circle cx="53" cy="36" r="1.5" fill="#fff"/>' +
                '<circle cx="58" cy="36" r="1.5" fill="#fff"/>' +
            '</svg>',
        tron:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#000"/>' +
                '<rect x="6"  y="20" width="20" height="3" fill="#00e5ff"/>' +
                '<rect x="23" y="20" width="3"  height="15" fill="#00e5ff"/>' +
                '<rect x="23" y="32" width="12" height="3" fill="#00e5ff"/>' +
                '<rect x="32" y="32" width="3"  height="10" fill="#00e5ff"/>' +
                '<rect x="32" y="40" width="2" height="2" fill="#fff"/>' +
                '<rect x="50" y="10" width="3"  height="20" fill="#ff5252"/>' +
                '<rect x="38" y="27" width="15" height="3" fill="#ff5252"/>' +
                '<rect x="38" y="27" width="3"  height="15" fill="#ff5252"/>' +
                '<rect x="38" y="40" width="2" height="2" fill="#fff"/>' +
            '</svg>',
        seabattle:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#0d47a1"/>' +
                '<g stroke="rgba(255,255,255,0.15)" stroke-width="0.5">' +
                    '<line x1="0" y1="10" x2="60" y2="10"/>' +
                    '<line x1="0" y1="20" x2="60" y2="20"/>' +
                    '<line x1="0" y1="30" x2="60" y2="30"/>' +
                    '<line x1="0" y1="40" x2="60" y2="40"/>' +
                    '<line x1="0" y1="50" x2="60" y2="50"/>' +
                    '<line x1="10" y1="0" x2="10" y2="60"/>' +
                    '<line x1="20" y1="0" x2="20" y2="60"/>' +
                    '<line x1="30" y1="0" x2="30" y2="60"/>' +
                    '<line x1="40" y1="0" x2="40" y2="60"/>' +
                    '<line x1="50" y1="0" x2="50" y2="60"/>' +
                '</g>' +
                '<rect x="10" y="11" width="30" height="8" fill="#9e9e9e"/>' +
                '<rect x="40" y="31" width="10" height="8" fill="#9e9e9e"/>' +
                '<rect x="14" y="13" width="6" height="4" fill="#e53935"/>' +
                '<text x="15.5" y="17" font-size="6" fill="#fff" font-weight="bold">X</text>' +
                '<text x="35.5" y="47" font-size="8" fill="#fff" font-weight="bold">·</text>' +
                '<text x="22.5" y="34" font-size="8" fill="#fff" font-weight="bold">·</text>' +
            '</svg>',
        tictac:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                '<g stroke="#fff" stroke-width="2">' +
                    '<line x1="20" y1="6"  x2="20" y2="54"/>' +
                    '<line x1="40" y1="6"  x2="40" y2="54"/>' +
                    '<line x1="6"  y1="20" x2="54" y2="20"/>' +
                    '<line x1="6"  y1="40" x2="54" y2="40"/>' +
                '</g>' +
                '<g stroke="#42a5f5" stroke-width="3" stroke-linecap="round">' +
                    '<line x1="9"  y1="9"  x2="17" y2="17"/>' +
                    '<line x1="17" y1="9"  x2="9"  y2="17"/>' +
                    '<line x1="49" y1="29" x2="57" y2="37"/>' +
                    '<line x1="57" y1="29" x2="49" y2="37"/>' +
                '</g>' +
                '<g stroke="#ef5350" stroke-width="3" fill="none">' +
                    '<circle cx="30" cy="30" r="6"/>' +
                    '<circle cx="13" cy="50" r="6"/>' +
                '</g>' +
            '</svg>',
        flappy:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#4fc3f7"/>' +
                '<rect x="0"  y="50" width="60" height="10" fill="#8d6e63"/>' +
                '<rect x="42" y="0"  width="12" height="20" fill="#43a047"/>' +
                '<rect x="40" y="18" width="16" height="4"  fill="#2e7d32"/>' +
                '<rect x="42" y="38" width="12" height="22" fill="#43a047"/>' +
                '<rect x="40" y="35" width="16" height="4"  fill="#2e7d32"/>' +
                '<circle cx="22" cy="30" r="9" fill="#ffeb3b"/>' +
                '<circle cx="22" cy="30" r="9" fill="none" stroke="#000" stroke-width="0.5"/>' +
                '<circle cx="26" cy="27" r="2" fill="#fff"/>' +
                '<circle cx="27" cy="27" r="1" fill="#000"/>' +
                '<polygon points="29,30 35,28 35,32" fill="#ff5722"/>' +
                '<path d="M 16 32 q 2 4 6 2" fill="#fbc02d"/>' +
            '</svg>',
        doodle:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#e1f5fe"/>' +
                '<rect x="4"  y="50" width="20" height="4" fill="#4caf50"/>' +
                '<rect x="32" y="40" width="20" height="4" fill="#4caf50"/>' +
                '<rect x="8"  y="28" width="20" height="4" fill="#4caf50"/>' +
                '<rect x="34" y="14" width="20" height="4" fill="#4caf50"/>' +
                '<rect x="20" y="20" width="14" height="14" fill="#ff6f00"/>' +
                '<rect x="23" y="24" width="3" height="3" fill="#fff"/>' +
                '<rect x="29" y="24" width="3" height="3" fill="#fff"/>' +
                '<rect x="24" y="25" width="1.5" height="1.5" fill="#000"/>' +
                '<rect x="30" y="25" width="1.5" height="1.5" fill="#000"/>' +
            '</svg>',
        arkanoid:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#0d1b2a"/>' +
                '<rect x="2"  y="6"  width="11" height="5" fill="#f44336"/>' +
                '<rect x="14" y="6"  width="11" height="5" fill="#ff9800"/>' +
                '<rect x="26" y="6"  width="11" height="5" fill="#ffeb3b"/>' +
                '<rect x="38" y="6"  width="11" height="5" fill="#4caf50"/>' +
                '<rect x="50" y="6"  width="8"  height="5" fill="#2196f3"/>' +
                '<rect x="2"  y="12" width="11" height="5" fill="#ff9800"/>' +
                '<rect x="14" y="12" width="11" height="5" fill="#ffeb3b"/>' +
                '<rect x="26" y="12" width="11" height="5" fill="#4caf50"/>' +
                '<rect x="38" y="12" width="11" height="5" fill="#2196f3"/>' +
                '<rect x="50" y="12" width="8"  height="5" fill="#9c27b0"/>' +
                '<circle cx="35" cy="35" r="3" fill="#fff"/>' +
                '<rect x="20" y="50" width="22" height="5" fill="#42a5f5" rx="2"/>' +
            '</svg>',
        tanks:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#000"/>' +
                // Цегли на задньому плані
                '<g fill="#8d4e2f">' +
                    '<rect x="2"  y="2"  width="14" height="10"/>' +
                    '<rect x="44" y="2"  width="14" height="10"/>' +
                    '<rect x="2"  y="48" width="14" height="10"/>' +
                    '<rect x="44" y="48" width="14" height="10"/>' +
                '</g>' +
                '<g stroke="#5d2d15" stroke-width="0.5">' +
                    '<line x1="2" y1="7" x2="16" y2="7"/>' +
                    '<line x1="9" y1="2" x2="9" y2="7"/>' +
                    '<line x1="44" y1="7" x2="58" y2="7"/>' +
                    '<line x1="51" y1="2" x2="51" y2="7"/>' +
                '</g>' +
                // Гравець-танк (жовтий)
                '<g transform="translate(20,36)">' +
                    '<rect width="20" height="20" fill="#f57c00"/>' +
                    '<rect x="2"  y="2"  width="4"  height="16" fill="#ffd54f"/>' +
                    '<rect x="14" y="2"  width="4"  height="16" fill="#ffd54f"/>' +
                    '<rect x="7"  y="7"  width="6"  height="6"  fill="#ffd54f"/>' +
                    '<rect x="9"  y="0"  width="2"  height="10" fill="#fff"/>' +
                '</g>' +
                // Ворожий танк (сірий, зверху)
                '<g transform="translate(20,4)">' +
                    '<rect width="20" height="20" fill="#616161"/>' +
                    '<rect x="2"  y="2"  width="4"  height="16" fill="#bdbdbd"/>' +
                    '<rect x="14" y="2"  width="4"  height="16" fill="#bdbdbd"/>' +
                    '<rect x="7"  y="7"  width="6"  height="6"  fill="#bdbdbd"/>' +
                    '<rect x="9"  y="10" width="2"  height="10" fill="#fff"/>' +
                '</g>' +
                // снаряд між танками
                '<rect x="29" y="29" width="2" height="2" fill="#fff"/>' +
            '</svg>',
        memory:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                // 4 карточки 2х2
                '<rect x="6"  y="6"  width="22" height="22" fill="#42a5f5" rx="2"/>' +
                '<text x="17" y="23" font-size="14" fill="#fff" text-anchor="middle" font-weight="bold">?</text>' +
                '<rect x="32" y="6"  width="22" height="22" fill="#ef5350" rx="2"/>' +
                '<circle cx="43" cy="17" r="6" fill="#fff"/>' +
                '<rect x="6"  y="32" width="22" height="22" fill="#ef5350" rx="2"/>' +
                '<circle cx="17" cy="43" r="6" fill="#fff"/>' +
                '<rect x="32" y="32" width="22" height="22" fill="#42a5f5" rx="2"/>' +
                '<text x="43" y="49" font-size="14" fill="#fff" text-anchor="middle" font-weight="bold">?</text>' +
            '</svg>',
        invaders:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#000"/>' +
                // Зірки
                '<rect x="8"  y="8"  width="1" height="1" fill="#fff"/>' +
                '<rect x="50" y="14" width="1" height="1" fill="#fff"/>' +
                '<rect x="22" y="3"  width="1" height="1" fill="#fff"/>' +
                // Інопланетяни (3шт)
                '<g fill="#4caf50">' +
                    '<rect x="10" y="14" width="3" height="3"/><rect x="16" y="14" width="3" height="3"/>' +
                    '<rect x="7"  y="17" width="15" height="3"/>' +
                    '<rect x="4"  y="20" width="3" height="3"/><rect x="22" y="20" width="3" height="3"/>' +
                '</g>' +
                '<g fill="#ff5722">' +
                    '<rect x="34" y="14" width="3" height="3"/><rect x="40" y="14" width="3" height="3"/>' +
                    '<rect x="31" y="17" width="15" height="3"/>' +
                    '<rect x="28" y="20" width="3" height="3"/><rect x="46" y="20" width="3" height="3"/>' +
                '</g>' +
                // снаряди
                '<rect x="13" y="30" width="2" height="5" fill="#fff"/>' +
                '<rect x="40" y="35" width="2" height="5" fill="#fff"/>' +
                // корабль гравця
                '<g fill="#42a5f5">' +
                    '<rect x="26" y="48" width="10" height="6"/>' +
                    '<rect x="29" y="44" width="4"  height="4"/>' +
                    '<rect x="22" y="52" width="18" height="3"/>' +
                '</g>' +
                // снаряд гравця
                '<rect x="30" y="38" width="2" height="6" fill="#fff"/>' +
            '</svg>',
        crossy:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                // кілька смуг, що чергуються
                '<rect y="0"  width="60" height="8" fill="#43a047"/>' +
                '<rect y="8"  width="60" height="9" fill="#424242"/>' +
                '<rect y="17" width="60" height="9" fill="#424242"/>' +
                '<rect y="26" width="60" height="6" fill="#43a047"/>' +
                '<rect y="32" width="60" height="9" fill="#1565c0"/>' +
                '<rect y="41" width="60" height="9" fill="#424242"/>' +
                '<rect y="50" width="60" height="10" fill="#43a047"/>' +
                // розмітка доріг
                '<g stroke="#fff200" stroke-width="0.5" stroke-dasharray="3 2">' +
                    '<line x1="0" y1="12.5" x2="60" y2="12.5"/>' +
                    '<line x1="0" y1="21.5" x2="60" y2="21.5"/>' +
                    '<line x1="0" y1="45.5" x2="60" y2="45.5"/>' +
                '</g>' +
                // машинки
                '<rect x="8"  y="9.5"  width="13" height="6" fill="#f44336" rx="1"/>' +
                '<rect x="38" y="18.5" width="13" height="6" fill="#ffc107" rx="1"/>' +
                '<rect x="20" y="42.5" width="13" height="6" fill="#9c27b0" rx="1"/>' +
                // колода на воді
                '<rect x="14" y="33.5" width="22" height="6" fill="#6d4c41" rx="1"/>' +
                // персонаж (курка) низ-середини
                '<g fill="#fff">' +
                    '<rect x="27" y="52" width="6" height="6"/>' +
                    '<rect x="28" y="49" width="4" height="3"/>' +
                '</g>' +
                '<rect x="29" y="50" width="2" height="1" fill="#000"/>' +
                '<polygon points="32,51 35,50 35,52" fill="#ff9800"/>' +
            '</svg>',
        minesweeper:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                // сітка 4x4
                '<g stroke="#37474f" stroke-width="1" fill="#cfd8dc">' +
                    '<rect x="2"  y="2"  width="13" height="13"/>' +
                    '<rect x="16" y="2"  width="13" height="13"/>' +
                    '<rect x="30" y="2"  width="13" height="13"/>' +
                    '<rect x="44" y="2"  width="13" height="13"/>' +
                    '<rect x="2"  y="16" width="13" height="13"/>' +
                    '<rect x="44" y="16" width="13" height="13"/>' +
                    '<rect x="2"  y="30" width="13" height="13"/>' +
                    '<rect x="30" y="30" width="13" height="13"/>' +
                    '<rect x="44" y="30" width="13" height="13"/>' +
                    '<rect x="16" y="44" width="13" height="13"/>' +
                    '<rect x="30" y="44" width="13" height="13"/>' +
                    '<rect x="44" y="44" width="13" height="13"/>' +
                '</g>' +
                // відкриті клітини з цифрами
                '<g fill="#90a4ae">' +
                    '<rect x="16" y="16" width="13" height="13"/>' +
                    '<rect x="30" y="16" width="13" height="13"/>' +
                    '<rect x="16" y="30" width="13" height="13"/>' +
                    '<rect x="2"  y="44" width="13" height="13"/>' +
                '</g>' +
                '<text x="22.5" y="27" font-size="10" fill="#1976d2" text-anchor="middle" font-weight="bold">1</text>' +
                '<text x="36.5" y="27" font-size="10" fill="#388e3c" text-anchor="middle" font-weight="bold">2</text>' +
                '<text x="22.5" y="41" font-size="10" fill="#d32f2f" text-anchor="middle" font-weight="bold">3</text>' +
                '<text x="8.5"  y="55" font-size="10" fill="#1976d2" text-anchor="middle" font-weight="bold">1</text>' +
                // флажок
                '<g transform="translate(46,4)">' +
                    '<rect x="3" y="0" width="1" height="9" fill="#000"/>' +
                    '<polygon points="4,0 9,2 4,4" fill="#f44336"/>' +
                '</g>' +
                // міна
                '<g transform="translate(36,46)">' +
                    '<circle cx="3" cy="6" r="3.5" fill="#000"/>' +
                    '<rect x="2.5" y="1" width="1" height="2" fill="#000"/>' +
                    '<rect x="2" y="5" width="2" height="0.8" fill="#fff"/>' +
                '</g>' +
            '</svg>',
        checkers:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                // шахматна дошка 4x4 (спрощена, для іконки)
                '<rect width="60" height="60" fill="#8d6e63"/>' +
                '<g fill="#3e2723">' +
                    '<rect x="0"  y="0"  width="15" height="15"/>' +
                    '<rect x="30" y="0"  width="15" height="15"/>' +
                    '<rect x="15" y="15" width="15" height="15"/>' +
                    '<rect x="45" y="15" width="15" height="15"/>' +
                    '<rect x="0"  y="30" width="15" height="15"/>' +
                    '<rect x="30" y="30" width="15" height="15"/>' +
                    '<rect x="15" y="45" width="15" height="15"/>' +
                    '<rect x="45" y="45" width="15" height="15"/>' +
                '</g>' +
                // білі шашки
                '<g fill="#fafafa" stroke="#bdbdbd" stroke-width="0.5">' +
                    '<circle cx="7.5"  cy="7.5"  r="5"/>' +
                    '<circle cx="37.5" cy="7.5"  r="5"/>' +
                    '<circle cx="22.5" cy="22.5" r="5"/>' +
                '</g>' +
                // чорні шашки
                '<g fill="#212121" stroke="#000" stroke-width="0.5">' +
                    '<circle cx="22.5" cy="52.5" r="5"/>' +
                    '<circle cx="52.5" cy="52.5" r="5"/>' +
                    '<circle cx="37.5" cy="37.5" r="5"/>' +
                '</g>' +
                // дамка з короною (на одній із чорних)
                '<rect x="35" y="35" width="5" height="1.5" fill="#ffd700"/>' +
                '<polygon points="35,35 36,32 38,33 40,32 41,35" fill="#ffd700"/>' +
            '</svg>',
        match3:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                '<rect width="60" height="60" fill="#1a1a2e"/>' +
                // сітка-фон
                '<g fill="#3a3a5e">' +
                    '<rect x="2"  y="2"  width="13" height="13"/>' +
                    '<rect x="16" y="2"  width="13" height="13"/>' +
                    '<rect x="30" y="2"  width="13" height="13"/>' +
                    '<rect x="44" y="2"  width="13" height="13"/>' +
                    '<rect x="2"  y="16" width="13" height="13"/>' +
                    '<rect x="16" y="16" width="13" height="13"/>' +
                    '<rect x="30" y="16" width="13" height="13"/>' +
                    '<rect x="44" y="16" width="13" height="13"/>' +
                    '<rect x="2"  y="30" width="13" height="13"/>' +
                    '<rect x="16" y="30" width="13" height="13"/>' +
                    '<rect x="30" y="30" width="13" height="13"/>' +
                    '<rect x="44" y="30" width="13" height="13"/>' +
                    '<rect x="2"  y="44" width="13" height="13"/>' +
                    '<rect x="16" y="44" width="13" height="13"/>' +
                    '<rect x="30" y="44" width="13" height="13"/>' +
                    '<rect x="44" y="44" width="13" height="13"/>' +
                '</g>' +
                // ряд із трьох червоних кружечків (збіг!) - підсвічені
                '<circle cx="8.5"  cy="8.5"  r="5" fill="#f44336"/>' +
                '<circle cx="22.5" cy="8.5"  r="5" fill="#f44336"/>' +
                '<circle cx="36.5" cy="8.5"  r="5" fill="#f44336"/>' +
                // обведення навколо трійки (підсвічування)
                '<rect x="3" y="3" width="40" height="11" fill="none" stroke="#fff" stroke-width="0.6" rx="2"/>' +
                '<circle cx="50.5" cy="8.5"  r="5" fill="#9c27b0"/>' +
                // інші самоцвіти - різні форми для різноманітності
                '<rect x="4"  y="18" width="9" height="9" fill="#4caf50" rx="1"/>' +
                '<polygon points="22.5,17 27.5,22 22.5,27 17.5,22" fill="#ffc107"/>' +
                '<circle cx="36.5" cy="22.5" r="5" fill="#2196f3"/>' +
                '<rect x="46"  y="18" width="9" height="9" fill="#f44336" rx="1"/>' +
                '<polygon points="8.5,31 13.5,36 8.5,41 3.5,36" fill="#9c27b0"/>' +
                '<circle cx="22.5" cy="36.5" r="5" fill="#4caf50"/>' +
                '<rect x="32"  y="32" width="9" height="9" fill="#ffc107" rx="1"/>' +
                '<polygon points="50.5,31 55.5,36 50.5,41 45.5,36" fill="#2196f3"/>' +
                '<circle cx="8.5" cy="50.5" r="5" fill="#ffc107"/>' +
                '<rect x="18"  y="46" width="9" height="9" fill="#2196f3" rx="1"/>' +
                '<polygon points="36.5,45 41.5,50 36.5,55 31.5,50" fill="#f44336"/>' +
                '<circle cx="50.5" cy="50.5" r="5" fill="#4caf50"/>' +
                // відблиски
                '<circle cx="7"   cy="7"   r="1.2" fill="#fff" opacity="0.7"/>' +
                '<circle cx="21"  cy="7"   r="1.2" fill="#fff" opacity="0.7"/>' +
                '<circle cx="35"  cy="7"   r="1.2" fill="#fff" opacity="0.7"/>' +
            '</svg>',
        platformer:
            '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
                // небо
                '<rect width="60" height="60" fill="#5c94fc"/>' +
                // хмара
                '<circle cx="12" cy="14" r="4" fill="#fff"/>' +
                '<circle cx="17" cy="13" r="4" fill="#fff"/>' +
                // земля з травою
                '<rect x="0" y="46" width="60" height="14" fill="#c84c0c"/>' +
                '<rect x="0" y="46" width="60" height="3" fill="#43a047"/>' +
                // героїня (спрощений силует)
                '<rect x="26" y="26" width="8" height="6" fill="#fed7aa"/>' +     // голова
                '<rect x="25" y="24" width="10" height="5" fill="#1f1410"/>' +    // волосся
                '<rect x="26" y="32" width="8" height="6" fill="#a855f7"/>' +     // топ
                '<rect x="26" y="38" width="8" height="6" fill="#2563eb"/>' +     // комбінезон 
                '<rect x="26" y="44" width="3" height="2" fill="#312e81"/>' +     // ноги
                '<rect x="31" y="44" width="3" height="2" fill="#312e81"/>' +
                '<rect x="28" y="29" width="1" height="1" fill="#15803d"/>' +     // очі
                '<rect x="31" y="29" width="1" height="1" fill="#15803d"/>' +
                // труба з права
                '<rect x="44" y="38" width="12" height="8" fill="#22c55e"/>' +
                '<rect x="42" y="36" width="16" height="4" fill="#22c55e"/>' +
                '<rect x="42" y="36" width="16" height="1" fill="#000"/>' +
                '<rect x="44" y="40" width="12" height="1" fill="#86efac"/>' +
                // ?-блок зверху
                '<rect x="6" y="20" width="10" height="10" fill="#fbbf24"/>' +
                '<rect x="6" y="20" width="10" height="1" fill="#000"/>' +
                '<rect x="6" y="29" width="10" height="1" fill="#000"/>' +
                '<rect x="10" y="23" width="2" height="4" fill="#fff"/>' +
                '<rect x="10" y="28" width="2" height="1" fill="#fff"/>' +
            '</svg>'
    };

    // Динамічне підвантаження плагіна платформера.
    // Якщо вже завантажено — просто відкриваємо активність.
    // Якщо ні - додаємо <script src="..."> на хостинг плагіна, чекаємо на завантаження, відкриваємо.
    var PLATFORMER_URL = 'https://cevamnelampaplagin.github.io/sharewithothers/lenuk.js';
    function loadPlatformerPlugin() {
        // Якщо плагін вже завантажений — Lampa.Component зарегистрировал mario_game
        if (window.lampa_mario_plugin) {
            Lampa.Activity.push({
                url: '',
                title: 'Ленаріо',
                component: 'mario_game',
                page: 1
            });
            return;
        }
        var s = document.createElement('script');
        s.src = PLATFORMER_URL + '?t=' + Date.now(); // захист від кешу
        s.onload = function () {
            // Плагін при завантаженні сам реєструє пункт меню та компонент.
            // Відкриваємо активність через невелику затримку, щоб плагін встиг ініціалізуватися..
            setTimeout(function () {
                if (window.lampa_mario_plugin) {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Ленаріо',
                        component: 'mario_game',
                        page: 1
                    });
                } else {
                    Lampa.Noty && Lampa.Noty.show && Lampa.Noty.show('Не вдалося запустити Ленаріо');
                }
            }, 200);
        };
        s.onerror = function () {
            Lampa.Noty && Lampa.Noty.show && Lampa.Noty.show('Неможливо завантажити ' + PLATFORMER_URL);
        };
        document.head.appendChild(s);
    }

    function getRecord(id) {
        return Lampa.Storage.get('games_record_' + id, 0);
    }
    function setRecord(id, value) {
        if (value > getRecord(id)) Lampa.Storage.set('games_record_' + id, value);
    }

    // ============================================================
    //                          МЕНЮ іГОР
    // ============================================================
    function GamesMenuComponent(object) {
        var html;
        var items;
        var self = this;

        this.create = function () {
            html = $('<div class="games-menu"><div class="games-menu__title">Виберіть гру</div><div class="games-menu__list"></div></div>');
            var list = html.find('.games-menu__list');

            GAMES_LIST.forEach(function (g) {
                var rec = getRecord(g.id);
                var noRecord = (g.id === 'tictac' || g.id === 'seabattle' || g.id === 'tron' || g.id === 'platformer');
                var recText = noRecord ? '' : '<div class="games-menu__rec">Рекорд: ' + rec + '</div>';
                var icon = GAME_ICONS[g.id] || '';
                var item = $(
                    '<div class="games-menu__item selector" data-id="' + g.id + '">' +
                        '<div class="games-menu__icon">' + icon + '</div>' +
                        '<div class="games-menu__body">' +
                            '<div class="games-menu__name">' + g.title + '</div>' +
                            '<div class="games-menu__desc">' + g.desc + '</div>' +
                            recText +
                        '</div>' +
                    '</div>'
                );
                item.on('hover:enter', function () {
                    var id = $(this).data('id');
                    // Платформер - окремий плагін, підвантажуємо динамічно - ні
                    if (id === 'platformer') {
                        loadPlatformerPlugin();
                        return;
                    }
                    Lampa.Activity.push({
                        url: '',
                        title: GAMES_LIST.filter(function(x){return x.id===id;})[0].title,
                        component: 'games_play',
                        game_id: id,
                        page: 1
                    });
                });
                list.append(item);
            });

            items = html.find('.games-menu__item').toArray();
            return this.render();
        };

        this.start = function () {
            function scrollToFocus() {
                setTimeout(function(){
                    var focused = html.find('.games-menu__item.focus')[0];
                    if (focused && focused.scrollIntoView) {
                        focused.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }
                }, 30);
            }
            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(self.render());
                    Lampa.Controller.collectionFocus(false, self.render());
                },
                left: function () {
                    if (Navigator.canmove('left')) Navigator.move('left');
                    else Lampa.Controller.toggle('menu');
                    scrollToFocus();
                },
                right: function () { Navigator.move('right'); scrollToFocus(); },
                up:    function () { Navigator.move('up');    scrollToFocus(); },
                down:  function () { Navigator.move('down');  scrollToFocus(); },
                back:  function () { Lampa.Activity.backward(); }
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return html; };
        this.destroy = function () { if (html) html.remove(); html = null; };
    }

    // ============================================================
    //                  КОМПОНЕНТ-ОБГОРТКА ДЛЯ іГОР
    // ============================================================
    function GamesPlayComponent(object) {
        var game = null;
        var html;
        var self = this;

        this.create = function () {
            html = $('<div class="games-play"></div>');
            var GameClass = GAMES[object.game_id];
            if (!GameClass) {
                html.text('Гра не знайдена');
                return html;
            }
            game = new GameClass(html, self);
            game.create();
            return this.render();
        };

        this.start = function () { if (game) game.start(); };
        this.pause = function () { if (game && game.pause) game.pause(); };
        this.stop  = function () { if (game && game.stop) game.stop(); };
        this.render = function () { return html; };
        this.destroy = function () {
            if (game && game.destroy) game.destroy();
            game = null;
            if (html) html.remove();
            html = null;
        };
    }

    // ============================================================
    //                            іГРИ
    // ============================================================
    var GAMES = {};

    // ---------- Універсальні хелпери ----------
    function setupController(handlers) {
        Lampa.Controller.add('content', $.extend({
            toggle: function () {},
            update: function () {},
            left:  function () {},
            right: function () {},
            up:    function () {},
            down:  function () {},
            enter: function () {},
            back:  function () { Lampa.Activity.backward(); }
        }, handlers || {}));
        Lampa.Controller.toggle('content');
    }

    // Універсальний обробник дотиків для ігор.
    // Приймає кореневий $-елемент та колбеки:
    //   onSwipe(dir): 'left'|'right'|'up'|'down' — після свайпа
    //   onTap(x, y): тап без свайпа, з координатами щодо елемента
    //   onDrag(x, y): рух пальця після старту (для перетягування платформи)
    //   onTouchStart, onTouchEnd: початок/кінець дотику
    // Повертає функцію-відкріплювач.
    function attachTouch(rootEl, callbacks) {
        callbacks = callbacks || {};
        var startX = 0, startY = 0, startTime = 0, dragging = false;
        var THRESHOLD = 25; // px — поріг свайпа
        var TAP_TIME = 300; // ms — поріг тапа
        var lastTouchEnd = 0; // позначка часу останнього touchend, щоб ігнорувати емульований mouse-евент

        function onStart(e, isTouch) {
            // Якщо це mousedown відразу після touchend — це емуляція, ігнор
            if (!isTouch && Date.now() - lastTouchEnd < 500) return;
            var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
            var rect = rootEl[0].getBoundingClientRect();
            startX = t.clientX;
            startY = t.clientY;
            startTime = Date.now();
            dragging = true;
            if (callbacks.onTouchStart) {
                callbacks.onTouchStart(t.clientX - rect.left, t.clientY - rect.top);
            }
        }
        function onMove(e) {
            if (!dragging) return;
            var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
            var rect = rootEl[0].getBoundingClientRect();
            if (callbacks.onDrag) {
                callbacks.onDrag(t.clientX - rect.left, t.clientY - rect.top);
            }
        }
        function onEnd(e, isTouch) {
            if (!dragging) return;
            dragging = false;
            if (isTouch) {
                lastTouchEnd = Date.now();
                // блокуємо емульований клік/mouseup, який браузер пошле слідом
                if (e.originalEvent && e.originalEvent.cancelable) {
                    try { e.originalEvent.preventDefault(); } catch (_) {}
                }
            }
            var t = (e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) || e.originalEvent;
            var rect = rootEl[0].getBoundingClientRect();
            var dx = t.clientX - startX;
            var dy = t.clientY - startY;
            var adx = Math.abs(dx), ady = Math.abs(dy);
            var elapsed = Date.now() - startTime;

            if (adx < THRESHOLD && ady < THRESHOLD) {
                if (elapsed < TAP_TIME && callbacks.onTap) {
                    callbacks.onTap(t.clientX - rect.left, t.clientY - rect.top);
                }
            } else if (callbacks.onSwipe) {
                var dir;
                if (adx > ady) dir = dx > 0 ? 'right' : 'left';
                else           dir = dy > 0 ? 'down' : 'up';
                callbacks.onSwipe(dir);
            }
            if (callbacks.onTouchEnd) callbacks.onTouchEnd();
        }

        rootEl.on('touchstart.gametouch', function(e){ onStart(e, true); });
        rootEl.on('mousedown.gametouch',  function(e){ onStart(e, false); });
        rootEl.on('touchmove.gametouch mousemove.gametouch', onMove);
        rootEl.on('touchend.gametouch',                function(e){ onEnd(e, true); });
        rootEl.on('mouseup.gametouch mouseleave.gametouch', function(e){ onEnd(e, false); });

        return function detach() {
            rootEl.off('.gametouch');
        };
    }

    // ============================================================
    //                          ЗМіЙКА
    // ============================================================
    GAMES.snake = function (root) {
        var canvas, ctx, info, overlay;
        var cols = 20, rows = 20, grid;
        var snake, dir, nextDir, food, score, timer;
        var paused = false, gameOver = false, destroyed = false;
        var SPEED = 110;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Счёт: <b class="g-score">0</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('snake') + '</b></span>' +
                    '<span class="g-hint">Стрілки - рух</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap">' +
                    '<canvas></canvas><div class="game-overlay"></div>' +
                  '</div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            info = root.find('.game-info');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
        };

        this.reset = function () {
            var cx = Math.floor(cols/2), cy = Math.floor(rows/2);
            snake = [{x:cx,y:cy},{x:cx-1,y:cy},{x:cx-2,y:cy}];
            dir = nextDir = {x:1,y:0};
            score = 0; paused = false; gameOver = false;
            this.placeFood();
            root.find('.g-score').text(score);
            this.resize(); this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.placeFood = function () {
            var free = [];
            for (var x=0; x<cols; x++) for (var y=0; y<rows; y++) {
                var on=false;
                for (var i=0;i<snake.length;i++) if (snake[i].x===x&&snake[i].y===y){on=true;break;}
                if (!on) free.push({x:x,y:y});
            }
            food = free.length ? free[Math.floor(Math.random()*free.length)] : null;
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var size = Math.floor(Math.min(rect.width, rect.height));
            if (size < 100) size = Math.min(window.innerHeight-200, window.innerWidth-100, 800);
            grid = Math.floor(size/cols);
            if (grid<8) grid=8;
            canvas.width = grid*cols; canvas.height = grid*rows;
        };

        this.draw = function () {
            ctx.fillStyle='#111'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.strokeStyle='rgba(255,255,255,0.04)';
            for (var i=1;i<cols;i++){ctx.beginPath();ctx.moveTo(i*grid,0);ctx.lineTo(i*grid,canvas.height);ctx.stroke();}
            for (var j=1;j<rows;j++){ctx.beginPath();ctx.moveTo(0,j*grid);ctx.lineTo(canvas.width,j*grid);ctx.stroke();}
            if (food) {
                ctx.fillStyle='#e53935';
                ctx.beginPath();
                ctx.arc(food.x*grid+grid/2, food.y*grid+grid/2, grid/2-2, 0, Math.PI*2);
                ctx.fill();
            }
            for (var k=0;k<snake.length;k++){
                ctx.fillStyle = k===0?'#66bb6a':'#43a047';
                ctx.fillRect(snake[k].x*grid+1, snake[k].y*grid+1, grid-2, grid-2);
            }
        };

        this.tick = function () {
            if (paused||gameOver||destroyed) return;
            dir = nextDir;
            var h = snake[0], nx=h.x+dir.x, ny=h.y+dir.y;
            if (nx<0||ny<0||nx>=cols||ny>=rows) return this.lose();
            for (var i=0;i<snake.length-1;i++) if (snake[i].x===nx&&snake[i].y===ny) return this.lose();
            snake.unshift({x:nx,y:ny});
            if (food && nx===food.x && ny===food.y) {
                score++;
                root.find('.g-score').text(score);
                setRecord('snake', score);
                root.find('.g-record').text(getRecord('snake'));
                this.placeFood();
            } else snake.pop();
            this.draw();
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, SPEED);};
        this.stopLoop  = function(){if(timer){clearInterval(timer);timer=null;}};
        this.lose = function(){gameOver=true;this.stopLoop();overlay.html('Гра скінчена<br><span class="g-sub">OK — заново</span>').addClass('show');};
        this.setDir = function(x,y){if(snake.length>1&&dir.x+x===0&&dir.y+y===0)return;nextDir={x:x,y:y};};

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:function(){s.setDir(-1,0);}, right:function(){s.setDir(1,0);},
                up:function(){s.setDir(0,-1);}, down:function(){s.setDir(0,1);},
                enter:function(){if(gameOver){s.reset();}}
            });
            // Тач: свайп = поворот, тап = рестарт післе Game Over
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (dir==='left')  s.setDir(-1,0);
                    if (dir==='right') s.setDir(1,0);
                    if (dir==='up')    s.setDir(0,-1);
                    if (dir==='down')  s.setDir(0,1);
                },
                onTap: function(){
                    if (gameOver) s.reset();
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                           ТЕТРИС
    // ============================================================
    GAMES.tetris = function (root) {
        var canvas, ctx, overlay;
        var COLS = 10, ROWS = 20, grid;
        var board, piece, score, lines, level, timer, dropDelay;
        var paused = false, gameOver = false, destroyed = false;

        var SHAPES = {
            I:{c:'#00bcd4', m:[[1,1,1,1]]},
            O:{c:'#ffeb3b', m:[[1,1],[1,1]]},
            T:{c:'#9c27b0', m:[[0,1,0],[1,1,1]]},
            S:{c:'#4caf50', m:[[0,1,1],[1,1,0]]},
            Z:{c:'#f44336', m:[[1,1,0],[0,1,1]]},
            L:{c:'#ff9800', m:[[1,0],[1,0],[1,1]]},
            J:{c:'#3f51b5', m:[[0,1],[0,1],[1,1]]}
        };
        var KEYS = ['I','O','T','S','Z','L','J'];

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Линії: <b class="g-lines">0</b></span>' +
                    '<span>Рівень: <b class="g-level">1</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('tetris') + '</b></span>' +
                    '<span class="g-hint">↑ — поворот, ↓ — прискорення, OK — поворот</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
        };

        this.reset = function () {
            board = [];
            for (var y=0;y<ROWS;y++){var r=[];for(var x=0;x<COLS;x++)r.push(null);board.push(r);}
            score=0; lines=0; level=1; dropDelay=600;
            paused=false; gameOver=false;
            this.spawn();
            this.updateUI();
            this.resize(); this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.spawn = function () {
            var k = KEYS[Math.floor(Math.random()*KEYS.length)];
            var s = SHAPES[k];
            piece = {
                m: s.m.map(function(r){return r.slice();}),
                c: s.c,
                x: Math.floor((COLS - s.m[0].length)/2),
                y: 0
            };
            if (this.collide(piece, 0, 0)) { gameOver=true; this.stopLoop(); setRecord('tetris',score); overlay.html('Гра скінчена<br><span class="g-sub">OK — заново</span>').addClass('show'); }
        };

        this.collide = function (p, dx, dy, m) {
            var mat = m || p.m;
            for (var y=0;y<mat.length;y++) for (var x=0;x<mat[y].length;x++){
                if (!mat[y][x]) continue;
                var nx = p.x + x + dx, ny = p.y + y + dy;
                if (nx<0||nx>=COLS||ny>=ROWS) return true;
                if (ny>=0 && board[ny][nx]) return true;
            }
            return false;
        };

        this.merge = function () {
            for (var y=0;y<piece.m.length;y++) for (var x=0;x<piece.m[y].length;x++){
                if (piece.m[y][x] && piece.y+y >= 0) board[piece.y+y][piece.x+x] = piece.c;
            }
        };

        this.clearLines = function () {
            var cleared = 0;
            for (var y=ROWS-1;y>=0;y--){
                var full=true;
                for (var x=0;x<COLS;x++) if (!board[y][x]){full=false;break;}
                if (full) { board.splice(y,1); var nr=[];for(var k=0;k<COLS;k++)nr.push(null); board.unshift(nr); cleared++; y++; }
            }
            if (cleared) {
                var pts = [0,100,300,500,800][cleared] * level;
                score += pts; lines += cleared;
                level = 1 + Math.floor(lines/10);
                dropDelay = Math.max(80, 600 - (level-1)*50);
                setRecord('tetris', score);
                this.updateUI();
                this.startLoop();
            }
        };

        this.rotate = function () {
            var m = piece.m;
            var rotated = [];
            for (var x=0;x<m[0].length;x++){
                var row = [];
                for (var y=m.length-1;y>=0;y--) row.push(m[y][x]);
                rotated.push(row);
            }
            if (!this.collide(piece, 0, 0, rotated)) piece.m = rotated;
        };

        this.move = function (dx) { if (!this.collide(piece, dx, 0)) piece.x += dx; };
        this.softDrop = function () {
            if (!this.collide(piece, 0, 1)) { piece.y++; score++; this.updateUI(); }
            else { this.merge(); this.clearLines(); this.spawn(); }
            this.draw();
        };

        this.updateUI = function () {
            root.find('.g-score').text(score);
            root.find('.g-lines').text(lines);
            root.find('.g-level').text(level);
            root.find('.g-record').text(getRecord('tetris'));
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var maxH = Math.min(rect.height, window.innerHeight-200);
            var maxW = Math.min(rect.width, window.innerWidth-100);
            grid = Math.floor(Math.min(maxW/COLS, maxH/ROWS));
            if (grid<10) grid=10;
            canvas.width = grid*COLS; canvas.height = grid*ROWS;
        };

        this.draw = function () {
            ctx.fillStyle='#111'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.strokeStyle='rgba(255,255,255,0.04)';
            for (var i=1;i<COLS;i++){ctx.beginPath();ctx.moveTo(i*grid,0);ctx.lineTo(i*grid,canvas.height);ctx.stroke();}
            for (var j=1;j<ROWS;j++){ctx.beginPath();ctx.moveTo(0,j*grid);ctx.lineTo(canvas.width,j*grid);ctx.stroke();}
            for (var y=0;y<ROWS;y++) for (var x=0;x<COLS;x++) if (board[y][x]) drawCell(x,y,board[y][x]);
            if (piece) for (var py=0;py<piece.m.length;py++) for (var px=0;px<piece.m[py].length;px++)
                if (piece.m[py][px]) drawCell(piece.x+px, piece.y+py, piece.c);

            function drawCell(x,y,c){
                if (y<0) return;
                ctx.fillStyle=c;
                ctx.fillRect(x*grid+1, y*grid+1, grid-2, grid-2);
            }
        };

        this.startLoop = function(){
            this.stopLoop();
            var s=this;
            timer = setInterval(function(){
                if (paused||gameOver||destroyed) return;
                if (!s.collide(piece,0,1)) piece.y++;
                else { s.merge(); s.clearLines(); s.spawn(); }
                s.draw();
            }, dropDelay);
        };
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(!gameOver){s.move(-1);s.draw();}},
                right: function(){if(!gameOver){s.move(1);s.draw();}},
                up:    function(){if(!gameOver){s.rotate();s.draw();}},
                down:  function(){if(!gameOver) s.softDrop();},
                enter: function(){
                    if (gameOver){s.reset();return;}
                    s.rotate(); s.draw();
                }
            });
            // Тач: свайп вліво/вправо/вниз = рух, свайп вверх = поворот, тап = поворот
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (gameOver) return;
                    if (dir==='left') { s.move(-1); s.draw(); }
                    else if (dir==='right') { s.move(1); s.draw(); }
                    else if (dir==='up') { s.rotate(); s.draw(); }
                    else if (dir==='down') s.softDrop();
                },
                onTap: function(){
                    if (gameOver){s.reset();return;}
                    s.rotate(); s.draw();
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                           PAC-MAN
    // ============================================================
    GAMES.pacman = function (root) {
        // Проста карта 19x15: # стіна, . крапка, o енергайзер, ' ' пусто
        var MAP = [
            "###################",
            "#........#........#",
            "#o##.###.#.###.##o#",
            "#.................#",
            "#.##.#.#####.#.##.#",
            "#....#...#...#....#",
            "####.### # ###.####",
            "   #.#       #.#   ",
            "####.# ##=## #.####",
            "#....  #   #  ....#",
            "#.####.#####.####.#",
            "#o..#...P...#...o#".replace('P','.'),
            "##.#.#.#####.#.#.##",
            "#....#...#...#....#",
            "###################"
        ];
        var COLS = MAP[0].length, ROWS = MAP.length;
        var canvas, ctx, overlay;
        var grid, grid_field;
        var pac, ghosts, score, lives, dotsLeft, frightTimer;
        var dir, nextDir;
        var timer, paused=false, gameOver=false, won=false, destroyed=false;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Життя: <b class="g-lives">3</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('pacman') + '</b></span>' +
                    '<span class="g-hint">Стрілки — рух</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
        };

        this.reset = function () {
            grid_field = [];
            for (var y=0;y<ROWS;y++){
                var row=[];
                for (var x=0;x<COLS;x++) row.push(MAP[y].charAt(x));
                grid_field.push(row);
            }
            // підрахунок крапочок
            dotsLeft = 0;
            for (var yy=0;yy<ROWS;yy++) for (var xx=0;xx<COLS;xx++)
                if (grid_field[yy][xx]==='.'||grid_field[yy][xx]==='o') dotsLeft++;

            pac = { x: 9, y: 11, px:9, py:11, t:0 };
            dir = {x:0,y:0}; nextDir = {x:0,y:0};
            ghosts = [
                { x:9, y:7, px:9, py:7, t:0, c:'#f44336', dir:{x:1,y:0}, mode:'normal', spawn:{x:9,y:7} },
                { x:8, y:7, px:8, py:7, t:0, c:'#ff9800', dir:{x:-1,y:0}, mode:'normal', spawn:{x:8,y:7} },
                { x:10,y:7, px:10,py:7, t:0, c:'#4fc3f7', dir:{x:0,y:1}, mode:'normal', spawn:{x:10,y:7} }
            ];
            score = 0; lives = 3; frightTimer = 0;
            paused=false; gameOver=false; won=false;
            this.updateUI();
            this.resize(); this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.cellAt = function (x,y) {
            if (y<0||y>=ROWS) return '#';
            if (x<0) x = COLS-1;
            if (x>=COLS) x = 0;
            return grid_field[y][x];
        };
        this.canMove = function (x,y,d) {
            var nx = x + d.x, ny = y + d.y;
            if (ny<0||ny>=ROWS) return false;
            if (nx<0) nx = COLS-1; if (nx>=COLS) nx=0;
            return grid_field[ny][nx] !== '#';
        };

        this.updateUI = function () {
            root.find('.g-score').text(score);
            root.find('.g-lives').text(lives);
            root.find('.g-record').text(getRecord('pacman'));
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var maxH = Math.min(rect.height, window.innerHeight-200);
            var maxW = Math.min(rect.width, window.innerWidth-100);
            grid = Math.floor(Math.min(maxW/COLS, maxH/ROWS));
            if (grid<14) grid=14;
            canvas.width = grid*COLS; canvas.height = grid*ROWS;
        };

        this.draw = function () {
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            for (var y=0;y<ROWS;y++) for (var x=0;x<COLS;x++){
                var c = grid_field[y][x];
                if (c==='#') {
                    ctx.fillStyle='#1a237e';
                    ctx.fillRect(x*grid, y*grid, grid, grid);
                    ctx.strokeStyle='#3949ab';
                    ctx.strokeRect(x*grid+1, y*grid+1, grid-2, grid-2);
                } else if (c==='.') {
                    ctx.fillStyle='#ffeb3b';
                    ctx.beginPath();
                    ctx.arc(x*grid+grid/2, y*grid+grid/2, Math.max(2,grid/8), 0, Math.PI*2);
                    ctx.fill();
                } else if (c==='o') {
                    ctx.fillStyle='#fff';
                    ctx.beginPath();
                    ctx.arc(x*grid+grid/2, y*grid+grid/2, Math.max(4,grid/4), 0, Math.PI*2);
                    ctx.fill();
                } else if (c==='=') {
                    ctx.fillStyle='#f48fb1';
                    ctx.fillRect(x*grid, y*grid+grid/2-2, grid, 4);
                }
            }
            // pac-man
            var pcx = (pac.px + (pac.x-pac.px)*pac.t)*grid + grid/2;
            var pcy = (pac.py + (pac.y-pac.py)*pac.t)*grid + grid/2;
            ctx.fillStyle='#ffeb3b';
            ctx.beginPath();
            var ang = Math.atan2(dir.y, dir.x) || 0;
            var mouth = 0.25 + 0.15*Math.sin(Date.now()/80);
            ctx.moveTo(pcx, pcy);
            ctx.arc(pcx, pcy, grid/2-2, ang+mouth, ang-mouth+Math.PI*2);
            ctx.closePath();
            ctx.fill();
            // ghosts
            ghosts.forEach(function(g){
                var gx = (g.px + (g.x-g.px)*g.t)*grid + grid/2;
                var gy = (g.py + (g.y-g.py)*g.t)*grid + grid/2;
                ctx.fillStyle = g.mode==='fright' ? '#1a237e' : g.c;
                ctx.beginPath();
                ctx.arc(gx, gy-2, grid/2-2, Math.PI, 0);
                ctx.lineTo(gx+grid/2-2, gy+grid/2-2);
                ctx.lineTo(gx+grid/4, gy+grid/3);
                ctx.lineTo(gx, gy+grid/2-2);
                ctx.lineTo(gx-grid/4, gy+grid/3);
                ctx.lineTo(gx-grid/2+2, gy+grid/2-2);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle='#fff';
                ctx.beginPath(); ctx.arc(gx-4, gy-2, 2, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(gx+4, gy-2, 2, 0, Math.PI*2); ctx.fill();
            });
        };

        this.tick = function () {
            if (paused||gameOver||destroyed||won) return;

            // Pac-man плавно йде
            pac.t += 0.2;
            if (pac.t >= 1) {
                pac.px = pac.x; pac.py = pac.y; pac.t = 0;
                // змінюємо напрямок, якщо можна
                if ((nextDir.x||nextDir.y) && this.canMove(pac.x, pac.y, nextDir)) dir = nextDir;
                if ((dir.x||dir.y) && this.canMove(pac.x, pac.y, dir)) {
                    pac.x += dir.x; pac.y += dir.y;
                    if (pac.x<0) pac.x = COLS-1; if (pac.x>=COLS) pac.x=0;
                }
                // зїсти
                var c = grid_field[pac.y][pac.x];
                if (c==='.') { grid_field[pac.y][pac.x]=' '; score+=10; dotsLeft--; this.updateUI(); }
                else if (c==='o') {
                    grid_field[pac.y][pac.x]=' '; score+=50; dotsLeft--; this.updateUI();
                    frightTimer = 50;
                    ghosts.forEach(function(g){g.mode='fright';});
                }
                if (dotsLeft<=0) { won=true; this.stopLoop(); setRecord('pacman',score); overlay.html('Рівень пройдено!<br><span class="g-sub">OK — заново</span>').addClass('show'); }
            }

            // привиди
            for (var i=0;i<ghosts.length;i++){
                var g = ghosts[i];
                g.t += g.mode==='fright' ? 0.13 : 0.18;
                if (g.t >= 1) {
                    g.px = g.x; g.py = g.y; g.t = 0;
                    // вибираємо напрямок: виключаємо розворот, вибираємо валідний випадково
                    var opts = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].filter(function(d){
                        return !(d.x+g.dir.x===0 && d.y+g.dir.y===0) && this.canMove(g.x,g.y,d);
                    }, this);
                    if (!opts.length) opts = [{x:-g.dir.x, y:-g.dir.y}];
                    // у звичайному режимі віддаємо перевагу напрямку до pac-man з шансом 60%
                    if (g.mode==='normal' && Math.random()<0.6) {
                        opts.sort(function(a,b){
                            var da = Math.abs(g.x+a.x-pac.x)+Math.abs(g.y+a.y-pac.y);
                            var db = Math.abs(g.x+b.x-pac.x)+Math.abs(g.y+b.y-pac.y);
                            return da-db;
                        });
                        g.dir = opts[0];
                    } else {
                        g.dir = opts[Math.floor(Math.random()*opts.length)];
                    }
                    g.x += g.dir.x; g.y += g.dir.y;
                    if (g.x<0) g.x=COLS-1; if (g.x>=COLS) g.x=0;
                }
            }

            // фрайт-таймер
            if (frightTimer>0){
                frightTimer--;
                if (frightTimer===0) ghosts.forEach(function(g){g.mode='normal';});
            }

            // зіткнення
            for (var j=0;j<ghosts.length;j++){
                var gh = ghosts[j];
                if (gh.x===pac.x && gh.y===pac.y) {
                    if (gh.mode==='fright') {
                        score += 200; this.updateUI();
                        gh.x = gh.spawn.x; gh.y = gh.spawn.y; gh.px = gh.x; gh.py = gh.y; gh.t = 0; gh.mode='normal';
                    } else {
                        lives--; this.updateUI();
                        if (lives<=0) { gameOver=true; this.stopLoop(); setRecord('pacman',score); overlay.html('Гра скінчена<br><span class="g-sub">OK — заново</span>').addClass('show'); return; }
                        pac.x=9; pac.y=11; pac.px=pac.x; pac.py=pac.y; pac.t=0; dir={x:0,y:0}; nextDir={x:0,y:0};
                        ghosts.forEach(function(g){g.x=g.spawn.x;g.y=g.spawn.y;g.px=g.x;g.py=g.y;g.t=0;g.mode='normal';});
                        return;
                    }
                }
            }

            this.draw();
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, 50);};
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){nextDir={x:-1,y:0};},
                right: function(){nextDir={x:1,y:0};},
                up:    function(){nextDir={x:0,y:-1};},
                down:  function(){nextDir={x:0,y:1};},
                enter: function(){
                    if (gameOver||won){s.reset();return;}
                }
            });
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (dir==='left')  nextDir={x:-1,y:0};
                    if (dir==='right') nextDir={x:1,y:0};
                    if (dir==='up')    nextDir={x:0,y:-1};
                    if (dir==='down')  nextDir={x:0,y:1};
                },
                onTap: function(){
                    if (gameOver||won) s.reset();
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                            ТРОН
    // ============================================================
    // Гравець проти бота. Кожен залишає слід, не можна врізатися.
    GAMES.tron = function (root) {
        var canvas, ctx, overlay;
        var COLS=40, ROWS=30, grid;
        var board; // 0 пусто, 1 слід гравця, 2 слід бота
        var p, b; // {x,y,dir}
        var timer, paused=false, gameOver=false, destroyed=false;
        var roundScore = 0;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Победы: <b class="g-score">0</b></span>' +
                    '<span class="g-hint">Стрілки - поворот</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
        };

        this.reset = function () {
            board = [];
            for (var y=0;y<ROWS;y++){var r=[];for(var x=0;x<COLS;x++)r.push(0);board.push(r);}
            p = { x:5, y:Math.floor(ROWS/2), dir:{x:1,y:0} };
            b = { x:COLS-6, y:Math.floor(ROWS/2), dir:{x:-1,y:0} };
            board[p.y][p.x]=1; board[b.y][b.x]=2;
            paused=false; gameOver=false;
            this.resize(); this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var maxH = Math.min(rect.height, window.innerHeight-200);
            var maxW = Math.min(rect.width, window.innerWidth-100);
            grid = Math.floor(Math.min(maxW/COLS, maxH/ROWS));
            if (grid<8) grid=8;
            canvas.width = grid*COLS; canvas.height = grid*ROWS;
        };

        this.draw = function () {
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            for (var y=0;y<ROWS;y++) for (var x=0;x<COLS;x++){
                if (board[y][x]===1) { ctx.fillStyle='#00e5ff'; ctx.fillRect(x*grid,y*grid,grid,grid); }
                else if (board[y][x]===2) { ctx.fillStyle='#ff5252'; ctx.fillRect(x*grid,y*grid,grid,grid); }
            }
            // голови яскравіші
            ctx.fillStyle='#fff';
            ctx.fillRect(p.x*grid+2, p.y*grid+2, grid-4, grid-4);
            ctx.fillRect(b.x*grid+2, b.y*grid+2, grid-4, grid-4);
        };

        this.botAI = function () {
            // вибирає напрямок, щоб прожити довше: рахує вільні клітини у кожному напрямі
            var opts = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].filter(function(d){
                return !(d.x+b.dir.x===0 && d.y+b.dir.y===0);
            });
            var best = b.dir, bestScore = -1;
            for (var i=0;i<opts.length;i++){
                var d = opts[i];
                var nx = b.x+d.x, ny = b.y+d.y;
                if (nx<0||ny<0||nx>=COLS||ny>=ROWS) continue;
                if (board[ny][nx]) continue;
                // оцінка: рахуємо доступні клітини flood-fill, але дешево — до 30 кроків
                var score = floodCount(nx, ny, 40);
                if (score > bestScore) { bestScore = score; best = d; }
            }
            b.dir = best;

            function floodCount(sx, sy, limit) {
                var seen = {};
                var stack = [[sx,sy]];
                var cnt = 0;
                while (stack.length && cnt<limit) {
                    var c = stack.pop();
                    var key = c[0]+'_'+c[1];
                    if (seen[key]) continue;
                    if (c[0]<0||c[1]<0||c[0]>=COLS||c[1]>=ROWS) continue;
                    if (board[c[1]][c[0]]) continue;
                    seen[key]=1; cnt++;
                    stack.push([c[0]+1,c[1]]);
                    stack.push([c[0]-1,c[1]]);
                    stack.push([c[0],c[1]+1]);
                    stack.push([c[0],c[1]-1]);
                }
                return cnt;
            }
        };

        this.tick = function () {
            if (paused||gameOver||destroyed) return;
            this.botAI();
            var pn = {x:p.x+p.dir.x, y:p.y+p.dir.y};
            var bn = {x:b.x+b.dir.x, y:b.y+b.dir.y};
            var pDead = pn.x<0||pn.y<0||pn.x>=COLS||pn.y>=ROWS||board[pn.y][pn.x];
            var bDead = bn.x<0||bn.y<0||bn.x>=COLS||bn.y>=ROWS||board[bn.y][bn.x];
            if (pn.x===bn.x && pn.y===bn.y) { pDead = bDead = true; }
            if (pDead && bDead) return this.endRound('Нічия');
            if (pDead) return this.endRound('Поразка');
            if (bDead) {
                roundScore++;
                root.find('.g-score').text(roundScore);
                return this.endRound('Перемога!');
            }
            p.x = pn.x; p.y = pn.y; board[p.y][p.x]=1;
            b.x = bn.x; b.y = bn.y; board[b.y][b.x]=2;
            this.draw();
        };

        this.endRound = function (text) {
            gameOver = true;
            this.stopLoop();
            overlay.html(text + '<br><span class="g-sub">OK — наступний раунд</span>').addClass('show');
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, 80);};
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.setDir = function (x,y) {
            if (p.dir.x+x===0 && p.dir.y+y===0) return;
            p.dir = {x:x,y:y};
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:function(){s.setDir(-1,0);},right:function(){s.setDir(1,0);},
                up:function(){s.setDir(0,-1);},down:function(){s.setDir(0,1);},
                enter: function(){
                    if (gameOver) s.reset();
                }
            });
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (dir==='left') s.setDir(-1,0);
                    if (dir==='right') s.setDir(1,0);
                    if (dir==='up') s.setDir(0,-1);
                    if (dir==='down') s.setDir(0,1);
                },
                onTap: function(){
                    if (gameOver) s.reset();
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                         МОРСЬКИЙ БІЙ
    // ============================================================
    GAMES.seabattle = function (root) {
        var SIZE = 10;
        var SHIPS = [4,3,3,2,2,2,1,1,1,1];
        var playerBoard, enemyBoard; // 0 пусто, 1 корабль, 2 промах, 3 влучення
        var playerShips, enemyShips;
        var cursor = {x:0, y:0};
        var aiState; // память бота
        var phase = 'play'; // 'play' | 'win' | 'lose'
        var turn = 'player';
        var info, overlay;

        this.create = function () {
            root.html(
                '<div class="game-wrap sea-wrap">' +
                  '<div class="game-info">' +
                    '<span class="sea-status">Ваш хід</span>' +
                    '<span class="g-hint">Стрілки - наведення, OK — постріл</span>' +
                  '</div>' +
                  '<div class="sea-boards">' +
                    '<div class="sea-side"><div class="sea-title">Ваше поле</div><div class="sea-board sea-player"></div></div>' +
                    '<div class="sea-side"><div class="sea-title">Поле противника</div><div class="sea-board sea-enemy"></div></div>' +
                  '</div>' +
                  '<div class="game-overlay"></div>' +
                '</div>'
            );
            info = root.find('.sea-status');
            overlay = root.find('.game-overlay');
            this.reset();
        };

        this.reset = function () {
            playerBoard = makeBoard();
            enemyBoard = makeBoard();
            playerShips = placeShips(playerBoard);
            enemyShips = placeShips(enemyBoard);
            cursor = {x:0,y:0};
            aiState = { mode:'hunt', queue:[], hits:[] };
            phase = 'play'; turn = 'player';
            this.renderBoards();
            info.text('Ваш хід');
            overlay.removeClass('show').text('');

            function makeBoard() {
                var b=[]; for(var y=0;y<SIZE;y++){var r=[];for(var x=0;x<SIZE;x++)r.push(0);b.push(r);} return b;
            }
            function placeShips(b) {
                var ships = [];
                for (var s=0;s<SHIPS.length;s++) {
                    var len = SHIPS[s];
                    for (var attempt=0; attempt<200; attempt++){
                        var horiz = Math.random()<0.5;
                        var x = Math.floor(Math.random()*(horiz ? SIZE-len+1 : SIZE));
                        var y = Math.floor(Math.random()*(horiz ? SIZE : SIZE-len+1));
                        if (canPlace(b,x,y,len,horiz)) {
                            var cells=[];
                            for (var i=0;i<len;i++){
                                var cx = horiz?x+i:x, cy = horiz?y:y+i;
                                b[cy][cx]=1;
                                cells.push({x:cx,y:cy});
                            }
                            ships.push({cells:cells, hits:0});
                            break;
                        }
                    }
                }
                return ships;
            }
            function canPlace(b,x,y,len,horiz) {
                for (var i=-1;i<=len;i++) for (var j=-1;j<=1;j++){
                    var cx = horiz?x+i:x+j, cy = horiz?y+j:y+i;
                    if (cx<0||cy<0||cx>=SIZE||cy>=SIZE) continue;
                    if (b[cy][cx]===1) return false;
                }
                return true;
            }
        };

        this.renderBoards = function () {
            renderBoard(root.find('.sea-player'), playerBoard, false);
            renderBoard(root.find('.sea-enemy'),  enemyBoard,  true);
            var self = this;
            function renderBoard($el, board, hideShips) {
                var html = '<table class="sea-table">';
                for (var y=0;y<SIZE;y++){
                    html += '<tr>';
                    for (var x=0;x<SIZE;x++){
                        var v = board[y][x];
                        var cls = 'sea-cell';
                        if (hideShips) {
                            if (v===2) cls += ' sea-miss';
                            else if (v===3) cls += ' sea-hit';
                            if (cursor.x===x && cursor.y===y && phase==='play' && turn==='player') cls += ' sea-cursor';
                        } else {
                            if (v===1) cls += ' sea-ship';
                            else if (v===2) cls += ' sea-miss';
                            else if (v===3) cls += ' sea-hit';
                        }
                        var attrs = hideShips ? ' data-x="'+x+'" data-y="'+y+'"' : '';
                        html += '<td class="' + cls + '"' + attrs + '></td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                $el.html(html);
            }
            // Тап по клітці ворожого поля = постріл у цю клітку
            root.find('.sea-enemy td[data-x]').on('click touchend', function(e){
                e.preventDefault();
                if (phase!=='play' || turn!=='player') {
                    if (phase!=='play') self.reset();
                    return;
                }
                cursor.x = parseInt($(this).attr('data-x'), 10);
                cursor.y = parseInt($(this).attr('data-y'), 10);
                self.fire();
            });
        };

        this.fire = function () {
            if (phase!=='play' || turn!=='player') return;
            var x = cursor.x, y = cursor.y;
            if (enemyBoard[y][x]>=2) return; // вже стріляли
            var hit = enemyBoard[y][x]===1;
            enemyBoard[y][x] = hit ? 3 : 2;
            if (hit) {
                var sunk = this.checkSunk(enemyShips, enemyBoard, x, y);
                this.renderBoards();
                if (this.allSunk(enemyShips)) {
                    phase='win'; info.text('Победа!');
                    overlay.html('Ви перемогли!<br><span class="g-sub">OK — заново</span>').addClass('show');
                    return;
                }
                info.text(sunk ? 'Потоплений! Стріляйте ще' : 'Влучання! Стріляйте ще');
            } else {
                turn='enemy';
                this.renderBoards();
                info.text('Хід противника');
                var s=this;
                setTimeout(function(){s.aiTurn();}, 600);
            }
        };

        this.checkSunk = function (ships, board, x, y) {
            for (var i=0;i<ships.length;i++){
                var s = ships[i];
                var has = false; var alive=0;
                for (var j=0;j<s.cells.length;j++){
                    var c = s.cells[j];
                    if (c.x===x && c.y===y) has=true;
                    if (board[c.y][c.x]!==3) alive++;
                }
                if (has && alive===0) return true;
            }
            return false;
        };

        this.allSunk = function (ships) {
            for (var i=0;i<ships.length;i++){
                for (var j=0;j<ships[i].cells.length;j++){
                    var c = ships[i].cells[j];
                    var board = (ships===enemyShips) ? enemyBoard : playerBoard;
                    if (board[c.y][c.x]===1) return false;
                }
            }
            return true;
        };

        this.aiTurn = function () {
            if (phase!=='play') return;
            var x,y;
            if (aiState.queue.length) {
                var t = aiState.queue.shift();
                x = t.x; y = t.y;
                if (playerBoard[y][x]>=2) { this.aiTurn(); return; }
            } else {
                aiState.mode='hunt';
                aiState.hits=[];
                // випадковий постріл у шаховому порядку
                var tries=0;
                do {
                    x = Math.floor(Math.random()*SIZE);
                    y = Math.floor(Math.random()*SIZE);
                    tries++;
                } while ((playerBoard[y][x]>=2 || (x+y)%2!==0) && tries<200);
                if (playerBoard[y][x]>=2) {
                    do { x = Math.floor(Math.random()*SIZE); y = Math.floor(Math.random()*SIZE); } while (playerBoard[y][x]>=2);
                }
            }
            var hit = playerBoard[y][x]===1;
            playerBoard[y][x] = hit ? 3 : 2;
            if (hit) {
                aiState.hits.push({x:x,y:y});
                var sunk = this.checkSunk(playerShips, playerBoard, x, y);
                if (sunk) {
                    aiState.mode='hunt'; aiState.queue=[]; aiState.hits=[];
                } else {
                    aiState.mode='target';
                    // додаємо сусідів у чергу
                    var dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
                    for (var k=0;k<dirs.length;k++){
                        var nx=x+dirs[k].x, ny=y+dirs[k].y;
                        if (nx>=0&&ny>=0&&nx<SIZE&&ny<SIZE && playerBoard[ny][nx]<2) {
                            aiState.queue.push({x:nx,y:ny});
                        }
                    }
                }
                this.renderBoards();
                if (this.allSunk(playerShips)) {
                    phase='lose'; info.text('Поразка');
                    overlay.html('Ви програли<br><span class="g-sub">OK — заново</span>').addClass('show');
                    return;
                }
                var s=this;
                setTimeout(function(){s.aiTurn();}, 600);
            } else {
                turn='player';
                this.renderBoards();
                info.text('Ваш хід');
            }
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(phase==='play'&&turn==='player'&&cursor.x>0){cursor.x--;s.renderBoards();}},
                right: function(){if(phase==='play'&&turn==='player'&&cursor.x<SIZE-1){cursor.x++;s.renderBoards();}},
                up:    function(){if(phase==='play'&&turn==='player'&&cursor.y>0){cursor.y--;s.renderBoards();}},
                down:  function(){if(phase==='play'&&turn==='player'&&cursor.y<SIZE-1){cursor.y++;s.renderBoards();}},
                enter: function(){
                    if (phase!=='play') { s.reset(); return; }
                    s.fire();
                }
            });
        };
        this.pause = function(){};
        this.destroy = function(){};
    };

    // ============================================================
    //                       ХРЕСТИКИ-НУЛИКИ
    // ============================================================
    GAMES.tictac = function (root) {
        var board, cursor={x:0,y:0}, turn='X', phase='play';
        var info, overlay;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span class="ttt-status">Ваш хід (X)</span>' +
                    '<span class="g-hint">Стрілки - вибір, OK — поставить</span>' +
                  '</div>' +
                  '<div class="ttt-board"></div>' +
                  '<div class="game-overlay"></div>' +
                '</div>'
            );
            info = root.find('.ttt-status');
            overlay = root.find('.game-overlay');
            this.reset();
        };

        this.reset = function () {
            board = [['','',''],['','',''],['','','']];
            cursor = {x:0,y:0}; turn='X'; phase='play';
            this.draw();
            info.text('Ваш хід (X)');
            overlay.removeClass('show').text('');
        };

        this.draw = function () {
            var html = '';
            for (var y=0;y<3;y++) for (var x=0;x<3;x++){
                var cls = 'ttt-cell';
                if (cursor.x===x&&cursor.y===y&&phase==='play'&&turn==='X') cls += ' ttt-cursor';
                html += '<div class="' + cls + '" data-x="'+x+'" data-y="'+y+'">' + (board[y][x]||'') + '</div>';
            }
            root.find('.ttt-board').html(html);
            var self = this;
            root.find('.ttt-cell').on('click touchend', function(e){
                e.preventDefault();
                if (phase!=='play') { self.reset(); return; }
                if (turn!=='X') return;
                cursor.x = parseInt($(this).attr('data-x'), 10);
                cursor.y = parseInt($(this).attr('data-y'), 10);
                self.place();
            });
        };

        this.checkWin = function (mark) {
            for (var i=0;i<3;i++){
                if (board[i][0]===mark&&board[i][1]===mark&&board[i][2]===mark) return true;
                if (board[0][i]===mark&&board[1][i]===mark&&board[2][i]===mark) return true;
            }
            if (board[0][0]===mark&&board[1][1]===mark&&board[2][2]===mark) return true;
            if (board[0][2]===mark&&board[1][1]===mark&&board[2][0]===mark) return true;
            return false;
        };
        this.isFull = function () {
            for (var y=0;y<3;y++) for (var x=0;x<3;x++) if (!board[y][x]) return false;
            return true;
        };

        this.minimax = function (b, mark) {
            var opp = mark==='O'?'X':'O';
            // термінальні стани
            if (winCheck(b,'O')) return {score: 1};
            if (winCheck(b,'X')) return {score:-1};
            if (full(b)) return {score: 0};
            var best = {score: mark==='O'?-Infinity:Infinity, x:-1, y:-1};
            for (var y=0;y<3;y++) for (var x=0;x<3;x++){
                if (!b[y][x]) {
                    b[y][x]=mark;
                    var r = this.minimax(b, opp);
                    b[y][x]='';
                    if (mark==='O' && r.score > best.score) best = {score:r.score, x:x, y:y};
                    if (mark==='X' && r.score < best.score) best = {score:r.score, x:x, y:y};
                }
            }
            return best;

            function winCheck(b, m) {
                for (var i=0;i<3;i++){
                    if (b[i][0]===m&&b[i][1]===m&&b[i][2]===m) return true;
                    if (b[0][i]===m&&b[1][i]===m&&b[2][i]===m) return true;
                }
                if (b[0][0]===m&&b[1][1]===m&&b[2][2]===m) return true;
                if (b[0][2]===m&&b[1][1]===m&&b[2][0]===m) return true;
                return false;
            }
            function full(b){for (var y=0;y<3;y++) for (var x=0;x<3;x++) if (!b[y][x]) return false; return true;}
        };

        this.aiMove = function () {
            var move = this.minimax(board, 'O');
            if (move.x>=0) board[move.y][move.x] = 'O';
            this.draw();
            if (this.checkWin('O')) { phase='lose'; info.text('Поразка'); overlay.html('Ви програли<br><span class="g-sub">OK — заново</span>').addClass('show'); return; }
            if (this.isFull()) { phase='draw'; info.text('Нічия'); overlay.html('Нічия<br><span class="g-sub">OK — заново</span>').addClass('show'); return; }
            turn='X'; info.text('Ваш хід (X)');
        };

        this.place = function () {
            if (phase!=='play' || turn!=='X') return;
            if (board[cursor.y][cursor.x]) return;
            board[cursor.y][cursor.x] = 'X';
            this.draw();
            if (this.checkWin('X')) { phase='win'; info.text('Перемога!'); overlay.html('Ви перемогли!<br><span class="g-sub">OK — заново</span>').addClass('show'); return; }
            if (this.isFull()) { phase='draw'; info.text('Нічия'); overlay.html('Нічия<br><span class="g-sub">OK — заново</span>').addClass('show'); return; }
            turn='O'; info.text('Хід противника');
            var s=this;
            setTimeout(function(){s.aiMove();}, 400);
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(phase==='play'&&turn==='X'&&cursor.x>0){cursor.x--;s.draw();}},
                right: function(){if(phase==='play'&&turn==='X'&&cursor.x<2){cursor.x++;s.draw();}},
                up:    function(){if(phase==='play'&&turn==='X'&&cursor.y>0){cursor.y--;s.draw();}},
                down:  function(){if(phase==='play'&&turn==='X'&&cursor.y<2){cursor.y++;s.draw();}},
                enter: function(){
                    if (phase!=='play') { s.reset(); return; }
                    s.place();
                }
            });
        };
        this.pause = function(){};
        this.destroy = function(){};
    };

    // ============================================================
    //                         FLAPPY BIRD
    // ============================================================
    GAMES.flappy = function (root) {
        var canvas, ctx, overlay;
        var W, H;
        var bird, pipes, score, timer;
        var paused=false, gameOver=false, destroyed=false, started=false;
        var GRAVITY = 0.5, JUMP = -8, PIPE_GAP = 160, PIPE_W = 60, PIPE_SPEED = 3;
        var spawnCounter = 0;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('flappy') + '</b></span>' +
                    '<span class="g-hint">OK / стрілки — взмах</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            W = Math.floor(Math.min(rect.width, rect.height * 0.8));
            H = Math.floor(rect.height);
            if (W < 200) W = 400;
            if (H < 300) H = 600;
            canvas.width = W; canvas.height = H;
        };

        this.reset = function () {
            this.resize();
            bird = { x: W*0.25, y: H/2, vy: 0, r: 14 };
            pipes = [];
            score = 0; spawnCounter = 0;
            paused=false; gameOver=false; started=false;
            root.find('.g-score').text(0);
            this.draw();
            overlay.html('Натисніть OK або стрілку<br><span class="g-sub">щоб злетіти</span>').addClass('show');
            this.startLoop();
        };

        this.flap = function () {
            if (gameOver) { this.reset(); return; }
            if (!started) { started=true; overlay.removeClass('show').text(''); }
            if (paused) return;
            bird.vy = JUMP;
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, 1000/60);};
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.tick = function () {
            if (paused||gameOver||destroyed) { this.draw(); return; }
            if (!started) { this.draw(); return; }

            bird.vy += GRAVITY;
            bird.y += bird.vy;

            spawnCounter++;
            if (spawnCounter > 90) {
                spawnCounter = 0;
                var gapY = 80 + Math.random() * (H - PIPE_GAP - 160);
                pipes.push({ x: W, gapY: gapY, passed: false });
            }

            for (var i=pipes.length-1;i>=0;i--) {
                pipes[i].x -= PIPE_SPEED;
                if (pipes[i].x + PIPE_W < 0) pipes.splice(i,1);
                else if (!pipes[i].passed && pipes[i].x + PIPE_W < bird.x) {
                    pipes[i].passed = true;
                    score++;
                    root.find('.g-score').text(score);
                    setRecord('flappy', score);
                    root.find('.g-record').text(getRecord('flappy'));
                }
            }

            // зіткнення
            if (bird.y + bird.r > H || bird.y - bird.r < 0) return this.lose();
            for (var j=0;j<pipes.length;j++) {
                var p = pipes[j];
                if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W) {
                    if (bird.y - bird.r < p.gapY || bird.y + bird.r > p.gapY + PIPE_GAP) return this.lose();
                }
            }
            this.draw();
        };

        this.lose = function () {
            gameOver = true;
            this.stopLoop();
            overlay.html('Гра закінчена<br>Рахунок: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.draw = function () {
            // небо
            var grad = ctx.createLinearGradient(0,0,0,H);
            grad.addColorStop(0,'#4fc3f7'); grad.addColorStop(1,'#81d4fa');
            ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
            // труби
            ctx.fillStyle = '#43a047';
            for (var i=0;i<pipes.length;i++) {
                var p = pipes[i];
                ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
                ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, H - p.gapY - PIPE_GAP);
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(p.x-3, p.gapY-15, PIPE_W+6, 15);
                ctx.fillRect(p.x-3, p.gapY+PIPE_GAP, PIPE_W+6, 15);
                ctx.fillStyle = '#43a047';
            }
            // земля
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(0, H-20, W, 20);
            // птах
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(bird.x+5, bird.y-3, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#ff5722';
            ctx.beginPath();
            ctx.moveTo(bird.x+10, bird.y);
            ctx.lineTo(bird.x+18, bird.y-2);
            ctx.lineTo(bird.x+18, bird.y+2);
            ctx.closePath();
            ctx.fill();
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){s.flap();},
                right: function(){s.flap();},
                up:    function(){s.flap();},
                down:  function(){s.flap();},
                enter: function(){s.flap();}
            });
            // Тач: будь-який тап або свайп = взмах
            this._detachTouch = attachTouch(root, {
                onTap: function(){ s.flap(); },
                onSwipe: function(){ s.flap(); }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                         DOODLE JUMP
    // ============================================================
    GAMES.doodle = function (root) {
        var canvas, ctx, overlay;
        var W, H;
        var player, platforms, score, height, timer;
        var paused=false, gameOver=false, destroyed=false;
        var keys = {left:false, right:false};
        var GRAVITY = 0.4, JUMP = -12, MOVE_SPEED = 5;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('doodle') + '</b></span>' +
                    '<span class="g-hint">Стрілки - рух</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset робиться з start() коли DOM готовий
            // cevamnelampaplagin translation
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            W = Math.floor(Math.min(rect.width, rect.height * 0.8));
            H = Math.floor(rect.height);
            if (W < 200) W = 400;
            if (H < 300) H = 600;
            canvas.width = W; canvas.height = H;
        };

        this.reset = function () {
            this.resize();
            player = { x: W/2, y: H-100, vx:0, vy:0, w:30, h:30 };
            platforms = [];
            // стартова платформа під гравцем
            platforms.push({ x: W/2 - 40, y: H - 60, w: 80 });
            // випадкові платформи
            for (var i=0;i<10;i++) {
                platforms.push({
                    x: Math.random()*(W-80),
                    y: H - 60 - (i+1)*60,
                    w: 80
                });
            }
            score = 0; height = 0;
            paused=false; gameOver=false;
            root.find('.g-score').text(0);
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, 1000/60);};
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.tick = function () {
            if (paused||gameOver||destroyed) return;

            // рух по горизонталі
            if (keys.left)  player.vx = -MOVE_SPEED;
            else if (keys.right) player.vx = MOVE_SPEED;
            else player.vx *= 0.8;

            player.x += player.vx;
            if (player.x < -player.w) player.x = W;
            if (player.x > W) player.x = -player.w;

            // гравітація
            player.vy += GRAVITY;
            player.y += player.vy;

            // прокручування екрана вгору коли гравець піднявся
            if (player.y < H/2 && player.vy < 0) {
                var dy = H/2 - player.y;
                player.y = H/2;
                height += dy;
                for (var i=0;i<platforms.length;i++) platforms[i].y += dy;
                score = Math.floor(height/10);
                root.find('.g-score').text(score);
                setRecord('doodle', score);
                root.find('.g-record').text(getRecord('doodle'));
            }

            // видалити платформи що внизу і згенерувати нові
            for (var j=platforms.length-1;j>=0;j--) {
                if (platforms[j].y > H) platforms.splice(j,1);
            }
            while (platforms.length < 10) {
                var topY = Math.min.apply(null, platforms.map(function(p){return p.y;}));
                platforms.push({
                    x: Math.random()*(W-80),
                    y: topY - 60 - Math.random()*30,
                    w: 80
                });
            }

            // приземлення на платформи (тільки під час падіння)
            if (player.vy > 0) {
                for (var k=0;k<platforms.length;k++) {
                    var p = platforms[k];
                    if (player.x + player.w > p.x && player.x < p.x + p.w &&
                        player.y + player.h > p.y && player.y + player.h < p.y + 12) {
                        player.vy = JUMP;
                    }
                }
            }

            // падіння за низ екрана = смерть
            if (player.y > H) return this.lose();

            this.draw();
        };

        this.lose = function () {
            gameOver = true;
            this.stopLoop();
            overlay.html('Гра закінчена<br>Счёт: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.draw = function () {
            ctx.fillStyle = '#e1f5fe'; ctx.fillRect(0,0,W,H);
            // платформи
            ctx.fillStyle = '#4caf50';
            for (var i=0;i<platforms.length;i++) {
                ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].w, 10);
            }
            // персонаж - простий кругляш з очима
            ctx.fillStyle = '#ff6f00';
            ctx.fillRect(player.x, player.y, player.w, player.h);
            ctx.fillStyle = '#fff';
            ctx.fillRect(player.x+5, player.y+8, 6, 6);
            ctx.fillRect(player.x+19, player.y+8, 6, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(player.x+7, player.y+10, 3, 3);
            ctx.fillRect(player.x+21, player.y+10, 3, 3);
        };

        this.start = function () {
            var s = this;
            // на пульті немає keyup/keydown у звичному вигляді - робимо «поштовх» після натискання
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){player.vx = -MOVE_SPEED * 2;},
                right: function(){player.vx = MOVE_SPEED * 2;},
                enter: function(){
                    if (gameOver) s.reset();
                }
            });
            // Тач: утримання у лівій/правій половині = рух туда
            // відпустити = стоп (через keys.left/right)
            this._detachTouch = attachTouch(root, {
                onTouchStart: function(x, y){
                    if (gameOver) { s.reset(); return; }
                    var rect = root[0].getBoundingClientRect();
                    if (x < rect.width / 2) { keys.left = true; keys.right = false; }
                    else { keys.right = true; keys.left = false; }
                },
                onDrag: function(x, y){
                    var rect = root[0].getBoundingClientRect();
                    if (x < rect.width / 2) { keys.left = true; keys.right = false; }
                    else { keys.right = true; keys.left = false; }
                },
                onTouchEnd: function(){
                    keys.left = false; keys.right = false;
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                          АРКАНОЇД
    // ============================================================
    GAMES.arkanoid = function (root) {
        var canvas, ctx, overlay;
        var W, H;
        var paddle, ball, blocks, lives, score, level, timer;
        var paused=false, gameOver=false, destroyed=false, ballLaunched=false;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Життя: <b class="g-lives">3</b></span>' +
                    '<span>Рівень: <b class="g-level">1</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('arkanoid') + '</b></span>' +
                    '<span class="g-hint">Стрілки - платформа, OK — запуск мяча</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            // reset() вызветься в start() — до цього моменту DOM готовий і getBoundingClientRect дасть реальні розміри
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var newW = Math.floor(rect.width);
            var newH = Math.floor(rect.height);
            if (newW < 300) newW = 600;
            if (newH < 300) newH = 500;
            // якщо розміри реально змінилися і гра вже ініціалізована - перерахуємо геометрію
            var prevW = W, prevH = H;
            W = newW; H = newH;
            canvas.width = W; canvas.height = H;
            if (paddle && (prevW !== W || prevH !== H)) {
                // перерахуємо розміри платформи та м'яча
                var pw = Math.max(80, Math.floor(W / 7));
                var ph = Math.max(12, Math.floor(pw / 8));
                var pr = Math.max(6, Math.floor(W / 80));
                paddle.w = pw;
                paddle.h = ph;
                paddle.y = H - ph - 18;
                if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
                if (paddle.x < 0) paddle.x = 0;
                paddle.speed = Math.max(8, Math.floor(W/80));
                ball.r = pr;
                if (!ballLaunched) {
                    ball.x = paddle.x + paddle.w/2;
                    ball.y = paddle.y - pr - 2;
                }
                // блоки теж перезберемо, якщо були
                if (blocks && blocks.length) this.buildLevel();
            }
        };

        this.reset = function () {
            this.resize();
            // адаптивний розмір платформи та м'яча
            var pw = Math.max(80, Math.floor(W / 7));
            var ph = Math.max(12, Math.floor(pw / 8));
            var pr = Math.max(6, Math.floor(W / 80));
            paddle = { x: W/2 - pw/2, y: H - ph - 18, w: pw, h: ph, speed: Math.max(8, Math.floor(W/80)) };
            ball = { x: W/2, y: paddle.y - pr - 2, vx: 0, vy: 0, r: pr };
            ballLaunched = false;
            blocks = [];
            score = 0; lives = 3; level = 1;
            this.buildLevel();
            paused=false; gameOver=false;
            root.find('.g-score').text(0);
            root.find('.g-lives').text(3);
            root.find('.g-level').text(1);
            this.draw();
            this.startLoop();
            overlay.html('Нажміть OK для запуска').addClass('show');
        };

        this.buildLevel = function () {
            blocks = [];
            var cols = 10, rows = Math.min(3 + level, 8);
            var bw = (W - 40) / cols, bh = Math.max(20, Math.floor(H / 25));
            var colors = ['#f44336','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0','#00bcd4','#e91e63'];
            for (var y=0;y<rows;y++) for (var x=0;x<cols;x++) {
                blocks.push({
                    x: 20 + x*bw + 2,
                    y: 60 + y*bh + 2,
                    w: bw - 4,
                    h: bh - 4,
                    c: colors[y % colors.length]
                });
            }
        };

        this.launchBall = function () {
            ballLaunched = true;
            // швидкість м'яча залежить від розміру поля (повільніше на великих екранах)
            var sp = Math.max(3, Math.floor(W / 200));
            ball.vx = (Math.random() < 0.5 ? -1 : 1) * sp;
            ball.vy = -sp - 1;
            overlay.removeClass('show').text('');
        };

        this.startLoop = function(){this.stopLoop(); var s=this; timer=setInterval(function(){s.tick();}, 1000/60);};
        this.stopLoop = function(){if(timer){clearInterval(timer);timer=null;}};

        this.tick = function () {
            if (paused||gameOver||destroyed) return;
            if (!ballLaunched) {
                ball.x = paddle.x + paddle.w/2;
                ball.y = paddle.y - ball.r - 2;
                this.draw();
                return;
            }

            ball.x += ball.vx;
            ball.y += ball.vy;

            // стіни
            if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx *= -1; }
            if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx *= -1; }
            if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy *= -1; }

            // платформа
            if (ball.y + ball.r > paddle.y && ball.y - ball.r < paddle.y + paddle.h &&
                ball.x > paddle.x && ball.x < paddle.x + paddle.w && ball.vy > 0) {
                ball.vy *= -1;
                ball.y = paddle.y - ball.r - 1;
                // відскок залежить від точки удару
                var hit = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
                ball.vx = hit * 6;
            }

            // блоки
            for (var i=blocks.length-1;i>=0;i--) {
                var b = blocks[i];
                if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
                    ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
                    blocks.splice(i,1);
                    score += 10 * level;
                    root.find('.g-score').text(score);
                    setRecord('arkanoid', score);
                    root.find('.g-record').text(getRecord('arkanoid'));
                    // визначаємо бік удару
                    var prevX = ball.x - ball.vx, prevY = ball.y - ball.vy;
                    if (prevX + ball.r <= b.x || prevX - ball.r >= b.x + b.w) ball.vx *= -1;
                    else ball.vy *= -1;
                    break;
                }
            }

            // втрата життя
            if (ball.y - ball.r > H) {
                lives--;
                root.find('.g-lives').text(lives);
                if (lives <= 0) return this.lose();
                ballLaunched = false;
                ball.vx = 0; ball.vy = 0;
                overlay.html('Життів залишилося: ' + lives + '<br><span class="g-sub">OK — продовжити</span>').addClass('show');
            }

            // перемога на рівні
            if (blocks.length === 0) {
                level++;
                root.find('.g-level').text(level);
                ballLaunched = false;
                ball.vx = 0; ball.vy = 0;
                this.buildLevel();
                overlay.html('Рівень ' + level + '!<br><span class="g-sub">OK — продовжити</span>').addClass('show');
            }

            this.draw();
        };

        this.lose = function () {
            gameOver = true;
            this.stopLoop();
            overlay.html('Гра закінчена<br>Счёт: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.draw = function () {
            ctx.fillStyle = '#0d1b2a'; ctx.fillRect(0,0,W,H);
            // блоки
            for (var i=0;i<blocks.length;i++) {
                var b = blocks[i];
                ctx.fillStyle = b.c;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.strokeRect(b.x, b.y, b.w, b.h);
            }
            // платформа
            ctx.fillStyle = '#42a5f5';
            ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
            // мяч
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
            ctx.fill();
        };

        this.movePaddle = function (dir) {
            paddle.x += dir * paddle.speed * 2;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
            if (!ballLaunched) ball.x = paddle.x + paddle.w/2;
            this.draw();
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(!gameOver) s.movePaddle(-1);},
                right: function(){if(!gameOver) s.movePaddle(1);},
                enter: function(){
                    if (gameOver) { s.reset(); return; }
                    if (!ballLaunched) { s.launchBall(); return; }
                    // під час гри OK нічого не робить
                }
            });
            // Тач: палець переміщає платформу під собою (drag); тап без drag = запуск мяча
            var didDrag = false;
            this._detachTouch = attachTouch(root, {
                onTouchStart: function(){ didDrag = false; },
                onDrag: function(x, y){
                    if (gameOver) return;
                    didDrag = true;
                    var canvasRect = canvas.getBoundingClientRect();
                    var rootRect = root[0].getBoundingClientRect();
                    var canvasX = x - (canvasRect.left - rootRect.left);
                    paddle.x = canvasX - paddle.w/2;
                    if (paddle.x < 0) paddle.x = 0;
                    if (paddle.x + paddle.w > W) paddle.x = W - paddle.w;
                    if (!ballLaunched) ball.x = paddle.x + paddle.w/2;
                    s.draw();
                },
                onTap: function(){
                    if (gameOver) { s.reset(); return; }
                    if (!ballLaunched) { s.launchBall(); return; }
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            // reset робиться із затримкою — потрібно дочекатися, щоб DOM-елемент отримав реальні розміри
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                          ТАНЧИКИ
    // ============================================================
    // Карта 13x13 клітин. Кожна клітка – тайл стіни/порожньо.
    // Гравець стартує зліва від штабу внизу. Штаб - 1 клітинка в координатах (6,12).
    // Танк займає 1 клітинку, рухається плавно пікселями.
    GAMES.tanks = function (root) {
        var canvas, ctx, overlay;
        var COLS = 13, ROWS = 13, TILE;
        // тайли: '.' пусто, 'B' цегла, 'S' сталь, 'W' вода, 'T' кущ, 'E' штаб
        var MAPS = [
            [
                ".............",
                ".BB.BB.BB.BB.",
                ".BB.BB.BB.BB.",
                ".BB.BBBBB.BB.",
                ".............",
                ".SS.....SS...",
                ".SS.WWW.SS...",
                ".....WWW.....",
                ".TTT.....TTT.",
                ".BB.BBBBB.BB.",
                ".BB.BB.BB.BB.",
                ".....B.B.....",
                ".....BEB....."
            ],
            [
                ".B.B.B.B.B.B.",
                ".B.B.B.B.B.B.",
                ".............",
                "SS.BB.BBB.SS.",
                "SS...........",
                "....WW.WW....",
                ".B..WW.WW..B.",
                ".B...........",
                ".TTTT...TTTT.",
                "..BB.BBB.BB..",
                ".............",
                ".....B.B.....",
                ".....BEB....."
            ]
        ];

        var field;            // масив [y][x] символ тайла
        var player;           // {px, py, dir, alive, cooldown}
        var enemies;          // [{px, py, dir, type, hp, alive, moveTimer, shootTimer}]
        var bullets;          // [{px, py, dx, dy, fromPlayer}]
        var bonus;            // {type, gx, gy, blink} | null
        var pressedDir;       // 'up'|'down'|'left'|'right'|null - поточний напрямок руху
        var enemiesLeft, score, lives, level;
        var freezeTimer, shieldTimer, fortifyTimer;
        var spawnTimer;
        var timer, paused, gameOver, won, destroyed;

        var DIRS = {
            up:    { dx:0,  dy:-1 },
            down:  { dx:0,  dy:1  },
            left:  { dx:-1, dy:0  },
            right: { dx:1,  dy:0  }
        };

        var ENEMY_SPAWNS = [{gx:0,gy:0}, {gx:6,gy:0}, {gx:12,gy:0}];
        var PLAYER_SPAWN = { gx:4, gy:12 };  // зліва від штабу
        var EAGLE_POS    = { gx:6, gy:12 };

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Життя: <b class="g-lives">3</b></span>' +
                    '<span>Рівень: <b class="g-level">1</b></span>' +
                    '<span>Ворогів: <b class="g-enemies">0</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('tanks') + '</b></span>' +
                    '<span class="g-hint">Стрілки - їде/поворот, та сама стрілка - стоп, OK — постріл</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            score = 0; lives = 3; level = 1;
            this.reset();
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var maxH = Math.min(rect.height, window.innerHeight - 200);
            var maxW = Math.min(rect.width, window.innerWidth - 100);
            TILE = Math.floor(Math.min(maxW/COLS, maxH/ROWS));
            if (TILE < 24) TILE = 24;
            canvas.width = TILE * COLS;
            canvas.height = TILE * ROWS;
        };

        this.reset = function () {
            this.loadMap((level - 1) % MAPS.length);
            player = {
                px: PLAYER_SPAWN.gx,
                py: PLAYER_SPAWN.gy,
                dir: 'up',
                alive: true,
                cooldown: 0
            };
            enemies = [];
            bullets = [];
            bonus = null;
            pressedDir = null;
            enemiesLeft = 10 + (level - 1) * 4;
            spawnTimer = 0;
            freezeTimer = 0;
            shieldTimer = 60;       // ~3 сек безсмертя на початку
            fortifyTimer = 0;
            paused = false;
            gameOver = false;
            won = false;
            destroyed = false;
            this.updateUI();
            this.resize();
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.loadMap = function (idx) {
            var map = MAPS[idx];
            field = [];
            for (var y = 0; y < ROWS; y++) {
                var row = [];
                for (var x = 0; x < COLS; x++) {
                    row.push(map[y].charAt(x));
                }
                field.push(row);
            }
        };

        this.updateUI = function () {
            root.find('.g-score').text(score);
            root.find('.g-lives').text(lives);
            root.find('.g-level').text(level);
            root.find('.g-enemies').text(enemiesLeft);
            root.find('.g-record').text(getRecord('tanks'));
        };

        // Чи може тайл бути проходимим для танка
        this.tileBlocks = function (gx, gy) {
            if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return true;
            var c = field[gy][gx];
            return c === 'B' || c === 'S' || c === 'W' || c === 'E';
        };

        // Чи можна поставити танк (1x1) у позицію (px, py) в координатах клітин (можуть бути дробові)
        this.canTankBeAt = function (px, py, ignoreTank) {
            // Перевіряємо 4 кута танка
            var corners = [
                { x: px,           y: py           },
                { x: px + 0.99,    y: py           },
                { x: px,           y: py + 0.99    },
                { x: px + 0.99,    y: py + 0.99    }
            ];
            for (var i = 0; i < corners.length; i++) {
                var gx = Math.floor(corners[i].x);
                var gy = Math.floor(corners[i].y);
                if (this.tileBlocks(gx, gy)) return false;
            }
            // інші танки
            var all = enemies.concat(player.alive ? [player] : []);
            for (var j = 0; j < all.length; j++) {
                var t = all[j];
                if (t === ignoreTank) continue;
                if (px + 1 > t.px && px < t.px + 1 && py + 1 > t.py && py < t.py + 1) return false;
            }
            return true;
        };

        // Рухаємо танк на speed клітини в напрямку dir.
        // Танк рухається тільки якщо вирівняний сіткою в перпендикулярній осі (для зручності повороту).
        this.moveTank = function (tank, dirName, speed) {
            var d = DIRS[dirName];
            // Поворот вільний - напрямок змінюється відразу
            tank.dir = dirName;

            // Авто-вирівнювання сіткою в перпендикулярній осі, якщо близько
            if (d.dx !== 0) {
                var ny = Math.round(tank.py);
                if (Math.abs(tank.py - ny) < speed) tank.py = ny;
            } else {
                var nx = Math.round(tank.px);
                if (Math.abs(tank.px - nx) < speed) tank.px = nx;
            }

            var newPx = tank.px + d.dx * speed;
            var newPy = tank.py + d.dy * speed;
            if (this.canTankBeAt(newPx, newPy, tank)) {
                tank.px = newPx;
                tank.py = newPy;
                return true;
            }
            return false;
        };

        this.fire = function (tank) {
            if (tank.cooldown > 0) return;
            // у кожного танка одночасно може літати лише один свій снаряд
            for (var i = 0; i < bullets.length; i++) {
                if (tank === player && bullets[i].fromPlayer) return;
                if (tank !== player && bullets[i].owner === tank) return;
            }
            var d = DIRS[tank.dir];
            // снаряд вилітає з центру передньої грані танка
            var bx = tank.px + 0.5 + d.dx * 0.5;
            var by = tank.py + 0.5 + d.dy * 0.5;
            bullets.push({
                px: bx, py: by,
                dx: d.dx, dy: d.dy,
                fromPlayer: tank === player,
                owner: tank
            });
            tank.cooldown = 12;
        };

        this.spawnEnemy = function () {
            if (enemiesLeft <= 0 || enemies.length >= 4) return;
            var free = ENEMY_SPAWNS.filter(function (sp) {
                return this.canTankBeAt(sp.gx, sp.gy);
            }, this);
            if (!free.length) return;
            var sp = free[Math.floor(Math.random() * free.length)];
            var r = Math.random();
            var type = 1;
            if (r > 0.85) type = 4;
            else if (r > 0.65) type = 3;
            else if (r > 0.4) type = 2;
            enemies.push({
                px: sp.gx, py: sp.gy,
                dir: 'down',
                type: type,
                hp: type === 3 ? 4 : 1,
                alive: true,
                moveTimer: 0,
                shootTimer: 30 + Math.floor(Math.random() * 60),
                spawnFlash: 30
            });
            enemiesLeft--;
            this.updateUI();
        };

        this.tick = function () {
            if (paused || gameOver || won || destroyed) return;

            if (freezeTimer > 0) freezeTimer--;
            if (shieldTimer > 0) shieldTimer--;
            if (fortifyTimer > 0) {
                fortifyTimer--;
                if (fortifyTimer === 0) this.fortifyEagle(false);
            }

            // спавн ворогів
            spawnTimer--;
            if (spawnTimer <= 0) {
                this.spawnEnemy();
                spawnTimer = 120;
            }

            // гравець
            if (player.alive) {
                if (player.cooldown > 0) player.cooldown--;
                if (pressedDir) this.moveTank(player, pressedDir, 0.15);
                this.checkBonus();
            }

            // вороги
            if (freezeTimer === 0) {
                for (var i = 0; i < enemies.length; i++) {
                    var e = enemies[i];
                    if (e.spawnFlash > 0) { e.spawnFlash--; continue; }
                    e.moveTimer--;
                    if (e.moveTimer <= 0) {
                        var dirs = ['up','down','left','right'];
                        if (Math.random() < 0.2 || !this.moveTank(e, e.dir, 0.1)) {
                            // намагаємося змінити напрямок, іноді у бік штабу чи гравця
                            if (Math.random() < 0.5) {
                                var tx = EAGLE_POS.gx, ty = EAGLE_POS.gy;
                                if (Math.random() < 0.5 && player.alive) { tx = player.px; ty = player.py; }
                                if (Math.abs(e.px - tx) > Math.abs(e.py - ty)) {
                                    dirs = [e.px > tx ? 'left' : 'right', e.py > ty ? 'up' : 'down'];
                                } else {
                                    dirs = [e.py > ty ? 'up' : 'down', e.px > tx ? 'left' : 'right'];
                                }
                            } else {
                                dirs.sort(function(){return Math.random()-0.5;});
                            }
                            for (var di = 0; di < dirs.length; di++) {
                                if (this.moveTank(e, dirs[di], 0.1)) break;
                            }
                        }
                        e.moveTimer = 0;
                    }
                    e.shootTimer--;
                    if (e.shootTimer <= 0) {
                        this.fire(e);
                        e.shootTimer = 50 + Math.floor(Math.random() * 80);
                    }
                }
            }

            // снаряди (рухаємо в 2 кроки по 0.3 для надійності колізій)
            for (var bi = bullets.length - 1; bi >= 0; bi--) {
                var b = bullets[bi];
                var hit = false;
                for (var step = 0; step < 2; step++) {
                    b.px += b.dx * 0.3;
                    b.py += b.dy * 0.3;
                    if (this.bulletCheck(b, bi)) { hit = true; break; }
                }
                if (hit) continue;
            }

            this.draw();

            // кінець рівня
            if (enemiesLeft <= 0 && enemies.length === 0) {
                won = true;
                this.stopLoop();
                level++;
                setRecord('tanks', score);
                this.updateUI();
                overlay.html('Рівень пройдено!<br>Счёт: ' + score + '<br><span class="g-sub">OK — наступний</span>').addClass('show');
            }
        };

        this.bulletCheck = function (b, bi) {
            // вийшов за кордони
            if (b.px < 0 || b.py < 0 || b.px >= COLS || b.py >= ROWS) {
                bullets.splice(bi, 1);
                return true;
            }
            var gx = Math.floor(b.px), gy = Math.floor(b.py);
            var c = field[gy][gx];
            if (c === 'E') {
                bullets.splice(bi, 1);
                this.endGame(false);
                return true;
            }
            if (c === 'B') {
                field[gy][gx] = '.';
                bullets.splice(bi, 1);
                return true;
            }
            if (c === 'S') {
                bullets.splice(bi, 1);
                return true;
            }
            // гравець
            if (player.alive && !b.fromPlayer) {
                if (b.px >= player.px && b.px < player.px + 1 &&
                    b.py >= player.py && b.py < player.py + 1) {
                    bullets.splice(bi, 1);
                    if (shieldTimer > 0) return true;
                    this.playerHit();
                    return true;
                }
            }
            // вороги
            if (b.fromPlayer) {
                for (var i = 0; i < enemies.length; i++) {
                    var e = enemies[i];
                    if (b.px >= e.px && b.px < e.px + 1 &&
                        b.py >= e.py && b.py < e.py + 1) {
                        bullets.splice(bi, 1);
                        e.hp--;
                        if (e.hp <= 0) {
                            if (e.type === 4) this.spawnBonus();
                            score += [0, 100, 200, 300, 400][e.type] || 100;
                            enemies.splice(i, 1);
                            this.updateUI();
                            setRecord('tanks', score);
                        }
                        return true;
                    }
                }
            }
            // снаряд об снаряд
            for (var bj = bi - 1; bj >= 0; bj--) {
                var b2 = bullets[bj];
                if (Math.abs(b.px - b2.px) < 0.5 && Math.abs(b.py - b2.py) < 0.5) {
                    bullets.splice(bi, 1);
                    bullets.splice(bj, 1);
                    return true;
                }
            }
            return false;
        };

        this.playerHit = function () {
            lives--;
            this.updateUI();
            if (lives <= 0) { this.endGame(false); return; }
            player.px = PLAYER_SPAWN.gx;
            player.py = PLAYER_SPAWN.gy;
            player.dir = 'up';
            shieldTimer = 60;
            pressedDir = null;
        };

        this.endGame = function (victory) {
            gameOver = true;
            this.stopLoop();
            setRecord('tanks', score);
            overlay.html((victory ? 'Перемога!' : 'Гра закінчена') + '<br>Рахунок: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.spawnBonus = function () {
            var types = ['star','helmet','shovel','grenade','clock','tank'];
            var t = types[Math.floor(Math.random() * types.length)];
            for (var attempt = 0; attempt < 50; attempt++) {
                var x = Math.floor(Math.random() * COLS);
                var y = Math.floor(Math.random() * ROWS);
                var c = field[y][x];
                if (c === '.' || c === 'T') {
                    bonus = { type: t, gx: x, gy: y, timer: 600 };
                    return;
                }
            }
        };

        this.checkBonus = function () {
            if (!bonus || !player.alive) return;
            if (player.px + 1 > bonus.gx && player.px < bonus.gx + 1 &&
                player.py + 1 > bonus.gy && player.py < bonus.gy + 1) {
                this.applyBonus(bonus.type);
                bonus = null;
            }
        };

        this.applyBonus = function (type) {
            score += 500;
            if (type === 'star')    shieldTimer = 60;
            else if (type === 'helmet')  shieldTimer = 600;
            else if (type === 'shovel')  { this.fortifyEagle(true); fortifyTimer = 600; }
            else if (type === 'grenade') {
                for (var i = 0; i < enemies.length; i++) score += 100;
                enemies = [];
            }
            else if (type === 'clock')   freezeTimer = 600;
            else if (type === 'tank')    lives++;
            this.updateUI();
            setRecord('tanks', score);
        };

        this.fortifyEagle = function (steel) {
            // стіни навколо штабу: (5,11),(6,11),(7,11),(5,12),(7,12)
            var walls = [{x:5,y:11},{x:6,y:11},{x:7,y:11},{x:5,y:12},{x:7,y:12}];
            for (var i = 0; i < walls.length; i++) {
                var w = walls[i];
                if (steel) {
                    if (field[w.y][w.x] !== 'E') field[w.y][w.x] = 'S';
                } else {
                    if (field[w.y][w.x] === 'S') field[w.y][w.x] = 'B';
                }
            }
        };

        // ---- Малювання ----
        this.draw = function () {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // тайли (крім кущів)
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                var c = field[y][x];
                if (c === 'B') this.drawBrick(x, y);
                else if (c === 'S') this.drawSteel(x, y);
                else if (c === 'W') this.drawWater(x, y);
                else if (c === 'E') this.drawEagle(x, y);
            }

            // бонус
            if (bonus) {
                bonus.timer--;
                if (bonus.timer <= 0) bonus = null;
                else if (Math.floor(bonus.timer / 8) % 2 === 0) this.drawBonus(bonus);
            }

            // гравець
            if (player.alive) {
                this.drawTank(player.px, player.py, player.dir, '#ffd54f', '#f57c00');
                if (shieldTimer > 0 && Math.floor(shieldTimer / 4) % 2 === 0) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(player.px * TILE - 1, player.py * TILE - 1, TILE + 2, TILE + 2);
                }
            }

            // вороги
            var ECOL = {
                1: ['#bdbdbd', '#616161'],
                2: ['#ff8a65', '#bf360c'],
                3: ['#90a4ae', '#263238'],
                4: ['#fff59d', '#f57f17']
            };
            for (var ei = 0; ei < enemies.length; ei++) {
                var e = enemies[ei];
                if (e.spawnFlash > 0) {
                    // мерехтіння при появі
                    if (Math.floor(e.spawnFlash / 4) % 2 === 0) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(e.px * TILE + 4, e.py * TILE + 4, TILE - 8, TILE - 8);
                    }
                    continue;
                }
                var col = ECOL[e.type] || ECOL[1];
                if (e.type === 4 && Math.floor(Date.now() / 200) % 2 === 0) col = ['#fff', '#f00'];
                this.drawTank(e.px, e.py, e.dir, col[0], col[1]);
            }

            // снаряди
            ctx.fillStyle = '#fff';
            for (var bi = 0; bi < bullets.length; bi++) {
                var b = bullets[bi];
                var s = TILE * 0.2;
                ctx.fillRect(b.px * TILE - s/2, b.py * TILE - s/2, s, s);
            }

            // кущі зверху (танки ховаються)
            for (var y2 = 0; y2 < ROWS; y2++) for (var x2 = 0; x2 < COLS; x2++) {
                if (field[y2][x2] === 'T') this.drawBush(x2, y2);
            }
        };

        this.drawBrick = function (x, y) {
            var px = x * TILE, py = y * TILE;
            ctx.fillStyle = '#8d4e2f';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#5d2d15';
            ctx.fillRect(px, py + TILE/2 - 1, TILE, 1);
            ctx.fillRect(px + TILE/2 - 1, py, 1, TILE/2);
            ctx.fillRect(px + TILE/4, py + TILE/2, 1, TILE/2);
            ctx.fillRect(px + 3*TILE/4, py + TILE/2, 1, TILE/2);
        };

        this.drawSteel = function (x, y) {
            var px = x * TILE, py = y * TILE;
            ctx.fillStyle = '#9e9e9e';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
            ctx.fillStyle = '#616161';
            ctx.fillRect(px + 3, py + 3, 3, 3);
        };

        this.drawWater = function (x, y) {
            var t = Math.floor(Date.now() / 300) % 2;
            var px = x * TILE, py = y * TILE;
            ctx.fillStyle = t ? '#1976d2' : '#1565c0';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#64b5f6';
            ctx.fillRect(px + 2, py + TILE/3, TILE/3, 1);
            ctx.fillRect(px + TILE/2, py + 2*TILE/3, TILE/3, 1);
        };

        this.drawBush = function (x, y) {
            var px = x * TILE, py = y * TILE;
            ctx.fillStyle = '#1b5e20';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#2e7d32';
            for (var i = 0; i < 4; i++) {
                var dx = (i % 2) * TILE/2 + 4;
                var dy = Math.floor(i / 2) * TILE/2 + 4;
                ctx.fillRect(px + dx, py + dy, TILE/2 - 6, TILE/2 - 6);
            }
        };

        this.drawEagle = function (x, y) {
            var px = x * TILE, py = y * TILE;
            ctx.fillStyle = '#bdbdbd';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#212121';
            ctx.fillRect(px + TILE/4, py + TILE/4, TILE/2, TILE/2);
            ctx.fillStyle = '#fbc02d';
            ctx.fillRect(px + TILE/2 - 2, py + TILE/2 - 4, 4, 6);
        };

        this.drawTank = function (px, py, dir, light, dark) {
            var x = px * TILE, y = py * TILE;
            var size = TILE;
            ctx.fillStyle = dark;
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = light;
            // Гусениці та ствол у напрямку
            if (dir === 'up' || dir === 'down') {
                ctx.fillRect(x + 2, y + 2, 4, size - 4);
                ctx.fillRect(x + size - 6, y + 2, 4, size - 4);
                ctx.fillStyle = dark;
                ctx.fillRect(x + 7, y + 4, size - 14, size - 8);
                ctx.fillStyle = light;
                ctx.fillRect(x + size/3, y + size/3, size/3, size/3);
                ctx.fillStyle = '#fff';
                if (dir === 'up')   ctx.fillRect(x + size/2 - 1, y, 2, size/2);
                else                ctx.fillRect(x + size/2 - 1, y + size/2, 2, size/2);
            } else {
                ctx.fillRect(x + 2, y + 2, size - 4, 4);
                ctx.fillRect(x + 2, y + size - 6, size - 4, 4);
                ctx.fillStyle = dark;
                ctx.fillRect(x + 4, y + 7, size - 8, size - 14);
                ctx.fillStyle = light;
                ctx.fillRect(x + size/3, y + size/3, size/3, size/3);
                ctx.fillStyle = '#fff';
                if (dir === 'left') ctx.fillRect(x, y + size/2 - 1, size/2, 2);
                else                ctx.fillRect(x + size/2, y + size/2 - 1, size/2, 2);
            }
        };

        this.drawBonus = function (b) {
            var px = b.gx * TILE, py = b.gy * TILE;
            ctx.fillStyle = '#fff';
            ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
            ctx.fillStyle = '#000';
            ctx.font = Math.floor(TILE * 0.7) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var sym = { star:'★', helmet:'⛑', shovel:'⛏', grenade:'B', clock:'⏱', tank:'+' };
            ctx.fillText(sym[b.type] || '?', px + TILE/2, py + TILE/2);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
        };

        this.startLoop = function () {
            this.stopLoop();
            var s = this;
            timer = setInterval(function () { s.tick(); }, 50);
        };
        this.stopLoop = function () {
            if (timer) { clearInterval(timer); timer = null; }
        };

        // ---- Керування ----
        // На пульті Лампи немає події "Клавіша відпущена".
        // Тому: натискання стрілки = "їхати у цей бік".
        // Повторне натискання тієї ж стрілки = "стоп".
        // Натискання іншої стрілки = зміна напрямку.
        this.start = function () {
            var s = this;
            function setDir(d) {
                if (gameOver || won || paused) return;
                if (pressedDir === d) pressedDir = null;
                else pressedDir = d;
                // миттєвий поворот без руху, щоб було видно, що напрямок змінився
                if (player.alive) player.dir = d;
            }
            setupController({
                toggle: function () {
                    Lampa.Controller.collectionSet(root);
                    Lampa.Controller.collectionFocus(false, root);
                },
                left:  function () { setDir('left'); },
                right: function () { setDir('right'); },
                up:    function () { setDir('up'); },
                down:  function () { setDir('down'); },
                enter: function () {
                    if (gameOver) { score = 0; lives = 3; level = 1; s.reset(); return; }
                    if (won)      { s.reset(); return; }
                    if (paused)   { paused = false; overlay.removeClass('show').text(''); return; }
                    s.fire(player);
                },
                back: function () {
                    Lampa.Activity.backward();
                }
            });
            // Тач: свайп = рух у цей бік, тап = постріл
            // Свайп у той же бік що поточний рух = стоп (через setDir)
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (gameOver) { score = 0; lives = 3; level = 1; s.reset(); return; }
                    if (won) { s.reset(); return; }
                    setDir(dir);
                },
                onTap: function(){
                    if (gameOver) { score = 0; lives = 3; level = 1; s.reset(); return; }
                    if (won)      { s.reset(); return; }
                    if (paused)   { paused = false; overlay.removeClass('show').text(''); return; }
                    s.fire(player);
                }
            });
            this._r = function () { s.resize(); s.draw(); };
            $(window).on('resize', this._r);
            setTimeout(function () { if (!destroyed) { s.resize(); s.draw(); } }, 50);
        };

        this.pause = function () {};
        this.destroy = function () {
            destroyed = true;
            this.stopLoop();
            if (this._detachTouch) this._detachTouch();
            if (this._r) $(window).off('resize', this._r);
        };
    };

    // ============================================================
    //                          MEMORY
    // ============================================================
    GAMES.memory = function (root) {
        var grid;        // масив карток {value, flipped, matched}
        var COLS = 4, ROWS = 4;
        var first = null; // індекс першої відкритої
        var second = null;
        var lock = false;
        var moves, matches, startTime, timerId;
        var cursor = 0;
        var info, overlay;
        var gameOver = false;

        // 16 эмодзі / символів для пар
        var SYMBOLS = ['🍎','🍌','🍇','🍒','🥝','🍓','🥑','🍑'];

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Ходів: <b class="g-moves">0</b></span>' +
                    '<span>Час: <b class="g-time">0</b></span>' +
                    '<span>Знайдено: <b class="g-matches">0</b>/8</span>' +
                    '<span>Рекорд: <b class="g-record">' + (getRecord('memory')||'-') + '</b></span>' +
                    '<span class="g-hint">Стрілки/тап - вибір картки</span>' +
                  '</div>' +
                  '<div class="memory-board"></div>' +
                  '<div class="game-overlay"></div>' +
                '</div>'
            );
            info = root.find('.game-info');
            overlay = root.find('.game-overlay');
            this.reset();
        };

        this.reset = function () {
            // створюємо пари
            var pool = [];
            for (var i = 0; i < SYMBOLS.length; i++) {
                pool.push(SYMBOLS[i], SYMBOLS[i]);
            }
            // перемішуємо
            for (var j = pool.length - 1; j > 0; j--) {
                var k = Math.floor(Math.random() * (j + 1));
                var tmp = pool[j]; pool[j] = pool[k]; pool[k] = tmp;
            }
            grid = pool.map(function (v) { return { value: v, flipped: false, matched: false }; });
            first = null; second = null; lock = false;
            moves = 0; matches = 0; cursor = 0;
            startTime = Date.now();
            gameOver = false;
            this.updateUI();
            this.draw();
            overlay.removeClass('show').text('');
            if (timerId) clearInterval(timerId);
            var s = this;
            timerId = setInterval(function () {
                if (!gameOver) {
                    var sec = Math.floor((Date.now() - startTime) / 1000);
                    root.find('.g-time').text(sec);
                }
            }, 500);
        };

        this.updateUI = function () {
            root.find('.g-moves').text(moves);
            root.find('.g-matches').text(matches);
            var rec = getRecord('memory');
            root.find('.g-record').text(rec ? rec : '-');
        };

        this.draw = function () {
            var html = '';
            for (var i = 0; i < grid.length; i++) {
                var c = grid[i];
                var cls = 'memory-card';
                if (c.flipped || c.matched) cls += ' memory-card--open';
                if (c.matched) cls += ' memory-card--matched';
                if (i === cursor && !gameOver) cls += ' memory-card--cursor';
                var content = (c.flipped || c.matched) ? c.value : '';
                html += '<div class="' + cls + '" data-i="' + i + '">' + content + '</div>';
            }
            root.find('.memory-board').html(html);
            var s = this;
            root.find('.memory-card').on('click touchend', function(e){
                e.preventDefault();
                var i = parseInt($(this).attr('data-i'), 10);
                cursor = i;
                s.flip();
            });
        };

        this.flip = function () {
            if (lock || gameOver) return;
            var c = grid[cursor];
            if (c.flipped || c.matched) return;
            c.flipped = true;
            this.draw();
            if (first === null) {
                first = cursor;
                return;
            }
            // друга картка
            second = cursor;
            moves++;
            this.updateUI();
            if (grid[first].value === grid[second].value) {
                grid[first].matched = true;
                grid[second].matched = true;
                matches++;
                this.updateUI();
                first = null; second = null;
                if (matches === SYMBOLS.length) this.win();
            } else {
                lock = true;
                var s = this;
                setTimeout(function () {
                    grid[first].flipped = false;
                    grid[second].flipped = false;
                    first = null; second = null;
                    lock = false;
                    s.draw();
                }, 800);
            }
        };

        this.win = function () {
            gameOver = true;
            if (timerId) { clearInterval(timerId); timerId = null; }
            var sec = Math.floor((Date.now() - startTime) / 1000);
            // рекорд = менше ходів краще; якщо ходів однаково - менше часу
            var prev = getRecord('memory');
            if (!prev || moves < prev) {
                Lampa.Storage.set('games_record_memory', moves);
            }
            this.updateUI();
            overlay.html('Перемога!<br>Ходів: ' + moves + ', час: ' + sec + ' с<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(gameOver)return; if(cursor%COLS>0){cursor--;s.draw();}},
                right: function(){if(gameOver)return; if(cursor%COLS<COLS-1){cursor++;s.draw();}},
                up:    function(){if(gameOver)return; if(cursor>=COLS){cursor-=COLS;s.draw();}},
                down:  function(){if(gameOver)return; if(cursor<grid.length-COLS){cursor+=COLS;s.draw();}},
                enter: function(){if(gameOver){s.reset();return;} s.flip();}
            });
        };

        this.pause = function () {};
        this.destroy = function () { if (timerId) clearInterval(timerId); };
    };

    // ============================================================
    //                       SPACE INVADERS
    // ============================================================
    GAMES.invaders = function (root) {
        var canvas, ctx, overlay;
        var W, H;
        var player;       // {x, y, w, h, cooldown, alive}
        var aliens;       // [{x, y, alive, type}]
        var bullets;      // [{x, y, vy, fromPlayer}]
        var keys;         // {left, right}
        var shootHeld;    // чи затиснута «стріляти»
        var direction;    // рух армії: 1 / -1
        var stepDown;     // прапор що потрібно зміститися вниз
        var moveTimer, score, lives, level;
        var loopTimer, spawnTimer;
        var paused = false, gameOver = false, won = false, destroyed = false;

        var COLS_A = 8, ROWS_A = 4;
        var ALIEN_W = 24, ALIEN_H = 18;
        var ALIEN_GAP_X = 12, ALIEN_GAP_Y = 10;
        var ALIEN_TOP = 40;

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Життя: <b class="g-lives">3</b></span>' +
                    '<span>Рівень: <b class="g-level">1</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('invaders') + '</b></span>' +
                    '<span class="g-hint">← → — рух, OK — постріл</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
            score = 0; lives = 3; level = 1;
            this.reset();
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            W = Math.floor(rect.width);
            H = Math.floor(rect.height);
            if (W < 320) W = 480;
            if (H < 400) H = 600;
            canvas.width = W; canvas.height = H;
        };

        this.reset = function () {
            this.resize();
            // робимо корабель більшим і ставимо вище дна, щоб було видно на ТБ
            var pw = Math.max(48, Math.floor(W / 12));
            var ph = Math.max(20, Math.floor(pw / 2));
            player = { x: W/2 - pw/2, y: H - ph - 60, w: pw, h: ph, cooldown: 0, alive: true };
            aliens = [];
            // адаптивний розмір прибульців та розстановка
            var aw = Math.max(24, Math.floor(W / 18));
            var ah = Math.max(18, Math.floor(aw * 0.75));
            var gapX = Math.floor(aw * 0.5);
            var gapY = Math.floor(ah * 0.55);
            ALIEN_W = aw; ALIEN_H = ah;
            var totalW = COLS_A * aw + (COLS_A - 1) * gapX;
            var startX = (W - totalW) / 2;
            for (var r = 0; r < ROWS_A; r++) for (var c = 0; c < COLS_A; c++) {
                aliens.push({
                    col: c, row: r,
                    x: startX + c * (aw + gapX),
                    y: 50 + r * (ah + gapY),
                    alive: true,
                    type: r === 0 ? 3 : (r < 2 ? 2 : 1)
                });
            }
            bullets = [];
            keys = { left: false, right: false };
            shootHeld = false;
            direction = 1;
            stepDown = false;
            moveTimer = 0;
            spawnTimer = 0;
            paused = false; gameOver = false; won = false;
            this.updateUI();
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.updateUI = function () {
            root.find('.g-score').text(score);
            root.find('.g-lives').text(lives);
            root.find('.g-level').text(level);
            root.find('.g-record').text(getRecord('invaders'));
        };

        this.startLoop = function () {
            this.stopLoop();
            var s = this;
            loopTimer = setInterval(function () { s.tick(); }, 1000/60);
        };
        this.stopLoop = function () { if (loopTimer) { clearInterval(loopTimer); loopTimer = null; } };

        this.tick = function () {
            if (paused || gameOver || won || destroyed) return;

            // рух гравця
            if (player.cooldown > 0) player.cooldown--;
            if (keys.left)  player.x -= 4;
            if (keys.right) player.x += 4;
            if (player.x < 0) player.x = 0;
            if (player.x + player.w > W) player.x = W - player.w;

            // стрельба
            if (shootHeld && player.cooldown === 0) {
                bullets.push({ x: player.x + player.w/2 - 1, y: player.y, vy: -8, fromPlayer: true });
                player.cooldown = 25;
            }

            // рух армії - раз на N кадрів (швидше, ніж менше залишилося)
            var alive = aliens.filter(function (a) { return a.alive; });
            if (alive.length === 0) {
                won = true;
                this.stopLoop();
                level++;
                setRecord('invaders', score);
                this.updateUI();
                overlay.html('Рівень пройдено!<br>Счёт: ' + score + '<br><span class="g-sub">OK — наступний</span>').addClass('show');
                return;
            }
            var moveInterval = Math.max(8, 30 - Math.floor((COLS_A * ROWS_A - alive.length) / 2) - level * 2);
            moveTimer++;
            if (moveTimer >= moveInterval) {
                moveTimer = 0;
                // перевіримо, чи треба спуститися
                var minX = Infinity, maxX = -Infinity;
                for (var i = 0; i < alive.length; i++) {
                    if (alive[i].x < minX) minX = alive[i].x;
                    if (alive[i].x + ALIEN_W > maxX) maxX = alive[i].x + ALIEN_W;
                }
                if ((direction > 0 && maxX + 8 >= W) || (direction < 0 && minX - 8 <= 0)) {
                    direction *= -1;
                    for (var j = 0; j < aliens.length; j++) aliens[j].y += 14;
                    // перевіримо досягнення гравця
                    for (var k = 0; k < aliens.length; k++) {
                        if (aliens[k].alive && aliens[k].y + ALIEN_H >= player.y) {
                            return this.gameOverNow(false);
                        }
                    }
                } else {
                    for (var m = 0; m < aliens.length; m++) aliens[m].x += direction * 6;
                }
            }

            // стрілянина прибульців
            spawnTimer--;
            if (spawnTimer <= 0) {
                spawnTimer = Math.max(20, 80 - level * 5);
                if (alive.length) {
                    var shooter = alive[Math.floor(Math.random() * alive.length)];
                    bullets.push({ x: shooter.x + ALIEN_W/2 - 1, y: shooter.y + ALIEN_H, vy: 4, fromPlayer: false });
                }
            }

            // рух снарядів та колізії
            for (var bi = bullets.length - 1; bi >= 0; bi--) {
                var b = bullets[bi];
                b.y += b.vy;
                if (b.y < -10 || b.y > H + 10) { bullets.splice(bi, 1); continue; }
                if (b.fromPlayer) {
                    for (var ai = 0; ai < aliens.length; ai++) {
                        var a = aliens[ai];
                        if (!a.alive) continue;
                        if (b.x > a.x && b.x < a.x + ALIEN_W && b.y > a.y && b.y < a.y + ALIEN_H) {
                            a.alive = false;
                            score += a.type * 10;
                            setRecord('invaders', score);
                            this.updateUI();
                            bullets.splice(bi, 1);
                            break;
                        }
                    }
                } else {
                    if (player.alive && b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
                        bullets.splice(bi, 1);
                        lives--;
                        this.updateUI();
                        if (lives <= 0) { return this.gameOverNow(false); }
                    }
                }
            }

            this.draw();
        };

        this.gameOverNow = function (victory) {
            gameOver = true;
            this.stopLoop();
            setRecord('invaders', score);
            overlay.html((victory ? 'Перемога!' : 'Гра закінчена') + '<br>Рахунок: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.draw = function () {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);
            // зірки
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            for (var s = 0; s < 30; s++) {
                var sx = (s * 73) % W;
                var sy = (s * 37) % H;
                ctx.fillRect(sx, sy, 1, 1);
            }
            // прибульці
            for (var i = 0; i < aliens.length; i++) {
                var a = aliens[i];
                if (!a.alive) continue;
                var col = ['#4caf50','#ff9800','#f44336'][a.type - 1] || '#4caf50';
                ctx.fillStyle = col;
                ctx.fillRect(a.x + 2, a.y + 4, ALIEN_W - 4, ALIEN_H - 8);
                ctx.fillRect(a.x, a.y + 8, ALIEN_W, ALIEN_H - 14);
                ctx.fillRect(a.x + 4, a.y, 4, 4);
                ctx.fillRect(a.x + ALIEN_W - 8, a.y, 4, 4);
                // очі
                ctx.fillStyle = '#000';
                ctx.fillRect(a.x + 6, a.y + 8, 3, 3);
                ctx.fillRect(a.x + ALIEN_W - 9, a.y + 8, 3, 3);
            }
            // снаряди
            for (var b = 0; b < bullets.length; b++) {
                ctx.fillStyle = bullets[b].fromPlayer ? '#fff' : '#ff5252';
                ctx.fillRect(bullets[b].x, bullets[b].y, 2, 6);
            }
            // гравець
            if (player.alive) {
                ctx.fillStyle = '#42a5f5';
                ctx.fillRect(player.x, player.y + 4, player.w, player.h - 4);
                ctx.fillRect(player.x + player.w/2 - 3, player.y, 6, 6);
            }
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){
                    if (gameOver||won) return;
                    keys.left = true; keys.right = false;
                    setTimeout(function(){keys.left=false;}, 200);
                },
                right: function(){
                    if (gameOver||won) return;
                    keys.right = true; keys.left = false;
                    setTimeout(function(){keys.right=false;}, 200);
                },
                up:    function(){
                    // теж постріл для зручності
                    if (gameOver||won) { s.reset(); return; }
                    if (player.cooldown === 0) {
                        bullets.push({ x: player.x + player.w/2 - 1, y: player.y, vy: -8, fromPlayer: true });
                        player.cooldown = 25;
                    }
                },
                enter: function(){
                    if (gameOver||won) { s.reset(); return; }
                    if (player.cooldown === 0) {
                        bullets.push({ x: player.x + player.w/2 - 1, y: player.y, vy: -8, fromPlayer: true });
                        player.cooldown = 25;
                    }
                }
            });
            // тач
            this._detachTouch = attachTouch(root, {
                onTouchStart: function(x, y){
                    if (gameOver||won) return;
                    var rect = root[0].getBoundingClientRect();
                    if (x < rect.width / 2) { keys.left = true; keys.right = false; }
                    else { keys.right = true; keys.left = false; }
                    shootHeld = true; // безперервна стрілянина поки затиснутий екран
                },
                onDrag: function(x, y){
                    var rect = root[0].getBoundingClientRect();
                    if (x < rect.width / 2) { keys.left = true; keys.right = false; }
                    else { keys.right = true; keys.left = false; }
                },
                onTouchEnd: function(){
                    keys.left = false; keys.right = false; shootHeld = false;
                },
                onTap: function(){
                    if (gameOver||won) s.reset();
                }
            });
            this._r = function () { s.resize(); s.draw(); };
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };

        this.pause = function () {};
        this.destroy = function () {
            destroyed = true;
            this.stopLoop();
            if (this._detachTouch) this._detachTouch();
            if (this._r) $(window).off('resize', this._r);
        };
    };

    // ============================================================
    //                         CROSSY ROAD
    // ============================================================
    // Нескінченна прокручування вгору. Смуги: трава (безпечно), дорога (машинки),
    // Вода (потрібні колоди). Початок – кілька трав'яних смуг. Камера скролиться
    // разом із гравцем, назад вниз не можна 
    GAMES.crossy = function (root) {
        var canvas, ctx, overlay;
        var TILE = 40;
        var COLS = 11;        // ширина поля у клітинках
        var VISIBLE_ROWS = 12; // скільки рядів на екрані
        var W, H;
        var lanes;             // масив смуг (нескінченно генерується вгору)
        var player;            // {col, row, animTimer, onLog}
        var camera;            // currentTopRow (плаваюче число для плавного прокручування)
        var cameraTarget;
        var rowsAdvanced;      // скільки рядів пройшов гравець (= рахунок)
        var maxRowEver;        // максимальний досягнутий row
        var loopTimer;
        var paused = false, gameOver = false, destroyed = false;
        var moveTimer = 0;
        var idleTimer = 0;     // якщо стоїш на місці занадто довго - вилітаєш знизу

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('crossy') + '</b></span>' +
                    '<span class="g-hint">Стрілки/свайпи - рух</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            // Поле вертикальне. Ширина - ціла кількість клітинок, що поміщаються у висоту
            H = Math.floor(rect.height);
            if (H < 300) H = 600;
            TILE = Math.max(28, Math.floor(H / VISIBLE_ROWS));
            W = TILE * COLS;
            // Якщо W не поміщається по ширині – зменшимо TILE
            if (W > rect.width) {
                TILE = Math.floor(rect.width / COLS);
                if (TILE < 24) TILE = 24;
                W = TILE * COLS;
                H = TILE * VISIBLE_ROWS;
            }
            canvas.width = W;
            canvas.height = H;
        };

        this.reset = function () {
            this.resize();
            lanes = {};
            // Стартові ряди - трава, щоб було де стартувати без небезпеки
            // row = 0 - стартовий. Гравець починає row=0.
            for (var r = -3; r <= 5; r++) {
                lanes[r] = this.makeLane(r, true);
            }
            for (var r2 = 6; r2 < 25; r2++) {
                lanes[r2] = this.makeLane(r2, false);
            }
            player = { col: Math.floor(COLS/2), row: 0, animTimer: 0, prevCol: Math.floor(COLS/2), prevRow: 0 };
            camera = -8;       // показуємо 8 рядів вище гравця
            cameraTarget = -8;
            rowsAdvanced = 0;
            maxRowEver = 0;
            paused = false; gameOver = false;
            idleTimer = 0;
            this.updateUI();
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.makeLane = function (row, forceGrass) {
            // тип смуги: 0=трава, 1=дорога, 2=вода, 3=залізниця
            var type = 0;
            if (!forceGrass) {
                var r = Math.random();
                if (r < 0.45) type = 1;       // дорога - найчастіші
                else if (r < 0.65) type = 2;  // вода
                else if (r < 0.72) type = 3;  // залізниця (рідко)
                else type = 0;                // трава
            }
            var lane = { row: row, type: type, items: [], speed: 0, dir: Math.random() < 0.5 ? 1 : -1 };
            if (type === 1) {
                // дорога: 1-3 машини
                var count = 1 + Math.floor(Math.random() * 3);
                lane.speed = (0.04 + Math.random() * 0.06) * lane.dir;
                var spacing = COLS / count;
                for (var i = 0; i < count; i++) {
                    lane.items.push({ x: i * spacing + Math.random() * 0.5, len: 1 });
                }
            } else if (type === 2) {
                // вода: колоди
                var count2 = 2 + Math.floor(Math.random() * 2);
                lane.speed = (0.025 + Math.random() * 0.025) * lane.dir;
                var len = 2 + Math.floor(Math.random() * 2);
                var spacing2 = COLS / count2;
                for (var j = 0; j < count2; j++) {
                    lane.items.push({ x: j * spacing2, len: len });
                }
            } else if (type === 3) {
                // залізниця: поки порожня, поїзд з'являється по таймеру
                lane.trainTimer = 100 + Math.floor(Math.random() * 100);
                lane.trainActive = false;
                lane.warning = false;
            } else {
                // трава: іноді додаємо дерево як перешкоду
                if (Math.random() < 0.3) {
                    var tx = Math.floor(Math.random() * COLS);
                    lane.items.push({ x: tx, len: 1, isTree: true });
                }
            }
            return lane;
        };

        this.updateUI = function () {
            root.find('.g-score').text(rowsAdvanced);
            root.find('.g-record').text(getRecord('crossy'));
        };

        this.startLoop = function () {
            this.stopLoop();
            var s = this;
            loopTimer = setInterval(function () { s.tick(); }, 1000/30);
        };
        this.stopLoop = function () { if (loopTimer) { clearInterval(loopTimer); loopTimer = null; } };

        this.tick = function () {
            if (paused || gameOver || destroyed) return;

            // плавне прокручування камери
            cameraTarget = player.row - 8;
            if (cameraTarget > camera) {
                camera += Math.min(0.15, cameraTarget - camera);
            }

            // рух об'єктів на смугах у видимій області
            for (var key in lanes) {
                var lane = lanes[key];
                var r = parseInt(key, 10);
                if (r < camera - 2 || r > camera + VISIBLE_ROWS + 2) continue;
                if (lane.type === 1 || lane.type === 2) {
                    for (var i = 0; i < lane.items.length; i++) {
                        var it = lane.items[i];
                        it.x += lane.speed;
                        // wrap
                        if (lane.speed > 0 && it.x > COLS + 1) it.x = -it.len - 1;
                        if (lane.speed < 0 && it.x + it.len < -1) it.x = COLS + 1;
                    }
                } else if (lane.type === 3) {
                    // поїзд
                    if (lane.trainTimer > 0) lane.trainTimer--;
                    if (!lane.trainActive && lane.trainTimer <= 0) {
                        // попередження
                        if (!lane.warning) { lane.warning = true; lane.warnTimer = 30; }
                        else if (lane.warnTimer > 0) { lane.warnTimer--; }
                        else {
                            // запускаємо поїзд
                            lane.trainActive = true;
                            lane.trainPos = lane.dir > 0 ? -8 : COLS;
                            lane.warning = false;
                        }
                    }
                    if (lane.trainActive) {
                        lane.trainPos += lane.dir * 0.6;
                        if ((lane.dir > 0 && lane.trainPos > COLS + 2) ||
                            (lane.dir < 0 && lane.trainPos < -10)) {
                            lane.trainActive = false;
                            lane.trainTimer = 80 + Math.floor(Math.random() * 120);
                        }
                    }
                }
            }

            // якщо гравець на колоді - рухається з ним
            var pl = lanes[player.row];
            if (pl && pl.type === 2 && player.onLog) {
                player.col += player.onLog.speed;
            }

            // перевірка колізій
            this.checkCollisions();

            // видалити далекі смуги вниз і згенерувати нові зверху
            var topRow = Math.floor(camera) - 5;
            var maxLaneRow = -Infinity;
            for (var k in lanes) {
                var rr = parseInt(k, 10);
                if (rr < topRow) delete lanes[k];
                if (rr > maxLaneRow) maxLaneRow = rr;
            }
            while (maxLaneRow < Math.ceil(camera) + VISIBLE_ROWS + 5) {
                maxLaneRow++;
                lanes[maxLaneRow] = this.makeLane(maxLaneRow, false);
            }

            // якщо гравець пішов нижче за видиму зону (камера обігнала) — смерть
            if (player.row < camera - 1) {
                return this.die('Камера пішла вперед');
            }
            // або якщо з'їхав на колоді за край
            if (player.col < 0 || player.col >= COLS) {
                return this.die('Відплив за край');
            }

            // рух гравця (для анімації переміщення)
            if (player.animTimer > 0) player.animTimer--;

            this.draw();
        };

        this.checkCollisions = function () {
            var lane = lanes[player.row];
            if (!lane) return;
            if (lane.type === 1) {
                // машинки
                for (var i = 0; i < lane.items.length; i++) {
                    var c = lane.items[i];
                    if (player.col + 0.7 > c.x && player.col + 0.3 < c.x + c.len) {
                        return this.die('Сбила машина');
                    }
                }
                player.onLog = null;
            } else if (lane.type === 2) {
                // вода — потрібно стояти на колоді
                var onLog = null;
                for (var j = 0; j < lane.items.length; j++) {
                    var lg = lane.items[j];
                    if (player.col + 0.5 >= lg.x && player.col + 0.5 < lg.x + lg.len) {
                        onLog = { speed: lane.speed };
                        break;
                    }
                }
                if (!onLog) return this.die('Утонул');
                player.onLog = onLog;
            } else if (lane.type === 3 && lane.trainActive) {
                // поїзд (довжиною 8 клітин)
                if (player.col + 0.5 > lane.trainPos && player.col + 0.5 < lane.trainPos + 8) {
                    return this.die('Поїзд!');
                }
                player.onLog = null;
            } else {
                player.onLog = null;
            }
        };

        this.die = function (reason) {
            gameOver = true;
            this.stopLoop();
            setRecord('crossy', rowsAdvanced);
            this.updateUI();
            overlay.html((reason || 'Гра закінчена') + '<br>Рахунок: ' + rowsAdvanced + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.move = function (dx, dy) {
            if (gameOver || paused) return;
            var nc = player.col + dx;
            var nr = player.row + dy;
            // не можна йти за краї по горизонталі
            if (nc < 0 || nc >= COLS) return;
            // не можна сильно назад (тільки до камери + 1)
            if (nr < Math.ceil(camera)) return;
            // перевірка дерева на новому місці
            var lane = lanes[nr];
            if (lane && lane.type === 0) {
                for (var i = 0; i < lane.items.length; i++) {
                    if (lane.items[i].isTree && Math.floor(lane.items[i].x) === nc) return;
                }
            }
            player.prevCol = player.col;
            player.prevRow = player.row;
            player.col = nc;
            player.row = nr;
            player.animTimer = 4;
            if (player.row > maxRowEver) {
                maxRowEver = player.row;
                rowsAdvanced = maxRowEver;
                this.updateUI();
            }
        };

        this.draw = function () {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);
            // малюємо смуги по спаданню row зверху (великі row вище)
            // екран: y = (camera + VISIBLE_ROWS - 1 - row) * TILE
            var topRow = Math.ceil(camera) + VISIBLE_ROWS;
            var botRow = Math.floor(camera) - 1;
            for (var r = topRow; r >= botRow; r--) {
                var lane = lanes[r];
                if (!lane) continue;
                var y = (camera + VISIBLE_ROWS - 1 - r) * TILE;
                this.drawLane(lane, y);
            }

            // гравець (з анімацією)
            var t = player.animTimer / 4;
            var pcol = player.col + (player.prevCol - player.col) * t;
            var prow = player.row + (player.prevRow - player.row) * t;
            // якщо на колоді - рухається з ним
            if (player.onLog && t === 0) {
                // позиція вже актуальна, нічого не міняємо
            }
            var px = pcol * TILE + TILE/2;
            var py = (camera + VISIBLE_ROWS - 1 - prow) * TILE + TILE/2;
            // тінь
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(px, py + TILE*0.35, TILE*0.3, TILE*0.1, 0, 0, Math.PI*2);
            ctx.fill();
            // тушка (курка)
            ctx.fillStyle = '#fafafa';
            ctx.fillRect(px - TILE*0.25, py - TILE*0.15, TILE*0.5, TILE*0.4);
            ctx.fillRect(px - TILE*0.18, py - TILE*0.35, TILE*0.36, TILE*0.25);
            // око
            ctx.fillStyle = '#000';
            ctx.fillRect(px + TILE*0.05, py - TILE*0.28, TILE*0.06, TILE*0.06);
            // клюв
            ctx.fillStyle = '#ff9800';
            ctx.fillRect(px + TILE*0.16, py - TILE*0.22, TILE*0.12, TILE*0.06);
            // гребінь
            ctx.fillStyle = '#f44336';
            ctx.fillRect(px - TILE*0.05, py - TILE*0.42, TILE*0.1, TILE*0.08);
        };

        this.drawLane = function (lane, y) {
            // фон
            var bgColor = '#43a047'; // трава
            if (lane.type === 1) bgColor = '#424242'; // дорога
            else if (lane.type === 2) bgColor = '#1565c0'; // вода
            else if (lane.type === 3) bgColor = '#5d4037'; // з/д шпали
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, y, W, TILE);

            if (lane.type === 1) {
                // розмітка
                ctx.strokeStyle = 'rgba(255,242,0,0.7)';
                ctx.lineWidth = 2;
                ctx.setLineDash([8, 8]);
                ctx.beginPath();
                ctx.moveTo(0, y + TILE/2);
                ctx.lineTo(W, y + TILE/2);
                ctx.stroke();
                ctx.setLineDash([]);
                // машинки
                for (var i = 0; i < lane.items.length; i++) {
                    var c = lane.items[i];
                    var cx = c.x * TILE;
                    var cw = c.len * TILE;
                    // машина може виїхати за край - відображаємо wrap
                    drawCar(cx, cw);
                    if (cx + cw > W) drawCar(cx - W * 1, cw);
                    if (cx < 0) drawCar(cx + W, cw);
                }
            } else if (lane.type === 2) {
                // вода з хвилями
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                for (var w = 0; w < W; w += 30) {
                    ctx.fillRect(w + ((Date.now()/100) % 30), y + TILE/2, 8, 1);
                }
                // колоди
                for (var li = 0; li < lane.items.length; li++) {
                    var lg = lane.items[li];
                    var lx = lg.x * TILE;
                    var lw = lg.len * TILE;
                    drawLog(lx, lw);
                    if (lx + lw > W) drawLog(lx - W, lw);
                    if (lx < 0) drawLog(lx + W, lw);
                }
            } else if (lane.type === 3) {
                // шпали
                ctx.fillStyle = '#3e2723';
                for (var sx = 0; sx < W; sx += TILE/2) {
                    ctx.fillRect(sx + 4, y + 4, TILE/2 - 8, TILE - 8);
                }
                // рельси
                ctx.fillStyle = '#9e9e9e';
                ctx.fillRect(0, y + TILE * 0.25, W, 3);
                ctx.fillRect(0, y + TILE * 0.7, W, 3);
                // попередження
                if (lane.warning) {
                    ctx.fillStyle = (Math.floor(Date.now()/150) % 2 === 0) ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,0.2)';
                    ctx.fillRect(0, y, W, TILE);
                }
                // поїзд
                if (lane.trainActive) {
                    var tx = lane.trainPos * TILE;
                    ctx.fillStyle = '#37474f';
                    ctx.fillRect(tx, y + 3, 8 * TILE, TILE - 6);
                    ctx.fillStyle = '#ffeb3b';
                    // фари
                    if (lane.dir > 0) {
                        ctx.fillRect(tx + 8 * TILE - 6, y + TILE/2 - 4, 4, 8);
                    } else {
                        ctx.fillRect(tx + 2, y + TILE/2 - 4, 4, 8);
                    }
                }
            } else {
                // трава з деревами
                for (var ti = 0; ti < lane.items.length; ti++) {
                    var t2 = lane.items[ti];
                    if (t2.isTree) {
                        var tx2 = t2.x * TILE;
                        // стовбур
                        ctx.fillStyle = '#5d4037';
                        ctx.fillRect(tx2 + TILE*0.4, y + TILE*0.5, TILE*0.2, TILE*0.5);
                        // крона
                        ctx.fillStyle = '#1b5e20';
                        ctx.beginPath();
                        ctx.arc(tx2 + TILE/2, y + TILE*0.4, TILE*0.4, 0, Math.PI*2);
                        ctx.fill();
                    }
                }
            }

            function drawCar(x, w) {
                var grad = lane.row * 137 % 360;
                // колесо удачі кольори
                var cols = ['#f44336', '#ffc107', '#9c27b0', '#00bcd4', '#ff9800', '#4caf50'];
                ctx.fillStyle = cols[Math.abs(lane.row) % cols.length];
                ctx.fillRect(x + 3, y + 6, w - 6, TILE - 12);
                // вікна
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.fillRect(x + 8, y + 9, w - 16, TILE * 0.3);
                // фари
                ctx.fillStyle = '#ffeb3b';
                if (lane.dir > 0) {
                    ctx.fillRect(x + w - 7, y + TILE - 12, 4, 4);
                } else {
                    ctx.fillRect(x + 3, y + TILE - 12, 4, 4);
                }
            }

            function drawLog(x, w) {
                ctx.fillStyle = '#6d4c41';
                ctx.fillRect(x, y + 4, w, TILE - 8);
                ctx.strokeStyle = '#3e2723';
                ctx.lineWidth = 1;
                for (var k = 1; k < w / TILE; k++) {
                    ctx.beginPath();
                    ctx.moveTo(x + k * TILE, y + 4);
                    ctx.lineTo(x + k * TILE, y + TILE - 4);
                    ctx.stroke();
                }
                // кінці - закруглені
                ctx.fillStyle = '#3e2723';
                ctx.beginPath();
                ctx.arc(x, y + TILE/2, TILE*0.1, 0, Math.PI*2);
                ctx.arc(x + w, y + TILE/2, TILE*0.1, 0, Math.PI*2);
                ctx.fill();
            }
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(gameOver){s.reset();return;} s.move(-1, 0);},
                right: function(){if(gameOver){s.reset();return;} s.move(1, 0);},
                up:    function(){if(gameOver){s.reset();return;} s.move(0, 1);},
                down:  function(){if(gameOver){s.reset();return;} s.move(0, -1);},
                enter: function(){
                    if (gameOver) { s.reset(); return; }
                    s.move(0, 1); // OK = крок вперед
                }
            });
            this._detachTouch = attachTouch(root, {
                onSwipe: function(dir){
                    if (gameOver){s.reset();return;}
                    if (dir==='left')  s.move(-1, 0);
                    if (dir==='right') s.move(1, 0);
                    if (dir==='up')    s.move(0, 1);
                    if (dir==='down')  s.move(0, -1);
                },
                onTap: function(){
                    if (gameOver){s.reset();return;}
                    s.move(0, 1); // тап = крок вперед
                }
            });
            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };
        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };

    // ============================================================
    //                          Сапер
    // ============================================================
    GAMES.minesweeper = function (root) {
        var info, overlay;
        var COLS, ROWS, MINES;
        var field;        // масив [y][x] = {mine, revealed, flagged, count}
        var cursor = {x:0, y:0};
        var firstClick = true;
        var minesLeft;
        var startTime, timerId;
        var gameOver = false, won = false;
        var DIFFICULTIES = {
            easy:   { cols: 9,  rows: 9,  mines: 10 },
            medium: { cols: 12, rows: 12, mines: 25 },
            hard:   { cols: 16, rows: 14, mines: 50 }
        };
        var difficulty = 'easy';

        this.create = function () {
            root.html(
                '<div class="game-wrap mine-wrap">' +
                  '<div class="game-info">' +
                    '<span>Мін: <b class="g-mines">0</b></span>' +
                    '<span>Час: <b class="g-time">0</b></span>' +
                    '<span class="mine-diff">Складність: <b>' + this.diffName(difficulty) + '</b></span>' +
                    '<span class="g-hint">↑↓←→ — курсор, OK — відкрити, ↓ довго — флажок, цифра 1/2/3 — складність</span>' +
                  '</div>' +
                  '<div class="mine-board"></div>' +
                  '<div class="game-overlay"></div>' +
                '</div>'
            );
            info = root.find('.game-info');
            overlay = root.find('.game-overlay');
            this.reset();
        };

        this.diffName = function (d) {
            return d === 'easy' ? 'Легко' : (d === 'medium' ? 'Среднє' : 'Складно');
        };

        this.reset = function () {
            var d = DIFFICULTIES[difficulty];
            COLS = d.cols; ROWS = d.rows; MINES = d.mines;
            field = [];
            for (var y=0; y<ROWS; y++) {
                var row = [];
                for (var x=0; x<COLS; x++) row.push({ mine:false, revealed:false, flagged:false, count:0 });
                field.push(row);
            }
            cursor = { x: Math.floor(COLS/2), y: Math.floor(ROWS/2) };
            firstClick = true;
            minesLeft = MINES;
            gameOver = false; won = false;
            startTime = null;
            this.updateUI();
            this.draw();
            overlay.removeClass('show').text('');
            if (timerId) clearInterval(timerId);
            var s = this;
            timerId = setInterval(function () {
                if (!gameOver && !won && startTime) {
                    var sec = Math.floor((Date.now() - startTime) / 1000);
                    root.find('.g-time').text(sec);
                }
            }, 500);
        };

        this.placeMines = function (avoidX, avoidY) {
            // ставимо міни рандомно, уникаючи перший клік та його сусідів
            var placed = 0;
            while (placed < MINES) {
                var rx = Math.floor(Math.random() * COLS);
                var ry = Math.floor(Math.random() * ROWS);
                if (Math.abs(rx - avoidX) <= 1 && Math.abs(ry - avoidY) <= 1) continue;
                if (field[ry][rx].mine) continue;
                field[ry][rx].mine = true;
                placed++;
            }
            // рахуємо підказки
            for (var y=0; y<ROWS; y++) for (var x=0; x<COLS; x++) {
                if (field[y][x].mine) continue;
                var c = 0;
                for (var dy=-1; dy<=1; dy++) for (var dx=-1; dx<=1; dx++) {
                    var nx = x+dx, ny = y+dy;
                    if (nx>=0 && nx<COLS && ny>=0 && ny<ROWS && field[ny][nx].mine) c++;
                }
                field[y][x].count = c;
            }
        };

        this.updateUI = function () {
            root.find('.g-mines').text(minesLeft);
            root.find('.mine-diff b').text(this.diffName(difficulty));
        };

        this.draw = function () {
            var html = '<div class="mine-grid" style="grid-template-columns:repeat(' + COLS + ',1fr);">';
            for (var y=0; y<ROWS; y++) for (var x=0; x<COLS; x++) {
                var c = field[y][x];
                var cls = 'mine-cell';
                var content = '';
                if (cursor.x===x && cursor.y===y && !gameOver && !won) cls += ' mine-cursor';
                if (c.revealed) {
                    cls += ' mine-revealed';
                    if (c.mine) { cls += ' mine-bomb'; content = '💣'; }
                    else if (c.count > 0) { content = c.count; cls += ' mine-n' + c.count; }
                } else if (c.flagged) {
                    cls += ' mine-flag';
                    content = '🚩';
                }
                html += '<div class="' + cls + '" data-x="' + x + '" data-y="' + y + '">' + content + '</div>';
            }
            html += '</div>';
            root.find('.mine-board').html(html);
            var s = this;
            // тач — короткий тап = відкрити, довгий = прапорець
            var pressTimer = null;
            var longPressed = false;
            root.find('.mine-cell').on('touchstart mousedown', function(e){
                var x = parseInt($(this).attr('data-x'), 10);
                var y = parseInt($(this).attr('data-y'), 10);
                cursor.x = x; cursor.y = y;
                longPressed = false;
                pressTimer = setTimeout(function(){ longPressed = true; s.toggleFlag(); s.draw(); }, 500);
            });
            root.find('.mine-cell').on('touchend mouseup mouseleave', function(e){
                if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
                if (e.type === 'mouseleave') return;
                e.preventDefault && e.preventDefault();
                if (gameOver || won) { s.reset(); return; }
                if (!longPressed) s.reveal();
            });
        };

        this.reveal = function () {
            if (gameOver || won) return;
            var c = field[cursor.y][cursor.x];
            if (c.flagged || c.revealed) return;
            if (firstClick) {
                this.placeMines(cursor.x, cursor.y);
                firstClick = false;
                startTime = Date.now();
            }
            this.flood(cursor.x, cursor.y);
            if (c.mine) {
                gameOver = true;
                this.revealAll();
                this.draw();
                overlay.html('Подорвался!<br><span class="g-sub">OK — заново</span>').addClass('show');
                if (timerId) clearInterval(timerId);
                return;
            }
            this.checkWin();
            this.draw();
        };

        this.flood = function (x, y) {
            var stack = [[x, y]];
            while (stack.length) {
                var p = stack.pop();
                var cx = p[0], cy = p[1];
                if (cx<0 || cy<0 || cx>=COLS || cy>=ROWS) continue;
                var cell = field[cy][cx];
                if (cell.revealed || cell.flagged) continue;
                cell.revealed = true;
                if (cell.mine) continue; // не розкриваємо сусідні міни
                if (cell.count === 0) {
                    for (var dy=-1; dy<=1; dy++) for (var dx=-1; dx<=1; dx++) {
                        if (dx===0 && dy===0) continue;
                        stack.push([cx+dx, cy+dy]);
                    }
                }
            }
        };

        this.toggleFlag = function () {
            if (gameOver || won) return;
            var c = field[cursor.y][cursor.x];
            if (c.revealed) return;
            c.flagged = !c.flagged;
            minesLeft += c.flagged ? -1 : 1;
            this.updateUI();
        };

        this.revealAll = function () {
            for (var y=0; y<ROWS; y++) for (var x=0; x<COLS; x++) {
                if (field[y][x].mine) field[y][x].revealed = true;
            }
        };

        this.checkWin = function () {
            for (var y=0; y<ROWS; y++) for (var x=0; x<COLS; x++) {
                if (!field[y][x].mine && !field[y][x].revealed) return;
            }
            won = true;
            if (timerId) clearInterval(timerId);
            var sec = Math.floor((Date.now() - startTime) / 1000);
            // рекорд = менший час для конкретної складності
            var key = 'minesweeper_' + difficulty;
            var prev = Lampa.Storage.get('games_record_' + key, 0);
            if (!prev || sec < prev) Lampa.Storage.set('games_record_' + key, sec);
            overlay.html('Перемога!<br>Час: ' + sec + ' с<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(cursor.x>0){cursor.x--;s.draw();}},
                right: function(){if(cursor.x<COLS-1){cursor.x++;s.draw();}},
                up:    function(){if(cursor.y>0){cursor.y--;s.draw();}},
                down:  function(){if(cursor.y<ROWS-1){cursor.y++;s.draw();}},
                enter: function(){
                    if (gameOver || won) { s.reset(); return; }
                    s.reveal();
                }
            });
        };

        this.pause = function () {};
        this.destroy = function () { if (timerId) clearInterval(timerId); };
    };

    // ============================================================
    //                          ШАШКИ
    // ============================================================
    // Поле 8x8. Гравець – білі (внизу), комп'ютер – чорні (згори).
    // Прості шашки йдуть тільки вперед по діагоналі, дамки - у бік.
    // Обов'язкове взяття. Ші - простий мінімакс на 3 ходи
    GAMES.checkers = function (root) {
        var info, overlay;
        var SIZE = 8;
        var board;       // [y][x]: 0=пусто, 1=біла, 2=чорна, 3=біла дамка, 4=чорна дамка
        var selected;    // {x,y} | null — вибрана шашка
        var validMoves;  // масив доступних ходів для вибраної шашки
        var mustCapture; // масив координат шашок, які мають бити
        var cursor = {x:0, y:7};
        var phase = 'play'; // 'play' | 'win' | 'lose' | 'draw'
        var turn = 'white';

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span class="check-status">Ваш хід</span>' +
                    '<span class="g-hint">Стрілки - курсор, OK - вибрати/походити</span>' +
                  '</div>' +
                  '<div class="check-board"></div>' +
                  '<div class="game-overlay"></div>' +
                '</div>'
            );
            info = root.find('.check-status');
            overlay = root.find('.game-overlay');
            this.reset();
        };

        this.reset = function () {
            board = [];
            for (var y=0; y<SIZE; y++) {
                var row = [];
                for (var x=0; x<SIZE; x++) {
                    var dark = (x + y) % 2 === 1;
                    if (dark && y < 3) row.push(2);      // чорні зверху
                    else if (dark && y > 4) row.push(1); // білі знизу
                    else row.push(0);
                }
                board.push(row);
            }
            selected = null;
            validMoves = [];
            cursor = { x: 0, y: 7 };
            // курсор - на першій білій шашці знизу
            for (var x=0; x<SIZE; x++) if (board[7][x] === 1) { cursor.x = x; cursor.y = 7; break; }
            phase = 'play';
            turn = 'white';
            mustCapture = this.getCaptures(board, 'white');
            info.text('Ваш хід');
            this.draw();
            overlay.removeClass('show').text('');
        };

        // допоміжні функції
        this.isWhite = function (p) { return p === 1 || p === 3; };
        this.isBlack = function (p) { return p === 2 || p === 4; };
        this.isKing  = function (p) { return p === 3 || p === 4; };
        this.color   = function (p) { return p === 0 ? null : (this.isWhite(p) ? 'white' : 'black'); };

        // отримати всі взяття для кольору
        this.getCaptures = function (b, color) {
            var captures = [];
            for (var y=0; y<SIZE; y++) for (var x=0; x<SIZE; x++) {
                var p = b[y][x];
                if (this.color(p) !== color) continue;
                var caps = this.getPieceCaptures(b, x, y);
                if (caps.length) captures.push({ x: x, y: y, captures: caps });
            }
            return captures;
        };

        // взяття для конкретної шашки (без багаторазових за раз – спрощення)
        this.getPieceCaptures = function (b, x, y) {
            var p = b[y][x];
            var color = this.color(p);
            var king = this.isKing(p);
            var caps = [];
            var dirs = [[-1,-1],[1,-1],[-1,1],[1,1]];
            for (var i=0; i<dirs.length; i++) {
                var dx = dirs[i][0], dy = dirs[i][1];
                if (king) {
                    // дамка: шукає першу ворожу по діагоналі, після неї - порожню клітку
                    var nx = x+dx, ny = y+dy;
                    var foundEnemy = null;
                    while (nx>=0 && ny>=0 && nx<SIZE && ny<SIZE) {
                        var v = b[ny][nx];
                        if (v !== 0) {
                            if (this.color(v) !== color && !foundEnemy) {
                                foundEnemy = { x: nx, y: ny };
                            } else {
                                break;
                            }
                        } else if (foundEnemy) {
                            caps.push({ tx: nx, ty: ny, capX: foundEnemy.x, capY: foundEnemy.y });
                        }
                        nx += dx; ny += dy;
                    }
                } else {
                    // звичайна шашка: б'є через одну у будь-якому напрямку
                    var ex = x+dx, ey = y+dy;
                    var tx = x+dx*2, ty = y+dy*2;
                    if (tx<0 || ty<0 || tx>=SIZE || ty>=SIZE) continue;
                    if (b[ty][tx] !== 0) continue;
                    var ev = b[ey][ex];
                    if (ev !== 0 && this.color(ev) !== color) {
                        caps.push({ tx: tx, ty: ty, capX: ex, capY: ey });
                    }
                }
            }
            return caps;
        };

        // звичайні ходи (коли взяття немає)
        this.getPieceMoves = function (b, x, y) {
            var p = b[y][x];
            var color = this.color(p);
            var king = this.isKing(p);
            var moves = [];
            var dirs;
            if (king) dirs = [[-1,-1],[1,-1],[-1,1],[1,1]];
            else dirs = (color === 'white') ? [[-1,-1],[1,-1]] : [[-1,1],[1,1]]; // вперед
            for (var i=0; i<dirs.length; i++) {
                var dx = dirs[i][0], dy = dirs[i][1];
                if (king) {
                    var nx = x+dx, ny = y+dy;
                    while (nx>=0 && ny>=0 && nx<SIZE && ny<SIZE && b[ny][nx]===0) {
                        moves.push({ tx: nx, ty: ny });
                        nx += dx; ny += dy;
                    }
                } else {
                    var nx2 = x+dx, ny2 = y+dy;
                    if (nx2>=0 && ny2>=0 && nx2<SIZE && ny2<SIZE && b[ny2][nx2]===0) {
                        moves.push({ tx: nx2, ty: ny2 });
                    }
                }
            }
            return moves;
        };

        // виконати хід
        this.doMove = function (b, fromX, fromY, move) {
            var p = b[fromY][fromX];
            b[fromY][fromX] = 0;
            b[move.ty][move.tx] = p;
            if (move.capX !== undefined) {
                b[move.capY][move.capX] = 0;
            }
            // перетворення на дамку
            if (p === 1 && move.ty === 0) b[move.ty][move.tx] = 3;
            if (p === 2 && move.ty === SIZE-1) b[move.ty][move.tx] = 4;
        };

        // вибір клітинки
        this.selectCell = function () {
            if (phase !== 'play' || turn !== 'white') return;
            var p = board[cursor.y][cursor.x];
            if (selected) {
                // спроба ходу до цієї клітини
                for (var i=0; i<validMoves.length; i++) {
                    var m = validMoves[i];
                    if (m.tx === cursor.x && m.ty === cursor.y) {
                        var fromX = selected.x, fromY = selected.y;
                        this.doMove(board, fromX, fromY, m);
                        // перевірка на ланцюжок взяття тією ж шашкою
                        if (m.capX !== undefined) {
                            var moreCaps = this.getPieceCaptures(board, m.tx, m.ty);
                            if (moreCaps.length) {
                                selected = { x: m.tx, y: m.ty };
                                cursor = { x: m.tx, y: m.ty };
                                validMoves = moreCaps;
                                this.draw();
                                return;
                            }
                        }
                        selected = null;
                        validMoves = [];
                        this.endPlayerTurn();
                        return;
                    }
                }
                // клік по іншій своїй шашці = зміна вибору
                if (this.isWhite(p)) {
                    this.tryPickPiece(cursor.x, cursor.y);
                } else {
                    selected = null;
                    validMoves = [];
                }
                this.draw();
            } else {
                // вибір шашки
                if (this.isWhite(p)) this.tryPickPiece(cursor.x, cursor.y);
                this.draw();
            }
        };

        this.tryPickPiece = function (x, y) {
            // якщо є обов'язкові взяття, можна вибрати тільки шашку, що б'є
            if (mustCapture.length) {
                var found = false;
                for (var i=0; i<mustCapture.length; i++) {
                    if (mustCapture[i].x === x && mustCapture[i].y === y) {
                        selected = { x: x, y: y };
                        validMoves = mustCapture[i].captures;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    selected = null;
                    validMoves = [];
                    info.text('Обовязкове взяття!');
                }
            } else {
                selected = { x: x, y: y };
                validMoves = this.getPieceMoves(board, x, y);
            }
        };

        this.endPlayerTurn = function () {
            // перевірка на кінець гри
            if (this.isGameOver(board, 'black')) {
                phase = 'win';
                info.text('Перемога!');
                overlay.html('Ви перемогли!<br><span class="g-sub">OK — заново</span>').addClass('show');
                this.draw();
                return;
            }
            turn = 'black';
            info.text('Хід компютера...');
            this.draw();
            var s = this;
            setTimeout(function () { s.aiMove(); }, 400);
        };

        this.isGameOver = function (b, color) {
            // у color закінчилися шашки чи немає ходів
            for (var y=0; y<SIZE; y++) for (var x=0; x<SIZE; x++) {
                if (this.color(b[y][x]) === color) {
                    if (this.getPieceCaptures(b, x, y).length || this.getPieceMoves(b, x, y).length) return false;
                }
            }
            return true;
        };

        this.aiMove = function () {
            if (phase !== 'play') return;
            var best = this.findBestMove(board, 'black', 3);
            if (!best) {
                phase = 'win';
                info.text('Перемога!');
                overlay.html('Компютер не може ходити!<br><span class="g-sub">OK — заново</span>').addClass('show');
                this.draw();
                return;
            }
            // виконуємо хід (можливо ланцюжок)
            var fromX = best.fromX, fromY = best.fromY;
            this.doMove(board, fromX, fromY, best.move);
            // якщо було взяття – продовжуємо брати тією ж шашкою жадібно
            if (best.move.capX !== undefined) {
                var curX = best.move.tx, curY = best.move.ty;
                var safe = 0;
                while (safe++ < 10) {
                    var moreCaps = this.getPieceCaptures(board, curX, curY);
                    if (!moreCaps.length) break;
                    // вибираємо будь-яке (можна ускладнити - найкраще)
                    var c = moreCaps[0];
                    this.doMove(board, curX, curY, c);
                    curX = c.tx; curY = c.ty;
                }
            }
            // перевірка перемоги білих
            if (this.isGameOver(board, 'white')) {
                phase = 'lose';
                info.text('Поразка');
                overlay.html('Ви програли<br><span class="g-sub">OK — заново</span>').addClass('show');
                this.draw();
                return;
            }
            turn = 'white';
            mustCapture = this.getCaptures(board, 'white');
            info.text(mustCapture.length ? 'Ваш хід — обовязкове взяття!' : 'Ваш хід');
            this.draw();
        };

        // Минимакс
        this.findBestMove = function (b, color, depth) {
            var moves = this.getAllMoves(b, color);
            if (!moves.length) return null;
            var best = null;
            var bestScore = color === 'black' ? -Infinity : Infinity;
            for (var i=0; i<moves.length; i++) {
                var m = moves[i];
                var nb = this.cloneBoard(b);
                this.doMove(nb, m.fromX, m.fromY, m.move);
                var score = this.minimax(nb, color === 'black' ? 'white' : 'black', depth - 1, -Infinity, Infinity);
                if (color === 'black' && score > bestScore) { bestScore = score; best = m; }
                if (color === 'white' && score < bestScore) { bestScore = score; best = m; }
            }
            return best;
        };

        this.minimax = function (b, color, depth, alpha, beta) {
            if (depth === 0) return this.evaluate(b);
            var moves = this.getAllMoves(b, color);
            if (!moves.length) return color === 'black' ? -1000 : 1000;
            if (color === 'black') {
                var max = -Infinity;
                for (var i=0; i<moves.length; i++) {
                    var nb = this.cloneBoard(b);
                    this.doMove(nb, moves[i].fromX, moves[i].fromY, moves[i].move);
                    var v = this.minimax(nb, 'white', depth - 1, alpha, beta);
                    if (v > max) max = v;
                    if (max > alpha) alpha = max;
                    if (beta <= alpha) break;
                }
                return max;
            } else {
                var min = Infinity;
                for (var j=0; j<moves.length; j++) {
                    var nb2 = this.cloneBoard(b);
                    this.doMove(nb2, moves[j].fromX, moves[j].fromY, moves[j].move);
                    var v2 = this.minimax(nb2, 'black', depth - 1, alpha, beta);
                    if (v2 < min) min = v2;
                    if (min < beta) beta = min;
                    if (beta <= alpha) break;
                }
                return min;
            }
        };

        this.getAllMoves = function (b, color) {
            // якщо є взяття - тільки вони (за правилом)
            var caps = this.getCaptures(b, color);
            var result = [];
            if (caps.length) {
                for (var i=0; i<caps.length; i++) {
                    for (var j=0; j<caps[i].captures.length; j++) {
                        result.push({ fromX: caps[i].x, fromY: caps[i].y, move: caps[i].captures[j] });
                    }
                }
                return result;
            }
            for (var y=0; y<SIZE; y++) for (var x=0; x<SIZE; x++) {
                if (this.color(b[y][x]) === color) {
                    var moves = this.getPieceMoves(b, x, y);
                    for (var k=0; k<moves.length; k++) {
                        result.push({ fromX: x, fromY: y, move: moves[k] });
                    }
                }
            }
            return result;
        };

        this.cloneBoard = function (b) {
            var nb = [];
            for (var y=0; y<SIZE; y++) nb.push(b[y].slice());
            return nb;
        };

        this.evaluate = function (b) {
            // плюси для чорних, мінуси для білих
            var score = 0;
            for (var y=0; y<SIZE; y++) for (var x=0; x<SIZE; x++) {
                var p = b[y][x];
                if (p === 1) score -= 1;
                else if (p === 2) score += 1;
                else if (p === 3) score -= 3;
                else if (p === 4) score += 3;
            }
            return score;
        };

        this.draw = function () {
            var html = '<div class="check-grid">';
            for (var y=0; y<SIZE; y++) for (var x=0; x<SIZE; x++) {
                var dark = (x + y) % 2 === 1;
                var cls = 'check-cell ' + (dark ? 'check-dark' : 'check-light');
                if (cursor.x === x && cursor.y === y && phase === 'play' && turn === 'white') cls += ' check-cursor';
                if (selected && selected.x === x && selected.y === y) cls += ' check-selected';
                // підсвічування валідних ходів
                var isMove = false;
                if (selected && validMoves) {
                    for (var i=0; i<validMoves.length; i++) {
                        if (validMoves[i].tx === x && validMoves[i].ty === y) { isMove = true; break; }
                    }
                }
                if (isMove) cls += ' check-validmove';
                var p = board[y][x];
                var piece = '';
                if (p === 1) piece = '<div class="check-piece check-white"></div>';
                else if (p === 2) piece = '<div class="check-piece check-black"></div>';
                else if (p === 3) piece = '<div class="check-piece check-white check-king"></div>';
                else if (p === 4) piece = '<div class="check-piece check-black check-king"></div>';
                html += '<div class="' + cls + '" data-x="' + x + '" data-y="' + y + '">' + piece + '</div>';
            }
            html += '</div>';
            root.find('.check-board').html(html);
            var s = this;
            root.find('.check-cell').on('click touchend', function(e){
                e.preventDefault();
                if (phase !== 'play') { s.reset(); return; }
                if (turn !== 'white') return;
                cursor.x = parseInt($(this).attr('data-x'), 10);
                cursor.y = parseInt($(this).attr('data-y'), 10);
                s.selectCell();
            });
        };

        this.start = function () {
            var s = this;
            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){if(phase==='play'&&turn==='white'&&cursor.x>0){cursor.x--;s.draw();}},
                right: function(){if(phase==='play'&&turn==='white'&&cursor.x<SIZE-1){cursor.x++;s.draw();}},
                up:    function(){if(phase==='play'&&turn==='white'&&cursor.y>0){cursor.y--;s.draw();}},
                down:  function(){if(phase==='play'&&turn==='white'&&cursor.y<SIZE-1){cursor.y++;s.draw();}},
                enter: function(){
                    if (phase !== 'play') { s.reset(); return; }
                    if (turn !== 'white') return;
                    s.selectCell();
                }
            });
        };

        this.pause = function () {};
        this.destroy = function () {};
    };

    // ============================================================
    //                       ТРИ В РЯД (MATCH-3)
    // ============================================================
    GAMES.match3 = function (root) {
        var canvas, ctx, overlay;
        var COLS = 8, ROWS = 8, TILE;
        var COLORS = 6;     // кількість кольорів каміння
        var grid;            // [y][x] = цвет (0..COLORS-1) или -1 (пусто)
        var cursor = {x:0, y:0};
        var selected = null; // обраний камінь {x, y} или null
        var animQueue = [];  // черга анімацій
        var W, H;
        var score, combo;
        var loopTimer;
        var paused = false, gameOver = false, destroyed = false;
        var moves;           // скільки ходів залишилось
        var MAX_MOVES = 30;

        // палітра каміння з різними формами
        var GEMS = [
            { color: '#f44336', shape: 'circle' },    // червоний
            { color: '#4caf50', shape: 'square' },    // зелений
            { color: '#2196f3', shape: 'diamond' },   // синій
            { color: '#ffc107', shape: 'hexagon' },   // жовтий
            { color: '#9c27b0', shape: 'triangle' },  // фіолетовий
            { color: '#ff9800', shape: 'star' }       // помаранчевий
        ];

        this.create = function () {
            root.html(
                '<div class="game-wrap">' +
                  '<div class="game-info">' +
                    '<span>Рахунок: <b class="g-score">0</b></span>' +
                    '<span>Ходів: <b class="g-moves">' + MAX_MOVES + '</b></span>' +
                    '<span>Комбо: <b class="g-combo">x1</b></span>' +
                    '<span>Рекорд: <b class="g-record">' + getRecord('match3') + '</b></span>' +
                    '<span class="g-hint">Стрілки — курсор, OK — вибрати/поміняти</span>' +
                  '</div>' +
                  '<div class="game-canvas-wrap"><canvas></canvas><div class="game-overlay"></div></div>' +
                '</div>'
            );
            canvas = root.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = root.find('.game-overlay');
        };

        this.resize = function () {
            var wrap = root.find('.game-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            var maxH = rect.height;
            var maxW = rect.width;
            // поле квадратне, мінімум сторона
            var size = Math.min(maxW, maxH);
            if (size < 200) size = 480;
            TILE = Math.floor(size / COLS);
            if (TILE < 30) TILE = 30;
            W = TILE * COLS;
            H = TILE * ROWS;
            canvas.width = W;
            canvas.height = H;
        };

        this.reset = function () {
            this.resize();
            // згенерувати поле БЕЗ початкових збігів
            grid = [];
            for (var y = 0; y < ROWS; y++) {
                var row = [];
                for (var x = 0; x < COLS; x++) {
                    var c;
                    var safe = 0;
                    do {
                        c = Math.floor(Math.random() * COLORS);
                        safe++;
                    } while (safe < 50 && this.wouldMatchAt(row, grid, x, y, c));
                    row.push(c);
                }
                grid.push(row);
            }
            // якщо немає взагалі жодного можливого ходу - перетворюємо
            var safety = 0;
            while (!this.hasAnyMove() && safety++ < 5) {
                this.shuffleGrid();
            }
            cursor = { x: 0, y: 0 };
            selected = null;
            animQueue = [];
            score = 0;
            combo = 1;
            moves = MAX_MOVES;
            paused = false; gameOver = false;
            this.updateUI();
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        // помічник: чи буде збіг якщо поставити колір c в (x,y)
        // row = поточний рядок, що будується (ще не в grid), grid — вже готові рядки
        this.wouldMatchAt = function (row, gridSoFar, x, y, c) {
            // горизонтально: 2 попередніх у тому ж рядку
            if (x >= 2 && row[x-1] === c && row[x-2] === c) return true;
            // вертикально: 2 попередніх у стовпці
            if (y >= 2 && gridSoFar[y-1][x] === c && gridSoFar[y-2][x] === c) return true;
            return false;
        };

        this.updateUI = function () {
            root.find('.g-score').text(score);
            root.find('.g-moves').text(moves);
            root.find('.g-combo').text('x' + combo);
            root.find('.g-record').text(getRecord('match3'));
        };

        this.startLoop = function () {
            this.stopLoop();
            var s = this;
            loopTimer = setInterval(function () { s.tick(); }, 1000/30);
        };
        this.stopLoop = function () { if (loopTimer) { clearInterval(loopTimer); loopTimer = null; } };

        this.tick = function () {
            if (paused || gameOver || destroyed) return;
            // якщо є активні анімації - обробляємо
            if (animQueue.length) {
                var anim = animQueue[0];
                anim.t++;
                if (anim.t >= anim.duration) {
                    // анімація закінчена - виконуємо ефект
                    if (anim.onDone) anim.onDone();
                    animQueue.shift();
                    // після кожної анімації перевіряємо далі
                    this.processCascade();
                }
            }
            this.draw();
        };

        // Знайти всі збіги 3+ в ряд
        this.findMatches = function () {
            var matches = [];
            var matched = {};
            // горизонтальні
            for (var y = 0; y < ROWS; y++) {
                var run = 1;
                for (var x = 1; x <= COLS; x++) {
                    if (x < COLS && grid[y][x] !== -1 && grid[y][x] === grid[y][x-1]) {
                        run++;
                    } else {
                        if (run >= 3) {
                            for (var k = x - run; k < x; k++) {
                                matched[k + ',' + y] = true;
                            }
                            matches.push({ kind: 'h', length: run, color: grid[y][x-1] });
                        }
                        run = 1;
                    }
                }
            }
            // вертикальні
            for (var xx = 0; xx < COLS; xx++) {
                var run2 = 1;
                for (var yy = 1; yy <= ROWS; yy++) {
                    if (yy < ROWS && grid[yy][xx] !== -1 && grid[yy][xx] === grid[yy-1][xx]) {
                        run2++;
                    } else {
                        if (run2 >= 3) {
                            for (var k2 = yy - run2; k2 < yy; k2++) {
                                matched[xx + ',' + k2] = true;
                            }
                            matches.push({ kind: 'v', length: run2, color: grid[yy-1][xx] });
                        }
                        run2 = 1;
                    }
                }
            }
            // збираємо унікальні клітини
            var cells = [];
            for (var key in matched) {
                var p = key.split(',');
                cells.push({ x: parseInt(p[0],10), y: parseInt(p[1],10) });
            }
            return { cells: cells, matches: matches };
        };

        // Запускаємо каскад: шукаємо збіги, ставимо у чергу анімацію зникнення
        this.processCascade = function () {
            if (animQueue.length) return;
            var found = this.findMatches();
            if (!found.cells.length) {
                // немає збігів - каскад закінчено
                combo = 1;
                this.updateUI();
                // перевірка: якщо ходів немає взагалі – перемішуємо
                if (!this.hasAnyMove()) {
                    this.shuffleGrid();
                }
                // кінець гри по ходах?
                if (moves <= 0) {
                    this.endGame();
                }
                return;
            }
            // підрахунок очок
            var pts = 0;
            for (var i = 0; i < found.matches.length; i++) {
                var m = found.matches[i];
                var base = [0, 0, 0, 30, 60, 100, 200][Math.min(m.length, 6)] || 200;
                pts += base;
            }
            pts *= combo;
            score += pts;
            setRecord('match3', score);
            this.updateUI();
            // ставимо анімацію зникнення
            var s = this;
            animQueue.push({
                kind: 'pop',
                cells: found.cells,
                t: 0,
                duration: 8,
                onDone: function () {
                    // видаляємо каміння
                    for (var i = 0; i < found.cells.length; i++) {
                        grid[found.cells[i].y][found.cells[i].x] = -1;
                    }
                    // обрушуємо зверху
                    s.collapse();
                    combo++;
                }
            });
        };

        // Падіння каміння зверху + заповнення новими
        this.collapse = function () {
            for (var x = 0; x < COLS; x++) {
                // стискаємо колонку: ненульові елементи вниз
                var stack = [];
                for (var y = ROWS - 1; y >= 0; y--) {
                    if (grid[y][x] !== -1) stack.push(grid[y][x]);
                }
                for (var y2 = ROWS - 1; y2 >= 0; y2--) {
                    var idx = ROWS - 1 - y2;
                    if (idx < stack.length) grid[y2][x] = stack[idx];
                    else grid[y2][x] = Math.floor(Math.random() * COLORS);
                }
            }
        };

        // Перемішування поля якщо немає ходів
        this.shuffleGrid = function () {
            var all = [];
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                all.push(grid[y][x]);
            }
            // перемішуємо
            for (var i = all.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = all[i]; all[i] = all[j]; all[j] = tmp;
            }
            var idx = 0;
            for (var y2 = 0; y2 < ROWS; y2++) for (var x2 = 0; x2 < COLS; x2++) {
                grid[y2][x2] = all[idx++];
            }
            // якщо знову є початкові збіги - перетворюємося цілком
            if (this.findMatches().cells.length > 0) {
                for (var y3 = 0; y3 < ROWS; y3++) for (var x3 = 0; x3 < COLS; x3++) {
                    grid[y3][x3] = Math.floor(Math.random() * COLORS);
                }
            }
        };

        // Чи є взагалі можливий перебіг? (пробуємо всі свапи і дивимося, чи дасть збіг)
        this.hasAnyMove = function () {
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                // вправо
                if (x < COLS - 1) {
                    this.swap(x, y, x+1, y);
                    var has = this.findMatches().cells.length > 0;
                    this.swap(x, y, x+1, y);
                    if (has) return true;
                }
                // вниз
                if (y < ROWS - 1) {
                    this.swap(x, y, x, y+1);
                    var has2 = this.findMatches().cells.length > 0;
                    this.swap(x, y, x, y+1);
                    if (has2) return true;
                }
            }
            return false;
        };

        this.swap = function (x1, y1, x2, y2) {
            var tmp = grid[y1][x1];
            grid[y1][x1] = grid[y2][x2];
            grid[y2][x2] = tmp;
        };

        // Спроба обміну двох сусідніх клітин
        this.trySwap = function (x1, y1, x2, y2) {
            if (animQueue.length) return; // під час анімації не чіпаємо
            // повинні бути сусідами
            var dx = Math.abs(x1 - x2), dy = Math.abs(y1 - y2);
            if (dx + dy !== 1) return;
            this.swap(x1, y1, x2, y2);
            var found = this.findMatches();
            if (!found.cells.length) {
                // відкат
                this.swap(x1, y1, x2, y2);
                return;
            }
            moves--;
            combo = 1;
            this.updateUI();
            // запускаємо каскад
            this.processCascade();
        };

        this.endGame = function () {
            gameOver = true;
            this.stopLoop();
            setRecord('match3', score);
            overlay.html('Гра закінчена<br>Рахунок: ' + score + '<br><span class="g-sub">OK — заново</span>').addClass('show');
        };

        // Малювання
        this.draw = function () {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, W, H);
            // фон комірок
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                ctx.fillStyle = (x + y) % 2 === 0 ? '#2a2a4e' : '#252548';
                ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            }
            // активна анімація - затемнення зникаючих клітинок
            var popping = {};
            var popT = 0;
            if (animQueue.length && animQueue[0].kind === 'pop') {
                var a = animQueue[0];
                popT = a.t / a.duration;
                for (var p = 0; p < a.cells.length; p++) {
                    popping[a.cells[p].x + ',' + a.cells[p].y] = true;
                }
            }
            // камні
            for (var y2 = 0; y2 < ROWS; y2++) for (var x2 = 0; x2 < COLS; x2++) {
                var c = grid[y2][x2];
                if (c < 0 || c >= COLORS) continue;
                var isPop = popping[x2 + ',' + y2];
                var scale = isPop ? (1 - popT) : 1;
                var alpha = isPop ? (1 - popT) : 1;
                this.drawGem(x2, y2, c, scale, alpha);
            }
            // курсор та обраний
            if (selected) {
                ctx.strokeStyle = '#4caf50';
                ctx.lineWidth = 4;
                ctx.strokeRect(selected.x * TILE + 2, selected.y * TILE + 2, TILE - 4, TILE - 4);
            }
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 3;
            ctx.strokeRect(cursor.x * TILE + 2, cursor.y * TILE + 2, TILE - 4, TILE - 4);
        };

        this.drawGem = function (x, y, colorIdx, scale, alpha) {
            var gem = GEMS[colorIdx];
            var cx = x * TILE + TILE / 2;
            var cy = y * TILE + TILE / 2;
            var r = (TILE * 0.4) * scale;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = gem.color;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            if (gem.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                // спалах
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.arc(cx - r*0.3, cy - r*0.3, r*0.25, 0, Math.PI*2);
                ctx.fill();
            } else if (gem.shape === 'square') {
                ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
                ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.fillRect(cx - r + 4, cy - r + 4, r * 0.5, r * 0.4);
            } else if (gem.shape === 'diamond') {
                ctx.beginPath();
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r, cy);
                ctx.lineTo(cx, cy + r);
                ctx.lineTo(cx - r, cy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.7);
                ctx.lineTo(cx + r * 0.4, cy - r * 0.2);
                ctx.lineTo(cx, cy);
                ctx.closePath();
                ctx.fill();
            } else if (gem.shape === 'hexagon') {
                ctx.beginPath();
                for (var i = 0; i < 6; i++) {
                    var a = Math.PI / 3 * i - Math.PI / 6;
                    var hx = cx + r * Math.cos(a);
                    var hy = cy + r * Math.sin(a);
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.arc(cx - r*0.25, cy - r*0.25, r*0.2, 0, Math.PI*2);
                ctx.fill();
            } else if (gem.shape === 'triangle') {
                ctx.beginPath();
                ctx.moveTo(cx, cy - r);
                ctx.lineTo(cx + r * 0.87, cy + r * 0.5);
                ctx.lineTo(cx - r * 0.87, cy + r * 0.5);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.moveTo(cx, cy - r * 0.7);
                ctx.lineTo(cx + r * 0.3, cy - r * 0.1);
                ctx.lineTo(cx - r * 0.3, cy - r * 0.1);
                ctx.closePath();
                ctx.fill();
            } else if (gem.shape === 'star') {
                ctx.beginPath();
                for (var s = 0; s < 10; s++) {
                    var ang = Math.PI / 5 * s - Math.PI / 2;
                    var rad = s % 2 === 0 ? r : r * 0.45;
                    var sx = cx + rad * Math.cos(ang);
                    var sy = cy + rad * Math.sin(ang);
                    if (s === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        };

        this.start = function () {
            var s = this;

            function moveCursor(dx, dy) {
                if (gameOver) { s.reset(); return; }
                if (animQueue.length) return;
                if (selected) {
                    // якщо у нас обрано сусідню — це хід
                    var nx = selected.x + dx, ny = selected.y + dy;
                    if (nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS) {
                        var sx = selected.x, sy = selected.y;
                        selected = null;
                        s.trySwap(sx, sy, nx, ny);
                        cursor.x = nx; cursor.y = ny;
                    }
                } else {
                    var nx2 = cursor.x + dx, ny2 = cursor.y + dy;
                    if (nx2 >= 0) cursor.x = Math.min(COLS - 1, nx2);
                    if (ny2 >= 0) cursor.y = Math.min(ROWS - 1, ny2);
                    if (nx2 < 0) cursor.x = 0;
                    if (ny2 < 0) cursor.y = 0;
                }
                s.draw();
            }

            setupController({
                toggle: function(){Lampa.Controller.collectionSet(root);Lampa.Controller.collectionFocus(false,root);},
                left:  function(){moveCursor(-1, 0);},
                right: function(){moveCursor(1, 0);},
                up:    function(){moveCursor(0, -1);},
                down:  function(){moveCursor(0, 1);},
                enter: function(){
                    if (gameOver) { s.reset(); return; }
                    if (animQueue.length) return;
                    if (!selected) {
                        selected = { x: cursor.x, y: cursor.y };
                    } else {
                        // якщо на тій самій клітині - знімаємо виділення
                        if (selected.x === cursor.x && selected.y === cursor.y) {
                            selected = null;
                        } else {
                            // якщо сусідня - намагаємося обміняти
                            var dx = Math.abs(cursor.x - selected.x);
                            var dy = Math.abs(cursor.y - selected.y);
                            if (dx + dy === 1) {
                                var sx = selected.x, sy = selected.y;
                                selected = null;
                                s.trySwap(sx, sy, cursor.x, cursor.y);
                            } else {
                                // не сусідня - переносимо вибір сюди
                                selected = { x: cursor.x, y: cursor.y };
                            }
                        }
                    }
                    s.draw();
                }
            });

            // Тач: тап = вибір/обмін із уже обраним; свайп = обмін з сусіднім у напрямку
            this._detachTouch = attachTouch(root, {
                onTap: function (x, y) {
                    if (gameOver) { s.reset(); return; }
                    if (animQueue.length) return;
                    var canvasRect = canvas.getBoundingClientRect();
                    var rootRect = root[0].getBoundingClientRect();
                    var cx = x - (canvasRect.left - rootRect.left);
                    var cy = y - (canvasRect.top - rootRect.top);
                    var gx = Math.floor(cx / TILE);
                    var gy = Math.floor(cy / TILE);
                    if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return;
                    cursor.x = gx; cursor.y = gy;
                    if (!selected) {
                        selected = { x: gx, y: gy };
                    } else {
                        if (selected.x === gx && selected.y === gy) {
                            selected = null;
                        } else {
                            var dx2 = Math.abs(gx - selected.x);
                            var dy2 = Math.abs(gy - selected.y);
                            if (dx2 + dy2 === 1) {
                                var sx2 = selected.x, sy2 = selected.y;
                                selected = null;
                                s.trySwap(sx2, sy2, gx, gy);
                            } else {
                                selected = { x: gx, y: gy };
                            }
                        }
                    }
                    s.draw();
                },
                onSwipe: function (dir) {
                    if (gameOver) { s.reset(); return; }
                    if (animQueue.length) return;
                    // свайп від позиції курсора (або останнього тапу)
                    var sx = cursor.x, sy = cursor.y;
                    var nx = sx, ny = sy;
                    if (dir === 'left')  nx--;
                    if (dir === 'right') nx++;
                    if (dir === 'up')    ny--;
                    if (dir === 'down')  ny++;
                    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
                    selected = null;
                    s.trySwap(sx, sy, nx, ny);
                    cursor.x = nx; cursor.y = ny;
                    s.draw();
                }
            });

            this._r = function(){s.resize();s.draw();};
            $(window).on('resize', this._r);
            setTimeout(function(){if(!destroyed) s.reset();},50);
        };

        this.pause = function(){};
        this.destroy = function(){destroyed=true;this.stopLoop();if(this._detachTouch)this._detachTouch();$(window).off('resize',this._r);};
    };


    function injectCSS() {
        var css =
        '<style>' +
        // Меню
        '.games-menu{padding:2em;color:#fff;height:100%;max-height:100vh;overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;}' +
        '.games-menu__title{font-size:1.6em;margin-bottom:1em;opacity:.8;}' +
        '.games-menu__list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1em;}' +
        '.games-menu__item{display:flex;align-items:center;gap:1em;padding:1em;background:rgba(255,255,255,0.05);border-radius:.6em;cursor:pointer;border:2px solid transparent;transition:all .2s;}' +
        '.games-menu__item.focus{border-color:#ffeb3b;background:rgba(255,235,59,0.12);transform:scale(1.03);}' +
        '.games-menu__icon{flex-shrink:0;width:64px;height:64px;border-radius:.5em;background:#1a1a2e;display:flex;align-items:center;justify-content:center;overflow:hidden;}' +
        '.games-menu__icon svg{width:60px;height:60px;}' +
        '.games-menu__body{flex:1;min-width:0;}' +
        '.games-menu__name{font-size:1.2em;font-weight:600;margin-bottom:.2em;}' +
        '.games-menu__desc{opacity:.6;font-size:.85em;}' +
        '.games-menu__rec{margin-top:.4em;font-size:.8em;color:#ffeb3b;}' +
        // Загальна обгортка ігор
        '.games-play{padding:0.2em;height:100%;box-sizing:border-box;}' +
        '.game-wrap{display:flex;flex-direction:column;align-items:center;color:#fff;height:100%;}' +
        '.game-info{display:flex;gap:0.6em;margin-bottom:0.3em;font-size:0.85em;flex-wrap:wrap;justify-content:center;line-height:1;}' +
        '.game-info span{padding:0.25em 0.5em;background:rgba(255,255,255,0.05);border-radius:.3em;}' +
        '.g-hint{opacity:.5;font-size:.9em;}' +
        '@media (max-height: 700px){.g-hint{display:none;}}' +
        '.game-canvas-wrap{position:relative;width:96vmin;height:calc(100vh - 60px);max-width:99vw;max-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;-webkit-user-select:none;}' +
        '.game-canvas-wrap canvas{display:block;background:#111;border-radius:.5em;box-shadow:0 0 20px rgba(0,0,0,.5);touch-action:none;}' +
        '.game-overlay{position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.7);font-size:2em;text-align:center;border-radius:.5em;z-index:10;}' +
        '.game-overlay.show{display:flex;}' +
        '.g-sub{font-size:.5em;opacity:.7;display:block;margin-top:.5em;}' +
        // Морський бій
        '.sea-wrap{padding:1em;}' +
        '.sea-boards{display:flex;gap:2em;justify-content:center;flex-wrap:wrap;}' +
        '.sea-side{text-align:center;}' +
        '.sea-title{margin-bottom:.5em;opacity:.7;}' +
        '.sea-table{border-collapse:collapse;}' +
        '.sea-cell{width:30px;height:30px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,80,150,0.3);}' +
        '.sea-cell.sea-ship{background:#888;}' +
        '.sea-cell.sea-miss{background:rgba(255,255,255,0.15);}' +
        '.sea-cell.sea-miss::after{content:"·";color:#fff;display:flex;align-items:center;justify-content:center;height:100%;}' +
        '.sea-cell.sea-hit{background:#e53935;}' +
        '.sea-cell.sea-hit::after{content:"X";color:#fff;display:flex;align-items:center;justify-content:center;height:100%;font-weight:bold;}' +
        '.sea-cell.sea-cursor{outline:2px solid #ffeb3b;outline-offset:-2px;}' +
        // Хрестики-нулики
        '.ttt-board{display:grid;grid-template-columns:repeat(3,100px);gap:6px;margin:1em 0;}' +
        '.ttt-cell{width:100px;height:100px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:3em;font-weight:bold;border-radius:.4em;}' +
        '.ttt-cell.ttt-cursor{outline:3px solid #ffeb3b;}' +
        // Memory
        '.memory-board{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:min(80vmin,500px);margin:1em 0;}' +
        '.memory-card{aspect-ratio:1;background:#1976d2;border-radius:.5em;display:flex;align-items:center;justify-content:center;font-size:2.5em;cursor:pointer;transition:all .2s;border:3px solid transparent;}' +
        '.memory-card--open{background:#fff;color:#000;}' +
        '.memory-card--matched{background:#43a047;color:#fff;opacity:.7;}' +
        '.memory-card--cursor{border-color:#ffeb3b;transform:scale(1.05);}' +
        // Minesweeper
        '.mine-board{margin:0.3em 0;display:flex;justify-content:center;}' +
        '.mine-grid{display:grid;gap:1px;background:#37474f;padding:2px;border-radius:.3em;}' +
        '.mine-cell{aspect-ratio:1;width:min(6vmin,40px);background:#cfd8dc;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9em;cursor:pointer;border:1px outset #eceff1;}' +
        '.mine-cell.mine-revealed{background:#90a4ae;border:1px solid #455a64;}' +
        '.mine-cell.mine-bomb{background:#f44336;}' +
        '.mine-cell.mine-flag{background:#ffe082;}' +
        '.mine-cell.mine-cursor{outline:3px solid #ffeb3b;outline-offset:-3px;z-index:1;}' +
        '.mine-cell.mine-n1{color:#1976d2;}' +
        '.mine-cell.mine-n2{color:#388e3c;}' +
        '.mine-cell.mine-n3{color:#d32f2f;}' +
        '.mine-cell.mine-n4{color:#5e35b1;}' +
        '.mine-cell.mine-n5{color:#bf360c;}' +
        '.mine-cell.mine-n6{color:#00695c;}' +
        '.mine-cell.mine-n7{color:#000;}' +
        '.mine-cell.mine-n8{color:#37474f;}' +
        // Шашки
        '.check-board{margin:0.3em 0;display:flex;justify-content:center;}' +
        '.check-grid{display:grid;grid-template-columns:repeat(8,1fr);width:min(70vmin,560px);aspect-ratio:1;border:3px solid #3e2723;}' +
        '.check-cell{display:flex;align-items:center;justify-content:center;position:relative;}' +
        '.check-light{background:#e6c39a;}' +
        '.check-dark{background:#8d6e63;}' +
        '.check-cursor{outline:3px solid #ffeb3b;outline-offset:-3px;z-index:2;}' +
        '.check-selected{outline:3px solid #4caf50;outline-offset:-3px;z-index:1;}' +
        '.check-validmove::after{content:"";position:absolute;width:30%;height:30%;background:rgba(76,175,80,0.5);border-radius:50%;}' +
        '.check-piece{width:75%;height:75%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:min(3vmin,1.4em);font-weight:bold;line-height:1;box-sizing:border-box;}' +
        '.check-white{background:radial-gradient(circle at 30% 30%,#fff,#bdbdbd);border:2px solid #757575;color:#b8860b;}' +
        '.check-black{background:radial-gradient(circle at 30% 30%,#616161,#212121);border:2px solid #000;color:#ffd700;}' +
        '.check-king{box-shadow:0 0 8px rgba(255,215,0,0.8);border-color:#ffd700 !important;}' +
        '.check-king::before{content:"★";}' +
        '</style>';
        $('body').append(css);
    }

    // ============================================================
    //                       ІНІЦІАЛІЗАЦІЯ
    // ============================================================
    function startPlugin() {
        injectCSS();

        Lampa.Component.add('games_menu', GamesMenuComponent);
        Lampa.Component.add('games_play', GamesPlayComponent);

        function addMenuItem() {
            var item = $(
                '<li class="menu__item selector games-menu-item">' +
                    '<div class="menu__ico">' + GAMES_ICON + '</div>' +
                    '<div class="menu__text">Ігри</div>' +
                '</li>'
            );
            item.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Ігри',
                    component: 'games_menu',
                    page: 1
                });
            });
            $('.menu .menu__list').eq(0).append(item);
        }

        if (window.appready) addMenuItem();
        else Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') addMenuItem();
        });
    }

    if (window.Lampa && window.Lampa.Component) startPlugin();
    else {
        var iv = setInterval(function () {
            if (window.Lampa && window.Lampa.Component) {
                clearInterval(iv);
                startPlugin();
            }
        }, 200);
    }

})();
