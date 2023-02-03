/*
>> Consigna 1: 
Sobre el desafío entregable de la clase 16, crear una vista en forma de tabla que consuma desde la ruta ‘/api/productos-test’ del servidor una lista con 5 productos generados al azar utilizando Faker.js como generador de información aleatoria de test (en lugar de tomarse desde la base de datos). Elegir apropiadamente los temas para conformar el objeto ‘producto’ (nombre, precio y foto).

*/

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


io.on('connection', async (client) => {
    
    try{
        await productos.getAll()
            .then((data)=>client.emit('products-update', data))


        await messages.getAll()
            .then((data)=>client.emit('messages-update', messages))
        
      
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

  app.use('/api/productos-test', (req, res) => {
    io.on('connection', async (client)=>{
        try{
            const productos = []
            for(let i=0; i<5; i++){
                
                const nombre = faker.commerce.product()
                const price = faker.commerce.price()
                const foto = faker.image.business()
                productos.push({nombre, price, foto})
            }
            await io.sockets.emit('faker-products-update', productos)
        }
        catch(err){
            console.log(err)
        }
    })
})
  



  

const PORT = 8080
server.listen(PORT, ()=> console.log(`I´m listening in port ${PORT}`))


