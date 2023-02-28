const data = fetch('http://localhost:8080/info/', {
    method: "GET",
    headers: {"Content-type": "application/json;charset=UTF-8"}
  })
    
    .then((objeto)=>{
        console.log("ESTA CORRIENDO EL .THEN")
        console.log(objeto)
    })
