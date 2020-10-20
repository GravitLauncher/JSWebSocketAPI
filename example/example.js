// User data
const wsUrl = 'ws://localhost:9274/api';
const userdata = {
    login: 'test',
    password: 'test'
};

// Log helper
const log = {
    el: document.getElementById('log'),
    append(message) {
        this.el.append(`${message}\n`);
    },
    appendData(data) {
        this.append(JSON.stringify(data));
    }
}

// Api usage example
const api = new GravitApi();
api.onOpen = () => {
    log.append('Соединение установлено');
}
api.onClose = (e) => {
    if (e.wasClean) return log.append('Соединение закрыто');
    if (e.code === 1006) log.append('Разрыв соединения');
}
api.onError = () => {
    log.append('Ошибка при подключеннии!');
}

api.connect(wsUrl)
.then(() => {
    api.send('getAvailabilityAuth').then(auth => {
        log.appendData(auth);
        auth = auth.list.pop();
        log.append(`Выбран первый профиль авторизации: ${auth.displayName}`);
        api.send('auth', {
            login: userdata.login,
            password: {
                password: userdata.password,
                type: "plain"
            },
            auth_id: auth.name,
            getSession: false,
            authType: "API",
            initProxy: false
        }).then(res => {
            log.appendData(res);
            api.close();
        }).catch(error => log.appendData(error));
    }).catch(error => log.appendData(error));
}).catch(console.error);