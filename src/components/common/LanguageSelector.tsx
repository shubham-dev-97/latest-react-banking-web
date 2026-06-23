import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
    Typography,
    Box,
    Tooltip,
    Divider,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Language as LanguageIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
    const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchTerm('');
    };

    const handleLanguageSelect = (languageCode: string) => {
        setLanguage(languageCode);
        handleClose();
    };

    const filteredLanguages = availableLanguages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Tooltip title="Select Language">
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    <LanguageIcon />
                    <Typography
                        variant="caption"
                        sx={{
                            ml: 0.5,
                            display: 'block',
                            textTransform: 'uppercase',
                            fontWeight: 500
                        }}
                    >
                        {currentLanguage.code}
                    </Typography>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        maxHeight: 400,
                        width: 280,
                        borderRadius: 2,
                        mt: 1
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                        Select Language
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Search languages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 1 }}
                    />
                </Box>

                <Divider />

                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {filteredLanguages.map((lang) => (
                        <MenuItem
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            selected={currentLanguage.code === lang.code}
                            sx={{
                                py: 1,
                                '&.Mui-selected': {
                                    backgroundColor: '#e3f2fd',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    }
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">
                                            {lang.nativeName}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {lang.name}
                                        </Typography>
                                    </Box>
                                }
                            />
                            {currentLanguage.code === lang.code && (
                                <Typography variant="caption" color="primary">
                                    ✓
                                </Typography>
                            )}
                        </MenuItem>
                    ))}
                </Box>

                {filteredLanguages.length === 0 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                            No languages found
                        </Typography>
                    </Box>
                )}
            </Menu>
        </>
    );
};

export default LanguageSelector;
