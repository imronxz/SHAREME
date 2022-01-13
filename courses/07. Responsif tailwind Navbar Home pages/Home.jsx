import React from 'react';
// React Hook
import { useState, useEffect, useRef } from 'react';
// React Icons
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
// logo
import logo from '../assets/logo.png';
// React Router
import { Link, Route, Routes } from 'react-router-dom';
// Component Pages
import { Sidebar, UserProfile } from '../components';
// Container
import Pins from './Pins';
// Sanity db
import { client } from '../client';
// Sanity query
import { userQuery } from '../utils/data';

function Home() {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  /** userInfo: localStorage.getItem('user')
   * -> Jika user ada maka return JSON.parse(user)
   * -> else clear localStorage
   */
  const userInfo =
    localStorage.getItem('user') !== 'undefined'
      ? JSON.parse(localStorage.getItem('user'))
      : localStorage.clear();

  // sanity query
  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        {/* Mobile Sidebar */}
        <Sidebar user={user && user} />
      </div>
      {/* Mobile Navbar */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer "
            onClick={() => setToggleSideBar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
        {/* TODO: animated Mobile toggleSideBar  */}
        {toggleSideBar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSideBar(false)}
              />
            </div>
            {/* Desktop Sidebar */}
            <Sidebar user={user && user} closeToggle={setToggleSideBar} />
          </div>
        )}
      </div>
      {/*TODO: img onClick -> user profile */}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
