const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();
const jsonParser = bodyParser.json();


const USERS = require("./users.json");
const CODEBLOCKS = require("./codeBlocks.json");
const SESSIONS = require("./sessions.json");

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/login", jsonParser, (req, res) => {
    const {userId, password} = req.body;
    const foundUser = USERS.find((user) => user.id === userId && user.password === password);

    if (foundUser) {
        return res.json({type: foundUser.type});
    } else {
        throw new Error("Wrong credentials");
    }
});


app.post("/get-type", jsonParser, (req, res) => {
    const {userId} = req.body;
    const foundUser = USERS.find((user) => user.id === userId);
    if (foundUser) {
        return res.json({type: foundUser.type});
    } else {
        throw new Error("Wrong credentials");
    }
});

app.post("/student-login", jsonParser, (req, res) => {
    const {userId, password, uuid} = req.body;
    const foundUser = USERS.find((user) => user.id === userId && user.password === password);

    if (foundUser && foundUser.type === "student") {
        const curSessions = fs.readFileSync('./server/sessions.json', {encoding:'utf8', flag:'r'})
        const curSessionsObj = JSON.parse(curSessions);
        const sessionUuid = curSessionsObj.find((session) => session.id === uuid);
        const isIdMatchUUID = sessionUuid.userId === userId;
        return res.json({isIdMatchUUID});
    } else {
        throw new Error("Wrong credentials");
    }
});

app.post("/check-uuid", jsonParser, (req, res) => {
    const {userId, uuid} = req.body;
    const foundUser = USERS.find((user) => user.id === userId && user.password === password);

    if (foundUser && foundUser.type === "student") {
        const curSessions = fs.readFileSync('./server/sessions.json', {encoding:'utf8', flag:'r'})
        const curSessionsObj = JSON.parse(curSessions);
        const sessionUuid = curSessionsObj.find((session) => session.id === uuid);
        const isIdMatchUUID = sessionUuid.userId === userId;
        return res.json({isIdMatchUUID});
    } else {
        throw new Error("Wrong credentials");
    }
});


app.post("/create-session", jsonParser, (req, res) => {
    const {userId, codeBlockId} = req.body;

    const id = uuidv4();
    const findCode = CODEBLOCKS.find((codeBlock) => codeBlock.id === codeBlockId);

    const newSession = {
        id: id,
        userId: userId,
        code: findCode.code,
        codeBlockId: codeBlockId,
        solution: findCode.solution
    }
    const curSessions = fs.readFileSync('./server/sessions.json', {encoding:'utf8', flag:'r'})
    const myObj = JSON.parse(curSessions);
    myObj.push(newSession);
    fs.writeFileSync('./server/sessions.json', JSON.stringify(myObj));

    return res.json({ id });
});

app.get("/students", jsonParser, (req, res) => {
    const students = USERS
        .filter((user) => user.type === "student")
        .map(({ id }) => id);
    if (students) {
        return res.json({students});
    } else {
        throw new Error("Couldn't get students");
    }
});

app.get("/sessions-links", jsonParser, (req, res) => {
    const sessionsLinks = SESSIONS.map((session) => session.id);
    if (sessionsLinks) {
        return res.json({sessionsLinks});
    } else {
        throw new Error("Couldn't get sessionsLinks");
    }
});

app.get("/code-blocks", jsonParser, (req, res) => {
    if (CODEBLOCKS) {
        return res.json({codeBlocks: CODEBLOCKS});
    } else {
        throw new Error("Couldn't get codeBlocks");
    }
});

app.post("/update-code", jsonParser, (req, res) => {

    const {uuid, code} = req.body;

    // console.log("uuid is: " + uuid + "\nnew code is: " + code);
    let isCodeMatchSolution = false;

    const curSessions = fs.readFileSync('./server/sessions.json', {encoding:'utf8', flag:'r'})
    const curSessionsObj = JSON.parse(curSessions);
    //check for correction
    for (let i = 0; i < curSessionsObj.length; i++) {
        if (curSessionsObj[i].id === uuid) {
            curSessionsObj[i].code = code;
            //add solution later
            isCodeMatchSolution = curSessionsObj[i].code === curSessionsObj[i].solution;
        }
    }
    fs.writeFileSync('./server/sessions.json', JSON.stringify(curSessionsObj));
    res.json({ isCodeMatchSolution });
});

app.post("/get-template-code", jsonParser, (req, res) => {
    const {uuid} = req.body;

    const curSessions = fs.readFileSync('./server/sessions.json', {encoding:'utf8', flag:'r'})
    const curSessionsObj = JSON.parse(curSessions);
    const sessionCode = curSessionsObj.find((session) => session.id === uuid).code;

    return res.json({sessionCode});
});




app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


