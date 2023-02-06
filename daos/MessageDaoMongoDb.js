



import ContainerMongoDb from '../model/ContainerMongoDb.js' ;




class MessagesDaoMongoDb extends ContainerMongoDb {

    constructor(name, model) {
        super(name, model)
    }

    
}

export default MessagesDaoMongoDb;