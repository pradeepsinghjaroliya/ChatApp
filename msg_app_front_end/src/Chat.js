import React, { useEffect, useState } from "react";
import "./Chat.css";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import { useSelector } from "react-redux";
import { selectChatId, selectChatName } from "./features/chatSlice";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import axios from "./axios";
import Pusher from "pusher-js";

const pusher = new Pusher("b8d26b1b6478c35cffc6", {
	cluster: "ap2",
});

function Chat() {
	const user = useSelector(selectUser);
	const [input, setInput] = useState("");
	const chatName = useSelector(selectChatName);
	const chatId = useSelector(selectChatId);
	const [messages, setMessages] = useState([]);

	const getConveresation = (chatId) => {
		if (chatId) {
			axios.get(`/get/conversation?id=${chatId}`).then((res) => {
				setMessages(res.data[0].conversation);
			});
		}
	};

	useEffect(() => {
		pusher.unsubscribe("messages");

		getConveresation(chatId);

		const channel = pusher.subscribe("messages");
		channel.bind("newMessage", function (data) {
			getConveresation(chatId);
		});
	}, [chatId]);

	const sendMessage = (e) => {
		e.preventDefault();

		axios.post(`/new/message/?id=${chatId}`, {
			message: input,
			timestamp: Date.now(),
			user: user,
		});

		setInput("");
	};

	return (
		<div className="chat">
			<div className="chat_header">
				<h4>
					TO: <span className="chat_name">{chatName}</span>
				</h4>
				<strong>Details</strong>
			</div>
			<div className="chat_messages">
				<FlipMove>
					{console.log(messages.data)}
					{messages.map(({ user, _id, message, timestamp }) => (
						<Message
							key={_id}
							id={_id}
							sender={user}
							message={message}
							timestamp={timestamp}
						/>
					))}
				</FlipMove>
			</div>
			<div className="chat_input">
				<form className="chat_input_form">
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						type="text"
						placeholder="Type a message"
						className="chat_input_input"
					/>
					<button onClick={sendMessage} className="chat_input_button">
						<SendIcon className="chat_input_button" />
					</button>
				</form>
			</div>
		</div>
	);
}

export default Chat;
