const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });


const keywords = {
    'car': ['https://autospot.ru/','https://ru.wikipedia.org/wiki/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C','https://avtomir.ru/new-cars/'],
    'boat': ['https://lodki-lodki.ru/','https://vodomotorika.ru/products/naduvnye_lodki_pvh','https://vodnik.ru/lodki-pvh'],
    'moto': ['https://bikeland.ru/mototekhnika/motorcycles/','https://pitland.ru/catalog/tekhnika/mototsikly/','https://uralmoto.ru/product/1']};


server.on('connection', (socket)=>{
    console.log('Клиент подключен');
    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        console.log('У нас запросили: ' + message.keyword)
        // Если в сообщении пришел keyword то 
        if (message.type === 'keyword'){
            if ((Object.keys(keywords).indexOf(`${message.keyword}`)!=-1)){
                 const urls = keywords[message.keyword];
                 console.log('Высылаем ссылки: ' + urls)
                 socket.send(JSON.stringify({type:'urls',content:urls}));}
                }
        // Если сообщении запрос на закачку, то качаем содержимое и отправляем клиенту
        else if (message.type === 'fetch'){
            const url = message.content
            console.log(message.content)
            fetch(url)
            .then(response => response.text())
            .then(data => {socket.send(JSON.stringify({type:'content', content:data}))})
                }
            }
        )
    }
)
