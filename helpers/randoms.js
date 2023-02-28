process.on('message', data => {
    console.log(data)
    let object = {}
    const randomNumber = (max)=>{
        return Math.floor(Math.random() * max)

    }
    
    for(let i=0; i<=data; i++){
        const random = randomNumber(1000);
        
        
        if(object.hasOwnProperty(random)){
            object[random]++
            console.log("+1")
        } else{
            object[random]=1            
            console.log("+1")
        }
    }
    
    process.send(object);
  });