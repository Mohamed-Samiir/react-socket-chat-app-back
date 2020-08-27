let users = [];

const addUser = (id, name, room) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // const userExists = users.find(
  //   (user) => user.name === name && user.room === room
  // );
  // if (userExists) return { error: "User already exists.." };

  const user = { id, name, room };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.filter((user) => user.id === id)[0];

const getUsers = (room) => users.filter(user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsers,
};
