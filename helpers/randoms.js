process.on('message', data => {
    
    let object = {}
    const randomNumber = (max)=>{
        return Math.floor(Math.random() * max)

    }
    
    for(let i=0; i<=data; i++){
        const random = randomNumber(1000);
        
        
        if(object.hasOwnProperty(random)){
            object[random]++
            
        } else{
            object[random]=1            
            
        }
    }
    
    process.send(object);
  });