export const fetcher = (url, { searchParams }) => {
  return fetch(`${url}?${new URLSearchParams(searchParams).toString()}`).then(
    (response) => response.json(),
  );
};
