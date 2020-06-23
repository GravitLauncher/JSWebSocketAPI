# GravitAPI
[![npm](https://img.shields.io/npm/v/gravit-api?style=flat-square)](https://www.npmjs.com/package/gravit-api)
[![GitHub license](https://img.shields.io/github/license/JoCat/gravit-api?style=flat-square)](https://github.com/JoCat/gravit-api/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JoCat/gravit-api?style=flat-square)](https://github.com/JoCat/gravit-api/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Реализация JS API для [GravitLauncher](https://github.com/GravitLauncher/Launcher)

## Установка

Используя npm:

```bash
npm i gravit-api
```

Используя jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/gravit-api/dist/gravit-api.min.js"></script>
```

Используя unpkg CDN:

```html
<script src="https://unpkg.com/gravit-api/dist/gravit-api.min.js"></script>
```

## Пример использования

```js
// Подключение класса API
const GravitApi = require('gravit-api');

// Данные для запроса
const wsUrl = 'ws://localhost:9274/api';
const userdata = {
    login: 'test',
    password: 'test'
};

// Инициализация класса API
const api = new GravitApi();

// Весь исполняемый код должен находится в теле функции GravitApi.onOpen
api.onOpen = () => {
    api.sendRequest('getAvailabilityAuth', {}, (auth) => { //Запрос списка методов авторизации
        console.log('Соединение установлено');
        auth = auth.list.pop(); // Выбор первого из списка
        api.sendRequest('auth', { // Авторизация
            login: userdata.login,
            password: {
                password: userdata.password,
                type: "plain"
            },
            auth_id: auth.name,
            getSession: false,
            authType: "API",
            initProxy: false
        }, (res) => {
            console.log(JSON.stringify(res));
            api.close(); // Закрытие соединения
        }, (error) => {
            console.log(JSON.stringify(error));
        });
    }, (error) => {
        console.log(JSON.stringify(error));
    })
}
// Подключение к сокету лаунчсервера
api.connect(wsUrl);
```

Более подробные примеры использования можно найти [здесь](https://github.com/JoCat/gravit-api/tree/master/example)

## Методы и параметры

Класс `GravitApi` содержит следущее:

Свойство:
* `requestMap` - коллекция с обработчиками ответов от лаунчсервера добавляемыми функцией `sendRequest`

Методы:
* `connect(url)` - подключение к сокету лаунчсервера, где:
    * `url` - адрес сокета лаунчсервера
* `close()` - отключение от сокета лаунчсервера
* `sendRequest(type, obj, callback, errorCallback)` - отправка запроса к лаунчсерверу, где:
    * `type` - тип запроса
    * `obj` - объект с параметрами запроса
    * `callback` - функция выполняемая при успешном получении ответа от лаунчсервера
    * `errorCallback` - функция выполняемая при возврате лаунчсервером сообщения об ошибке
* `genRandUUIDv4()` - генерация случайного UUID для запроса, используется в `sendRequest`
* `checkValidRequestType(type)` - функция проверки указания валидного type для запроса, используется в `sendRequest`

Эвенты (стандартные эвенты [вебсокета](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)):
* `onOpen()` - обработчик эвента [onopen](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onopen)
* `onClose()` - обработчик эвента [onclose](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onclose)
* `onMessage()` - обработчик эвента [onmessage](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage)
* `onError()` - обработчик эвента [onerror](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror)