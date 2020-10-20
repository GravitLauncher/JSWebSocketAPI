const WebSocket = require('isomorphic-ws');
const getRandomValues = require('get-random-values');

module.exports = class GravitApi {
    constructor() {
        this.requestMap = new Map();
    }

    /**
     * Connect to websocket
     * @param {string} url
     * @return {Promise<GravitApi | Error>}
     */
    connect(url) {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(url);
            this.socket.onopen = () => {
                this.onOpen();
                resolve(this);
            };
            this.socket.onerror = (err) => {
                this.onError();
                reject(err);
            };
            this.socket.onclose = this.onClose;
            this.socket.onmessage = this.onMessage;
            this.socket.GravitApi = this;
        });
    }

    /**
     * Close websocket connection
     */
    close() {
        this.socket.close();
    }

    /**
     * Send request for websocket
     * @param {string} type request type
     * @param {object} obj request data
     * @return {Promise<object>} response data
     */
    send(type, obj = {}) {
        return new Promise((resolve, reject) => {
            if (typeof type !== "string" || type === '')
                reject({type: "error", error: "Invalid request type"});
            obj.type = type;
            obj.requestUUID = this.getUUIDv4();

            this.requestMap.set(obj.requestUUID, data => {
                if (["error", "exception"].includes(data.type)) reject(data);
                else resolve(data);
            });
            this.socket.send(JSON.stringify(obj));
        })
    }

    /**
     * @return {string} uuid v4 (random)
     */
    getUUIDv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    /* Events */
    onOpen() {
        console.log('Connection established');
    }

    onClose(event) {
        if (event.wasClean) return console.log('Connection closed');
        if (event.code === 1006) console.error('Connection break');
        else {
            console.error('Unknown error');
            console.dir(event);
        }
    }

    onMessage(event) {
        const obj = JSON.parse(event.data);
        const requestMap = this.GravitApi.requestMap;
        if (obj.requestUUID && requestMap.has(obj.requestUUID)) {
            requestMap.get(obj.requestUUID)(obj);
            requestMap.delete(obj.requestUUID);
        } else {
            if (obj.type === "error") console.error(obj.error);
            else {
                console.error('Unknown message');
                console.dir(event);
            }
        }
    }

    onError() {
        console.error('Connection error');
    }
}