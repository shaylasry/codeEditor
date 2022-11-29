import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useContext, useEffect, useState} from "react";
// @ts-ignore
import {getTemplateCode, studentLogin} from "../service.ts";
// @ts-ignore
import {UserContext} from "../context/UserContext.tsx";
import {useHistory} from "react-router-dom";
import { useParams} from 'react-router-dom';

// @ts-ignore
import {useAuth} from "../context/AuthContext.tsx";

export const StudentLoginPage = () => {
    // const {userName, setUserName} = useContext(UserContext);
    const {userName, setUserName} = useAuth();

    const [password, setPassword] = useState(null);
    const { uuid } = useParams();
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
            const {data : {isIdMatchUUID}} = await studentLogin(userName, password, uuid);
            if(isIdMatchUUID) {
                navigate.push("/SessionPage/" + uuid);
            } else {

            }
        } catch (e) {
            console.log(e);
        }
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
