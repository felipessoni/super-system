import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from 'react-bootstrap';

//Pages
import Login from './pages/Login/Login';

import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Course from './pages/Course/Course';
import Announcement from './pages/Announcement/Announcement';
import Calendar from './pages/Calendar/Calendar';
import Deadline from './pages/Deadline/Deadline';
import Forum from './pages/Forum/Forum';
import ForumCreate from './pages/Forum/ForumCreate';
import Quiz from './pages/Quiz/Quiz';
import Event from './pages/Event/Event';

//Components
import Sidebar from './components/Sidebar/Sidebar';

import './App.css';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(()=>{
    
    return ()=>{

    }
  }, []);

  return (
    <div className="App">
      {
        isLoading ?

        <Spinner className="loader" animation="border" variant="primary" />

        :

        isAuthenticated ?

        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route path='/profile' element={<Profile />} />
            <Route path='/home' element={<Dashboard />} />        
            <Route path='/home/Announcement/:announcementNum' element={<Announcement />} />    
            <Route path='/home/Course/:courseCode' element={<Course />} />
            <Route path='/home/Deadline/:deadlineId' element={<Deadline />} />    
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/forum' element={<Forum />} />
            <Route path='/forum/create' element={<ForumCreate />} />
            <Route path='/quiz' element={<Quiz />} />
            <Route path='/event' element={<Event />} />
            <Route 
              path='*'
              element={<Navigate to='/home' replace/>}
            />
          </Routes>
        </BrowserRouter>

        :

        <Login />
      }
    </div>
  );
}

export default App;
