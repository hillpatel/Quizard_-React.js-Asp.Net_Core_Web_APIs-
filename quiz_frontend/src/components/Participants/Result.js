import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { getFormattedTime } from '../../helper';
import useStateContext from '../../hooks/useStateContext';
import { createAPIEndpoint, Endpoints } from '../api';
import { green } from '@mui/material/colors';

export default function Result() {
  const {context, setContext} = useStateContext();
  const [score, setScore] = useState(0);
  const [qCount, setQCount] = useState(0);

  useEffect(() => {
    // const ids = context.selectedOptions.map(x=>x.qnId);
    
        createAPIEndpoint(Endpoints.questions+"/List")
        .fetchPagination({isPagination:false, quizId:context.quizCode}) 
        .then((res)=>{
            console.log(context);
            setQCount(res.data.length);
            if(context.score==0){
                const qna = context.selectedOptions.map(x=>({
                    ...x,
                    ...res.data.find(y=>y.id===x.qnId)
                }));
                //setQnAns(qna);
                calculateScore(qna);
            }
            else{
                setScore(context.score);
            }
            //console.log(res.data);
        })
        .catch((err)=>{console.log(err)});
    
    
  }, [])
  
  const calculateScore = qna=>{
    let tempScore = qna.reduce((acc,curr)=>{
      return curr.answer === curr.selected ? acc+1 : acc;
    },0);
    console.log(1);
    createAPIEndpoint(Endpoints.participants+"/Mapping")
    .post({
        ParticipantId : context.participantId,
        QuizId : context.quizCode,
        TimeTaken : context.timeTaken,
        Score : tempScore
    }).then(()=>{
        console.log(tempScore);
        setScore(tempScore);
        setContext({score:tempScore});
    });
  };

    return (
    <React.Fragment>
    <Card sx={{mt:5, display:'flex', width:'100%', maxWidth: 640, mx:'auto'}}>
      <Box sx={{display:'flex', flexDirection:'column', flexGrow:1}}>
        <CardContent sx={{flex:'1 0 auto', textAlign:'center'}}>
          <Typography variant="h4">Congratulations!</Typography>
          <Typography variant="h6">
            YOUR SCORE
          </Typography>
          <Typography variant="h5" sx={{fontWeight:600}}>
            <Typography variant="span" color={green[500]}>
              {score}
            </Typography>/{qCount}
          </Typography>
          <Typography variant='h6'>
            Took {getFormattedTime(context.timeTaken) + ' mins'}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia 
        component='img'
        sx={{width:220}}
        image="/images/result.png"
      />
    </Card>
    </React.Fragment>
  )
}
