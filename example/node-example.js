const GravitApi = require('../src');

// User data
const wsUrl = 'ws://localhost:9274/api';
const userdata = {
    login: 'test',
    password: 'test'
};

// Api usage example
const api = new GravitApi();
api.onOpen = () => {
    api.sendRequest('getAvailabilityAuth', {}, (auth) => {
        console.log('Соединение установлено');
        console.log(JSON.stringify(auth));
        auth = auth.list.pop();
        console.log(`Выбран первый профиль авторизации: ${auth.name}`);
        api.sendRequest('auth', {
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
            api.close();
        }, (error) => {
            console.log(JSON.stringify(error));
        });
    }, (error) => {
        console.log(JSON.stringify(error));
    })
}
api.connect(wsUrl);