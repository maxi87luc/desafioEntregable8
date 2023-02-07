import {schema, denormalize} from 'https://cdn.jsdelivr.net/npm/normalizr@3.6.2/+esm'

const author = new schema.Entity('authors',);

// Define your message schema
const message = new schema.Entity('messages', {
  author: author,
});

const mensajeria = new schema.Entity('mensajerias', {
  mensajes: [message]
});

const client = io();

client.on('faker-products-update', (data) => {
    
    console.log(data)
    const tbody = document.getElementById('faker-tbody');
    let tr = ""
    const templateTr = Handlebars.compile(`
        <tr>
            
            <td>{{nombre}}</td>
            <td>$ {{price}}</td>
            <td><img src="{{foto}}" style="width: 30px" alt="">  </td>
        </tr>
    `);
    

        data.forEach((product)=>{
        
            tr = `
            ${tr}
            ${templateTr(product)}
            `      
            tbody.innerHTML = tr;   
        })
    
    

 
    

});





client.on('products-update', (data) => {
    
    const tbody = document.getElementById('tbody');
    let tr = ""
    const templateTr = Handlebars.compile(`
        <tr>
            <th scope="row">{{id}}</th>
            <td>{{title}}</td>
            <td>{{price}}</td>
            <td><img src="{{thumbnail}}" style="width: 30px" alt="">  </td>
        </tr>
    `);
    
  
    data.forEach((product)=>{
        
        tr = `
        ${tr}
        ${templateTr(product)}
        `      
        tbody.innerHTML = tr;   
    })

 
    

});

client.on('messages-update', (data) => {	

    
    const denormalizedData = denormalize(data.result, mensajeria, data.entities);
    
    const messagesContainer = document.getElementById('messages-container')
    let li = ""
    const templateLi = Handlebars.compile(`
    <li class="list-group-item"><img width="30px" src="{{author.avatar}}"><strong style="color: blue">{{author.id}}:</strong><p style="color: brown">{{content.date.DD}}/{{content.date.MM}}/{{content.date.YY}} {{content.date.hh}}:{{content.date.mm}}</p><p style="font-style: italic; color: green">{{content.text}}</p></li>
    `)  
    
 

    denormalizedData.mensajes.forEach((message)=>{
        
        li = `
            ${li}
            ${templateLi(message)}
        `
        messagesContainer.innerHTML = li
    })
})


const productForm = document.getElementById('productForm');


productForm.addEventListener('submit', (e)=>{
    
    e.preventDefault();
    const title = productForm[0].value;
    const price = parseInt(productForm[1].value);
    const thumbnail = productForm[2].value;
    messageToSend = {title, price, thumbnail};
        
    client.emit('producto', messageToSend);
         

})

const messageForm = document.getElementById('messageForm');

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const email = messageForm[0].value;
    const name = messageForm[1].value;
    const lastname = messageForm[2].value;
    const age = messageForm[3].value;
    const alias = messageForm[4].value;
    const avatar = messageForm[5].value

    const message = messageForm[6].value;
    const messageToSend = {
        author: {
            id: email, 
            nombre: name, 
            apellido: lastname, 
            edad: age, 
            alias: alias,
            avatar: avatar
        },
        content: {
            text: message
        }
    }
    console.log(messageToSend)

    client.emit('mensaje', messageToSend)

})





