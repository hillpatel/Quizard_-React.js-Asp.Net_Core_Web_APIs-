import { Button, Card, CardActionArea, CardContent, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import useStateContext from '../../hooks/useStateContext';
import { createAPIEndpoint, Endpoints } from '../api';
import Center from '../Center'
const getFreshModel = ()=>({
    name:'',
    email:'',
    quizCode:''
});

export default function ParticipantLogin() {

    const {values, setValues, errors, setErrors, handleInputChange} = useForm(getFreshModel);
    const {context, setContext} = useStateContext();
    const navigate = useNavigate();
    const login =(e)=>{
        e.preventDefault();
        if(validate()){
            createAPIEndpoint(Endpoints.participants).post(values)
            .then(res=>{
                console.log(res);
                setContext({participantId: res.data.id, quizCode: res.data.quizCode, timeTaken: res.data.timeTaken, score: res.data.score});
                if(res.data.timeTaken>0){
                    navigate('/result');
                }
                else{
                    navigate("/quizboard");
                }
            })
            .catch(err=>{
                let temp = {};
                temp.quizCode = "No Quiz with this Code exist";
                setErrors(temp);
            });
        }
    }

    const validate = ()=>{
        let temp = {};
        temp.name = values.name!==""?"":"Invalid Name";
        temp.email = (/\S+@\S+\.\S+/).test(values.email)?"":"Invalid Email";
        temp.quizCode = values.quizCode!==""?"":"Invalid Quiz Code";
        setErrors(temp);
        return Object.values(temp).every(x=>x==="");
    }

  return (
    <Center>
        <Card sx={{width:500}}>
            <CardActionArea>
                <CardContent sx={{textAlign:'center'}}>
                    <Typography variant='h4' sx={{m:1}}>Join the Quiz</Typography>
                    <Box sx={{m:4}}>
                        <form onSubmit={login}>
                            <TextField 
                                variant='outlined' 
                                size='small'
                                label='Name'
                                name='name' 
                                sx={{m:1}}
                                onChange={handleInputChange}
                                {...(errors.name && {error:true, helperText:errors.name})}
                            />
                            
                            <TextField 
                                variant='outlined' 
                                size='small'
                                label='E-mail'
                                name='email' 
                                sx={{m:1}}
                                onChange={handleInputChange}
                                {...(errors.email && {error:true, helperText:errors.email})}
                            />

                            <TextField 
                                variant='outlined' 
                                size='small'
                                label='Quiz Code'
                                name='quizCode' 
                                sx={{m:1}}
                                onChange={handleInputChange}
                                {...(errors.quizCode && {error:true, helperText:errors.quizCode})}
                            />

                            <Button
                                type='submit'
                                variant='contained'
                                sx={{width:'70%', m:1}}
                            >
                                Submit
                            </Button>
                        </form>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    </Center>
  )
}
