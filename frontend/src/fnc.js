
export async function fetchJSON(url,data){
	let res;
	let opt = {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		//credentials: 'same-origin', // include, *same-origin, omit
		credentials: 'include', // - Чтобы браузеры могли отправлять запрос с учётными данными (даже для cross-origin запросов)
		headers: {
			'Content-Type': 'application/json',  // обязательно должен быть указан иначе запрос не распарсится!
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // no-referrer, *client
		body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
	};

	try{
		//console.log('fetchJSON: отправка запроса на '+url);
		//console.log(opt);
		res = await fetch(url,opt);
		//console.log('fetchJSON: успешно отправлен запрос на '+url);
	} catch (error) {
		return {errcode:'SYS001',errmsg:'ошибка выполнения http запроса',error};
	}
	//console.log('fetchJSON: результат запроса '+res.ok);
	if(!res.ok){
		let text = '';
		try{
			text = res.text();
		} catch (error) {
			text = 'err get result body text';
		}
		if(!text) text = 'no body text';
		return {errcode:'SYS002',errmsg:'запрос вернул некорректный JSON',error:text};
	}
	

	let body;
	try {
		body = await res.json();
		//console.log('fetchJSON: данные запроса '+JSON.stringify(body,0,'\t'));
	} catch (error) {
		return {errcode:'SYS003',errmsg:'запрос вернул некорректный JSON',error};
	}
	return body;
}

export function sleep(ms=0) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

