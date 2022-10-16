import { Card, CardContent, CardHeader, LinearProgress, List, ListItemButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFormattedTime } from '../../helper';
import useStateContext from '../../hooks/useStateContext'
import { createAPIEndpoint, Endpoints } from '../api';

export default function QuizBoard() {

    const [qns, setQns] = useState([]);
    const [qnIndex, setQnIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const { context, setContext} = useStateContext();
    const navigate = useNavigate();

    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken(prev => prev + 1)
        }, [1000])
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: []
        });
        
        createAPIEndpoint(Endpoints.questions+"/List")
            .fetchPagination({isPagination:false, quizId:context.quizCode}) 
            .then(res => {
                setQns(res.data)
                startTimer()
            })
            .catch(err => { console.log(err); })

        return () => { clearInterval(timer) }
    }, []);

    const updateAnswer = (qnId, optionIdx) => {
        const temp = [...context.selectedOptions]
        temp.push({
            qnId,
            selected: optionIdx
        })
        if (qnIndex < qns.length-1) {
            setContext({ selectedOptions: [...temp] })
            setQnIndex(qnIndex + 1)
        }
        else {
            setContext({ selectedOptions: [...temp], timeTaken })
            navigate("/result");
        }
    }

    return (
        qns.length !== 0
            ? <Card
                sx={{
                    maxWidth: 640, mx: 'auto', mt: 5,
                    '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' }
                }}>
                <CardHeader
                    title={'Question ' + (qnIndex + 1) + ' of '+qns.length}
                    action={<Typography>{getFormattedTime(timeTaken)}</Typography>} />
                <Box>
                    <LinearProgress variant="determinate" value={(qnIndex + 1) * 100 / 5} />
                </Box>
                <CardContent>
                    <Typography variant="h6">
                        {qns[qnIndex].questionInWords}
                    </Typography>
                    <List>
                        <ListItemButton disableRipple key={0} onClick={() => updateAnswer(qns[qnIndex].id, 0)}>
                            <div>
                                <b>{"A . "}</b>{qns[qnIndex].option1}
                            </div>
                        </ListItemButton>
                        <ListItemButton disableRipple key={1} onClick={() => updateAnswer(qns[qnIndex].id, 1)}>
                            <div>
                                <b>{"B . "}</b>{qns[qnIndex].option2}
                            </div>
                        </ListItemButton>
                        <ListItemButton disableRipple key={2} onClick={() => updateAnswer(qns[qnIndex].id, 2)}>
                            <div>
                                <b>{"C . "}</b>{qns[qnIndex].option3}
                            </div>
                        </ListItemButton>
                        <ListItemButton disableRipple key={3} onClick={() => updateAnswer(qns[qnIndex].id, 3)}>
                            <div>
                                <b>{"D . "}</b>{qns[qnIndex].option4}
                            </div>
                        </ListItemButton>
                    </List>
                </CardContent>
            </Card>
            : null
    )
}
