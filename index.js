

import  express from 'express';


import  { faker } from '@faker-js/faker';
faker.setLocale('es')
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'






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
let name = ""
app.use(expressSession({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://entregableUser:1234@coderhouse.yv2sexp.mongodb.net/?retryWrites=true&w=majority' }),
    secret: 'my-super-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }

  }));



app.post('/login', (req, res, next)=>{
    
    req.session.name = req.body.name
    
    res.redirect('../')
    next()
    
})
app.use((req, res, next)=>{
    
    name = req.session.name
    next()
})


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

app.get('/logout', (req, res)=>{
    req.session.destroy();
    
    res.redirect('../login');
})



io.on('connection', async (client) => {
     
    try{
        await productos.getAll()
            .then((data)=>client.emit('products-update', data))
            .then(io.sockets.emit('loginUpdate', {name: name}))
            
            

        await messages.getAll()

            .then((data)=> {
                return normalizar(data)
            })
            .then((data)=>client.emit('messages-update', data))

        await createElement(5).then((data)=>{client.emit('faker-products-update', data)})

        await 
        
      
        await client.on('producto', data => {   
            
            
            productos.save(data)
                .then(()=>console.log(data))
                .then(()=>productos.getAll())
                .then((data)=>io.sockets.emit('products-update', data))
            
            
            
    
               
        });
    } catch (err){
        console.log(err)
    }
    
  
    client.on
  
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

    client.on('login', data=>{
        const name = data
        console.log(name)
    })
    
    
  
});

  




  

const PORT = 8080
server.listen(PORT, ()=> console.log(`I´m listening in port ${PORT}`))


