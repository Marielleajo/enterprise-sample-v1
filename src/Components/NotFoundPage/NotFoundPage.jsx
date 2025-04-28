import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Button, Container, Grid, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    alignItems:"center"
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <Container maxWidth="md" className={classes.root} sx={{display:'flex'}}>
      <Grid container>
        <Grid item xs={12} className='center'>
          <Typography variant="h1" gutterBottom>
            404
          </Typography>
        </Grid>
        <Grid item xs={12} className='center'>
          <Typography variant="h5" gutterBottom>
            Oops! Page not found.
          </Typography>
        </Grid>
        <Grid item xs={12} className='center'>
          <Typography variant="body1">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
        </Grid>
        <Grid item xs={12} className='center'>
          <Button variant='contained' color='primary' onClick={goBack} style={{ marginTop: '10px',minWidth:'200px' }}>
            Go Back
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFoundPage;
