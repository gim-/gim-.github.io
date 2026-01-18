(function () {
    'use strict';

    function startListener() {

        tizen.tvinputdevice.registerKey('MediaPlayPause');
        tizen.tvinputdevice.registerKey('ChannelUp');
        tizen.tvinputdevice.registerKey('ChannelDown');
        tizen.tvinputdevice.registerKey('ChannelList');
        tizen.tvinputdevice.registerKey('MediaTrackNext');
        tizen.tvinputdevice.registerKey('MediaTrackPrevious');

        document.addEventListener("keydown", (event) => {
            if (!Lampa.Player.opened()) {
                return;
            }
            switch (event.keyCode) {
                case tizen.tvinputdevice.getKey('MediaPlayPause').code:
                    event.preventDefault();
                    Lampa.PlayerVideo.playpause();
                    break;
                case tizen.tvinputdevice.getKey('ChannelUp').code:
                case tizen.tvinputdevice.getKey('MediaTrackNext').code:
                    event.preventDefault();
                    Lampa.PlayerPlaylist.next();
                    break;
                case tizen.tvinputdevice.getKey('ChannelDown').code:
                case tizen.tvinputdevice.getKey('MediaTrackPrevious').code:
                    event.preventDefault();
                    Lampa.PlayerPlaylist.prev();
                    break;
                case tizen.tvinputdevice.getKey('ChannelList').code:
                    event.preventDefault();
                    Lampa.PlayerPlaylist.show();
                    break;
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
