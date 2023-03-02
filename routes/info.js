
import {info} from '../config/enviroment.js'
const infoRoute = (req, res)=>{    
    res.send(JSON.stringify(info, null, 2))    
}
export default infoRoute