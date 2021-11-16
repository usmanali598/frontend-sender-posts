import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './Register';
import Posts from './Posts';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/posts/:id' element={<Posts />} />
        <Route path='/posts/' element={<Posts />} />
        <Route path='/' element={<Register />} />
      </Routes>
    </>
  )
}

export default App;
