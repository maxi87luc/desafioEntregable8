const client = io();



client.on('faker-products-update', (data) => {
    console.log("it´s alive")
    console.log(data)
    const tbody = document.getElementById('tbody');
    let tr = ""
    const templateTr = Handlebars.compile(`
        <tr>
            <th scope="row">{{id}}</th>
            <td>{{title}}</td>
            <td>{{price}}</td>
            <td><img src="{{thumbnail}}" style="width: 30px" alt="">  </td>
        </tr>
    `);
    
  
    data.forEach((product)=>{
        
        tr = `
        ${tr}
        ${templateTr(product)}
        `      
        tbody.innerHTML = tr;   
    })

 
    

});
















