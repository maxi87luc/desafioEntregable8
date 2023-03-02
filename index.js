import  express from 'express';
import passport from 'passport'
import './config/passport.js'
import  { faker } from '@faker-js/faker';
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io';
import { createServer } from 'http';
import Mensaje from './model/messageSchema.js'
import { normalize, schema } from 'normalizr';
import {mongoURL, mongoSecret, info} from './config/enviroment.js';
import infoRoute from './routes/info.js'
import apiRandoms from './routes/api/randoms.js'
import Contenedor from './model/index.js'
import daoMongoDb  from './daos/daoMongoDb.js'
import dbClient from './config/connectToDb.js' ;
import connectToMongoDb  from './config/connectToMongoDb.js' ;
import {port} from './config/enviroment.js'
import {login, loginPassport} from './routes/login.js'
import {signin, signinPassport} from './routes/signin.js'
import normalizar from './helpers/normalizr.js'
import createElement from './helpers/createElement.js'

const app = express();
faker.setLocale('es')

const server = createServer(app); 
const io = new Server(server);

app.get('/info', infoRoute)

app.get('/api/randoms', apiRandoms)

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

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



connectToMongoDb().then(()=>console.log("database OK"))

app.post('/login', loginPassport, login)

app.post('/signin', signinPassport, signin)



let name = ""

app.get('/logout', (req, res)=>{
    
    req.session.destroy();
    
    name = ""
    res.redirect('../login');
})


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
       
        data.content.date = {DD, MM, YY, hh, mm}
        
     
        messages.save(data)
      
        
        messages.getAll()
            .then((data)=> {
                return normalizar(data)
            })
            .then((data)=>client.emit('messages-update', data))

        


    })

    
    
    
  
});

  

server.listen(port, ()=> console.log(`I´m listening in port ${port}`))


