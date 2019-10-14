import { writable } from 'svelte/store';
import { connect } from '../socket.js';
import { fetchJSON } from '../fnc.js';

let userData = {
    id: 0,
    name: '',
    login: '',
}
userData.login = window.localStorage.getItem('login');

const { subscribe, set } = writable(userData);

userData.setUserData = function(id,name,login) {
	console.log("обновляем данные пользователя ",id,name,login);
	userData.id = id;
	userData.name = name;
	userData.login = login;
	window.localStorage.setItem('login', login);
	set(userData);
	connect();
	return this;
}
function createUserStore() {
	return { subscribe };
}
export const userStore = createUserStore();


async function checkIsAuth(){
	let d = await fetchJSON('/status');
	if(d.user){
		console.log('вы уже авторизованы!');
		let u = d.user;
		userData.setUserData(u.id,u.name,u.login);
	}
}

(async () => {
	console.log('проверяем авторизацию..');
	checkIsAuth();
})();


