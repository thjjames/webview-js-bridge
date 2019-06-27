// jsbridge by thj
(function() {
    if (window.WebviewJsBridge) {
        return;
    }

    var iframe;
    var scheme = 'myScheme://hybrid/';
    var seqId = 1;

    var emitMessageMap = {
        'networkStateChange': function (data) {
            console.log('network type: ' + data.networkType);
        } // just an example
    };
    var callbackIdMap = {};

    // ios需要触发url变化 android只需要调用对应的JavascriptInterface
    // 这里为了方便保持一致用iframe的方式 有需要的可以分开实现
    function createIframe() {
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        var ele = document.body || document.documentElement;
        ele.appendChild(iframe);
    }
    createIframe();

    // 与native约定形式seqId&param
    function jsCallNative(method, param, callback) {
        var url = scheme + method + '?seqId=' + seqId;

        if (param) {
            url += '&param=' + JSON.stringify(param); // 可能需要encode
        }
        if (callback) {
            callbackIdMap[seqId] = callback;
        }
        seqId++;

        iframe.src = url;
    }

    // 与native约定形式emitKey&seqId&data&error
    function nativeCallback(msg) {
        if (!msg) {
            return false;
        }

        try {
            var obj = JSON.parse(msg);

            if (obj.emitKey) {
                if (emitMessageMap[obj.emitKey]) {
                    return emitMessageMap[obj.emitKey](obj.data);
                } else {
                    console.log('Key has not been registered');
                    return false;
                }
            } else {
                var id = obj.seqId;
                if (id) {
                    var callback = callbackIdMap[id];
                    if (callback) {
                        var ret = callback(obj.data);
                        delete obj.seqId;
                        return ret;
                    }
                } else {
                    console.log('Bad json: without key or id!!!\n' + obj.error);
                    return false;
                }
            }
        } catch (e) {
            console.log('Error nativeCallback exception: ' + e);
            return false;
        }
        return true;
    }

    function listenToNativeEmitMessage(msg, callback) {
        if (msg && callback) {
            emitMessageMap.msg = callback;
        }
    }

    window.WebviewJsBridge = {
        jsCallNative,
        nativeCallback, // 无需js调用
        listenToNativeEmitMessage
    };
})();