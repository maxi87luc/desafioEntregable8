import passport from 'passport'
import { Strategy } from 'passport-local'
import {hash, hashSync, compareSync} from 'bcrypt'
import daoMongoDb  from '../daos/daoMongoDb.js'
import User from '../model/userSchema.js'

const users = new daoMongoDb({name: "users", model: User})

//passport login -----------------------------------------------------------


passport.use('login', new Strategy((username, password, done) => {
    const user = users.findOne({username: username})
        .then((user)=>{            
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
  
