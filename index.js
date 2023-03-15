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
import { mongoURL, mongoSecret, info, modo, args} from './config/enviroment.js';
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
import cluster from 'cluster'
import {fork} from 'child_process'
import compression from 'compression'
import log4js from 'log4js';
import './helpers/log4js.js'




const app = express();
faker.setLocale('es')

const server = createServer(app); 
const io = new Server(server);

app.use('*', (req, res, next)=>{
    const { url, method } = req
    const logger = log4js.getLogger();
    logger.level = "info";
    logger.info(`path: ${url}, method: ${method}`);
    next()
})



app.get('/info', compression(), infoRoute)

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
        
        await messages.getAll()
            .then((data)=> {
                return normalizar(data)
            })
            .then((data)=>client.emit('messages-update', data))

        await productos.getAll()
            .then((data)=>client.emit('products-update', data))
            .then(()=>refreshName())
            .then(io.sockets.emit('loginUpdate', {name: refreshName()}))         
            
            

           

        await createElement(5).then((data)=>{client.emit('faker-products-update', data)})
        
      
        await client.on('producto', data => {   
            
            
            productos.save(data)
                
                .then(()=>productos.getAll())
                .then((data)=>io.sockets.emit('products-update', data))
            
            
            
    
               
        });
    } catch (err){
        const logger = log4js.getLogger("err");
        logger.level = "error";
        logger.error(err);  
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


if (args.modo == "cluster"){
    if (cluster.isPrimary){
        console.log(process.pid)
        
        for (let i = 0; i < info.numCpus; i++) {
            
          cluster.fork();
        }
        cluster.on('exit', (worker, code, signal)=>{
            
            console.log(worker.process.pid + "It´s Dead")
            cluster.fork()
        })
        console.log("cluster is primary")
    } else {
    
        server.listen(port, ()=> console.log(`I´m listening in port ${port}. Process ${process.pid}`))
    
    }
} else {
    server.listen(port, ()=> console.log(`I´m listening in port ${port}. Process ${process.pid}`))
}


app.get('*', (req, res) => {
    if(req.url==="/"){
        res.end()
    } else {
        console.log(req.url)
        const { url, method } = req
        const logger = log4js.getLogger("warn");
        logger.level = "warn";
        logger.warn(`Ruta ${method} ${url} no implementada`)
    }
    
    
  })
  



