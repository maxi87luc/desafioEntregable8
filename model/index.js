




class Contenedor {
    constructor(name, dbClient) {
        
        this.name = name;
        this.dbClient = dbClient;
        const createTable = async ()=>{        
                
            
            try {            
                await dbClient.schema.createTable(name, (table) => {
                    table.increments('id')
                    table.string('title')
                    table.float('price')
                    table.string('thumbnail')
                
              }) 
              console.log('Container Table created');
          
            } catch (err){
                console.error(err.message)
            } 
              
             
             
        }
        createTable()

    }
    async save(object){
        
        
        try {
            const objectToAdd = await this.dbClient(this.name).insert(object);
            console.log("Id asignado = " + objectToAdd[0]);
        } catch(err) {
            console.error(err);
        }
        
        
        
    }
    async getById(id){   

        const articlesInDb = await this.dbClient.from(this.name).where('id', id).select('*');

        console.log(JSON.stringify(articlesInDb, null, 2))
                          
    }
    async getAll(){
        
        const articlesInDb = await this.dbClient.from(this.name).select('*');

        return articlesInDb

        
       
               
    }
    async deleteById(id){
        
        try{
            await dbClient(this.name).where('id', id).del();

            console.log('Producto borrado');
        }
        catch (err){
            console.log(err)
        }
       
        
                    
       
    }
    async deleteAll(){
        
        try{
            await this.dbClient(this.name).del();

            console.log('todos los productos fueron borrados');
        }
        catch (err){
            console.log(err)
        }
        
     
    }
}



export default Contenedor



