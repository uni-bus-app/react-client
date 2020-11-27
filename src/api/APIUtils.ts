const apiURL = 'https://20200817t190317-dot-unibus-app.nw.r.appspot.com';

export const getRoutePath = async () => {
  const res = await fetch(`${apiURL}/u1routepath`);
  return await res.json();
};

export const getStops = async () => {
  const res = await fetch(`${apiURL}/stops`);
  return await res.json();
};

export const getTimes = async (stopID: string) => {
  const res = await fetch(`${apiURL}/times/${stopID}`);
  return await res.json();
};
