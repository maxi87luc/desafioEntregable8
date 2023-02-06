





class ContainerMongoDb {
    constructor(object){    
        
        this.name = object.name
        this.model = object.model  
        
    

    }

    async save(object){
        // save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        
        
            try{            
            
                const newItem = new this.model(object)
                
                return newItem.save()
    
                
            }
            catch (err){
                console.log(err)
            }
        }
        
                

       

        
    
  
            
        

    async getAll(){
        // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        let listado = []
        
        
        try{
            listado = await this.model.find()
            
            return listado
                     

        }
        catch (err){
            console.log(err)
        }
       
       


        
                        
    }

    async deleteAll(){
        // deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            await this.model.deleteMany({})
        }
        catch (err){
            console.log(err)
        }
        
     
    }
};

export default ContainerMongoDb;


