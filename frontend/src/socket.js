import { writable } from 'svelte/store';
import moment from 'moment';
import eventemitter3 from 'eventemitter3';


class SocketData extends eventemitter3 {
	constructor(name) {
		super();
		this.name = name;
		this.isReady = 0;
		this.socket = 0;
		console.log('create SocketData("' + this.name + '")');
	}

	setReady(ok) {
		this.isReady = ok;
		if (ok) {
			this.emit('ready');
		} else {
			this.emit('notready');
		}
	}

	connect() {
		const host = window.location.protocol + '//' + window.location.hostname + '';
		console.log('SocketData("' + this.name + '") try connect to socket: ' + host);
		let socket = io(host);
		this.socket = socket;

		socket.on("connect", () => {
			console.log('SocketData("' + this.name + '") socket connect');
			console.log("this.isReady==" + this.isReady);
			this.setReady(1);
		});
		socket.on("disconnect", () => {
			console.log('SocketData("' + this.name + '") socket disconnect');
			this.setReady(0);
		});
		socket.on("event", (data) => {
			console.log("socket event", data);
		});
	}

	getSocket() {
		if (this.isReady) return this.socket;
		return 0;
	}

}

function createVkRulesStore(socketData) {
	let vkrules = {
		rules: [],
		loading: 1,
		isupdated: 0,  // флаг что юзер ещё не отправил обновленные правила на сервер
		sendRules: sendRules,
		getRules: getRules,
		updateRule: updateRule,
	};

	const { subscribe, set } = writable(vkrules);

	socketData.on('ready', () => {
		vkrules.getRules();
	});

	function getRules() {
		let socket = socketData.getSocket();
		if (!socket) return;
		vkrules.loading = 1;
		socket.emit('getrules');
		socket.once('rules', function (rules) {
			vkrules.rules = rules;
			vkrules.loading = 0;
			vkrules.isupdated = 0;
			set(vkrules);
			socketData.emit('rules', rules);
		});
	}
	function addRule() {
		let n = { tag: 'tag' + (vkrules.rules.length + 1), value: '' }
		vkrules.rules.push(n);
		vkrules.isupdated = 1;
		set(vkrules);
	}
	function updateRule(i, rule) {
		vkrules.rules[i] = rule;
		vkrules.isupdated = 1;
		set(vkrules);
	}
	function sendRules() {
		let socket = socketData.getSocket();
		if (!socket) return;
		socket.emit('newrules', vkrules.rules);
		vkrules.isupdated = 0;
		set(vkrules);
	}

	return { subscribe };
}

function createVkDataStore(socketData) {
	let vkdata = {
		data: [],
		loading: 1,
		getData: getData,
	};

	const { subscribe, set } = writable(vkdata);

	socketData.on('ready', () => {
		vkdata.getData();
	});

	function getData() {
		let socket = socketData.getSocket();
		if (!socket) return;
		vkdata.loading = 1;
		socket.emit('getvkdata');
		socket.on('vkdata', function (data) {
			vkdata.data = data;
			vkdata.loading = 0;
			set(vkdata);
			socketData.emit('vkdata', data);
		});
	}

	return { subscribe };
}



let socketData = new SocketData('sock1');

export const connect = () => { socketData.connect(); }
export const vkrulesStore = createVkRulesStore(socketData);
export const vkdataStore = createVkDataStore(socketData);
