import * as React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem, Modal,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
// @ts-ignore
import {createSession, getCodeBlocks, getSessionsLink, getStudents, getType} from "../service.ts";
// @ts-ignore
import {UserContext} from "../context/UserContext.tsx";
import {useHistory} from "react-router-dom";

// @ts-ignore
import {useAuth} from "../context/AuthContext.tsx";
// @ts-ignore
// import {singletonContext} from "../context/userSingleton.js"


export const LobbyPage = () => {
    const {userName, setUserName} = useAuth();
    const navigate = useHistory();

    const [codeBlocks, setCodeBlocks] = useState(null);
    const [userIds, setUserIds] = useState(null);
    const [selectedCodeBlockId, setSelectedCodeBlockId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isStudentIdModalOpen, setIsStudentIdModalOpen] = React.useState(false);
    const [sessionsLinksList, setSessionsLinksList] = useState(null);
    const [selectedSessionsLinks, setSelectedSessionsLinks] = useState(null);
    const [sessionLink, setSessionLink] = useState(null);


    //check user type for validation, stay only if mentor
    useEffect(() => {
        const _ = async () => {
            if (userName) {
                const {data: {type}} = await getType(userName);
                console.log("this is user: " + userName);
                if (type !== "mentor") {
                    navigate.push("/");
                }
                const {data: {codeBlocks: newCodeBlocks}} = await getCodeBlocks();
                console.log(codeBlocks);
                const {data: {students: newStudentIds}} = await getStudents();
                const {data: {sessionsLinks: newSessionsLinks}} = await getSessionsLink();

                setCodeBlocks(newCodeBlocks);
                setUserIds(newStudentIds);
                setSessionsLinksList(newSessionsLinks.map((sessionLink) => "/SessionPage/" +sessionLink));

            } else{
                navigate.push("/");
            }
        };
        _();
    }, []);


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    //change the block id and open modal to generate session according to user
    const handleCodeBlockChange = (event: SelectChangeEvent) => {
        setSelectedCodeBlockId(event.target.value as string);
        setIsStudentIdModalOpen(true);
    };

    const handleStudentChange = (event: SelectChangeEvent) => {
        setSelectedUserId(event.target.value as string);
    };


    //crate a new session
    const handleCreateSession = async () => {
        const { data: {id}} = await createSession(selectedUserId, selectedCodeBlockId);
        const linkForMentor = "http://localhost:3000/SessionPage/" + id;
        let curSessionsLinksList = sessionsLinksList;
        curSessionsLinksList.push(linkForMentor);
        setSessionsLinksList(curSessionsLinksList);

        setSessionLink("http://localhost:3000/StudentLoginPage/" + id);
    }

    const handleSessionsLinksChange = (event: SelectChangeEvent) => {
        navigate.push(event.target.value as string);

        // setSelectedSessionsLinks();
    };

    console.log(codeBlocks);
    return (
        <>
            <Modal
                open={isStudentIdModalOpen}
                onClose={() => setIsStudentIdModalOpen(false)}
            >
                <Box sx={style}>
                    <FormControl fullWidth>
                        <InputLabel>studentId</InputLabel>
                        <Select
                            value={selectedUserId}

                            label="studentId"
                            onChange={handleStudentChange}
                        >
                            {userIds && userIds.map((id) => <MenuItem value={id}>{id}</MenuItem>)}
                        </Select>
                        <Button onClick={handleCreateSession}>Generate Session Link</Button>
                        {sessionLink}
                    </FormControl>
                </Box>
            </Modal>
            <FormControl fullWidth>
                <InputLabel id="bloc-id">BlockId</InputLabel>
                <Select
                    value={selectedCodeBlockId}
                    label="BlockId"
                    onChange={handleCodeBlockChange}
                >
                    {codeBlocks && codeBlocks.map((cb) => <MenuItem value={cb.id}>{cb.id}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="sessions-links">Sessions Links</InputLabel>
                <Select
                    value={sessionsLinksList}
                    label="SessionsLinks"
                    onChange={handleSessionsLinksChange}
                >
                    {sessionsLinksList && sessionsLinksList.map((cb) => <MenuItem value={cb}>{cb}</MenuItem>)}
                </Select>
            </FormControl>

        </>
    );
}



