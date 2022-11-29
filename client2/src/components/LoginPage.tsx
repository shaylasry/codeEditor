import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useContext, useEffect, useState} from "react";
// @ts-ignore
import {getCodeBlocks, getStudents, getTemplateCode, login} from "../service.ts";
// @ts-ignore
import {UserContext} from "../context/UserContext.tsx";
import {useHistory} from "react-router-dom";
// @ts-ignore
import {useAuth} from "../context/AuthContext.tsx";
// @ts-ignore
import {singletonContext} from "../context/userSingleton.js"
// @ts-ignore
import {userContext} from "../user/User.ts"


export const LoginPage = () => {

    const {userName, setUserName} = useAuth();
    const [password, setPassword] = useState(null);



    const navigate = useHistory();
    const resetUser = () => {
        setUserName(null);
        setPassword(null);
    }

    useEffect(() => {
        resetUser();
    }, []);

   

    const handleLogin = async () => {
        try {
            const {data: {type}} = await login(userName, password);
            if (type === "mentor") {
                navigate.push("/LobbyPage")
            } else if (type === "student") {
                navigate.push("/")
                resetUser();
            } else {
                resetUser();
            }

        } catch (e) {
            resetUser();
            console.log(e);
        }
            //if user is mentor redirect to lobby
        //if user is student or err redirect to login page


    }


    return (
        <>
            <TextField
                id="user-name-field"
                label="Username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
            />
            <TextField
                id="password-field"
                label="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <Button onClick={() => handleLogin()}>Login</Button>
        </>
    );
}
