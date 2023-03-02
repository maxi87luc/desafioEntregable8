import { normalize, schema } from 'normalizr';

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

export default normalizar