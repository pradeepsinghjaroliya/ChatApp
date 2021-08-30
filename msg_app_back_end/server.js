import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Pusher from "pusher";
import mongoData from "./mongoData.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
	appId: "1212438",
	key: "b8d26b1b6478c35cffc6",
	secret: "6ed604ae7fddbdeade26",
	cluster: "ap2",
	useTLS: true,
});

app.use(cors());
app.use(express.json());

const uri = process.env.URI;
mongoose.connect(uri, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const conn = mongoose.connection;
conn.once("open", () => {
	console.log("MongoDb connected.");

	const changeStream = mongoose.connection.collection("conversations").watch();

	changeStream.on('change', (change) => {
		//console.log("inside chg stream");
		if (change.operationType === 'insert') {
			pusher.trigger('chats', "newChat", {
				'change': change
			})
		} else if (change.operationType === 'update') {
			pusher.trigger('messages', 'newMessage', {
				'change': change
			})
		} else {
			console.log("Error in Pusher..");
		}
	});
});

app.get("/", (req, res) => res.status(200).send(" Get request received."));

app.post("/new/conversation", (req, res) => {
	//console.log(req.body);
	const dbData = req.body;

	mongoData.create(dbData, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.post("/new/message", (req, res) => {
	//console.log(req.body);
	mongoData.updateMany(
		{ _id: req.query.id },
		{ $push: { conversation: req.body } },
		(err, data) => {
			if (err) {
				console.log("Error saving the message...");
				console.log(err);
				res.status(500).send(err);
			} else {
				//console.log(data);
				res.status(201).send(data);
			}
		}
	);
});

app.get("/get/conversationList", (req, res) => {
	mongoData.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			data.sort((b, a) => {
				return a.timestamp - b.timestamp;
			});
			let conversations = [];

			data.map((conversationData) => {
				const conversationInfo = {
					id: conversationData._id,
					name: conversationData.chatName,
					timestamp: conversationData.conversation[0].timestamp,
				};
				conversations.push(conversationInfo);
			});
			res.status(200).send(conversations);
		}
	});
});

app.get("/get/conversation", (req, res) => {
	const id = req.query.id;

	mongoData.find({ _id: id }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.get("/get/lastMessage", (req, res) => {
	const id = req.query.id;

	mongoData.find({ _id: id }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			let convData = data[0].conversation;

			convData.sort((b, a) => {
				return a.timestamp - b.timestamp;
			});
			res.status(200).send(convData[0]);
		}
	});
});

app.listen(port, () => {
	console.log(`Server running on localhost port: ${port}`);
});
