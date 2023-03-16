import autocannon from 'autocannon'

autocannon({
  url: 'http://localhost:8080/info',
  connections: 10, //default
  pipelining: 1, // default
  duration: 10 // default
}, console.log)

// async/await

const foo = async ()=> {
  const result = await autocannon({
    url: 'http://localhost:8080/info',
    connections: 10, //default
    pipelining: 1, // default
    duration: 10 // default
  })
  console.log(result)
}