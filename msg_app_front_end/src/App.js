import React, { useEffect } from 'react';
import './App.css';
import Home from './Home';
import { login, logout, selectUser } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Login from './Login';
import { auth } from './firebase';

function App() {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if(authUser){
                //logged in
                dispatch(login({
                    uid: authUser.uid,
                    photo: authUser.photoURL,
                    email: authUser.email,
                    displayName: authUser.displayName,
                }))
            }
            else {
                //logged out
                dispatch(logout());
            }
        })
    }, []);

    return (
        <div >
           {user ? <Home /> : <Login />}
        </div>
    )
}

export default App;
