import React from 'react';
import Sidebar from './Sidebar.js';
import Chat from './Chat.js';
import './Home.css';

function Home() {
    return (
        <div className="app_container">
            <Sidebar />
            <Chat />
        </div>
    )
}

export default Home ;
