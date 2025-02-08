import { Box, useTheme } from '@mui/material';
import * as React from 'react';
import moment from "moment";
// import { tokens } from '../../theme';

const Footer = () => {
    let thisYear = moment().format('YYYY');
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign : 'center',
          }}>
        <Box className="footer fixed-bottom" >
            <div className="footer-text">
                { "Copyright © " + thisYear+ " CHILDNOURISH  "+" - Afghan Childrengrowstrong Application"}
            </div>
        </Box> 
    </Box>
    );
  }
  
  export default Footer;