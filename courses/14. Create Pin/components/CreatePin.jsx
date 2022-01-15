import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';

// Categories array object
import { categories } from '../utils/data';

import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setimageAsset] = useState(null);
  const [wrongImage, setWrongImage] = useState(false);

  // Navigate to the pin detail page
  const navigate = useNavigate();

  /** @uploadImage : upload image to sanity db cloud
   *  @type {selectedFile}: file object = e.target.files[0]
   *  @name {fileName}: file name
   *  @client {assets}: upload image to cloud
   *  @upload {assetType, body, options }: Uploads an image asset to the configured dataset.
   *  @promises {then, catch} : the document is returned as a promise.
   *  @setimageAsset to {document}: set imageAsset to the uploaded image
   *  @setLoading to false: set loading to false
   */
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongImage(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setimageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error uploading image', err);
        });
    } else {
      setWrongImage(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill all the fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImage && <p>Wrong Image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl ">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg ">Click to upload..</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <p>Something else</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
