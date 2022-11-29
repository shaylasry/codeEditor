import {createContext, useContext, useMemo, useState} from "react";


export const AuthContext = createContext(null);

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    // const user = useMemo(() => ({ userName, setUserName }), [userName, setUserName])

    return (
        <AuthContext.Provider value={{ userName, setUserName }}>
            {children}
        </AuthContext.Provider>
    )
}

