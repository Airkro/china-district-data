import { request } from 'undici';

export const fetch = ({ hostname, pathname, searchParams }) => {
  return request({
    protocol: 'https:',
    hostname,
    pathname,
    search: `?${new URLSearchParams(searchParams).toString()}`,
  }).then(({ body }) => body.json());
};
