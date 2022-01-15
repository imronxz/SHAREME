import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';

// TODO: categories from utils/data
import { categories } from '../utils/data';

// isNotActiveStyles
const isNotActiveStyles =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
// isActiveStyles
const isActiveStyles =
  'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {
  // TODO: jika closeToggle true maka sidebar akan ditutup
  const handleCloseSideBar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between h-full bg-white overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col ">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSideBar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>

        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            onClick={handleCloseSideBar}
          >
            <RiHomeFill />
            Home
          </NavLink>

          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
          {/* slice array 0 ke array terkhir - 1 */}
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              /* new active class */
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              onClick={handleCloseSideBar}
              key={category.name}
            >
              <img
                src={category.image}
                alt="categories-img"
                className="w-8 h-8 rounded-full shadow-sm"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSideBar}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
