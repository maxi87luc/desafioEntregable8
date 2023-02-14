import mongoose from 'mongoose';

let isConnected = false;

const connectToDbAtlas = async () => {
  if (!isConnected) {
    console.log('Nueva conexión');
    await mongoose.connect('mongodb+srv://maxi87luc:Juani422@coderhouse.yv2sexp.mongodb.net/test');
    isConnected = true;
    return;
  }

  console.log('Conexión existente');
  return;
};


export default connectToDbAtlas
