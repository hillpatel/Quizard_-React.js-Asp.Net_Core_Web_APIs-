import { Card, CardActionArea, CardContent, colors, Grid, Typography, useThemeProps} from '@mui/material';
import React, { useState, useEffect } from 'react'
import useStateContext from '../../hooks/useStateContext'
import { createAPIEndpoint, Endpoints } from '../api';
import Center from '../Center';

export default function Dashboard() {
    
    const {context, setContext} = useStateContext();
    const [totalQuiz, setTotalQuiz] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);

    useEffect(()=>{
        createAPIEndpoint(Endpoints.quizCreators)
        .fetchById(context.userId)
        .then((res)=>{
            console.log(res);
            setTotalQuiz(res.data.quizes.length);
            setTotalParticipants(res.data.participants);
        })
    },[]);

    return (
        <div style={{backgroundImage: 'url("images/dashboard.png")'}}>
            {/* Welcome {context.userEmail} */}
            {/* <Typography variant='h2' align='center'>Welcome <b>{context.userEmail}</b></Typography> */}
            <Grid 
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
            >
                <Grid item xs={6}>
                    <Center>
                        <Card sx={{width:'100%'}}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant='h3' textAlign='center'>Quizes Created</Typography>
                                    <Typography variant='h1' sx={{color:colors.green[500]}} textAlign='center'>{totalQuiz}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Center>
                </Grid>
                <Grid item xs={6}>
                    <Center>
                        <Card sx={{width:'100%'}}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant='h3' textAlign='center'>Total Participants</Typography>
                                    <Typography variant='h1' sx={{color: colors.yellow[600]}} textAlign='center'>{totalParticipants}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Center>
                </Grid>
            </Grid>
            
        </div>
    )
}
