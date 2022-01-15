import React, { useState, useEffect } from 'react';

// MasonryLayout.jsx
import MasonryLayout from './MasonryLayout';
// Sanity client
import { client } from '../client';
// Query sanity utils/data
import { feedQuery, searchQuery } from '../utils/data';
// Spinner
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  /**  @searchQuery : search query
   *   @dependencies [searchTerm]
   *   @searchTerm: search term
   *   @setLoading to true: set loading to true
   *   @query {params}: searchQuery(searchTerm.toLowerCase())
   *   @client {fetch}: fetch data from sanity db cloud
   * -> setPins to {data}: set pins to the data
   *   @setLoading to false: set loading to false
   * ---------------------ELSE--------------------------------
   *   @client {fetch}: fetch(feedQuery) from sanity db cloud
   * -> setPins to {data}: set pins to the data
   *   @setLoading to false: set loading to false
   */
  useEffect(() => {
    if (searchTerm) {
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());

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
  }, [searchTerm]);

  return (
    <div>
      {/* Spinner */}
      {loading && <Spinner message="Sedang mencari..🔎" />}

      {/* jika ada pins dan panjang besar dr 0 render MasonryLayout -> pins={pins} */}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}

      {/* jika ada pins dan panjang > 0 dan searchTerm tidak empty string dan loading(true)
          render container with message "Tidak ada hasil pencarian" 
      */}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl capitalize">
          Tidak ada hasil pencarian
        </div>
      )}
    </div>
  );
};

export default Search;
