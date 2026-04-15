(function () {
    'use strict';

    const plugin_name = 'RealPhysicsGravity';
    let engine, runner;
    let isSimulating = false;

    // 1. Функція для динамічного завантаження Matter.js
    function loadScript(url, callback) {
        let script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // 2. Ініціалізація фізичного світу
    function initPhysics() {
        if (isSimulating) return;
        isSimulating = true;

        // Отримуємо API Matter.js
        const Engine = Matter.Engine,
              Runner = Matter.Runner,
              Bodies = Matter.Bodies,
              Composite = Matter.Composite,
              Events = Matter.Events;

        // Створюємо рушій (без Canvas-рендерингу!)
        engine = Engine.create();
        
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        // Створюємо "невидимі стіни" по краях екрану, щоб картки не випадали
        const wallOptions = { isStatic: true };
        Composite.add(engine.world, [
            Bodies.rectangle(w / 2, -500, w * 2, 1000, wallOptions), // Стеля (дуже високо)
            Bodies.rectangle(w / 2, h + 50, w, 100, wallOptions),    // Підлога
            Bodies.rectangle(-50, h / 2, 100, h * 3, wallOptions),   // Ліва стіна
            Bodies.rectangle(w + 50, h / 2, 100, h * 3, wallOptions) // Права стіна
        ]);

        // Шукаємо всі картки
        let cards = document.querySelectorAll('.card');
        let bodies = [];

        cards.forEach(card => {
            let rect = card.getBoundingClientRect();
            
            // "Відриваємо" картку від сітки Lampa і робимо її абсолютною
            card.style.position = 'fixed';
            card.style.left = '0px';
            card.style.top = '0px';
            card.style.margin = '0px';
            card.style.zIndex = 9999;
            card.style.willChange = 'transform';
            
            // Створюємо фізичний прямокутник у Matter.js на тому ж місці
            let body = Bodies.rectangle(
                rect.left + rect.width / 2, // Matter.js рахує від центру об'єкта
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.4,  // Пружність (як сильно відскакують)
                    friction: 0.1,     // Тертя
                    density: 0.05      // Вага
                }
            );
            
            // Зберігаємо посилання на DOM-елемент всередині фізичного тіла
            body.domElement = card;
            body.width = rect.width;
            body.height = rect.height;
            bodies.push(body);
        });

        // Додаємо всі картки у фізичний світ
        Composite.add(engine.world, bodies);

        // 3. СИНХРОНІЗАЦІЯ: На кожному кроці фізики оновлюємо DOM
        Events.on(engine, 'afterUpdate', function() {
            bodies.forEach(body => {
                let dom = body.domElement;
                
                // Переводимо координати центру Matter.js назад у top-left для CSS
                let x = body.position.x - body.width / 2;
                let y = body.position.y - body.height / 2;
                let angle = body.angle; // Кут повороту
                
                dom.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
            });
        });

        // Запускаємо фізику
        runner = Runner.create();
        Runner.run(runner, engine);

        // Вмикаємо гіроскоп
        bindSensors();
        Lampa.Noty.show('Гравітація активована! Обережно, все падає!');
    }

    // 4. Обробка гіроскопа / акселерометра
    function bindSensors() {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().catch(console.error);
        }

        window.addEventListener('deviceorientation', function(event) {
            let beta = event.beta;   // [-180, 180]
            let gamma = event.gamma; // [-90, 90]
            
            if (beta === null || gamma === null) return;

            // Зсуваємо beta на 45 градусів, припускаючи, що телефон тримають під кутом
            let gravityX = gamma / 45; 
            let gravityY = (beta - 45) / 45;

            // Обмежуємо силу гравітації, щоб картки не пробивали стіни
            gravityX = Math.max(-2, Math.min(2, gravityX));
            gravityY = Math.max(-2, Math.min(2, gravityY));

            // Передаємо вектор гравітації у Matter.js
            engine.world.gravity.x = gravityX;
            engine.world.gravity.y = gravityY;
        });
    }

    // 5. Запуск (спочатку вантажимо Matter.js, потім ініціалізуємо)
    function startPlugin() {
        if (!window.Matter) {
            Lampa.Noty.show('Завантаження фізики...');
            // Використовуємо CDN для завантаження бібліотеки Matter.js
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js', initPhysics);
        } else {
            initPhysics();
        }
    }

    // 6. Інтеграція в інтерфейс Lampa (додаємо кнопку-іконку у хедер)
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            // Створюємо іконку, що нагадує яблуко або обвал
            let btn = $('<div class="head__action" title="Обвал карток (Гравітація)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>');
            
            btn.on('click', function() {
                startPlugin();
            });
            
            // Додаємо кнопку до верхньої панелі (біля пошуку/налаштувань)
            $('.head__actions').append(btn);
        }
    });

})();
