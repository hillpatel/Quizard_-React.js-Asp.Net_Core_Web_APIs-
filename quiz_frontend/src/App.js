import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './components/Welcome';
import Theme from './components/Theme';
import Login from './components/Users/Login';
import ParticipantLogin from './components/Participants/ParticipantLogin';
import Dashboard from './components/Users/Dashboard';
import QuizPage from './components/Users/QuizPage';
import useStateContext from './hooks/useStateContext';
import Questions from './components/Users/Questions';
import QuizBoard from './components/Participants/QuizBoard';
import Result from './components/Participants/Result';

function App() {
  const {context} = useStateContext();
  return (
    <Theme>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/participantLogin' element={<ParticipantLogin />} />
          { context.userId!=0 &&
            <>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/quizpage' element={<QuizPage />} />
              <Route path='/questions' element={<Questions />} />
            </>
          }
          { context.participantId!=0 &&
            <>
              <Route path='/quizboard' element={<QuizBoard />} />
              <Route path='/result' element={<Result />} />
            </>
          }
        </Routes>
      
    </Theme>
  );
}

export default App;
