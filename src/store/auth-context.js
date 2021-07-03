import React, { useEffect, useState } from 'react';


const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    loggedIn: (token) => { },
    loggedOut: () => { }
});

let logoutTimer;

const retriveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemaingTime(storedExpirationTime);
    if (remainingTime < 60000) { // one minute
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: storedExpirationTime
    }
}

const calculateRemaingTime = (expirationTime) => {
    const curTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - curTime;
    return remainingDuration;
}

export const AuthContextProvider = (props) => {
    const tokenData = retriveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    // const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const userLoggedIn = !!token;

    const logOutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }

    const logInHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemaingTime(expirationTime);
        logoutTimer = setTimeout(logOutHandler, remainingTime);
    }

    useEffect(() => {
        if (tokenData) {
            console.log("durationn", tokenData.duration);
            logoutTimer = setTimeout(logOutHandler, tokenData.duration);
        }
    }, [tokenData])



    const contextValue = {
        token: token,
        isLoggedIn: userLoggedIn,
        loggedIn: logInHandler,
        loggedOut: logOutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;