const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
};

export {fetchData};
