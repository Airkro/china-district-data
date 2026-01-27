export const fetcher = async <T = unknown,>(
  url: string,
  { searchParams }: { searchParams: Record<string, any> },
): Promise<T> => {
  const response = await fetch(
    `${url}?${new URLSearchParams(searchParams).toString()}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
