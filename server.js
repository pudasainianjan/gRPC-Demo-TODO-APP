const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{}); 

//load packageDef into gRPC object
const grpcObject = grpc.loadPackageDefinition(packageDef);     // GOAL: we want todoPackage as an object  //thiswill load todoPackage with the scheme
const todoPackage = grpcObject.todoPackage;   //now we can instanciate service,get access to messange and everything

//create a server 
const server = new grpc.Server();
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());     //createInsecure() means comm. betn services will be in plain text

//tell server about services you are using
server.addService(todoPackage.Todo.service,
    {
        "CreateTodo": createTodo,
        "readTodos": readTodos,
        "readTodosStream": readTodosStream
    }    
);
server.start();         //start listening to the port

const todos = [];

//methods in grpc always takes 2 paramenter (call,callback) whole call and callback where we use to send back info back to the client
function createTodo (call,callback) {       
    //console.log(call);      //contains request by client with todoItem and id
    const todoItem = {
        "id":todos.length+1,
        "text":call.request.text
    }
    todos.push(todoItem);
    callback(null,todoItem)          //call the client back null(how big is payload) and send back todoItem to client
}

function readTodosStream(call,callback){
    todos.forEach(t=>call.write(t));
    call.end();
}

function readTodos(call, callback){
    callback(null,{"items":todos})      //this should match the schema we made inside proto file
    // console.log(todos);
}
