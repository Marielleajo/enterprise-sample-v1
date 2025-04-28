import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../Assets/lottie/Forbidden.json'; // Import your Lottie animation JSON file
import { Box } from '@mui/material';

const ForbbidenComponent = () => {
    return (
        <Box sx={{width: "30%", height: "100vh", display: "flex", marginX: "auto"}} >
            <Lottie animationData={animationData} />
        </Box>
    );
};

export default ForbbidenComponent;
