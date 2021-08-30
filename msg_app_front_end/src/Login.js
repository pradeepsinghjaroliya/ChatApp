import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import { auth, provider } from './firebase';

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch((err) => alert(err.message));
    }

    return (
        <div className="login">
            <div className="login_logo">
                <img src="data:image/png;base64,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" alt="Company Logo" />
                <h1>PSJ-MsgApp</h1>
            </div>
            <Button onClick={signIn} className="login_button">Sign In</Button>
        </div>
    )
}

export default Login
