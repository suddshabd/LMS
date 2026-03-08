/* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useState, useCallback, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { authAPI } from "../services/apiService";

// export const AppContext = createContext();

// export function AppProvider({ children }) {
//     const { user: clerkUser, isSignedIn } = useUser();

//     const [appUser, setAppUser] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loadingAppUser, setLoadingAppUser] = useState(true);

//     const [theme, setThemeState] = useState(() => {
//         return localStorage.getItem("pibBitsTheme") || "light";
//     });

//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         const syncUserWithBackend = async () => {
//             if (!isSignedIn || !clerkUser) {
//                 setIsAuthenticated(false);
//                 setAppUser(null);
//                 setLoadingAppUser(false);
//                 return;
//             }

//             try {
//                 setLoadingAppUser(true);

//                 // 🔥 Sync user (backend gets clerkId from cookie automatically)
//                 await authAPI.syncUser({
//                     email: clerkUser.emailAddresses[0]?.emailAddress,
//                     firstName: clerkUser.firstName,
//                     lastName: clerkUser.lastName,
//                     imageUrl: clerkUser.imageUrl,
//                 });

//                 // 🔥 Then fetch full backend user (with role)
//                 const response = await authAPI.getCurrentUser();

//                 if (response.success) {
//                     setAppUser(response.user);
//                     setIsAuthenticated(true);
//                 } else {
//                     setAppUser(null);
//                     setIsAuthenticated(false);
//                 }
//             } catch (error) {
//                 console.error("Auth sync error:", error);
//                 setAppUser(null);
//                 setIsAuthenticated(false);
//             } finally {
//                 setLoadingAppUser(false);
//             }
//         };

//         syncUserWithBackend();
//     }, [isSignedIn, clerkUser]);

//     const setTheme = useCallback((newTheme) => {
//         setThemeState(newTheme);
//         localStorage.setItem("pibBitsTheme", newTheme);
//     }, []);

//     const addNotification = useCallback((notification) => {
//         const id = Date.now();
//         setNotifications((prev) => [...prev, { ...notification, id }]);
//         setTimeout(() => {
//             setNotifications((prev) => prev.filter((n) => n.id !== id));
//         }, 3000);
//     }, []);

//     return (
//         <AppContext.Provider
//             value={{
//                 clerkUser,
//                 appUser,
//                 isAuthenticated,
//                 loadingAppUser,
//                 theme,
//                 setTheme,
//                 notifications,
//                 addNotification,
//             }}
//         >
//             {children}
//         </AppContext.Provider>
//     );
// }


// frontend/src/context/AppContext.jsx

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { authAPI } from "../services/apiService";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const { user } = useUser();
    const { isSignedIn, getToken } = useAuth();

    const [appUser, setAppUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAppUser, setLoadingAppUser] = useState(true);

    const [theme, setThemeState] = useState(
        () => localStorage.getItem("pibBitsTheme") || "light"
    );

    useEffect(() => {
        const syncUser = async () => {
            if (!isSignedIn || !user) {
                setAppUser(null);
                setIsAuthenticated(false);
                setLoadingAppUser(false);
                return;
            }

            try {
                setLoadingAppUser(true);

                const token = await getToken();

                // Sync user
                await authAPI.syncUser(
                    {
                        email: user.primaryEmailAddress?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: user.imageUrl,
                    },
                    token
                );

                // Get current user
                const response = await authAPI.getCurrentUser(token);

                if (response.success) {
                    setAppUser(response.user);
                    setIsAuthenticated(true);
                } else {
                    setAppUser(null);
                    setIsAuthenticated(false);
                }
            } catch {
                setAppUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoadingAppUser(false);
            }
        };

        syncUser();
    }, [getToken, isSignedIn, user]);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem("pibBitsTheme", newTheme);
    }, []);

    return (
        <AppContext.Provider
            value={{
                appUser,
                isAuthenticated,
                loadingAppUser,
                theme,
                setTheme,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
