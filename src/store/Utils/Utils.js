export const parseResponse = (resp) => {
  const arr = resp.data
    ? Object.keys(resp.data).map((key) => ({
        key,
        ...resp.data[key],
      }))
    : [];
  return arr;
};
