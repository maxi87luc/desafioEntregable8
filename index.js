/*

>> Aspectos a incluir en el entregable: 

El mensaje se envía del frontend hacia el backend, el cual lo almacenará en la base de datos elegida. Luego cuando el cliente se conecte o envie un mensaje, recibirá un array de mensajes a representar en su vista. 
El array que se devuelve debe estar normalizado con normalizr, conteniendo una entidad de autores. Considerar que el array tiene sus autores con su correspondiente id (mail del usuario), pero necesita incluir para el proceso de normalización un id para todo el array en su conjunto (podemos asignarle nosotros un valor fijo).
Ejemplo: { id: ‘mensajes’, mensajes: [ ] }
El frontend debería poseer el mismo esquema de normalización que el backend, para que este pueda desnormalizar y presentar la información adecuada en la vista.


*/

import  express from 'express';
import  http from 'http' ;

import  { faker } from '@faker-js/faker';
faker.setLocale('es')



const app = express();
import { Server } from 'socket.io';

import { createServer } from 'http';

import Mensaje from './model/messageSchema.js'

import { normalize, schema } from 'normalizr';


const server = createServer(app); 
const io = new Server(server);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
import Contenedor from './model/index.js'
import MessagesDaoMongoDb  from './daos/MessageDaoMongoDb.js'
import dbClient from './config/connectToDb.js' ;
import connectToDb  from './config/connectToMongoDb.js' ;

connectToDb().then(()=>console.log("OK"))

const productos = new Contenedor("productos", dbClient)


const messages = new MessagesDaoMongoDb({name: "mensajes", model: Mensaje})
// Define a authors schema
const author = new schema.Entity('authors',);

// Define your message schema
const message = new schema.Entity('messages', {
  author: author,
});

const mensajeria = new schema.Entity('mensajerias', {
  mensajes: [message]
});

const normalizar = (data)=>{
    
    const dataConId = data.map((message)=>{
  
        return {
          id: message._id,
          author: message.author,
          content: message.content,
        }
       
      
      })
    const normalizedData = normalize({id: "mensajes", mensajes: dataConId}, mensajeria);
    console.log(normalizedData)
    return normalizedData

}
  


const createElement = async (n)=>{
    const productos =[]
    
    for(let i=0; i<n; i++){                
        const nombre = await faker.commerce.product()
        const price = await faker.commerce.price()
        const foto = await faker.image.business()
        productos.push({nombre, price, foto})
    }
    return productos
}


io.on('connection', async (client) => {
    
    try{
        await productos.getAll()
            .then((data)=>client.emit('products-update', data))


        await messages.getAll()

            .then((data)=> {
                return normalizar(data)
            })
            .then((data)=>client.emit('messages-update', data))

        await createElement(5).then((data)=>{client.emit('faker-products-update', data)})
        
      
        await client.on('producto', data => {   
            
            
            productos.save(data)
                .then(()=>console.log(data))
                .then(()=>productos.getAll())
                .then((data)=>io.sockets.emit('products-update', data))
            
            
            
    
               
        });
    } catch (err){
        console.log(err)
    }
  
  
    client.on('mensaje', data =>{
        const date = new Date()
        const DD = date.getDay()
        const MM = date.getMonth() + 1;
        const YY = date.getYear() + 1900;
        const hh = date.getHours()
        const mm = date.getMinutes()
        console.log(data)
        data.content.date = {DD, MM, YY, hh, mm}
        
     
        messages.save(data)
        console.log(data)
        
        messages.getAll()
            .then((data)=> {
                return normalizar(data)
            })
            .then((data)=>client.emit('messages-update', data))

        


    })
  
});

  




  

const PORT = 8080
server.listen(PORT, ()=> console.log(`I´m listening in port ${PORT}`))


