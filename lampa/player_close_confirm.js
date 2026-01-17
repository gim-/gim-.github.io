(function () {
    'use strict';

    var back_timer;
    var back_to_close = false;
    var original_controller_back;
    var message_element;
    var timeout = 1000;

    function startListener() {
        original_controller_back = Lampa.Controller.back;

        Lampa.Select.opened = function () {
            return document.body.classList.contains('selectbox--open');
        }

        Lampa.Controller.back = function () {
            if (Lampa.Player.opened()) {
                if (Lampa.Select.opened()) {
                    // Menu is open, let it handle the back press
                    original_controller_back();
                    return;
                }
                if (Lampa.PlayerPanel.visibleStatus()) {
                    // Always hide player panel first on back press, this is more intuitive
                    Lampa.PlayerPanel.hide();
                    return;
                }
                if (back_to_close) {
                    clearTimeout(back_timer);
                    back_to_close = false;
                    hideMessage();
                    Lampa.Player.close();
                    Lampa.Controller.toggle('content');
                } else {
                    back_to_close = true;

                    showMessage({
                        title: 'Выход',
                        text: 'Нажмите еще раз для выхода'
                    });

                    back_timer = setTimeout(function () {
                        back_to_close = false;
                        hideMessage();
                    }, timeout);
                }
            } else {
                original_controller_back();
            }
        };

        document.addEventListener("keydown", (event) => {
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
                if (!Lampa.Player.opened() || Lampa.PlayerPanel.visibleStatus()
                    || Lampa.Select.opened() || Lampa.Modal.opened()) {
                    return;
                }
                // Show player panel on first key press if it's not visible.
                // This provides more predictable behavior for keyboard/remote users.
                event.preventDefault();
                Lampa.PlayerPanel.toggle();
            }
        });
    }

    function showMessage(message) {
        hideMessage();

        message_element = document.createElement('div');
        message_element.style.position = 'absolute';
        message_element.style.zIndex = '100';
        message_element.style.left = '50%';
        message_element.style.top = '50%';
        message_element.style.transform = 'translate(-50%, -50%)';
        message_element.style.padding = '1em 2em';
        message_element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        message_element.style.color = 'white';
        message_element.style.borderRadius = '0.5em';
        message_element.style.textAlign = 'center';

        var title = document.createElement('div');
        title.innerText = message.title;
        title.style.fontWeight = 'bold';
        title.style.fontSize = '1.2em';
        title.style.marginBottom = '0.5em';

        var text = document.createElement('div');
        text.innerText = message.text;

        message_element.appendChild(title);
        message_element.appendChild(text);

        var player = document.querySelector('.player');
        if (player) {
            player.appendChild(message_element);
        }
    }

    function hideMessage() {
        if (message_element && message_element.parentNode) {
            message_element.parentNode.removeChild(message_element);
        }
        message_element = null;
    }

    if (window.appready) {
        startListener();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startListener();
            }
        });
    }

})();
