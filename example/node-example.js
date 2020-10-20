const GravitApi = require('../src');

// User data
const wsUrl = 'ws://localhost:9274/api';
const userdata = {
    login: 'test',
    password: 'test'
};

// Api usage example
const api = new GravitApi();
api.connect(wsUrl)
.then(() => {
    api.send('getAvailabilityAuth').then(auth => {
        console.log(auth.list);
        auth = auth.list.pop();
        console.log(`Выбран первый профиль авторизации: ${auth.displayName}`);
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
            console.log(res);
            api.close();
        }).catch(console.error);
    }).catch(console.error);
}).catch(console.error);