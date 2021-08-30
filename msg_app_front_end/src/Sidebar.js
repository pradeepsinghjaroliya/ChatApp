import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar } from "@material-ui/core";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import Sidebarchat from "./Sidebarchat";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { auth } from "./firebase";
import axios from "./axios";
import Pusher from "pusher-js";
const pusher = new Pusher("b8d26b1b6478c35cffc6", {
	cluster: "ap2",
});

function Sidebar() {
	const user = useSelector(selectUser);
	const [chats, setChats] = useState([]);

	const getChats = () => {
		axios.get("/get/conversationList").then((res) => {
			setChats(res.data);
		});
	};

	useEffect(() => {
		getChats();

		const channel = pusher.subscribe("chats");
		channel.bind("newChat", function (data) {
			getChats();
		});
	}, []);

	const addChat = (e) => {
		e.preventDefault();

		const chatName = prompt("Please enter a chat name");
		const firstMsg = prompt(
			"Heyyy!! Send a welcome message to let everyone know u have joined"
		);

		if (chatName && firstMsg) {
			let chatId = "";

			axios
				.post("/new/conversation", {
					chatName: chatName,
				})
				.then((res) => {
					chatId = res.data._id;
				})
				.then(() => {
					axios.post(`/new/message?id=${chatId}`, {
						message: firstMsg,
						timestamp: Date.now(),
						user: user,
					});
				});
		}
	};

	return (
		<div className="sidebar">
			<div className="sidebar_header">
				<Avatar
					src={user.photo}
					onClick={() => auth.signOut()}
					className="sidebar_avatar"
				/>
				<div className="sidebar_search">
					<SearchOutlinedIcon className="sidebar_search_icon" />
					<input className="sidebar_search_box" placeholder="Search" />
				</div>
				<QuestionAnswerOutlinedIcon onClick={addChat} className="sidebar_new" />
			</div>
			<div className="sidebar_chats">
				{chats.map(({ id, name, timestamp }) => (
					<Sidebarchat key={id} id={id} chatName={name} timestamp={timestamp} />
				))}
			</div>
		</div>
	);
}

export default Sidebar;
