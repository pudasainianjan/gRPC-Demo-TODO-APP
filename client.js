//exactly same as server

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{}); 

//load packageDef into gRPC object
const grpcObject = grpc.loadPackageDefinition(packageDef);     
const todoPackage = grpcObject.todoPackage;  

const text = process.argv[2];           //2 is third paramenter which will be the actual text for rg: node client.js do-coding

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());      //creating obj of todo service with port and ip

client.createTodo({
    "id": -1,
    "text": text
},(err,response)=>{
    // console.log("received from server"+JSON.stringify(response));
})

/*
client.readTodos({},(err,response)=>{
    console.log("received todos list from server"+JSON.stringify(response));
    if(!response.items){                //if its not undefined then do this
        response.items.forEach(a=>console.log(a.text));
    }
    
})
*/

//not receiving at once, but one by one
const call = client.readTodosStream();
call.on("data",item=>{
    console.log("received item form server "+JSON.stringify(item));
})

call.on("end",e=>console.log("server done sending data!"))