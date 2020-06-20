const WebSocket = require('isomorphic-ws');
const getRandomValues = require('get-random-values');

module.exports = class GravitApi {
    constructor() {
        this.requestMap = new Map();
    }

    connect(url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onOpen;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;
        this.socket.GravitApi = this;
    }

    close() {
        this.socket.close();
    };

    sendRequest(type, obj, callback, errorCallback) {
        obj.type = type;
        obj.requestUUID = this.genRandUUIDv4();
        this.requestMap.set(obj.requestUUID, event => {
            if (event.type == "error") {
                if (errorCallback != undefined) errorCallback(event.error);
            } else if (event.type == "exception") {
                if (errorCallback != undefined) errorCallback(event.exception);
            } else {
                callback(event);
            }
        });
        this.socket.send(JSON.stringify(obj));
    }

    genRandUUIDv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    /* Events */
    onOpen() {
        console.log('Соединение установлено');
    }

    onClose(e) {
        if (e.wasClean) return console.log('Соединение закрыто');
        if (e.code === 1006) console.error('Разрыв соединения');
        else {
            console.error('Неизвестная ошибка');
            console.dir(e);
        }
    }

    onMessage(event) {
        const obj = JSON.parse(event.data);
        const requestMap = this.GravitApi.requestMap;

        if (obj.requestUUID && requestMap.has(obj.requestUUID)) {
            requestMap.get(obj.requestUUID)(obj);
            requestMap.delete(obj.requestUUID);
        } else {
            console.dir(event);
        }
    }

    onError() {
        console.error('Ошибка при подключеннии!');
    }
}