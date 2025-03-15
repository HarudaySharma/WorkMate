import { createContext, useContext } from "react";
import { ErrorFormat, User } from "../types";

interface AuthContextType {
    user: User | null;
    error: ErrorFormat | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refetch: () => Promise<void>; // refetches the user data from server
}

export const AuthContext = createContext<AuthContextType | null>(null)

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error("accessing user information in a component not wrapped under AuthProvider")
    }

    return context;
}

export default useAuth;
