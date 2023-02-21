import mongoose from 'mongoose';

let isConnected = false;

const connectToMessageDb = async () => {
  if (!isConnected) {
    console.log('Nueva conexión');
    await mongoose.connect('mongodb://127.0.0.1:27017/database');
    isConnected = true;
    return;
  }

  console.log('Conexión existente');
  return;
};


export default connectToMessageDb

