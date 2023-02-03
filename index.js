

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { faker } = require('@faker-js/faker');
faker.setLocale('es')



const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json())

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const {Contenedor, MessageContainer }= require('./model/index')
const { dbClient, dbClientSQLite3 } = require("./config/connectToDb");

const productos = new Contenedor("productos", dbClient)

const messages = new MessageContainer("messages", dbClientSQLite3)

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
            .then((data)=>client.emit('messages-update', messages))

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
        data.date = {DD, MM, YY, hh, mm}
     
        messages.save(data)
        console.log(data)
        
        messages.getAll()
            
            .then((data)=>io.sockets.emit('messages-update', data))

        


    })
  
});

  




  

const PORT = 8080
server.listen(PORT, ()=> console.log(`I´m listening in port ${PORT}`))


