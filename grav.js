(function () {
    'use strict';

    // Назва плагіна
    const plugin_name = 'GravityCards';
    let isGravityActive = false;

    // Функція ініціалізації датчиків
    function startGravity() {
        if (!window.DeviceOrientationEvent) {
            console.warn(`${plugin_name}: Ваш пристрій не підтримує DeviceOrientation API.`);
            Lampa.Noty.show('Гравітація: Гіроскоп не підтримується на цьому пристрої/браузері.');
            return;
        }

        // Запит дозволу (обов'язково для iOS 13+ та деяких сучасних Android WebView)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        bindSensors();
                    } else {
                        Lampa.Noty.show('Гравітація: Немає дозволу на використання датчиків.');
                    }
                })
                .catch(console.error);
        } else {
            bindSensors();
        }
    }

    function bindSensors() {
        if (isGravityActive) return;
        window.addEventListener('deviceorientation', handleOrientation);
        isGravityActive = true;
        Lampa.Noty.show('Гравітація увімкнена! Нахиліть телефон.');
    }

    // Обробка нахилу пристрою
    function handleOrientation(event) {
        let beta = event.beta;   // Нахил вперед-назад [-180, 180]
        let gamma = event.gamma; // Нахил вліво-вправо [-90, 90]

        // Якщо пристрій лежить на столі або дані відсутні
        if (beta === null || gamma === null) return;

        // Шукаємо всі картки з контентом на екрані Lampa
        // Зазвичай вони мають клас .card або .item
        let cards = document.querySelectorAll('.card, .item');

        cards.forEach(card => {
            // Додаємо кожній картці унікальний фактор ваги (randomFactor),
            // щоб вони зсипалися не синхронно, а хаотично (ніби різні за масою)
            let randomFactor = card.getAttribute('data-grav-mass');
            if (!randomFactor) {
                randomFactor = (Math.random() * 0.8 + 0.2); // Вага від 0.2 до 1.0
                card.setAttribute('data-grav-mass', randomFactor);
                
                // Додаємо плавний CSS перехід для фізики
                card.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.willChange = 'transform'; // Оптимізація для WebView
            }

            // Розрахунок зміщення (множник визначає "силу гравітації")
            // Віднімаємо 45 від beta, припускаючи, що користувач тримає телефон під кутом 45 градусів у руках
            let xMove = gamma * 4 * parseFloat(randomFactor);
            let yMove = (beta - 45) * 4 * parseFloat(randomFactor);

            // Обмежуємо максимальний відліт, щоб картки не зникали назавжди (опціонально)
            xMove = Math.max(-300, Math.min(300, xMove));
            yMove = Math.max(-500, Math.min(500, yMove));

            // Застосовуємо трансформацію
            card.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    }

    // Інтеграція в життєвий цикл Lampa
    if (window.appready) {
        startGravity();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                startGravity();
            }
        });
    }
})();
