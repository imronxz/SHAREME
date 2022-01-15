import React, { useState, useEffect } from 'react';

// router
import { Link, useParams } from 'react-router-dom';
// uuid
import { v4 as uuidv4 } from 'uuid';
// client google
import { client, urlFor } from '../client';
// Masonry Layout
import MasonryLayout from './MasonryLayout';
// data query
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
// icons
import { MdDownloadForOffline } from 'react-icons/md';
// Spinner
import Spinner from './Spinner';

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  // useParams -> ID... on click profile
  const { pinId } = useParams();

  //TODO: Fetch pinDetail from sanity
  /* getting one individual pin then setting it to pinDetailQuery(utils/data) return setPinDetail(pinId)
  -> all realated pin to pinDetailMorePinQuery(utils/data) return setPins(res)
  */
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  // TODO: Add comment button
  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  //FIXME: Should bellow useEffect before return fetchPinDetails
  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: '1500px', borderRadius: '32px' }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            {/*TODO: pinDetail -> show image from Pin */}
            <img
              src={pinDetail?.image && urlFor(pinDetail.image).url()}
              alt="userImg-post-detail"
              className="rounded-t-3xl rounded-b-lg"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-629">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                {/*TODO: pinDetail -> download image, icons: MdDownloadForOffline */}
                <a
                  href={`${pinDetail?.image.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/*TODO: pinDetail -> url/destination */}
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3 ">{pinDetail.about}</p>
            </div>
            {/* TODO: pinDetail (image, userName) -> postedBy  */}
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail.postedBy?.image}
                className="w-8 h-8 rounded-full object-cover"
                alt="user-profile"
              />
              <p className="font-semibold capitalize">
                {' '}
                {pinDetail.postedBy?.userName}
              </p>
            </Link>
            {/* TODO: img, userName -> Show users comments section */}
            <h2 className="mt-5 text-2xl">Komentar Terbaru</h2>
            <div className="max-h-37 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={item.postedBy.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* img, input -> Adding user comment section */}
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Tambah Komentar"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="bg-rose-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                type="button"
                onClick={addComment}
              >
                {addingComment ? 'Kirim Komentar...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/*  */}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          Gambar yang sama 💗
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins.." />
      )}
    </>
  );
};

export default PinDetails;
