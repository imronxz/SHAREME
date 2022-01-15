import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return <Spinner message={`We are adding ideas to your feed!`} />;
  }
  if (!pins?.length)
    return (
      <div className="flex mt-28 font-bold w-full text-rose-700 text-3xl items-center justify-center capitalize  ">
        😭Tidak terdapat gambar dengan kategori tersebut...😥
      </div>
    );

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
