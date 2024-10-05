const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, options);
  const json = response.json();
  if (!response.ok) {
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

export {fetchData};
