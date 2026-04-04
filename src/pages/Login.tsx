import React, { useState } from 'react';
import {
    Box, Container, Paper, Typography,
    TextField, Button, InputAdornment,
    IconButton, Alert, CircularProgress,
    useTheme
} from '@mui/material';

import {
    AccountBalance, Lock, Visibility,
    VisibilityOff, Login as LoginIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute, getUserRole } from '../utils/roleAccess';

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        userLoginID: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.userLoginID || !formData.password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const response = await login(
                formData.userLoginID,
                formData.password
            );

            if (response.success) {

               
                const role = getUserRole(response.user);

                console.log("User:", response.user);
                console.log("Role:", role);

                // GET DEFAULT ROUTE
                const defaultRoute = getDefaultRoute(role);

                //  NAVIGATE
                navigate(defaultRoute);

            } else {
                setError(response.message || 'Login failed. Please check your credentials.');
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                mb: 2
                            }}
                        >
                            <AccountBalance sx={{ fontSize: 40 }} />
                        </Box>

                        <Typography variant="h4" fontWeight="bold">
                            Banking Dashboard
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                            Secure Banking System
                        </Typography>
                    </Box>

                    {/* Error */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        <TextField
                            fullWidth
                            label="Username"
                            name="userLoginID"
                            value={formData.userLoginID}
                            onChange={handleChange}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalance />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, py: 1.5 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <LoginIcon sx={{ mr: 1 }} />
                                    Login
                                </>
                            )}
                        </Button>

                    </form>

                    {/* Footer */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="caption">
                            © {new Date().getFullYear()} Banking Dashboard
                        </Typography>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
};  

export default Login;