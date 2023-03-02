import { fork } from "child_process"
const randoms = fork('./helpers/randoms.js');

const apiRandoms = (req, res)=>{
    const cant = req.query.cant?parseInt(req.query.cant):100000000

    
    console.log(cant)
    randoms.send(cant)
    randoms.on('message', (object) => {
        
        res.end(JSON.stringify(object, null, 2))
        
    });   
    
    
}
export default apiRandoms