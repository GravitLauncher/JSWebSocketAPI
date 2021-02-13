# GravitAPI
[![npm](https://img.shields.io/npm/v/gravit-api?style=flat-square)](https://www.npmjs.com/package/gravit-api)
[![GitHub license](https://img.shields.io/github/license/JoCat/gravit-api?style=flat-square)](https://github.com/JoCat/gravit-api/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JoCat/gravit-api?style=flat-square)](https://github.com/JoCat/gravit-api/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJoCat%2Fgravit-api.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FJoCat%2Fgravit-api?ref=badge_shield)

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

// Инициализация класса API
const api = new GravitApi();

// Подключение и отправка/обработка запросов с использованием Promise

api.connect(wsUrl) // Подключение к сокету лаунчсервера
.then(() => {
    api.send('getAvailabilityAuth').then(auth => { //Запрос списка методов авторизации
        console.log(auth.list);
        api.close(); // Закрытие соединения
    }).catch(console.error);
}).catch(console.error);

// или в стиле async/await

(async () => {
    try {
        await api.connect(wsUrl);
        const auth = await api.send('getAvailabilityAuth');
        console.log(auth.list);
    } catch (error) {
        console.error(error);
    } finally {
        api.close();
    }
})();
```

Более подробные примеры использования можно найти [здесь](https://github.com/JoCat/gravit-api/tree/master/example)

## Методы и параметры

Класс `GravitApi` содержит следущее:

Свойство:
* `requestMap` - коллекция с обработчиками ответов от лаунчсервера добавляемыми функцией `send`

Методы:
* `connect(url)` - подключение к сокету лаунчсервера, где:
    * `url` - адрес сокета лаунчсервера
* `close()` - отключение от сокета лаунчсервера
* `send(type, obj)` - отправка запроса к лаунчсерверу, где:
    * `type` - тип запроса
    * `obj` - объект с параметрами запроса
* `getUUIDv4()` - генерация случайного UUID для запроса, используется в `sendRequest`

Эвенты (стандартные эвенты [вебсокета](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)):
* `onOpen()` - обработчик эвента [onopen](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onopen)
* `onClose()` - обработчик эвента [onclose](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onclose)
* `onMessage()` - обработчик эвента [onmessage](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage)
* `onError()` - обработчик эвента [onerror](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJoCat%2Fgravit-api.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FJoCat%2Fgravit-api?ref=badge_large)