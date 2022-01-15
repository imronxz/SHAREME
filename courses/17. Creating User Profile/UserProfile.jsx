import React, { useState, useEffect } from 'react';
// router
import { useParams, useNavigate } from 'react-router-dom';
// icons
import { AiOutlineLogout } from 'react-icons/ai';

// google sign out
import { GoogleLogout } from 'react-google-login';

// utils/data
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
// client sanity
import { client } from '../client';
// masonry layout
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

// TODO: random images from unsplash
const randomSplashImg =
  'https://source.unsplash.com/1600x900/?people,fashion,blockchain,3d-renders,architecture,technology,photography';

// button styles
const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const isNotActiveStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created'); //created or saved
  const [activeBtn, setActiveBtn] = useState('created');

  // react-router-dom
  const navigate = useNavigate();
  const { userId } = useParams();

  /** @query data from utils -> sanity db
   *  @query: userQuery(userId)
   *  -> client.fetch(query).then -> setUser(data)
   */
  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  /** @query data from utils -> sanity db
   *  @dependecy: userId and text
   *  @Created: const createdPinsQuery = userCreatedPinsQuery(userId)
   *  -> client.fetch(createdPinsQuery).then -> setPins(data).
   *  ---------------------------------------------------------------
   *  @Saved: const savedPinsQuery = userSavedPinsQuery(userId)
   *  -> client.fetch(savedPinsQuery).then -> setPins(data)
   */
  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // TODO: logout user from sanity db
  const logout = () => {
    localStorage.clear();

    navigate('/login');
  };

  // TODO: jika !user -> Spinner
  if (!user) {
    return <Spinner message="Loading user..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          {/* TODO: random unsplash banner and user image and userName */}
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomSplashImg}
              alt="random-unsplash-banner"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            />
            <img
              src={user.image}
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              alt="user-pict"
            />
            <h1 className="font-bold text-3xl text-center mt-3">{user.userName}</h1>
            {/* TODO: Adding GoogleLogout button  */}
            <div className="absolute top-0 z-1 right-0 p-2 ">
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy={'single_host_origin'}
                />
              )}
            </div>
          </div>
          {/* TODO: jika btn active === created, maka aktifkan activeBtnStyles else isNotActiveStyles */}
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : isNotActiveStyles
              }`}
            >
              Created
            </button>
            {/* TODO: jika btn active === Save, maka aktifkan activeBtnStyles else isNotActiveStyles */}
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${
                activeBtn === 'saved' ? activeBtnStyles : isNotActiveStyles
              }`}
            >
              Saved
            </button>
          </div>
          {/* Render Masonry Layout */}
          {pins?.length ? (
            <div className="px-2 ">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex font-bold w-full mt-2 text-xl items-center justify-center ">
              Belum ada aktivitas...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
