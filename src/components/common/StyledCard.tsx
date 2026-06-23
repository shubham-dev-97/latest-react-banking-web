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
            case 'small': return { height: 110, iconSize: 40, fontSize: 'h6', padding: 1.5 };
            case 'large': return { height: 180, iconSize: 56, fontSize: 'h4', padding: 3 };
            default: return { height: 140, iconSize: 48, fontSize: 'h5', padding: 2.5 };
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                '&:hover': {
                    transform: onClick ? 'translateY(-6px)' : 'none',
                    boxShadow: onClick ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'translate(30%, -30%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }
            }}
        >
            <CardContent sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative', 
                zIndex: 1,
                p: dimensions.padding,
                '&:last-child': { pb: dimensions.padding }
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            opacity: 0.9, 
                            fontWeight: 600, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            fontSize: size === 'small' ? '0.7rem' : '0.75rem'
                        }}
                    >
                        {title}
                    </Typography>
                    <Avatar sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: dimensions.iconSize,
                        height: dimensions.iconSize,
                        color: 'white',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {icon}
                    </Avatar>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                    {value && (
                        <Typography variant={dimensions.fontSize as any} sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                            {value}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 500, display: 'block', mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default StyledCard;



// import React from 'react';
// import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material';

// interface StyledCardProps {
//     title: string;
//     value: string | number;
//     subtitle?: string;
//     icon: React.ReactNode;
//     colorIndex?: number;
// }

// const StyledCard: React.FC<StyledCardProps> = ({ title, value, subtitle, icon, colorIndex = 0 }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//     const colors = [
//         { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '#fff' },
//         { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '#fff' },
//         { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '#fff' },
//         { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '#fff' },
//         { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '#fff' },
//         { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '#fff' },
//     ];

//     const selectedColor = colors[colorIndex % colors.length];

//     return (
//         <Card
//             sx={{
//                 height: '100%',
//                 background: selectedColor.bg,
//                 borderRadius: { xs: 2, sm: 3 },
//                 transition: 'transform 0.2s, box-shadow 0.2s',
//                 '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: 6,
//                 },
//             }}
//         >
//             <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <Box>
//                         <Typography 
//                             variant="subtitle2" 
//                             sx={{ 
//                                 color: 'rgba(255,255,255,0.9)',
//                                 fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
//                                 mb: { xs: 0.5, sm: 1 },
//                                 textTransform: 'uppercase',
//                                 letterSpacing: '0.5px',
//                             }}
//                         >
//                             {title}
//                         </Typography>
//                         <Typography 
//                             variant="h5" 
//                             sx={{ 
//                                 fontWeight: 'bold', 
//                                 color: 'white',
//                                 fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
//                                 lineHeight: 1.2,
//                             }}
//                         >
//                             {value}
//                         </Typography>
//                         {subtitle && (
//                             <Typography 
//                                 variant="caption" 
//                                 sx={{ 
//                                     color: 'rgba(255,255,255,0.8)',
//                                     fontSize: { xs: '0.65rem', sm: '0.7rem' },
//                                     display: 'block',
//                                     mt: 0.5,
//                                 }}
//                             >
//                                 {subtitle}
//                             </Typography>
//                         )}
//                     </Box>
//                     <Box 
//                         sx={{ 
//                             bgcolor: 'rgba(255,255,255,0.2)',
//                             borderRadius: '50%',
//                             p: { xs: 0.5, sm: 1, md: 1.5 },
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         {React.cloneElement(icon as React.ReactElement, { 
//                             sx: { 
//                                 fontSize: { xs: 20, sm: 28, md: 32 },
//                                 color: selectedColor.icon 
//                             } 
//                         })}
//                     </Box>
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// };

// export default StyledCard;
