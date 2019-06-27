require('./WebviewJavascriptBridge');
/**
 * package jsCallNative with Promise
 * @param method {string} 函数名称
 * @param param {object} 函数参数
 * @param callback [function] 回掉函数
 */
function call(method, param, callback) {
    if (param === void 0) { 
        param = {}; 
    }
    if (typeof param === 'function' && !callback) { 
        callback = param;
        param = {}; 
    }
    return new Promise(function (resolve, reject) {
        window.WebviewJsBridge.jsCallNative(method, param, function (data) {
            if (callback) {
                data = callback(null, data);
            } 
            resolve(data); 
        });
    });
}
module.exports = call;
