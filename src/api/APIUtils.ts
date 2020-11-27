export const getRoutePath = async () => {
  const res = await fetch(
    'https://20200817t190317-dot-unibus-app.nw.r.appspot.com/u1routepath',
    {
      method: 'GET',
    }
  );
  return await res.json();
};

export const getStops = async () => {
  const res = await fetch(
    'https://20200817t190317-dot-unibus-app.nw.r.appspot.com/stops',
    {
      method: 'GET',
    }
  );
  return await res.json();
};
