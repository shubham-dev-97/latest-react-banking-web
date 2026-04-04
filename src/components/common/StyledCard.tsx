import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { bankColors } from '../../styles/bankColors';

interface StyledCardProps {
    title: string;
    value?: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    colorIndex?: number; // 0-7 for different gradients
    gradient?: string;
    onClick?: () => void;
    size?: 'small' | 'medium' | 'large';
}

const StyledCard: React.FC<StyledCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    colorIndex = 0,
    gradient,
    onClick,
    size = 'medium'
}) => {
    const getSize = () => {
        switch(size) {
            case 'small': return { height: 100, iconSize: 36, fontSize: 'h6' };
            case 'large': return { height: 180, iconSize: 56, fontSize: 'h4' };
            default: return { height: 140, iconSize: 48, fontSize: 'h5' };
        }
    };

    const dimensions = getSize();
    const background = gradient || bankColors.cardColors[colorIndex % bankColors.cardColors.length];

    return (
        <Card
            onClick={onClick}
            sx={{
                height: dimensions.height,
                background,
                color: 'white',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.3s, box-shadow 0.3s',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: onClick ? 'translateY(-4px)' : 'none',
                    boxShadow: onClick ? '0 10px 25px rgba(0,0,0,0.2)' : 'none',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.1)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                },
                '&:hover::before': {
                    opacity: onClick ? 1 : 0,
                }
            }}
        >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Avatar sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: dimensions.iconSize,
                        height: dimensions.iconSize,
                        color: 'white'
                    }}>
                        {icon}
                    </Avatar>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                    {value && (
                        <Typography variant={dimensions.fontSize as any} sx={{ fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default StyledCard;