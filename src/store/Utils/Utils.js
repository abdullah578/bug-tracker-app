export const parseResponse = (resp) => {
  const arr = resp.data
    ? Object.keys(resp.data).map((key) => ({
        key,
        ...resp.data[key],
      }))
    : [];
  return arr;
};

export const parseProjectResponse = (projects, users, userKey) => {
  const projKeys = [];
  if (!projects.data || !users.data) return [];
  Object.keys(users.data).forEach((id) => {
    if (userKey in users.data[id]) projKeys.push(id);
  });
  return Object.keys(projects.data)
    .filter((proj) => projKeys.includes(proj))
    .map((proj) => ({...projects.data[proj],key:proj}));
};

export const parseTicketResponse = (resp) => {
  return resp.data
    ? Object.keys(resp.data).map((key) => {
        const ticket = resp.data[key];
        let history = [];
        let comments = [];
        if (ticket.history)
          history = Object.keys(ticket.history).map(
            (index) => ticket.history[index]
          );
        if (ticket.comments)
          comments = Object.keys(ticket.comments).map(
            (index) => ticket.comments[index]
          );
        return { ...resp.data[key], key, history, comments };
      })
    : [];
};