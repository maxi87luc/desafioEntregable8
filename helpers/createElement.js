import  { faker } from '@faker-js/faker';

const createElement = async (n)=>{
    const productos =[]
    
    for(let i=0; i<n; i++){                
        const nombre = await faker.commerce.product()
        const price = await faker.commerce.price()
        const foto = await faker.image.business()
        productos.push({nombre, price, foto})
    }
    return productos
}

export default createElement