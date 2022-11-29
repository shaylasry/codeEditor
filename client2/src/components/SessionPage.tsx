import CodeMirror, {useCodeMirror} from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import * as React from 'react';
import { useParams} from 'react-router-dom';
import EmojiPicker, {Emoji} from 'emoji-picker-react';
// @ts-ignore
import {UserContext} from "../context/UserContext.tsx";

import {useContext, useEffect, useRef, useState} from "react";
// @ts-ignore
// @ts-ignore
import {
    checkUUID,
    createSession,
    getCodeBlocks,
    getTemplateCode,
    getType,
    login,
    updateCode
} from "../service.ts";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import {useHistory} from "react-router-dom";
// @ts-ignore
import {useAuth} from "../context/AuthContext.tsx";


export const SessionPage = () => {
    const {userName, setUserName} = useAuth();
    const {uuid} = useParams();

    const [readOnly, setReadOnly] = useState(false);
    const navigate = useHistory();
    const [adminBackToPrevPage, setAdminBackToPrevPage] = useState(false);
    const [userBackToPrevPage, setUserBackToPrevPage] = useState(false);
    const [userType, setUserType] = useState(null);
    const [code, setCode] = useState("");
    const [isSmileyModalOpen, setIsSmileyModalOpen] = React.useState(false);


    //check if user is mentor or student, if mentor no need to login, if student first login
    useEffect(() => {
        const _ = async () => {
            if (!userName) {
                navigate.push("/studentLoginPage/" + uuid);
            } else {
                //getType
                const {data: {type}} = await getType(userName);
                const _ = async () => {
                    const {data: {sessionCode}} = await getTemplateCode(uuid);
                    setCode(sessionCode);
                };
                _();
                if (type === "mentor") {
                    setUserType("mentor");
                    await setReadOnly(true);

                } else {
                    setUserType("student");
                    const {data: {isIdMatchUUID}} = await checkUUID(userName, uuid);

                    //if this is not the user that assigned to this session push it out
                    if (!isIdMatchUUID) {
                        navigate.push("/studentLoginPage/" + uuid);
                    }
                }
            }

        };
        _();
    }, []);


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 50,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    //handle the back to previous page click
    const handleClick = () => {
        if (userType === "mentor") {
            setAdminBackToPrevPage(true);
        } else {
            setUserBackToPrevPage(true);
        }
    }


//go out from session page if handleClick button is called
    useEffect(() => {
        if (userBackToPrevPage) {
            navigate.push("/studentLoginPage/" + uuid);
        }
    }, [userBackToPrevPage]);

    useEffect(() => {
        if (adminBackToPrevPage) {
            navigate.push("/LobbyPage");
        }
    }, [adminBackToPrevPage]);


    //handle code match to solution smiley face pop up
    useEffect(() => {
        if(code !== "") {
            const _ = async () => {
                const {data: {isCodeMatchSolution}} = await updateCode(uuid, code);
                setIsSmileyModalOpen(isCodeMatchSolution);
            };
            _();
        }
    }, [code]);




    return (
        <>
            <Modal
                open={isSmileyModalOpen}
                onClose={() => setIsSmileyModalOpen(false)}
            >
                <Box sx={style}>
                    <Emoji unified="1f601" size="50"/>
                </Box>
            </Modal>
            <CodeMirror
                value={code}
                readOnly={readOnly}
                theme="dark"
                height="200px"
                extensions={[javascript({ jsx: true })]}
                onChange={ (value) => {setCode(value)}}
            />
            <Button onClick={handleClick}>Back to previous page</Button>

        </>
    );

}
