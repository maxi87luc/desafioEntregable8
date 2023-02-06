

import  mongoose from 'mongoose' ;

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  
  author: { type: Object, required: true },
  content: {type: Object, required: true}
  
});

const Mensaje = model('Mensaje', messageSchema);

export default Mensaje;