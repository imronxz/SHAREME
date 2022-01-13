// sanity libs
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: '',
  dataSet: 'production',
  apiVersion: '14-01-2022',
  useCdn: true,
  token: '',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
