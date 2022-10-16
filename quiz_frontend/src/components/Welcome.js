import { Button, Card, CardActionArea, CardContent, CardMedia } from '@mui/material'
import React from 'react'
import Center from './Center'
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  
  function goToLoginPage(){
    navigate('/login');
  }
  
  function goToParticipantLoginPage(){
    navigate('/participantLogin');
  }

  return (
      <Center>
        <Card sx={{maxWidth:'70%', m:'auto', alignSelf:'center'}}>
          <CardActionArea>
            <CardMedia 
              component='img'
              height='auto'
              image='/images/WelcomePage.png'
              alt='Image'
              sx={{m:'auto'}}
            />
            <CardContent sx={{textAlign:'center'}}>
              <Button onClick={goToLoginPage} variant='contained' color='warning' sx={{m:1}}>
                Create a Quiz
              </Button>

              <Button onClick={goToParticipantLoginPage} variant='contained' color='success' sx={{m:1}}>
                Participate in a Quiz
              </Button>
              {/* <Typography variant='h4'>
                Quizard
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                A general purpose platform for conducting a quiz and participating in it.
              </Typography> */}
            </CardContent>
          </CardActionArea>
        </Card>
      </Center>
  )
}
