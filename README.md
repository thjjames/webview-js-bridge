WebviewJavascriptBridge
=======================

## Usage
npm install

## Javascript API
Register a handler called `call` return with Promise
Example:
```javascript
call("forward", {type: 1}, function(data) { console.log(data); })
```
or
call global object
Example:
```javascript
WebviewJsBridge.jsCallNative("forward", {type: 1}, function(data) { console.log(data); })
WebviewJsBridge.listenToNativeEmitMessage("networkStateChange", function(data) { console.log('network type: ' + data.networkType); })
```