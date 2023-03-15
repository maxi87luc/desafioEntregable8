
import {info} from '../config/enviroment.js'
import log4js from 'log4js'
import '../helpers/log4js.js'


const infoRoute = (req, res)=>{  
    console.log(info)
    res.send(JSON.stringify(info, null, 2))    
    
}
export default infoRoute