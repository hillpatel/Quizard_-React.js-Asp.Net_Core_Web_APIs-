import React,{useState, useEffect} from 'react'
import { ThemeProvider} from '@mui/system';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Switch } from '@mui/material';
import Layout from './Layout';
import { BrowserRouter } from 'react-router-dom';

export default function Theme(props) {
    if(localStorage.getItem('mode')==null && localStorage.getItem('modeText')==null){
        localStorage.setItem('mode','light');
        localStorage.setItem('modeText','Light');
    }
    const [mode_type, setMode_type] = useState(localStorage.getItem('mode'));
    const [themeText, setThemeText] = useState(localStorage.getItem('modeText'));
    // const [mode_type, setMode_type] = useState('light');
    // const [themeText, setThemeText] = useState('Light');
    const [theme, setTheme] = useState(
        createTheme({
            palette: {
                mode: mode_type,
            },
        })
    );
    const themeChangeHandler = ()=>{
        if(mode_type==='dark'){
            setMode_type('light');
            setThemeText('Light');
            localStorage.setItem('mode','light');
            localStorage.setItem('modeText','Light');
        }
        else if(mode_type==='light'){
            setMode_type('dark');
            setThemeText('Dark');
            localStorage.setItem('mode','dark');
            localStorage.setItem('modeText','Dark');
        }
        
    }

    useEffect(() => {
        setTheme(
            createTheme({
                palette: {
                    mode: mode_type,
                },
            })
        );
        localStorage.setItem('theme',JSON.stringify(theme));
    }, [mode_type]);
    


    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout>
                    <Box 
                    //sx={{position:'fixed', right:'20px'}}
                    >
                        <Switch checked={localStorage.getItem('mode')==='dark'} size='small' onChange={themeChangeHandler} /> <span style={{fontSize:'15px'}}>{themeText}</span>
                        {/* <Switch size='small' onChange={themeChangeHandler} /> <span style={{fontSize:'15px'}}>{themeText}</span> */}
                    </Box>
                </Layout>
                {props.children}
            </ThemeProvider>
        </BrowserRouter>
    ) 
}
