import { useState, useEffect } from 'react';

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: any;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        console.log('🔍 useAuth - initializing from localStorage');
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        console.log('🔍 Token exists:', !!token);
        console.log('🔍 User string exists:', !!userStr);
        
        if (token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                console.log('🔍 Found user in localStorage:', userData);
                setUser(userData);
            } catch (e) {
                console.error('Failed to parse user from localStorage:', e);
            }
        } else {
            console.log('🔍 No user found in localStorage');
        }
    }, []);

    const login = async (username: string, password: string): Promise<LoginResponse> => {
        setIsLoading(true);
        try {
            console.log('🔍 login attempt for:', username);
            
            const response = await fetch('https://nerofinsbankapi.azurewebsites.net/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userLoginID: username,
                    password: password
                })
            });

            const data = await response.json();
            console.log('🔍 login response:', data);

            if (response.ok && data.success) {
                // Store in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Update state
                setUser(data.user);
                console.log('🔍 user state updated:', data.user);
                
                return { success: true, message: 'Login successful', token: data.token, user: data.user };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        console.log('🔍 logged out, user set to null');
    };
  
    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    return {
        isLoading,
        user,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user || !!localStorage.getItem('authToken')
    };
};