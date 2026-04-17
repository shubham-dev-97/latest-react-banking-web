import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import { CurrencyUnit, useCurrency } from '../../contexts/CurrencyContext';

const currencyUnits: CurrencyUnit[] = [
    'Rupees (₹)',
    'Thousand',
    'Lakh',
    'Crore',
    'Hundred Crore',
    'Thousand Crore',
    'Million (Mn)',
    'Billion (Bn)',
    'Trillion (Tn)'
];

const CurrencySelector: React.FC = () => {
    const { currencyUnit, setCurrencyUnit } = useCurrency();

    return (
        <Box sx={{ minWidth: 150}}>
            <FormControl fullWidth size="small">
                <InputLabel sx={{color:"white"}}></InputLabel>
                <Select
                    value={currencyUnit}
                    label="Currency Format"
                    onChange={(e) => setCurrencyUnit(e.target.value as CurrencyUnit)}
                >
                    {currencyUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                            {unit}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CurrencySelector;