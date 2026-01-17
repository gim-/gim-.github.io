(function () {
    'use strict';

    function startListener() {

        tizen.tvinputdevice.registerKey('MediaPlayPause'); 

        document.addEventListener("keydown", (event) => {
            if (event.keyCode === tizen.tvinputdevice.getKey('MediaPlayPause').code) {
                if (Lampa.Player.opened()) {
                    event.preventDefault();
                    Lampa.PlayerVideo.playpause();
                }
            }
        });
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
