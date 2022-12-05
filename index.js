// // const express = require("express");
// // const app = express();
// // const PORT = 4000;

// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());

// // const http = require("http").Server(app);
// // const cors = require("cors");
// // app.use(cors());

// // const socketIO = require('socket.io')(http, {
// // 	cors: {
// // 		origin: "http://localhost:3000"
// // 	}
// // });

// // socketIO.on('connection', (socket) => {
// // 	console.log(`⚡: ${socket.id} user just connected!`);
// // 	socket.on('disconnect', () => {
// // 		socket.disconnect()
// // 		console.log('🔥: A user disconnected');
// // 	});
// // 	socket.on("taskDragged", (data) => {
// // 		const { source, destination } = data;

// // 		const itemMoved = {
// // 			...tasks[source.droppableId].items[source.index],
// // 		};
// // 		console.log("DraggedItem>>> ", itemMoved);

// // 		tasks[source.droppableId].items.splice(source.index, 1);

// // 		tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

// // 		socket.emit("tasks", tasks);
// // 	});
// // });

// // app.listen(process.env.PORT || PORT, () => {
// // 	console.log(`Server listening on ${PORT}`);
// // });


// // //2nd option
// const express = require("express")
// const app = express()
// const http = require("http")
// const cors = require("cors")
// const { Server } = require("socket.io")
// app.use(cors)
// app.set('port', 4000)
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     }
// })

// io.on("connection", (socket) => {
//     console.log("Socket Id", socket.id)

//     socket.on("disconnect", () => {
//         console.log("User Disconnected", socket.id)
//     })

//     //socket.emit("getTask", tasks);

//     socket.on("createTask", (data) => {
//         const newTask = { id: fetchID(), title: data.task, comments: [] };
//         var item = []
//         // item.push(newTask)
//         tasks["pending"].items.push(newTask);
//         // tasks = {
//         //     "pending" : {
//         //         "title" : 'pending',
//         //         "items" : item
//         //       }
//         // }
//         socket.emit("tasks", tasks);
//         console.log("createTask>>> ", tasks);
//         // 👇🏻 sends notification via Novu
//         // sendNotification(data.userId);
//     });

//     socket.on("fetchComments", (data) => {
//         const taskItems = tasks[data.category].items;
//         for (let i = 0; i < taskItems.length; i++) {
//             if (taskItems[i].id === data.id) {
//                 socket.emit("comments", taskItems[i].comments);
//             }
//         }
//     });
//     socket.on("addComment", (data) => {
//         console.log("Add Comment", data)
//         const taskItems = tasks[data.category].items;
//         for (let i = 0; i < taskItems.length; i++) {
//             if (taskItems[i].id === data.id) {
//                 taskItems[i].comments.push({
//                     name: data.userId,
//                     text: data.comment,
//                     id: fetchID(),
//                 });
//                 socket.emit("comments", taskItems[i].comments);
//             }
//         }
//     });
//     socket.on("taskDragged", (data) => {
//         const { source, destination } = data;

//         const itemMoved = {
//             ...tasks[source.droppableId].items[source.index],
//         };
//         tasks[source.droppableId].items.splice(source.index, 1);

//         tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

//         socket.emit("tasks", tasks);
//     });
// })

// // app.get("/api", (req, res) => {
// //     res.json(tasks);
// // });

// app.listen(process.env.PORT || 4000, () => {
//     console.log("SERVER RUNNING")
// })

// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
//   });



//3rd one
const express = require('express');
const app = express();
const cors = require("cors")
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(cors())
//const io = new Server(server);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        "Access-Control-Allow-Origin": "*",
    }
});

app.get('/api', (req, res) => {
    res.json(tasks)
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log("Socket Id", socket.id)
    socket.on("createTask", (data) => {
        const newTask = { id: fetchID(), title: data.task, comments: [] };
        var item = []
        // item.push(newTask)
        tasks["pending"].items.push(newTask);
        // tasks = {
        //     "pending" : {
        //         "title" : 'pending',
        //         "items" : item
        //       }
        // }
        socket.emit("tasks", tasks);
        console.log("createTask>>> ", tasks);
        // 👇🏻 sends notification via Novu
        // sendNotification(data.userId);
    });

    socket.on("taskDragged", (data) => {
        const { source, destination } = data;

        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        tasks[source.droppableId].items.splice(source.index, 1);

        tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

        socket.emit("tasks", tasks);
    });
    socket.on("fetchComments", (data) => {
        const taskItems = tasks[data.category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === data.id) {
                socket.emit("comments", taskItems[i].comments);
            }
        }
    });
    socket.on("addComment", (data) => {
        console.log("Add Comment", data)
        const taskItems = tasks[data.category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === data.id) {
                taskItems[i].comments.push({
                    name: data.userId,
                    text: data.comment,
                    id: fetchID(),
                });
                console.log("taskItemsLoop", taskItems)
                socket.emit("comments", taskItems[i].comments);
            }
        }
    });
});


  app.listen(process.env.PORT || 4000, () => {
         console.log("SERVER RUNNING")
     })

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
    pending: {
        title: "pending",
        items: [
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
        ],
    },
    completed: {
        title: "completed",
        items: [
        ],
    },
};