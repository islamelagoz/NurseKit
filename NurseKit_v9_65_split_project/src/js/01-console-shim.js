        /* Defansif console shim: bazı ortamlar (eklenti, sandbox, eski iframe) console.info/group/groupEnd metodlarını
           kırpabilir. Bu blok sadece eksik olanları doldurur; mevcut metodlara dokunmaz. */
        (function () {
            if (typeof window === 'undefined') return;
            try {
                if (!window.console) window.console = {};
                var c = window.console;
                var noop = function () {};
                var fallback = (typeof c.log === 'function') ? c.log.bind(c) : noop;
                ['log','info','warn','error','debug','group','groupCollapsed','groupEnd','trace','table','dir','assert','time','timeEnd','count'].forEach(function (k) {
                    if (typeof c[k] !== 'function') c[k] = (k === 'groupEnd' || k === 'time' || k === 'timeEnd' || k === 'count' || k === 'assert') ? noop : fallback;
                });
            } catch (e) { /* sessiz */ }
        })();
    
