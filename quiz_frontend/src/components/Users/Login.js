import { Button, Card, CardActionArea, CardContent, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import useStateContext from '../../hooks/useStateContext';
import { createAPIEndpoint, Endpoints } from '../api';
import Center from '../Center'
const getFreshModel = ()=>({
    email:'',
    password:''
});

export default function Login() {

    const {values, setValues, errors, setErrors, handleInputChange} = useForm(getFreshModel);

    const {context, setContext} = useStateContext();

    const [validCredentials, setValidCredentials] = useState(true);

    const navigate = useNavigate();

    const login =(e)=>{
        e.preventDefault();
        if(validate()){
            createAPIEndpoint(Endpoints.quizCreators)
            .post(values)
            .then((res)=>{
                setValidCredentials(true);
                setContext({userId : res.data.id, userEmail : res.data.email});
            })
            .then(()=>{navigate('/dashboard');})
            .catch((err)=>{
                setValidCredentials(false);
            });
        }
    }

    const validate = ()=>{
        let temp = {};
        temp.email = (/\S+@\S+\.\S+/).test(values.email)?"":"Invalid Email";
        temp.password = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/).test(values.password)?"":"Password must be between 6 to 20 characters containing at least one numeric digit, one uppercase and one lowercase letter";
        setErrors(temp);
        return Object.values(temp).every(x=>x==="");
    }

    return (
    <Center>
        <Card sx={{width:500}}>
            <CardActionArea>
                <CardContent sx={{textAlign:'center'}}>
                    <Typography variant='h4' sx={{m:1}}>Login to Create</Typography>
                    <Box sx={{m:4}}>
                        <form onSubmit={login}>
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
                                label='Password'
                                name='password' 
                                type='password'
                                sx={{m:1}}
                                onChange={handleInputChange}
                                {...(errors.password && {error:true, helperText:errors.password})}
                            />
                            { !validCredentials && <Typography sx={{color:'red'}} variant='body1'>Invalid Credentials</Typography>}
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
