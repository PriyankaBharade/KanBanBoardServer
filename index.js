const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require("http").Server(app);
const cors = require("cors");
app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
        socket.disconnect()
        console.log('🔥: A user disconnected');
    });
    socket.on("taskDragged", (data) => {
        const { source, destination } = data;
        
        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        console.log("DraggedItem>>> ", itemMoved);

        tasks[source.droppableId].items.splice(source.index, 1);

        tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

        socket.emit("tasks", tasks);
    });
});

app.get("/api", (req, res) => {
    res.json(tasks);
});

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });

app.listen(process.env.PORT || PORT, '0.0.0.0', () => {
	console.log(`Server listening on ${PORT}`);
  });

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
	pending: {
		title: "pending",
		items: [
			{
				id: fetchID(),
				title: "Send the Figma file to Dima",
				comments: [],
			},
		],
	},
	ongoing: {
		title: "ongoing",
		items: [
			{
				id: fetchID(),
				title: "Review GitHub issues",
				comments: [
					{
						name: "David",
						text: "Ensure you review before merging",
						id: fetchID(),
					},
				],
			},
		],
	},
	completed: {
		title: "completed",
		items: [
			{
				id: fetchID(),
				title: "Create technical contents",
				comments: [
					{
						name: "Dima",
						text: "Make sure you check the requirements",
						id: fetchID(),
					},
				],
			},
		],
	},
};