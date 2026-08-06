(function () {
    'use strict';

    if (window.lampa_mario_plugin) return;
    window.lampa_mario_plugin = true;

    var ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor">' +
        '<rect x="10" y="3"  width="12" height="6"/>' +
        '<rect x="8"  y="9"  width="16" height="4"/>' +
        '<rect x="6"  y="13" width="20" height="6"/>' +
        '<rect x="11" y="14" width="3"  height="3" fill="#fff"/>' +
        '<rect x="18" y="14" width="3"  height="3" fill="#fff"/>' +
        '<rect x="8"  y="19" width="16" height="9"/>' +
        '<rect x="14" y="22" width="4"  height="6" fill="#fff"/>' +
        '</svg>';

    // ============================================================
    //                    ПЛАТФОРМЕР - КОМПОНЕНТ
    // ============================================================
    function MarioComponent(object) {
        var self = this;
        var html, canvas, ctx, overlay, hud;

        var TILE = 32;
        var SCALE = 1;
        var W, H;

        // ----- РІВНІ -----
        // Тайли:
        // ' ' пусто
        // '#' земля (нерушима)
        // 'B' цегла (розбивається)
        // 'Q' ?-блок з монетою
        // 'M' ?-блок з грибом
        // 'q' пустий ?-блок
        // 'P','p' труба верх (ліва, права половини)
        // 'L','l' труба низ (продовження)
        // 'D','d' труба-вхід (опускаєшся вниз = в підземелля) — на основному рівні
        // 'F' флагшток з прапором (верхівка)
        // 'f' древко прапора (продовження)
        // 'S' старт гравця
        // 'X' вихід з підземелля (телепорт назад на поверхню)
        // 'E' гумба
        // 'K' літаюча черепахо-подібний (рухається трохи швидше)
        // '.' хмара (декорація)
        // 'b' кущ (декорація)
        // 'h' пагорб (декорація)

        var LEVEL_OVERWORLD = [
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "  .                                                                                                                                       ",
            "                  .                          ..                                                                                           ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "       .                                                       .              .                                                           ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "          Z                                            Z                                                Z                                  ",
            "                                                                                                                                          ",
            "                  Q       Z                     B   M   B   Q   B                 Z                                                   F   ",
            "                                                                                                                                      f   ",
            "                      Pp            Pp                                Pp                                Pp                            f   ",
            "S         E           Ll      E     Ll  K   E     K         E         Ll  E     E               E       Ll  K     B BB      DD        f   ",
            "############     ##########  ##########  ###########  ##########  ##########  ##########  ##########  ###########################     f   ",
            "############     ##########  ##########  ###########  ##########  ##########  ##########  ##########  ###########################         "
        ];

        var LEVEL_UNDERWORLD = [
            "                                                                                ",
            "                                                                                ",
            "                                                                                ",
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
            "@                                                                              @",
            "@                 Q                 M                       Q                  @",
            "@                                                                              @",
            "@                                                                              @",
            "@                                                                              @",
            "@                B B B            B B B           B B B   B B                  @",
            "@                                                                              @",
            "@   S      E                  E                E                          X    @",
            "@##############################################################################@",
            "@##############################################################################@",
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
        ];

        // Рівень 2-1: небо — стрибки по платформах, прірви
        var LEVEL_SKY = [
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                                                                                                                                          ",
            "                         .                                                 .                                                 .            ",
            "     .                                            .                                                 .                                     ",
            "                                                                                                                                          ",
            "                                                                                Z                                                         ",
            "                              Z                                                                                                           ",
            "               .                                            .                                            Z    .                           ",
            "                                                       Z                                                                                  ",
            "                                                                                                                                          ",
            "                                               M                                                                                          ",
            "                                                                                     Q                                                    ",
            "                       Q                                                                                                                  ",
            "                                            #######                                 K                                               F     ",
            "                      E                     #######                   B Q B       #######                      E                    f     ",
            "                    #######                                                       #######                   #######                 f     ",
            "                    #######        E                    #######                                             #######                 f     ",
            "                                #######                 #######       E E                     #########                             f     ",
            "  S                             #######                             #########                 #########                             f     ",
            "################                                                    #########                                         ##############f     ",
            "################                                                                                                      ###################"
        ];

        // Рівень 2-2: печера — сходи, шипасті їжаки, коридори
        var LEVEL_CAVE = [
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
            "@                                                                                                                                @",
            "@                                                                                                                                @",
            "@                                                                                 Q   M   Q                                      @",
            "@                 Q M                                                                                                            @",
            "@                                                                                                                                @",
            "@                                                                               ##############                                   @",
            "@               ######  ##                                                    ##            ####                                 @",
            "@             ##        ####                           ##                   ####            ######                               @",
            "@           ####        ######                         ##                 ######            ########                             @",
            "@         ######        ########        BQB            ##               ########            ##########                           @",
            "@ S     ########        #E######E  K         E    K    ## E E         ##########          E ##########   E    E    E           X @",
            "##################################################################################################################################",
            "##################################################################################################################################",
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
        ];

        var LEVEL;     // поточний
        var levelKey;  // 'overworld' | 'underworld'
        var savedOverworld; // запамятований стан верхнього світу при провалі
        var startPos;       // запамятована стартова позиція поточного рівня (для респавну після смерті)
        var COLS, ROWS;

        // ----- СТАН -----
        var player;
        var enemies;
        var coins;
        var particles;
        var powerups;     // випавші гриби [{x,y,vx,vy,kind}]
        var camera;
        var coinCount, lives, score;
        var gameOver = false, won = false, paused = false, destroyed = false;
        var levelDone = false;
        var loopTimer;
        var keys;
        var jumpHeld;
        var jumpTimer;
        var coyoteTime;   // скільки кадрів стрибок ще доступний після сходу з землі
        var jumpBuffer;   // запамятовуємо натискання стрибка щоб спрацювало при приземленні
        var deathTimer;
        var winTimer;
        var fadeTimer;     // для ефекту переходу між рівнями
        var fadeKind;      // 'enter' | 'exit'

        // ----- КОНСТАНТИ -----
        var GRAVITY = 0.55;
        var MOVE_ACC = 0.5;
        var MAX_RUN = 4;
        var FRICTION = 0.85;
        var JUMP_VEL = -10;
        var JUMP_SUSTAIN = 18;
        var ENEMY_SPEED = 1;

        this.create = function () {
            html = $(
                '<div class="mario-wrap">' +
                  '<div class="mario-hud">' +
                    '<span>СВІТ: <b class="mario-lvl">1-1</b></span>' +
                    '<span>МОНЕТИ: <b class="mario-coins">0</b></span>' +
                    '<span>ЖИТТЯ: <b class="mario-lives">3</b></span>' +
                    '<span>РАХУНОК: <b class="mario-score">0</b></span>' +
                  '</div>' +
                  '<div class="mario-canvas-wrap">' +
                    '<canvas></canvas>' +
                    '<div class="mario-overlay"></div>' +
                    '<div class="mario-controls">' +
                      '<div class="mario-pad">' +
                        '<div class="mario-btn mario-btn-left">←</div>' +
                        '<div class="mario-btn mario-btn-right">→</div>' +
                      '</div>' +
                      '<div class="mario-btn mario-btn-jump">▲</div>' +
                    '</div>' +
                  '</div>' +
                '</div>'
            );
            canvas = html.find('canvas')[0];
            ctx = canvas.getContext('2d');
            overlay = html.find('.mario-overlay');
            hud = html.find('.mario-hud');
            score = 0; lives = 3; coinCount = 0;
            return html;
        };

        this.resize = function () {
            var wrap = html.find('.mario-canvas-wrap')[0];
            var rect = wrap.getBoundingClientRect();
            W = Math.floor(rect.width);
            H = Math.floor(rect.height);
            if (W < 320) W = 800;
            if (H < 200) H = 500;
            canvas.width = W;
            canvas.height = H;
            // Підлаштовуємо SCALE так, щоб по висоті поміщалося стільки рядків рівня, скільки потрібно для видимості землі та героїні над нею.
            // Висота рівня в тайлах: для overworld ~21, для underworld ~15. Ми хочемо щоб поверхня землі завжди була видима.
            // Беремо 14 видимих рядків як базу, але якщо рівень менше — підганяємо.
            var ROWS_VIEW = Math.min(14, ROWS || 14);
            SCALE = H / (ROWS_VIEW * TILE);
            // Мінімальний масштаб — щоб герой не був зовсім дрібним
            if (SCALE < 0.5) SCALE = 0.5;
        };

        this.loadLevel = function (key) {
            levelKey = key;
            // ВАЖЛИВО: копіюємо рядки, щоб зміни тайлів не псували вихідник
            var src;
            var label;
            if (key === 'overworld')      { src = LEVEL_OVERWORLD;  label = '1-1'; }
            else if (key === 'underworld'){ src = LEVEL_UNDERWORLD; label = '1-2'; }
            else if (key === 'sky')       { src = LEVEL_SKY;        label = '2-1'; }
            else if (key === 'cave')      { src = LEVEL_CAVE;       label = '2-2'; }
            else                          { src = LEVEL_OVERWORLD;  label = '1-1'; }
            LEVEL = src.slice();
            // вирівняємо довжину
            var maxLen = 0;
            for (var i = 0; i < LEVEL.length; i++) if (LEVEL[i].length > maxLen) maxLen = LEVEL[i].length;
            COLS = maxLen;
            ROWS = LEVEL.length;
            for (var j = 0; j < LEVEL.length; j++) {
                while (LEVEL[j].length < maxLen) LEVEL[j] = LEVEL[j] + ' ';
            }
            hud.find('.mario-lvl').text(label);
        };

        this.findStart = function () {
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                if (LEVEL[y].charAt(x) === 'S') {
                    // Розміщуємо героїню так, щоб її низ збігся з верхівкою землі.
                    // Спрайт висотою h = TILE*2 - 4, займає рядок S і рядок вище.
                    // y клітинки 'S' в пікселях: y * TILE. Низ героїні повинен бути = (y+1) * TILE (верх землі під S).
                    // Значить player.y = (y+1)*TILE - h. З h ≈ 60 і TILE=32: для y=16 отримаємо 17*32-60 = 484
                    return { x: x, y: y, pixelY: (y + 1) * TILE - (TILE * 2 - 4) };
                }
            }
            return { x: 1, y: ROWS - 4, pixelY: (ROWS - 3) * TILE - (TILE * 2 - 4) };
        };

        this.spawnEnemies = function () {
            enemies = [];
            for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
                var c = LEVEL[y].charAt(x);
                if (c === 'E') {
                    enemies.push({
                        x: x * TILE, y: y * TILE,
                        vx: -ENEMY_SPEED, vy: 0,
                        w: TILE, h: TILE,
                        alive: true, dead: false, deadTimer: 0,
                        kind: 'goomba', anim: 0,
                        active: false   // активується коли героїня близько
                    });
                } else if (c === 'K') {
                    enemies.push({
                        x: x * TILE, y: y * TILE,
                        vx: -ENEMY_SPEED * 1.4, vy: 0,
                        w: TILE, h: TILE * 1.2,
                        alive: true, dead: false, deadTimer: 0,
                        kind: 'spike', anim: 0,
                        active: false
                    });
                } else if (c === 'Z') {
                    enemies.push({
                        x: x * TILE, y: y * TILE,
                        vx: -ENEMY_SPEED * 1.2, vy: 0,
                        w: TILE, h: TILE,
                        alive: true, dead: false, deadTimer: 0,
                        kind: 'beetle', anim: 0,
                        baseY: y * TILE,
                        flyTime: Math.random() * 100,
                        active: false
                    });
                }
            }
        };

        this.cleanMarkers = function () {
            // прибрати S/E/K/Z з карти
            for (var y = 0; y < ROWS; y++) {
                LEVEL[y] = LEVEL[y].replace(/[SEKZ]/g, ' ');
            }
        };

        this.reset = function () {
            this.resize();
            this.loadLevel('overworld');
            // ВАЖЛИВО: findStart і spawnEnemies ДО cleanMarkers, інакше всі маркери (S/E/K/Z)
            // вже стерті і вороги/старт не знаходяться.
            var st = this.findStart();
            startPos = st;
            this.spawnEnemies();
            this.cleanMarkers();
            player = this.makePlayer(st.x * TILE, st.pixelY);
            coins = []; particles = []; powerups = [];
            camera = { x: 0, y: 0 };
            score = 0; coinCount = 0; lives = 3;
            gameOver = false; won = false; paused = false; levelDone = false;
            jumpHeld = false; jumpTimer = 0;
            coyoteTime = 0; jumpBuffer = 0;
            deathTimer = 0; winTimer = 0; fadeTimer = 0; fadeKind = null;
            keys = { left: false, right: false, jump: false };
            this.updateHUD();
            this.draw();
            this.startLoop();
            overlay.removeClass('show').text('');
        };

        this.makePlayer = function (x, y) {
            return {
                x: x, y: y,
                vx: 0, vy: 0,
                w: TILE - 4,
                h: TILE * 2 - 4,
                onGround: false,
                dir: 1,
                animTime: 0,
                alive: true,
                big: false,
                invuln: 0,
                hairBob: 0
            };
        };

        this.updateHUD = function () {
            hud.find('.mario-coins').text(coinCount);
            hud.find('.mario-lives').text(lives);
            hud.find('.mario-score').text(score);
        };

        this.startLoop = function () {
            this.stopLoop();
            var s = this;
            loopTimer = setInterval(function () { s.tick(); }, 1000/60);
        };
        this.stopLoop = function () { if (loopTimer) { clearInterval(loopTimer); loopTimer = null; } };

        this.tileAtPx = function (px, py) {
            var tx = Math.floor(px / TILE);
            var ty = Math.floor(py / TILE);
            if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return ' ';
            return LEVEL[ty].charAt(tx);
        };
        this.solidAt = function (px, py) {
            var c = this.tileAtPx(px, py);
            // в підземеллі '@' теж твердий
            return c === '#' || c === 'B' || c === 'Q' || c === 'M' || c === 'q' ||
                   c === 'P' || c === 'p' || c === 'L' || c === 'l' ||
                   c === '@';
        };

        this.tick = function () {
            if (window.__mario) window.__mario.tickCount++;
            if (paused || destroyed) return;

            // перехід між рівнями (плавне затемнення)
            if (fadeTimer > 0) {
                fadeTimer--;
                this.draw();
                if (fadeTimer === 30 && fadeKind === 'enter') {
                    // в середині затемнення — змінюємо рівень
                    this.enterUnderworld();
                } else if (fadeTimer === 30 && fadeKind === 'exit') {
                    this.exitUnderworld();
                }
                if (fadeTimer === 0) fadeKind = null;
                return;
            }

            if (gameOver || won) return;

            if (!player.alive) {
                deathTimer++;
                player.vy += GRAVITY;
                player.y += player.vy;
                if (deathTimer > 80) {
                    lives--;
                    this.updateHUD();
                    if (lives <= 0) {
                        gameOver = true;
                        this.stopLoop();
                        overlay.html('Гра закінчена<br>Рахунок: ' + score + '<br><span class="mario-sub">OK / тап — заново</span>').addClass('show');
                    } else {
                        // респавн на збереженій стартовій позиції рівня
                        var st = startPos;
                        if (!st) st = { x: 2, y: ROWS - 4, pixelY: (ROWS - 3) * TILE - (TILE * 2 - 4) };
                        player = this.makePlayer(st.x * TILE, st.pixelY);
                        player.invuln = 90;
                        deathTimer = 0;
                        camera.x = 0;
                        camera.y = 0;
                        // Реактивуємо всіх живих ще ворогів щоб при поверненні
                        // героїні вони знову спрацювали по лінивому спавну
                        for (var ei = 0; ei < enemies.length; ei++) {
                            if (enemies[ei].alive) enemies[ei].active = false;
                        }
                    }
                }
                this.draw();
                return;
            }

            if (levelDone) {
                winTimer++;
                if (winTimer > 100) {
                    // Прогресія рівнів: 1-1 → 2-1 → 2-2 → кінець
                    var nextLevel = null;
                    if (levelKey === 'overworld') nextLevel = 'sky';
                    else if (levelKey === 'sky') nextLevel = 'cave';
                    if (nextLevel) {
                        this.advanceToLevel(nextLevel);
                    } else {
                        won = true;
                        this.stopLoop();
                        overlay.html('Всі рівні пройдені!<br>Рахунок: ' + score + '<br><span class="mario-sub">OK / тап — заново</span>').addClass('show');
                    }
                }
                this.draw();
                return;
            }

            this.updatePlayer();
            this.updateEnemies();
            this.updateCoins();
            this.updateParticles();
            this.updatePowerups();
            this.updateCamera();
            this.draw();
        };

        this.updatePlayer = function () {
            // налагоджувальні лічильники
            if (keys.left)  { if (window.__mario) window.__mario.tickSawLeft  = (window.__mario.tickSawLeft  || 0) + 1; }
            if (keys.right) { if (window.__mario) window.__mario.tickSawRight = (window.__mario.tickSawRight || 0) + 1; }
            if (keys.jump)  { if (window.__mario) window.__mario.tickSawJump  = (window.__mario.tickSawJump  || 0) + 1; }
            // горизонтальна швидкість
            if (keys.left) {
                player.vx -= MOVE_ACC;
                if (player.vx < -MAX_RUN) player.vx = -MAX_RUN;
                player.dir = -1;
            } else if (keys.right) {
                player.vx += MOVE_ACC;
                if (player.vx > MAX_RUN) player.vx = MAX_RUN;
                player.dir = 1;
            } else {
                // У повітрі інерція майже повна — vx зберігається до приземлення.
                // На землі — звичайне тертя (мяке ковзання).
                if (player.onGround) {
                    player.vx *= FRICTION;
                    if (Math.abs(player.vx) < 0.1) player.vx = 0;
                } else {
                    // легкий опір повітря, щоб не було зовсім без сповільнення
                    player.vx *= 0.99;
                }
            }

            // оновлюємо coyote time: якщо на землі — скидаємо лічильник,
            // якщо щойно зійшли — він починає тікати
            if (player.onGround) {
                coyoteTime = 8; // ~130мс при 60fps — вікно прощаючого стрибка
            } else if (coyoteTime > 0) {
                coyoteTime--;
            }
            // оновлюємо jump buffer: якщо гравець натиснув стрибок, запамятовуємо це на ~120мс,
            // щоб при торканні землі стрибок спрацював автоматично
            if (keys.jump) {
                jumpBuffer = 7;
            } else if (jumpBuffer > 0) {
                jumpBuffer--;
            }

            // стрибок: спрацьовує якщо є coyote time (на землі або щойно з краю)
            // І є натискання jump (або ще в буфері)
            if ((keys.jump || jumpBuffer > 0) && coyoteTime > 0 && !jumpHeld) {
                player.vy = JUMP_VEL;
                player.onGround = false;
                jumpHeld = true;
                jumpTimer = 0;
                coyoteTime = 0;
                jumpBuffer = 0;
            }
            if (keys.jump && jumpHeld && jumpTimer < JUMP_SUSTAIN) {
                player.vy -= 0.4;
                jumpTimer++;
            }
            if (!keys.jump) jumpHeld = false;

            // гравітація — але тільки якщо не стоїмо на землі (інакше тряска від мікропадінь)
            if (!player.onGround) {
                player.vy += GRAVITY;
                if (player.vy > 12) player.vy = 12;
            } else if (player.vy > 0) {
                // якщо стояли на землі і vy залишилося позитивним — обнуляємо
                player.vy = 0;
            }

            // перевірка на трубу-портал ВНИЗ (тільки overworld) — провал
            if (levelKey === 'overworld' && keys.left === false && keys.right === false && player.vy >= 0) {
                // якщо прямо під гравцем тайл 'D' і гравець стоїть на ньому
                var px = player.x + player.w / 2;
                var py = player.y + player.h + 2;
                if (this.tileAtPx(px, py) === 'D') {
                    // провал!
                    fadeTimer = 60;
                    fadeKind = 'enter';
                    return;
                }
            }
            // в підземеллі на тайлі X — вихід. Перевіряємо кілька точок тіла щоб
            // вихід спрацьовував коли героїня стоїть на порталі або знаходиться над ним.
            if (levelKey === 'underworld') {
                var cx = player.x + player.w / 2;
                var checks = [
                    [cx, player.y + player.h / 2],     // центр
                    [cx, player.y + player.h - 4],     // ноги
                    [cx, player.y + player.h + 2]      // прямо під ногами
                ];
                for (var ci = 0; ci < checks.length; ci++) {
                    if (this.tileAtPx(checks[ci][0], checks[ci][1]) === 'X') {
                        fadeTimer = 60;
                        fadeKind = 'exit';
                        return;
                    }
                }
            }

            // рух
            this.movePlayerAxis(player.vx, 0);
            this.movePlayerAxis(0, player.vy);

            // Додаткова перевірка удару головою: якщо героїня в стрибку (не падає
            // швидко вниз) і її хітбокс перетинає блок зверху — збиваємо його.
            if (!player.onGround && player.vy < 3) {
                this.checkSideBump();
            }

            // перевірка опори
            if (!this.collidesAt(player.x, player.y + 1, player.w, player.h)) {
                player.onGround = false;
            }

            // випав з карти
            if (player.y > ROWS * TILE + 100) {
                this.killPlayer();
                return;
            }

            // прапор
            var fx = player.x + player.w / 2;
            var fy = player.y + player.h / 2;
            var ftile = this.tileAtPx(fx, fy);
            if (ftile === 'F' || ftile === 'f') {
                levelDone = true;
                score += 1000;
                this.updateHUD();
            }

            // взаємодія з ворогами
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if (!e.alive || e.dead) continue;
                if (this.rectOverlap(player.x, player.y, player.w, player.h, e.x + 4, e.y + 4, e.w - 8, e.h - 8)) {
                    if (player.vy > 0 && player.y + player.h - 8 < e.y + e.h / 2) {
                        if (e.kind === 'spike') {
                            // на «шипастого» стрибати не можна — шкода
                            this.hitPlayer();
                        } else {
                            e.dead = true;
                            e.deadTimer = 30;
                            player.vy = JUMP_VEL * 0.6;
                            score += 100;
                            this.updateHUD();
                        }
                    } else if (player.invuln <= 0) {
                        this.hitPlayer();
                    }
                }
            }

            // підбір грибов
            for (var pi = powerups.length - 1; pi >= 0; pi--) {
                var pu = powerups[pi];
                if (this.rectOverlap(player.x, player.y, player.w, player.h, pu.x, pu.y, pu.w, pu.h)) {
                    if (pu.kind === 'mushroom') {
                        score += 1000;
                        this.updateHUD();
                        if (!player.big) this.growPlayer();
                    }
                    powerups.splice(pi, 1);
                }
            }

            if (player.invuln > 0) player.invuln--;
            player.animTime++;
            player.hairBob = Math.sin(player.animTime * 0.2) * 1.5;
        };

        this.growPlayer = function () {
            // робимо гравця в 2 рази вищим
            var oldH = player.h;
            player.big = true;
            player.h = TILE * 2 + 12;
            player.y -= (player.h - oldH); // зсунути так, щоб низ залишився на місці
        };

        this.shrinkPlayer = function () {
            var oldH = player.h;
            player.big = false;
            player.h = TILE * 2 - 4;
            player.y += (oldH - player.h);
            player.invuln = 90;
        };

        this.hitPlayer = function () {
            if (player.big) {
                this.shrinkPlayer();
            } else {
                this.killPlayer();
            }
        };

        this.movePlayerAxis = function (dx, dy) {
            var steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 4) || 1;
            var sdx = dx / steps;
            var sdy = dy / steps;
            for (var s = 0; s < steps; s++) {
                if (sdx !== 0) {
                    var nx = player.x + sdx;
                    if (this.collidesAt(nx, player.y, player.w, player.h)) {
                        player.vx = 0;
                        break;
                    }
                    player.x = nx;
                }
                if (sdy !== 0) {
                    var ny = player.y + sdy;
                    if (this.collidesAt(player.x, ny, player.w, player.h)) {
                        if (sdy > 0) {
                            player.onGround = true;
                            player.y = Math.floor((ny + player.h) / TILE) * TILE - player.h;
                        } else {
                            this.headBump();
                            player.y = Math.ceil(ny / TILE) * TILE;
                        }
                        player.vy = 0;
                        break;
                    } else {
                        player.y = ny;
                        if (sdy > 0) player.onGround = false;
                    }
                }
            }
        };

        this.collidesAt = function (x, y, w, h) {
            var pts = [
                [x, y], [x + w - 1, y],
                [x, y + h - 1], [x + w - 1, y + h - 1]
            ];
            // якщо висока героїня (велика або з шипом) — додаємо точки по боках
            if (h > TILE) {
                pts.push([x, y + h / 2], [x + w - 1, y + h / 2]);
            }
            for (var i = 0; i < pts.length; i++) {
                if (this.solidAt(pts[i][0], pts[i][1])) return true;
            }
            return false;
        };

        this.headBump = function () {
            // Перевіряємо точки по ширині голови — якщо хоч одна потрапила в цеглу/?-блок,
            // рахуємо удар. Розширюємо зону на ~6px за краї спрайта, щоб не потрібно було
            // прицілюватися ідеально центром.
            var headY = player.y - 2;
            var checkPoints = [
                player.x - 6,                  // далеко зліва від спрайта
                player.x + 4,
                player.x + player.w / 2,
                player.x + player.w - 4,
                player.x + player.w + 6        // далеко справа від спрайта
            ];
            var hitTiles = {};
            for (var i = 0; i < checkPoints.length; i++) {
                var tx = Math.floor(checkPoints[i] / TILE);
                var ty = Math.floor(headY / TILE);
                if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) continue;
                var key = tx + ',' + ty;
                if (hitTiles[key]) continue;
                hitTiles[key] = true;
                this.bumpTileAt(tx, ty);
            }
        };

        // Розширена перевірка удару головою: враховує «майже потрапив в блок».
        // Спрацьовує тільки коли героїня реально близько до нижнього краю блока зверху.
        this.checkSideBump = function () {
            // Спрацьовує тільки коли героїня стрибає І її верхівка дійсно торкається
            // нижнього краю блока. Перевіряємо 3 точки у верхніх 4 пікселях голови.
            var headY = player.y;
            // Якщо верхівка нижче самої нижньої клітинки блоків — не перевіряємо
            var ty = Math.floor((headY - 1) / TILE);
            if (ty < 0 || ty >= ROWS) return;

            // Низ блока в цьому рядку
            var blockBottom = (ty + 1) * TILE;
            // Спрацьовує тільки якщо верхівка близько до низу блока (≤ 4 пікселів)
            if (headY - blockBottom > 4 || headY - blockBottom < -4) return;

            // 3 точки по реальній ширині голови (без розширення)
            var checkPoints = [
                player.x + 4,
                player.x + player.w / 2,
                player.x + player.w - 4
            ];
            var hitTiles = {};
            for (var i = 0; i < checkPoints.length; i++) {
                var tx = Math.floor(checkPoints[i] / TILE);
                if (tx < 0 || tx >= COLS) continue;
                var key = tx + ',' + ty;
                if (hitTiles[key]) continue;
                var c = LEVEL[ty].charAt(tx);
                if (c !== 'B' && c !== 'Q' && c !== 'M') continue;
                // Додаткова перевірка: блок повинен бути РЕАЛЬНО над героїнею —
                // його горизонтальний центр повинен перетинатися з шириною героїні.
                var blockCx = tx * TILE + TILE / 2;
                if (blockCx < player.x - 2 || blockCx > player.x + player.w + 2) continue;
                hitTiles[key] = true;
                this.bumpTileAt(tx, ty);
            }
        };

        this.bumpTileAt = function (tx, ty) {
            var c = LEVEL[ty].charAt(tx);
            if (c === 'B') {
                if (player.big) {
                    // велика героїня може розбити цеглу
                    LEVEL[ty] = LEVEL[ty].substring(0, tx) + ' ' + LEVEL[ty].substring(tx + 1);
                    score += 50;
                    this.updateHUD();
                    for (var k = 0; k < 4; k++) {
                        particles.push({
                            x: tx * TILE + TILE/2, y: ty * TILE + TILE/2,
                            vx: (k % 2 === 0 ? -1 : 1) * (1 + Math.random() * 2),
                            vy: -3 - Math.random() * 2,
                            t: 0, kind: 'brick'
                        });
                    }
                } else {
                    score += 10;
                    this.updateHUD();
                }
            } else if (c === 'Q' || c === 'M') {
                var wasMushroom = (c === 'M');
                LEVEL[ty] = LEVEL[ty].substring(0, tx) + 'q' + LEVEL[ty].substring(tx + 1);
                if (wasMushroom) {
                    powerups.push({
                        x: tx * TILE + 4, y: ty * TILE - TILE,
                        vx: 1, vy: 0,
                        w: TILE - 8, h: TILE - 4,
                        kind: 'mushroom',
                        emerging: 30
                    });
                    score += 200;
                } else {
                    coins.push({
                        x: tx * TILE + TILE/2 - 6, y: ty * TILE,
                        vy: -7, t: 0
                    });
                    score += 200;
                    coinCount++;
                    if (coinCount >= 100) { coinCount = 0; lives++; }
                }
                this.updateHUD();
            }
        };

        this.killPlayer = function () {
            player.alive = false;
            player.vy = JUMP_VEL * 0.7;
            deathTimer = 0;
        };

        this.updateEnemies = function () {
            // Вікно активації: трохи ширше екрана вліво від героїні і до краю екрана справа
            var viewW = W / SCALE;
            var activateLeft = camera.x - TILE * 2;
            var activateRight = camera.x + viewW + TILE * 2;

            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if (!e.alive) continue;
                if (e.dead) {
                    e.deadTimer--;
                    if (e.deadTimer <= 0) e.alive = false;
                    continue;
                }

                // Активація: ворог прокидається коли героїня в зоні видимості
                if (!e.active) {
                    if (e.x > activateLeft && e.x < activateRight) {
                        e.active = true;
                    } else {
                        continue; // спимо — не рухаємося, не падаємо
                    }
                }

                e.anim++;

                // Жук-літун — особливий випадок: летить по синусоїді, без гравітації
                if (e.kind === 'beetle') {
                    e.flyTime++;
                    e.x += e.vx;
                    e.y = e.baseY + Math.sin(e.flyTime * 0.05) * 50;
                    if (e.x < 0 || e.x > COLS * TILE) e.vx = -e.vx;
                    continue;
                }

                e.vy += GRAVITY;
                if (e.vy > 8) e.vy = 8;
                var nx = e.x + e.vx;
                if (this.solidAtRect(nx, e.y, e.w - 4, e.h - 2)) {
                    e.vx = -e.vx;
                } else {
                    e.x = nx;
                }
                var ny = e.y + e.vy;
                if (this.solidAtRect(e.x, ny, e.w - 4, e.h - 2)) {
                    if (e.vy > 0) e.y = Math.floor((ny + e.h) / TILE) * TILE - e.h;
                    else e.y = Math.ceil(ny / TILE) * TILE;
                    e.vy = 0;
                } else {
                    e.y = ny;
                }
                // не падати з країв (з допуском по vy щоб гравітація не заважала)
                var footX = e.vx > 0 ? e.x + e.w : e.x - 1;
                var footY = e.y + e.h + 2;
                if (Math.abs(e.vy) < 1 && !this.solidAt(footX, footY)) {
                    e.vx = -e.vx;
                }
                if (e.y > ROWS * TILE + 100) e.alive = false;
            }
        };

        this.solidAtRect = function (x, y, w, h) {
            return this.solidAt(x, y) || this.solidAt(x + w, y) ||
                   this.solidAt(x, y + h) || this.solidAt(x + w, y + h);
        };

        this.updateCoins = function () {
            for (var i = coins.length - 1; i >= 0; i--) {
                var c = coins[i];
                c.t++;
                c.y += c.vy;
                c.vy += GRAVITY * 0.5;
                if (c.t > 40) coins.splice(i, 1);
            }
        };

        this.updateParticles = function () {
            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.t++;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += GRAVITY * 0.5;
                if (p.t > 60 || p.y > (ROWS + 5) * TILE) particles.splice(i, 1);
            }
        };

        this.updatePowerups = function () {
            for (var i = powerups.length - 1; i >= 0; i--) {
                var p = powerups[i];
                if (p.emerging > 0) {
                    p.emerging--;
                    p.y += 1; // плавно піднімається
                    p.y -= 2;
                    continue;
                }
                p.vy += GRAVITY;
                if (p.vy > 8) p.vy = 8;
                // рух по X з перевіркою стін
                var nx = p.x + p.vx;
                if (this.solidAtRect(nx, p.y, p.w, p.h)) p.vx = -p.vx;
                else p.x = nx;
                // по Y
                var ny = p.y + p.vy;
                if (this.solidAtRect(p.x, ny, p.w, p.h)) {
                    if (p.vy > 0) p.y = Math.floor((ny + p.h) / TILE) * TILE - p.h;
                    else p.y = Math.ceil(ny / TILE) * TILE;
                    p.vy = 0;
                } else {
                    p.y = ny;
                }
                if (p.y > ROWS * TILE + 100) powerups.splice(i, 1);
            }
        };

        this.updateCamera = function () {
            // горизонталь
            var targetX = player.x - W / SCALE / 2 + TILE;
            if (targetX > camera.x) camera.x = targetX;
            if (camera.x < 0) camera.x = 0;
            var maxCamX = COLS * TILE - W / SCALE;
            if (camera.x > maxCamX) camera.x = maxCamX;
            if (camera.x < 0) camera.x = 0;
            // вертикаль — у нас є «мертва зона»: поки героїня всередині неї,
            // камера не рухається взагалі. Це дозволяє землі залишатися нерухомою
            // під час звичайних стрибків, а камера зсувається тільки коли героїня
            // дійсно виходить за межі цієї зони (наприклад дуже високий стрибок).
            var viewH = H / SCALE;
            // бажана позиція героїні на екрані — приблизно 65% від верху
            // (нижня третина). Мертва зона — ±25% від центру цієї точки.
            var anchorY = camera.y + viewH * 0.65;
            var deadTop    = camera.y + viewH * 0.30;
            var deadBottom = camera.y + viewH * 0.85;
            var playerCenterY = player.y + player.h / 2;
            if (playerCenterY < deadTop) {
                // героїня вище зони — камера повзе вгору
                camera.y -= (deadTop - playerCenterY) * 0.4;
            } else if (playerCenterY > deadBottom) {
                // героїня нижче зони — камера повзе вниз
                camera.y += (playerCenterY - deadBottom) * 0.4;
            }
            // обмеження знизу: камера не йде нижче самого нижнього рядка з твердими тайлами,
            // щоб під землею не показувалася пустота
            var groundBottomTy = 0;
            for (var ty = ROWS - 1; ty >= 0; ty--) {
                var hasSolid = false;
                for (var tx = 0; tx < COLS; tx++) {
                    var ch = LEVEL[ty].charAt(tx);
                    if (ch === '#' || ch === '@') { hasSolid = true; break; }
                }
                if (hasSolid) { groundBottomTy = ty + 1; break; }
            }
            var maxCamY = groundBottomTy * TILE - viewH;
            if (maxCamY < 0) maxCamY = 0;
            if (camera.y > maxCamY) camera.y = maxCamY;
            if (camera.y < 0) camera.y = 0;
        };

        this.rectOverlap = function (ax, ay, aw, ah, bx, by, bw, bh) {
            return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
        };

        // ----- ПЕРЕХОДИ МІЖ РІВНЯМИ -----
        this.enterUnderworld = function () {
            // запамятовуємо де була героїня і рахунок
            savedOverworld = {
                playerX: player.x,
                playerY: player.y,
                cameraX: camera.x,
                level: LEVEL.slice() // знімок стану тайлів overworld
            };
            this.loadLevel('underworld');
            var st = this.findStart();
            startPos = st;
            this.spawnEnemies();
            this.cleanMarkers();
            var px = st.x * TILE, py = st.pixelY;
            var wasBig = player.big;
            player = this.makePlayer(px, py);
            if (wasBig) this.growPlayer();
            powerups = []; coins = []; particles = [];
            camera.x = 0;
            camera.y = 0;
        };

        this.exitUnderworld = function () {
            // відновлюємо overworld
            LEVEL = savedOverworld.level;
            COLS = LEVEL[0].length;
            ROWS = LEVEL.length;
            levelKey = 'overworld';
            hud.find('.mario-lvl').text('1-1');
            // ставимо героїню поруч з трубою повернення (просто трохи правіше точки D)
            var px = savedOverworld.playerX + TILE * 4;
            var py = savedOverworld.playerY;
            var wasBig = player.big;
            player = this.makePlayer(px, py);
            if (wasBig) this.growPlayer();
            this.spawnEnemies();
            powerups = []; coins = []; particles = [];
            camera.x = savedOverworld.cameraX;
            camera.y = 0;
        };

        // Перехід на наступний рівень в прогресії (після прапора)
        this.advanceToLevel = function (key) {
            this.loadLevel(key);
            var st = this.findStart();
            startPos = st;
            this.spawnEnemies();
            this.cleanMarkers();
            var wasBig = player.big;
            player = this.makePlayer(st.x * TILE, st.pixelY);
            if (wasBig) this.growPlayer();
            powerups = []; coins = []; particles = [];
            camera = { x: 0, y: 0 };
            levelDone = false; winTimer = 0;
        };

        // ============================================================
        //                            ВІДМАЛЬОВКА
        // ============================================================
        this.draw = function () {
            // фон
            if (levelKey === 'overworld' || levelKey === 'sky') {
                // блакитне небо з легким градієнтом (для sky трохи світліше)
                var grad = ctx.createLinearGradient(0, 0, 0, H);
                if (levelKey === 'sky') {
                    grad.addColorStop(0, '#7badff');
                    grad.addColorStop(1, '#cfe7ff');
                } else {
                    grad.addColorStop(0, '#5c94fc');
                    grad.addColorStop(1, '#9bbcfa');
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, W, H);
            } else {
                // підземелля/печера: чорний з темно-синім градієнтом
                var grad2 = ctx.createLinearGradient(0, 0, 0, H);
                grad2.addColorStop(0, '#000');
                grad2.addColorStop(1, '#0a0a25');
                ctx.fillStyle = grad2;
                ctx.fillRect(0, 0, W, H);
            }

            ctx.save();
            ctx.scale(SCALE, SCALE);
            ctx.translate(-camera.x, -camera.y);

            var startCol = Math.max(0, Math.floor(camera.x / TILE) - 1);
            var endCol = Math.min(COLS, startCol + Math.ceil(W / SCALE / TILE) + 2);

            // декорація заднього плану (тільки overworld і sky)
            if (levelKey === 'overworld') {
                this.drawHills(startCol, endCol);
            }

            // фонові тайли (хмари, кущі)
            for (var y = 0; y < ROWS; y++) {
                for (var x = startCol; x < endCol; x++) {
                    var c = LEVEL[y].charAt(x);
                    if (c === '.') this.drawCloud(x, y);
                    else if (c === 'b') this.drawBush(x, y);
                }
            }
            // тверді тайли (без труб - вони йдуть окремим шаром поверх гравця)
            for (var y2 = 0; y2 < ROWS; y2++) {
                for (var x2 = startCol; x2 < endCol; x2++) {
                    var ch = LEVEL[y2].charAt(x2);
                    if (ch === '#') this.drawGround(x2, y2);
                    else if (ch === '@') this.drawCaveBlock(x2, y2);
                    else if (ch === 'B') this.drawBrick(x2, y2);
                    else if (ch === 'Q') this.drawQBlock(x2, y2, 'coin');
                    else if (ch === 'M') this.drawQBlock(x2, y2, 'mushroom');
                    else if (ch === 'q') this.drawQBlock(x2, y2, null);
                    else if (ch === 'X') this.drawExit(x2, y2);
                }
            }

            // монети-ефекти
            for (var i = 0; i < coins.length; i++) this.drawCoinFx(coins[i]);
            // осколки
            for (var pi = 0; pi < particles.length; pi++) this.drawParticle(particles[pi]);
            // гриби
            for (var pwi = 0; pwi < powerups.length; pwi++) this.drawMushroom(powerups[pwi]);
            // вороги
            for (var ei = 0; ei < enemies.length; ei++) {
                var en = enemies[ei];
                if (!en.alive) continue;
                if (en.dead) this.drawEnemySquished(en);
                else this.drawEnemy(en);
            }
            // героїня
            if (player.alive || (deathTimer < 80 && !gameOver)) {
                if (player.invuln > 0 && Math.floor(player.invuln / 4) % 2 === 0) {
                    // мигання — пропускаємо
                } else {
                    this.drawHero();
                }
            }

            // ТРУБИ — збираємо цілком і малюємо кожну як єдиний прямокутник.
            // Групи сусідніх 'P' (або 'D') в одному рядку = один обід-верхівка.
            // Під ободом можуть бути 'L' клітини = тіло труби.
            this.drawAllPipes(startCol, endCol);

            // ПРАПОР — малюється як єдина щогла від 'F' до останнього 'f', щоб не було розривів
            this.drawAllFlags(startCol, endCol);

            ctx.restore();

            // ефект переходу (плавне затемнення)
            if (fadeTimer > 0) {
                var alpha = fadeTimer > 30 ? (60 - fadeTimer) / 30 : fadeTimer / 30;
                ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
                ctx.fillRect(0, 0, W, H);
            }
        };

        this.drawHills = function (startCol, endCol) {
            // дальній паралакс - пагорби
            ctx.save();
            ctx.translate(camera.x * 0.3, 0);
            for (var i = 0; i < 5; i++) {
                var hx = i * 280 + 50 - camera.x * 0.3;
                var hy = (ROWS - 5) * TILE;
                ctx.fillStyle = '#1f9b3d';
                ctx.beginPath();
                ctx.arc(hx, hy, 100, Math.PI, 0);
                ctx.fill();
                // відблиск
                ctx.fillStyle = '#2dd055';
                ctx.beginPath();
                ctx.arc(hx - 20, hy - 30, 25, Math.PI, 0);
                ctx.fill();
            }
            ctx.restore();
        };

        this.drawGround = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            var aboveEmpty = (ty > 0) && LEVEL[ty - 1].charAt(tx) === ' ';
            // основний колір — цегляно-коричневий (як в NES-класиці)
            ctx.fillStyle = '#c84c0c';
            ctx.fillRect(x, y, TILE, TILE);
            // світлий відблиск у верхній-лівій частині блока
            ctx.fillStyle = '#e36b1a';
            ctx.fillRect(x, y, TILE, 4);
            ctx.fillRect(x, y, 3, TILE);
            // темна тінь знизу-справа
            ctx.fillStyle = '#7a2c00';
            ctx.fillRect(x, y + TILE - 3, TILE, 3);
            ctx.fillRect(x + TILE - 3, y, 3, TILE);
            // середня горизонтальна лінія (шов цеглин)
            ctx.fillStyle = '#7a2c00';
            ctx.fillRect(x, y + TILE/2 - 1, TILE, 2);
            // вертикальні шви (в шаховому порядку)
            if (ty % 2 === 0) {
                ctx.fillRect(x + TILE/2 - 1, y, 2, TILE/2);
                ctx.fillRect(x + TILE/4 - 1, y + TILE/2, 2, TILE/2);
                ctx.fillRect(x + 3*TILE/4 - 1, y + TILE/2, 2, TILE/2);
            } else {
                ctx.fillRect(x + TILE/4 - 1, y, 2, TILE/2);
                ctx.fillRect(x + 3*TILE/4 - 1, y, 2, TILE/2);
                ctx.fillRect(x + TILE/2 - 1, y + TILE/2, 2, TILE/2);
            }
            // травянистий верх (тільки над пустотою)
            if (aboveEmpty) {
                // основна смуга трави — перекриває верхівку цегли
                ctx.fillStyle = '#43a047';
                ctx.fillRect(x, y, TILE, 8);
                // світлий відблиск трави
                ctx.fillStyle = '#66bb6a';
                ctx.fillRect(x, y, TILE, 2);
                // темна межа трави
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(x, y + 8, TILE, 2);
                // окремі травинки стирчать вгору (нижній край нерівний)
                ctx.fillStyle = '#43a047';
                ctx.fillRect(x + 4,  y - 2, 2, 4);
                ctx.fillRect(x + 14, y - 1, 2, 3);
                ctx.fillRect(x + 24, y - 2, 2, 4);
                // темні штрихи трави
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(x + 5,  y + 3, 1, 4);
                ctx.fillRect(x + 11, y + 4, 1, 3);
                ctx.fillRect(x + 17, y + 2, 1, 5);
                ctx.fillRect(x + 24, y + 4, 1, 3);
                // світлі травинки між ними
                ctx.fillStyle = '#a5d6a7';
                ctx.fillRect(x + 8,  y + 3, 1, 3);
                ctx.fillRect(x + 21, y + 2, 1, 4);
            }
            // дрібні камінці-краплинки для текстуры
            var seed = (tx * 7 + ty * 13) % 100;
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            if (seed < 70) {
                ctx.fillRect(x + (seed % TILE), y + 14 + ((seed * 3) % (TILE - 16)), 2, 2);
            }
            ctx.fillStyle = 'rgba(255,200,150,0.2)';
            if (seed < 50) {
                ctx.fillRect(x + ((seed * 5) % TILE), y + 16 + ((seed * 7) % (TILE - 18)), 1, 1);
            }
        };


        this.drawCaveBlock = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            // темно-бірюзовий камінь
            ctx.fillStyle = '#1e4a5a';
            ctx.fillRect(x, y, TILE, TILE);
            ctx.fillStyle = '#2a6b80';
            ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
            ctx.fillStyle = '#0d2b35';
            ctx.fillRect(x, y + TILE/2 - 1, TILE, 2);
            ctx.fillRect(x + TILE/2 - 1, y, 2, TILE);
            // мерехтливі кристали (рідко)
            if ((tx * 7 + ty * 13) % 11 === 0) {
                ctx.fillStyle = '#7dd3fc';
                ctx.fillRect(x + TILE/3, y + TILE/3, 4, 4);
                ctx.fillStyle = '#bae6fd';
                ctx.fillRect(x + TILE/3 + 1, y + TILE/3 + 1, 2, 2);
            }
        };

        this.drawBrick = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            var baseCol, lightCol, darkCol;
            if (levelKey === 'underworld' || levelKey === 'cave') {
                baseCol = '#3a7d8f'; lightCol = '#5fb0c5'; darkCol = '#1c4a55';
            } else {
                baseCol = '#c84c0c'; lightCol = '#e36b1a'; darkCol = '#7a2c00';
            }
            ctx.fillStyle = baseCol;
            ctx.fillRect(x, y, TILE, TILE);
            // відблиск зверху-зліва
            ctx.fillStyle = lightCol;
            ctx.fillRect(x, y, TILE, 3);
            ctx.fillRect(x, y, 3, TILE);
            // тінь знизу-справа
            ctx.fillStyle = darkCol;
            ctx.fillRect(x, y + TILE - 3, TILE, 3);
            ctx.fillRect(x + TILE - 3, y, 3, TILE);
            // шви
            ctx.fillStyle = darkCol;
            ctx.fillRect(x, y + TILE/2 - 1, TILE, 2);
            ctx.fillRect(x + TILE/2 - 1, y + 3, 2, TILE/2 - 3);
            ctx.fillRect(x + TILE/4 - 1, y + TILE/2 + 1, 2, TILE/2 - 4);
            ctx.fillRect(x + 3*TILE/4 - 1, y + TILE/2 + 1, 2, TILE/2 - 4);
        };

        this.drawQBlock = function (tx, ty, kind) {
            var x = tx * TILE, y = ty * TILE;
            var active = kind !== null;
            var phase = Math.floor(Date.now() / 250) % 3;
            var col = active
                ? [ '#fbbf24', '#f59e0b', '#fcd34d' ][phase]
                : '#7a3a00';
            ctx.fillStyle = col;
            ctx.fillRect(x, y, TILE, TILE);
            // відблиск
            ctx.fillStyle = active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)';
            ctx.fillRect(x + 2, y + 2, TILE - 4, 4);
            ctx.fillRect(x + 2, y + 2, 4, TILE - 4);
            // тінь
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(x + 2, y + TILE - 4, TILE - 4, 2);
            ctx.fillRect(x + TILE - 4, y + 2, 2, TILE - 4);
            // рамка
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, TILE, 2);
            ctx.fillRect(x, y + TILE - 2, TILE, 2);
            ctx.fillRect(x, y, 2, TILE);
            ctx.fillRect(x + TILE - 2, y, 2, TILE);
            // заклепки в кутах
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 4, y + 4, 3, 3);
            ctx.fillRect(x + TILE - 7, y + 4, 3, 3);
            ctx.fillRect(x + 4, y + TILE - 7, 3, 3);
            ctx.fillRect(x + TILE - 7, y + TILE - 7, 3, 3);
            if (active) {
                // знак питання
                ctx.fillStyle = '#fff';
                ctx.fillRect(x + TILE/2 - 4, y + 8, 8, 3);
                ctx.fillRect(x + TILE/2 + 2, y + 8, 3, 6);
                ctx.fillRect(x + TILE/2 - 1, y + 14, 4, 3);
                ctx.fillRect(x + TILE/2 - 1, y + TILE - 10, 4, 3);
                // тінь від ?
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.fillRect(x + TILE/2 - 3, y + 9, 8, 1);
            }
        };


        // ============================================================
        //                 МАЛЮВАННЯ ТРУБ (ЄДИНІ ПРЯМОКУТНИКИ)
        // ============================================================
        // Головна функція: проходить по всій карті, знаходить всі труби, малює цілком.
        this.drawAllPipes = function (startCol, endCol) {
            // Захист від подвійного малювання однієї і тієї ж труби
            var drawn = {};
            for (var ty = 0; ty < ROWS; ty++) {
                for (var tx = startCol; tx < endCol; tx++) {
                    if (drawn[ty + ',' + tx]) continue;
                    var ch = LEVEL[ty].charAt(tx);
                    // Звичайна труба — починаємо з верхівки 'P' або нижньої 'L' (якщо верхівка поза кадром)
                    if (ch === 'P') {
                        // Знайти ширину верхівки (скільки P підряд)
                        var pipeLeft = tx;
                        while (pipeLeft - 1 >= 0 && LEVEL[ty].charAt(pipeLeft - 1) === 'p') pipeLeft--;
                        if (drawn[ty + ',' + pipeLeft]) continue;
                        var pipeRight = tx;
                        while (pipeRight + 1 < COLS && LEVEL[ty].charAt(pipeRight + 1) === 'p') pipeRight++;
                        // Знайти висоту тіла (скільки L під верхівкою)
                        var pipeBottom = ty;
                        while (pipeBottom + 1 < ROWS) {
                            var below = LEVEL[pipeBottom + 1].charAt(pipeLeft);
                            if (below === 'L' || below === 'l') pipeBottom++;
                            else break;
                        }
                        this.drawPipeRect(pipeLeft, ty, pipeRight - pipeLeft + 1, pipeBottom - ty + 1, true);
                        // Позначаємо як намальовані всі клітини цієї труби
                        for (var py = ty; py <= pipeBottom; py++) {
                            for (var px = pipeLeft; px <= pipeRight; px++) {
                                drawn[py + ',' + px] = true;
                            }
                        }
                    }
                    // Портальна труба
                    else if (ch === 'D') {
                        var dLeft = tx;
                        while (dLeft - 1 >= 0 && LEVEL[ty].charAt(dLeft - 1) === 'D') dLeft--;
                        if (drawn[ty + ',' + dLeft]) continue;
                        var dRight = tx;
                        while (dRight + 1 < COLS && LEVEL[ty].charAt(dRight + 1) === 'D') dRight++;
                        this.drawPortalPipeRect(dLeft, ty, dRight - dLeft + 1);
                        for (var pdx = dLeft; pdx <= dRight; pdx++) {
                            drawn[ty + ',' + pdx] = true;
                        }
                    }
                }
            }
        };

        // Малює трубу як єдиний прямокутник: з верхівкою-ободом і тілом.
        // (tx, ty) - верхня ліва клітина верхівки. widthTiles, heightTiles — загальний розмір.
        this.drawPipeRect = function (tx, ty, widthTiles, heightTiles, hasCap) {
            var x = tx * TILE;
            var y = ty * TILE;
            var w = widthTiles * TILE;
            var h = heightTiles * TILE;
            var capH = 12;
            var bodyTop = hasCap ? y + capH : y;
            var bodyH = h - (hasCap ? capH : 0);

            // ---- Тіло труби ----
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(x, bodyTop, w, bodyH);
            // відблиск зліва
            ctx.fillStyle = '#86efac';
            ctx.fillRect(x + 4, bodyTop, 4, bodyH);
            ctx.fillStyle = '#bbf7d0';
            ctx.fillRect(x + 6, bodyTop, 1, bodyH);
            // тінь справа
            ctx.fillStyle = '#15803d';
            ctx.fillRect(x + w - 8, bodyTop, 8, bodyH);
            ctx.fillStyle = '#0f6230';
            ctx.fillRect(x + w - 4, bodyTop, 2, bodyH);
            // обведення боків
            ctx.fillStyle = '#000';
            ctx.fillRect(x, bodyTop, 1, bodyH);
            ctx.fillRect(x + w - 1, bodyTop, 1, bodyH);

            // ---- Верхівка-обід ----
            if (hasCap) {
                var capX = x - 4;
                var capW = w + 8;
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(capX, y, capW, capH);
                ctx.fillStyle = '#86efac';
                ctx.fillRect(capX, y + 2, capW, 2);
                ctx.fillStyle = '#15803d';
                ctx.fillRect(capX, y + 8, capW, 2);
                // обведення
                ctx.fillStyle = '#000';
                ctx.fillRect(capX, y, capW, 1);
                ctx.fillRect(capX, y + 11, capW, 1);
                ctx.fillRect(capX, y, 1, capH);
                ctx.fillRect(capX + capW - 1, y, 1, capH);
            }
        };

        // Малює портальну трубу як єдиний прямокутник
        this.drawPortalPipeRect = function (tx, ty, widthTiles) {
            // Спочатку малюємо як звичайну трубу з верхівкою і без тіла
            this.drawPipeRect(tx, ty, widthTiles, 1, true);

            // Темна «дірка» в центрі труби
            var x = tx * TILE;
            var y = ty * TILE;
            var w = widthTiles * TILE;
            var holeCx = x + w / 2;
            ctx.fillStyle = '#000';
            ctx.fillRect(holeCx - 8, y + 14, 16, TILE - 16);

            // Миготлива жовта стрілка
            if (Math.floor(Date.now() / 400) % 2 === 0) {
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(holeCx - 4, y + 16, 8, 6);
                ctx.beginPath();
                ctx.moveTo(holeCx - 7, y + 22);
                ctx.lineTo(holeCx + 7, y + 22);
                ctx.lineTo(holeCx, y + TILE - 3);
                ctx.closePath();
                ctx.fill();
            }
        };


        this.drawCloud = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            // основний масив
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + 16, y + 18, 12, 0, Math.PI * 2);
            ctx.arc(x + 28, y + 14, 14, 0, Math.PI * 2);
            ctx.arc(x + 42, y + 18, 12, 0, Math.PI * 2);
            ctx.arc(x + 50, y + 22, 8, 0, Math.PI * 2);
            ctx.fill();
            // нижня тінь
            ctx.fillStyle = '#cfe7ff';
            ctx.beginPath();
            ctx.arc(x + 16, y + 24, 10, 0, Math.PI);
            ctx.arc(x + 30, y + 26, 12, 0, Math.PI);
            ctx.arc(x + 46, y + 24, 10, 0, Math.PI);
            ctx.fill();
            // відблиск зверху
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + 28, y + 12, 6, 0, Math.PI * 2);
            ctx.fill();
        };

        this.drawBush = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            ctx.fillStyle = '#43a047';
            ctx.beginPath();
            ctx.arc(x + 8, y + TILE - 4, 8, Math.PI, 0);
            ctx.arc(x + 18, y + TILE - 8, 10, Math.PI, 0);
            ctx.arc(x + 28, y + TILE - 4, 8, Math.PI, 0);
            ctx.fill();
            // відблиск
            ctx.fillStyle = '#66bb6a';
            ctx.beginPath();
            ctx.arc(x + 16, y + TILE - 12, 5, 0, Math.PI * 2);
            ctx.fill();
            // квіточка
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 22, y + TILE - 10, 2, 2);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x + 22, y + TILE - 10, 1, 1);
        };

        // ============================================================
        //                     МАЛЮВАННЯ ПРАПОРА (ЄДИНА ЩОГЛА)
        // ============================================================
        this.drawAllFlags = function (startCol, endCol) {
            // Знаходимо всі групи 'F' (верхівка прапора) і малюємо щоглу від F до останнього f під нею
            var drawn = {};
            for (var ty = 0; ty < ROWS; ty++) {
                for (var tx = startCol; tx < endCol; tx++) {
                    if (drawn[ty + ',' + tx]) continue;
                    if (LEVEL[ty].charAt(tx) !== 'F') continue;
                    // Знайти кінець щогли вниз
                    var bottomTy = ty;
                    while (bottomTy + 1 < ROWS && LEVEL[bottomTy + 1].charAt(tx) === 'f') bottomTy++;
                    this.drawFlagPoleAndTop(tx, ty, bottomTy);
                    for (var py = ty; py <= bottomTy; py++) drawn[py + ',' + tx] = true;
                }
            }
        };

        this.drawFlagPoleAndTop = function (tx, topTy, bottomTy) {
            var x = tx * TILE;
            var topY = topTy * TILE;
            var bottomY = (bottomTy + 1) * TILE;
            var poleH = bottomY - topY;
            // Парна ширина щогли (4 пікселі), центр в середині клітини
            var poleW = 4;
            var poleX = x + Math.floor(TILE / 2) - Math.floor(poleW / 2);

            // Щогла — єдиний прямокутник від верхівки до основи
            ctx.fillStyle = '#9ca3af';
            ctx.fillRect(poleX, topY, poleW, poleH);
            // Відблиск зліва
            ctx.fillStyle = '#d1d5db';
            ctx.fillRect(poleX, topY, 1, poleH);
            // Тінь справа
            ctx.fillStyle = '#6b7280';
            ctx.fillRect(poleX + poleW - 1, topY, 1, poleH);

            // Кулька на верхівці (поверх щогли)
            // cevamnelampaplagin ukr
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(x + TILE / 2, topY + 4, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(x + TILE / 2 - 1, topY + 3, 2, 0, Math.PI * 2);
            ctx.fill();

            // Прапор — білий трикутник
            var wave = Math.sin(Date.now() / 200) * 2;
            var flagAnchorX = poleX; // прапор кріпиться до лівого краю щогли
            var flagY = topY + 12;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(flagAnchorX, flagY);
            ctx.lineTo(flagAnchorX - 16 + wave, flagY + 6);
            ctx.lineTo(flagAnchorX - 14 + wave, flagY + 12);
            ctx.lineTo(flagAnchorX, flagY + 16);
            ctx.closePath();
            ctx.fill();
            // Точка-зірка
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(flagAnchorX - 8 + wave / 2, flagY + 7, 3, 3);
        };


        this.drawExit = function (tx, ty) {
            var x = tx * TILE, y = ty * TILE;
            // тепле світло — портал назовні
            var pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
            ctx.fillStyle = 'rgba(251,191,36,' + pulse + ')';
            ctx.fillRect(x, y, TILE, TILE);
            ctx.fillStyle = 'rgba(255,255,255,' + pulse + ')';
            ctx.beginPath();
            ctx.arc(x + TILE/2, y + TILE/2, 8, 0, Math.PI * 2);
            ctx.fill();
            // стрілка вгору
            ctx.fillStyle = '#000';
            ctx.fillRect(x + TILE/2 - 1, y + 8, 2, 16);
            ctx.beginPath();
            ctx.moveTo(x + TILE/2 - 6, y + 12);
            ctx.lineTo(x + TILE/2 + 6, y + 12);
            ctx.lineTo(x + TILE/2, y + 4);
            ctx.closePath();
            ctx.fill();
        };

        this.drawCoinFx = function (co) {
            ctx.fillStyle = '#fde047';
            ctx.fillRect(co.x, co.y, 12, 16);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(co.x, co.y, 12, 2);
            ctx.fillRect(co.x, co.y + 14, 12, 2);
            ctx.fillStyle = '#92400e';
            ctx.fillRect(co.x + 4, co.y + 4, 4, 8);
        };

        this.drawParticle = function (p) {
            ctx.fillStyle = '#c2410c';
            ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
            ctx.fillStyle = '#7a2c00';
            ctx.fillRect(p.x - 4, p.y, 8, 2);
        };

        this.drawMushroom = function (p) {
            // гриб з червоним капелюшком і білими плямами
            var x = p.x, y = p.y;
            var w = p.w, h = p.h;
            // ніжка
            ctx.fillStyle = '#fde68a';
            ctx.fillRect(x + 4, y + h/2, w - 8, h/2);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x + 4, y + h - 4, w - 8, 4);
            // капелюшок
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, w/2, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(x, y + h/2 - 1, w, 4);
            // темний низ капелюшка
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(x, y + h/2 + 2, w, 2);
            // плями
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + w/2 - 6, y + h/2 - 2, 3, 0, Math.PI * 2);
            ctx.arc(x + w/2 + 6, y + h/2 - 4, 4, 0, Math.PI * 2);
            ctx.fill();
            // оченята
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 7, y + h/2 + 6, 3, 4);
            ctx.fillRect(x + w - 10, y + h/2 + 6, 3, 4);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 7, y + h/2 + 6, 1, 1);
            ctx.fillRect(x + w - 10, y + h/2 + 6, 1, 1);
        };

        this.drawEnemy = function (e) {
            var x = e.x, y = e.y;
            if (e.kind === 'goomba') {
                // тіло
                ctx.fillStyle = '#7b3f00';
                ctx.fillRect(x + 4, y + 6, e.w - 8, e.h - 14);
                // купол шапки
                ctx.fillStyle = '#7b3f00';
                ctx.beginPath();
                ctx.arc(x + e.w/2, y + 8, e.w/2 - 2, Math.PI, 0);
                ctx.fill();
                // відблиск
                ctx.fillStyle = '#a86a30';
                ctx.beginPath();
                ctx.arc(x + e.w/2 - 4, y + 6, 4, 0, Math.PI * 2);
                ctx.fill();
                // очі
                ctx.fillStyle = '#fff';
                ctx.fillRect(x + 8, y + 12, 6, 8);
                ctx.fillRect(x + e.w - 14, y + 12, 6, 8);
                ctx.fillStyle = '#000';
                ctx.fillRect(x + 10, y + 14, 3, 4);
                ctx.fillRect(x + e.w - 12, y + 14, 3, 4);
                // брови
                ctx.fillStyle = '#3e1f00';
                ctx.fillRect(x + 6, y + 9, 8, 3);
                ctx.fillRect(x + e.w - 14, y + 9, 8, 3);
                // ніжки (анімація)
                var off = Math.floor(e.anim / 8) % 2;
                ctx.fillStyle = '#3e1f00';
                ctx.fillRect(x + 4, y + e.h - 8 + (off ? 0 : 2), 8, 6);
                ctx.fillRect(x + e.w - 12, y + e.h - 8 + (off ? 2 : 0), 8, 6);
            } else if (e.kind === 'spike') {
                // шипастий їжак
                ctx.fillStyle = '#374151';
                ctx.fillRect(x + 4, y + 8, e.w - 8, e.h - 14);
                // шипи
                ctx.fillStyle = '#1f2937';
                for (var i = 0; i < 4; i++) {
                    var sx = x + 6 + i * 6;
                    ctx.beginPath();
                    ctx.moveTo(sx, y + 8);
                    ctx.lineTo(sx + 4, y + 8);
                    ctx.lineTo(sx + 2, y);
                    ctx.closePath();
                    ctx.fill();
                }
                // очі
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(x + 8, y + 14, 4, 4);
                ctx.fillRect(x + e.w - 12, y + 14, 4, 4);
                ctx.fillStyle = '#fff';
                ctx.fillRect(x + 9, y + 15, 1, 1);
                // ніжки
                var off2 = Math.floor(e.anim / 6) % 2;
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(x + 4, y + e.h - 6 + (off2 ? 0 : 2), 6, 6);
                ctx.fillRect(x + e.w - 10, y + e.h - 6 + (off2 ? 2 : 0), 6, 6);
            } else if (e.kind === 'beetle') {
                // жук-літун: округле червоне тільце з плямами + крила ляскають
                var wingPhase = Math.floor(e.anim / 3) % 2;
                // крила (за тільцем) — сірі напівпрозорі
                ctx.fillStyle = 'rgba(200,200,255,0.6)';
                if (wingPhase === 0) {
                    ctx.beginPath();
                    ctx.ellipse(x + e.w/2 - 8, y + 6, 10, 5, -0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + e.w/2 + 8, y + 6, 10, 5, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.ellipse(x + e.w/2 - 6, y + 8, 9, 4, -0.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + e.w/2 + 6, y + 8, 9, 4, 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                // тільце - червоний овал
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.ellipse(x + e.w/2, y + e.h/2 + 2, e.w/2 - 4, e.h/2 - 4, 0, 0, Math.PI * 2);
                ctx.fill();
                // темна розділова лінія посередині
                ctx.fillStyle = '#000';
                ctx.fillRect(x + e.w/2 - 1, y + 8, 2, e.h - 16);
                // чорні плями (як у сонечка)
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(x + e.w/2 - 6, y + e.h/2,     2.5, 0, Math.PI * 2);
                ctx.arc(x + e.w/2 + 6, y + e.h/2,     2.5, 0, Math.PI * 2);
                ctx.arc(x + e.w/2 - 4, y + e.h/2 + 6, 2,   0, Math.PI * 2);
                ctx.arc(x + e.w/2 + 4, y + e.h/2 + 6, 2,   0, Math.PI * 2);
                ctx.fill();
                // голова (темна вгорі)
                ctx.fillStyle = '#1f2937';
                ctx.beginPath();
                ctx.ellipse(x + e.w/2, y + 6, e.w/3, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                // вусики
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + e.w/2 - 4, y + 4);
                ctx.lineTo(x + e.w/2 - 7, y - 2);
                ctx.moveTo(x + e.w/2 + 4, y + 4);
                ctx.lineTo(x + e.w/2 + 7, y - 2);
                ctx.stroke();
                // очі
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(x + e.w/2 - 5, y + 5, 2, 2);
                ctx.fillRect(x + e.w/2 + 3, y + 5, 2, 2);
            }
        };

        this.drawEnemySquished = function (e) {
            ctx.fillStyle = '#7b3f00';
            ctx.fillRect(e.x + 2, e.y + e.h - 8, e.w - 4, 6);
            ctx.fillStyle = '#3e1f00';
            ctx.fillRect(e.x + 4, e.y + e.h - 6, 4, 2);
            ctx.fillRect(e.x + e.w - 8, e.y + e.h - 6, 4, 2);
            // X-очі
            ctx.fillStyle = '#fff';
            ctx.fillRect(e.x + 8, e.y + e.h - 10, 4, 2);
            ctx.fillRect(e.x + e.w - 12, e.y + e.h - 10, 4, 2);
        };

        // ----- ГЕРОЇНЯ -----
        this.drawHero = function () {
            var x = player.x, y = player.y;
            var w = player.w, h = player.h;

            var running = Math.abs(player.vx) > 0.5 && player.onGround;
            var jumping = !player.onGround && Math.abs(player.vy) > 0.3;
            var animFrame = Math.floor(player.animTime / 6) % 2;

            // тіло: верх — тулуб у фіолетовому топі, низ — синій комбінезон
            // пропорції залежать від big
            var headH = h * 0.35;
            var bodyH = h - headH;
            var hairFlow = player.hairBob + (running ? Math.sin(player.animTime * 0.4) * 1.5 : 0);

            // ноги (малюємо під тілом, тому першими)
            var legY = y + h - 6;
            var legW = Math.max(4, Math.floor(w * 0.3));
            var footColor = '#5b21b6';
            var bootColor = '#312e81';
            if (running) {
                // анімація: одна нога трохи попереду-назад
                if (animFrame === 0) {
                    ctx.fillStyle = footColor;
                    ctx.fillRect(x + 2, legY - 2, legW, 8);
                    ctx.fillRect(x + w - legW - 2, legY, legW, 6);
                } else {
                    ctx.fillStyle = footColor;
                    ctx.fillRect(x + 2, legY, legW, 6);
                    ctx.fillRect(x + w - legW - 2, legY - 2, legW, 8);
                }
                // черевики
                ctx.fillStyle = bootColor;
                ctx.fillRect(x + 1, y + h - 3, legW + 1, 3);
                ctx.fillRect(x + w - legW - 3, y + h - 3, legW + 1, 3);
            } else if (jumping) {
                // зігнута нога вперед
                ctx.fillStyle = footColor;
                ctx.fillRect(x + 4, legY - 4, legW, 10);
                ctx.fillRect(x + w - legW - 4, legY, legW, 6);
                ctx.fillStyle = bootColor;
                ctx.fillRect(x + 3, y + h - 3, legW + 1, 3);
            } else {
                // стоїть — дві ноги разом
                ctx.fillStyle = footColor;
                ctx.fillRect(x + 2, legY, legW, 6);
                ctx.fillRect(x + w - legW - 2, legY, legW, 6);
                ctx.fillStyle = bootColor;
                ctx.fillRect(x + 1, y + h - 3, legW + 1, 3);
                ctx.fillRect(x + w - legW - 3, y + h - 3, legW + 1, 3);
            }

            // штани/комбінезон
            var pantsTop = y + headH + bodyH * 0.45;
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(x + 2, pantsTop, w - 4, legY - pantsTop + 2);
            // ґудзики лямок
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x + Math.floor(w * 0.3),     pantsTop + 2, 2, 2);
            ctx.fillRect(x + w - Math.floor(w * 0.3) - 2, pantsTop + 2, 2, 2);
            // тінь на ногах
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(x + 2, legY - 2, w - 4, 2);

            // топ (фіолетовий)
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(x + 2, y + headH, w - 4, bodyH * 0.45);
            ctx.fillStyle = '#7e22ce';
            ctx.fillRect(x + 2, y + headH + bodyH * 0.45 - 2, w - 4, 2);

            // руки (одна спереду — визначається dir)
            var armColor = '#fed7aa'; // тон шкіри
            var armW = Math.max(3, Math.floor(w * 0.18));
            var armY = y + headH + 2;
            if (running) {
                // рух рук у протифазі ногам
                if (animFrame === 0) {
                    ctx.fillStyle = armColor;
                    ctx.fillRect(x - 1, armY + 4, armW, 10);
                    ctx.fillRect(x + w - armW + 1, armY, armW, 10);
                } else {
                    ctx.fillStyle = armColor;
                    ctx.fillRect(x - 1, armY, armW, 10);
                    ctx.fillRect(x + w - armW + 1, armY + 4, armW, 10);
                }
            } else if (jumping) {
                // руки трохи підняті
                ctx.fillStyle = armColor;
                ctx.fillRect(x - 1, armY - 2, armW, 8);
                ctx.fillRect(x + w - armW + 1, armY - 2, armW, 8);
            } else {
                ctx.fillStyle = armColor;
                ctx.fillRect(x - 1, armY + 2, armW, 10);
                ctx.fillRect(x + w - armW + 1, armY + 2, armW, 10);
            }

            // голова — кремовий тон
            var faceX = x + 1;
            var faceY = y;
            var faceW = w - 2;
            var faceH = headH;
            ctx.fillStyle = '#fed7aa';
            ctx.fillRect(faceX, faceY + 4, faceW, faceH - 4);
            // тінь знизу підборіддя
            ctx.fillStyle = '#fbbf77';
            ctx.fillRect(faceX, faceY + faceH - 2, faceW, 2);

            // ВОЛОССЯ — довге темне, майорить за спиною
            // частина зверху (чубчик/верхівка)
            ctx.fillStyle = '#1f1410';
            ctx.fillRect(faceX - 2, faceY, faceW + 4, 8);
            // бічні пасма
            ctx.fillRect(faceX - 3, faceY + 2, 4, faceH - 2);
            ctx.fillRect(faceX + faceW - 1, faceY + 2, 4, faceH - 2);
            // довге волосся за спиною (з протилежної від dir сторони видно більше)
            var hairBackX = player.dir > 0 ? faceX - 4 : faceX + faceW;
            ctx.fillStyle = '#2a1a14';
            ctx.fillRect(hairBackX + (player.dir > 0 ? -2 : 0), faceY + 4, 4, faceH + bodyH * 0.5);
            // кінець волосся рухається
            ctx.fillStyle = '#1f1410';
            ctx.fillRect(hairBackX + (player.dir > 0 ? -2 : 0), faceY + faceH + bodyH * 0.5 - 2, 4 + Math.floor(hairFlow), 4);
            // відблиск у волоссі
            ctx.fillStyle = '#4a2f25';
            ctx.fillRect(faceX + 2, faceY + 1, faceW - 4, 2);

            // чубчик (поверх чола — залишаємо очі вільними)
            ctx.fillStyle = '#1f1410';
            ctx.fillRect(faceX, faceY + 6, faceW, 3);
            // асиметричний завиток чубчика
            ctx.fillRect(faceX + (player.dir > 0 ? faceW - 6 : 2), faceY + 8, 4, 3);

            // очі
            var eyeY = faceY + 12;
            var eyeW = Math.max(3, Math.floor(faceW * 0.18));
            var eyeH = 4;
            var ex1 = faceX + Math.floor(faceW * 0.20);
            var ex2 = faceX + faceW - Math.floor(faceW * 0.20) - eyeW;
            // білок
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex1, eyeY, eyeW, eyeH);
            ctx.fillRect(ex2, eyeY, eyeW, eyeH);
            // зіниці (зелені, дивляться в бік руху)
            ctx.fillStyle = '#15803d';
            var pupOff = player.dir > 0 ? eyeW - 2 : 0;
            ctx.fillRect(ex1 + pupOff, eyeY + 1, 2, eyeH - 2);
            ctx.fillRect(ex2 + pupOff, eyeY + 1, 2, eyeH - 2);
            // вії
            ctx.fillStyle = '#1f1410';
            ctx.fillRect(ex1 - 1, eyeY - 1, eyeW + 2, 1);
            ctx.fillRect(ex2 - 1, eyeY - 1, eyeW + 2, 1);

            // ніс (маленька точка)
            ctx.fillStyle = '#fbbf77';
            ctx.fillRect(faceX + faceW/2 - 1, eyeY + 5, 2, 2);

            // рот
            ctx.fillStyle = '#dc2626';
            if (jumping) {
                // відкритий рот
                ctx.fillRect(faceX + faceW/2 - 2, eyeY + 9, 4, 4);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(faceX + faceW/2 - 2, eyeY + 11, 4, 2);
            } else {
                // посмішка
                ctx.fillRect(faceX + faceW/2 - 3, eyeY + 9, 6, 2);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(faceX + faceW/2 - 3, eyeY + 10, 6, 1);
            }

            // румянець на щоках
            ctx.fillStyle = 'rgba(252,165,165,0.6)';
            ctx.fillRect(faceX + 2, eyeY + 6, 4, 3);
            ctx.fillRect(faceX + faceW - 6, eyeY + 6, 4, 3);
        };

        // ============================================================
        //                          УПРАВЛІННЯ
        // ============================================================
        this.start = function () {
            var s = this;

            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(html);
                    Lampa.Controller.collectionFocus(false, html);
                },
                left:  function () {
                    if (gameOver || won) { s.reset(); return; }
                    keys.left = true; keys.right = false;
                    if (s._leftTimer) clearTimeout(s._leftTimer);
                    s._leftTimer = setTimeout(function () { keys.left = false; }, 350);
                },
                right: function () {
                    if (gameOver || won) { s.reset(); return; }
                    keys.right = true; keys.left = false;
                    if (s._rightTimer) clearTimeout(s._rightTimer);
                    s._rightTimer = setTimeout(function () { keys.right = false; }, 350);
                },
                up:    function () {
                    if (gameOver || won) { s.reset(); return; }
                    keys.jump = true;
                    if (s._jumpTimer) clearTimeout(s._jumpTimer);
                    s._jumpTimer = setTimeout(function () { keys.jump = false; }, 380);
                },
                down:  function () {
                    keys.left = false; keys.right = false;
                    if (s._leftTimer) clearTimeout(s._leftTimer);
                    if (s._rightTimer) clearTimeout(s._rightTimer);
                },
                enter: function () {
                    if (gameOver || won) { s.reset(); return; }
                    keys.jump = true;
                    if (s._jumpTimer) clearTimeout(s._jumpTimer);
                    s._jumpTimer = setTimeout(function () { keys.jump = false; }, 380);
                },
                back:  function () { Lampa.Activity.backward(); }
            });
            Lampa.Controller.toggle('content');

            // Підтримка звичайної клавіатури (для запуску в браузері).
            // Використовуємо capture-фазу, щоб перехопити події РАНІШЕ Лампи
            // (вона теж слухає стрілки для своєї навігації).
            // Робимо keys і player доступними в console для налагодження
            window.__mario = {
                getPlayer: function(){return player;},
                getKeys: function(){return keys;},
                getEnemies: function(){return enemies;},
                tickCount: 0,
                getStatus: function(){
                    var enemySummary = enemies ? enemies.map(function(e){
                        return {
                            kind: e.kind,
                            x: Math.round(e.x),
                            y: Math.round(e.y),
                            alive: e.alive,
                            dead: e.dead,
                            active: e.active
                        };
                    }) : [];
                    return {
                        tickCount: window.__mario.tickCount,
                        keys: JSON.stringify(keys),
                        playerVx: player ? player.vx : 'no player',
                        playerX: player ? Math.round(player.x) : 'no player',
                        playerOnGround: player ? player.onGround : 'no player',
                        playerAlive: player ? player.alive : 'no player',
                        cameraX: camera ? Math.round(camera.x) : 0,
                        levelKey: levelKey,
                        enemyCount: enemies ? enemies.length : 0,
                        enemiesAlive: enemies ? enemies.filter(function(e){return e.alive;}).length : 0,
                        enemiesActive: enemies ? enemies.filter(function(e){return e.active;}).length : 0,
                        enemies: enemySummary,
                        paused: paused,
                        destroyed: destroyed,
                        gameOver: gameOver,
                        won: won,
                        fadeTimer: fadeTimer,
                        levelDone: levelDone,
                        loopActive: !!loopTimer
                    };
                }
            };
            this._onKeyDown = function (e) {
                if (gameOver || won) return;
                var handled = true;
                switch (e.keyCode) {
                    case 37: keys.left = true; keys.right = false; break;
                    case 39: keys.right = true; keys.left = false; break;
                    case 38: case 32: case 88: case 90: keys.jump = true; break;
                    case 40: keys.left = false; keys.right = false; break;
                    default: handled = false;
                }
                if (handled) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                }
            };
            this._onKeyUp = function (e) {
                var handled = true;
                switch (e.keyCode) {
                    case 37: keys.left = false; break;
                    case 39: keys.right = false; break;
                    case 38: case 32: case 88: case 90: keys.jump = false; break;
                    default: handled = false;
                }
                if (handled) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                }
            };
            // capture = true — обробник спрацює раніше Лампи
            document.addEventListener('keydown', this._onKeyDown, true);
            document.addEventListener('keyup', this._onKeyUp, true);

            var $left  = html.find('.mario-btn-left');
            var $right = html.find('.mario-btn-right');
            var $jump  = html.find('.mario-btn-jump');
            function bindHold($el, key) {
                $el.on('touchstart mousedown', function (e) {
                    e.preventDefault();
                    if (gameOver || won) { s.reset(); return; }
                    keys[key] = true;
                });
                $el.on('touchend mouseup mouseleave touchcancel', function () {
                    keys[key] = false;
                });
            }
            bindHold($left,  'left');
            bindHold($right, 'right');
            bindHold($jump,  'jump');

            this._r = function () { s.resize(); s.draw(); };
            $(window).on('resize', this._r);
            setTimeout(function () { if (!destroyed) s.reset(); }, 50);
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return html; };
        this.destroy = function () {
            destroyed = true;
            this.stopLoop();
            if (this._r) $(window).off('resize', this._r);
            if (this._onKeyDown) document.removeEventListener('keydown', this._onKeyDown, true);
            if (this._onKeyUp) document.removeEventListener('keyup', this._onKeyUp, true);
            if (html) html.remove();
            html = null;
            canvas = null;
            ctx = null;
        };
    }

    // ============================================================
    //                            СТИЛІ
    // ============================================================
    function injectCSS() {
        var css =
        '<style>' +
        '.mario-wrap{position:relative;width:100%;height:100%;background:#000;color:#fff;font-family:"Press Start 2P",monospace;}' +
        '.mario-hud{position:absolute;top:0;left:0;right:0;display:flex;gap:1em;padding:0.5em 1em;font-size:0.9em;background:rgba(0,0,0,0.5);z-index:10;flex-wrap:wrap;}' +
        '.mario-canvas-wrap{position:relative;width:100%;height:100%;display:block;}' +
        '.mario-canvas-wrap canvas{display:block;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;}' +
        '.mario-overlay{position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,0.7);font-size:1.6em;text-align:center;z-index:20;}' +
        '.mario-overlay.show{display:flex;}' +
        '.mario-sub{font-size:0.6em;opacity:0.7;margin-top:0.5em;display:block;}' +
        '.mario-controls{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;padding:1em 2em;pointer-events:none;z-index:15;}' +
        '.mario-pad{display:flex;gap:0.5em;pointer-events:none;}' +
        '.mario-btn{pointer-events:auto;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.2);border:3px solid rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;font-size:1.6em;color:#fff;user-select:none;-webkit-user-select:none;touch-action:none;}' +
        '.mario-btn:active{background:rgba(255,255,255,0.4);}' +
        '@media (min-width: 1100px) and (hover: hover){.mario-controls{display:none;}}' +
        '</style>';
        $('body').append(css);
    }

    // ============================================================
    //                        ІНІЦІАЛІЗАЦІЯ
    // ============================================================
    function startPlugin() {
        injectCSS();
        Lampa.Component.add('mario_game', MarioComponent);

        // Якщо вже є плагін «Ігри» — не додаємо окремий пункт в меню,
        // запуск Ленаріо буде через колекцію ігор.
        if (window.lampa_games_plugin) return;

        function addMenuItem() {
            var item = $(
                '<li class="menu__item selector mario-menu-item">' +
                    '<div class="menu__ico">' + ICON + '</div>' +
                    '<div class="menu__text">Ленаріо</div>' +
                '</li>'
            );
            item.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Ленаріо',
                    component: 'mario_game',
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
