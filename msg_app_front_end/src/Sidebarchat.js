import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setChat } from "./features/chatSlice";
import "./Sidebarchat.css";
import axios from "./axios";
import Pusher from "pusher-js";

const pusher = new Pusher("b8d26b1b6478c35cffc6", {
	cluster: "ap2",
});

function Sidebarchat({ id, chatName }) {
	const dispatch = useDispatch();
	const [chatInfo, setChatInfo] = useState([]);

	const [lastMsg, setLastMsg] = useState("");
	const [lastPhoto, setLastPhoto] = useState("");
	const [lastTimestamp, setLastTimestamp] = useState("");

	const getSidebarElement = () => {
		axios.get(`/get/lastMessage?id=${id}`).then((res) => {
			setLastMsg(res.data.message);
			setLastPhoto(res.data.user.photo);
			setLastTimestamp(res.data.timestamp);
		});
	};

	useEffect(() => {
		//console.log("st");
		getSidebarElement();

		//pusher stuff
		const channel = pusher.subscribe('messages');
		channel.bind('newMessage', function (data) {
			//console.log("art");
			getSidebarElement();
		});
	}, [id]);

	return (
		<div
			onClick={() => {
				dispatch(
					setChat({
						chatId: id,
						chatName: chatName,
					})
				);
			}}
			className="sidebar_chat"
		>
			<Avatar src={lastPhoto} className="sidebar_chat_avatar" />
			<div className="sidebar_chat_info">
				<h3>{chatName}</h3>
				<p>{lastMsg}</p>
				<small>{new Date(parseInt(lastTimestamp)).toUTCString()}</small>
			</div>
		</div>
	);
}

export default Sidebarchat;
