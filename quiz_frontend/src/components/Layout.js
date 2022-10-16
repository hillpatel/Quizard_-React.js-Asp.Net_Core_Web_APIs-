import { AppBar, Toolbar, Box, Typography, Button, Menu, MenuItem } from '@mui/material'
import React,{useState} from 'react'
import useStateContext from '../hooks/useStateContext'
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';

export default function Layout(props) {
  const {context, resetContext} = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = ()=>{
    handleClose();
    resetContext();
    navigate("/");
  }
  const goToDashboard = ()=>{
    handleClose();
    navigate("/dashboard");
  }
  const goToQuizPage = ()=>{
    handleClose();
    navigate("/quizpage");
  }
  //console.log(context);
  return (
    <AppBar position='static'>
        <Toolbar>
            {(context.userId!==0 || context.participantId!==0) &&
            <>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="contained"
                sx={{border:0, outline:0}}
              >
                <PersonIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {
                  context.userId!==0 &&
                  <>
                    <MenuItem onClick={goToDashboard}>Dashboard</MenuItem>
                    <MenuItem onClick={goToQuizPage}>Quiz</MenuItem>
                  </>
                }
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
            // <Typography variant='p' sx={{position:'fixed'}}>{context.userEmail}</Typography>
            }
            
            <Box sx={{width:400,m:'auto'}}>
                <Typography variant='h3' align='center'>
                    <b>Quizard</b>
                </Typography>
            </Box>
            {props.children}
        </Toolbar>
    </AppBar>
  )
}
