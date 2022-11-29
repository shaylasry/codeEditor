import React, { useState, useMemo } from "react";

class UserSingleton extends React.Component {
    constructor(userName) {
        super(undefined);
        if (UserSingleton.instance == null) {
            this.user = userName;
            UserSingleton.instance = this;
        }
        return UserSingleton.instance;
    }

    setUser(userName) {
        this.user = userName;
    }

    getUser(userName) {
        return this.user;
    }


}

export const singletonContext = new UserSingleton(null);

