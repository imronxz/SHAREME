import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// components
import Login from './components/Login';
// container
import Home from './container/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
};

export default App;
