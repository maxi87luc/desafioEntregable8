/*
 
Implementar sobre el entregable que venimos realizando un mecanismo de autenticación. Para ello:
Se incluirá una vista de registro, en donde se pidan email y contraseña. Estos datos se persistirán usando MongoDb, en una (nueva) colección de usuarios, cuidando que la contraseña quede encriptada (sugerencia: usar la librería bcrypt).
Una vista de login, donde se pida email y contraseña, y que realice la autenticación del lado del servidor a través de una estrategia de passport local.
Cada una de las vistas (logueo - registro) deberá tener un botón para ser redirigido a la otra.

*/

import  express from 'express';
import session from 'express-session'
import passport from 'passport'
import pkg from 'passport-strategy';
import { Strategy } from 'passport-local'
import {hash, hashSync, compareSync} from 'bcrypt'



//passport login -----------------------------------------------------------


passport.use('login', new Strategy((username, password, done) => {
    const user = users.findOne({username: username})
        .then((user)=>{
            console.log(user)
            if(!user){
                done(null, false)
                return
            } 
            if(compareSync(password, user.password)){
                done(null, user);
                return;
            }
            done(null, false);
        })

    
}))

//passport signup -------------------------------------------------
passport.use('signup', new Strategy((username, password, done) => {
    const existentUser = users.findOne({username: username})
        .then(user=>{
            if (user) {
                done(new Error('User already exists'));
                return;
                }
        });
   


    const user = { username, password: hashSync(password, 10) };
    console.log({ user });
    users.save(user);

    done(null, user);
}))

passport.serializeUser(function(user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(function(username, done) {
    const user = users.findOne({username: username});
    done(null, user);
  });
  


import  { faker } from '@faker-js/faker';
faker.setLocale('es')
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'







const app = express();
import { Server } from 'socket.io';

import { createServer } from 'http';

import Mensaje from './model/messageSchema.js'
import User from './model/userSchema.js'

import { normalize, schema } from 'normalizr';



const server = createServer(app); 
const io = new Server(server);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
import Contenedor from './model/index.js'
import daoMongoDb  from './daos/daoMongoDb.js'
import dbClient from './config/connectToDb.js' ;
import connectToMongoDb  from './config/connectToMongoDb.js' ;
import {port} from './config/enviroment.js'
import {mongoURL, mongoSecret} from './config/enviroment.js'

app.use(expressSession({
    store: MongoStore.create({ mongoUrl: mongoURL }),
    secret: mongoSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }

  }));

app.use(passport.initialize());
app.use(passport.session());





const productos = new Contenedor("productos", dbClient)


const messages = new daoMongoDb({name: "mensajes", model: Mensaje})

const users = new daoMongoDb({name: "users", model: User})



connectToMongoDb().then(()=>console.log("database OK"))








app.post('/login',
    passport.authenticate('login', { failureRedirect: '../login-error' })
    ,(req, res, next)=>{
 
    req.session.username = req.user.username;

    
    res.redirect('../')
    next()
    
})

app.post('/signin',
    passport.authenticate('signup', { failureRedirect: '../signin-error' })
    ,(req, res, next)=>{ 
        
        req.session.username = req.user.username
    
        res.redirect('../')
        next()
    
})



// Normalizr ------------------------------------

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
    
    name = ""
    res.redirect('../login');
})

let name = ""
const refreshName = ()=>{
   
    app.use((req, res)=>{
       
        if(req.session.username)
            name = req.session.username
        else{
            name = "";
        }
    })
   
    
    return name

}
console.log(refreshName())


io.on('connection', async (client) => {
     
    try{
        await productos.getAll()
            .then((data)=>client.emit('products-update', data))
            .then(()=>refreshName())
            .then(io.sockets.emit('loginUpdate', {name: refreshName()}))
            
            

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

    
    
    
  
});

  




  


server.listen(port, ()=> console.log(`I´m listening in port ${port}`))


