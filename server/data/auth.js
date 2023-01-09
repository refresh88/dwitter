//'abc1234': $2b$10$745F5oUAIc/TxK8bGBX2qukzuMt2O6gLoNGdBIyq6xCL5MghKcR1q
let users = [
  {
    id: '1',
    username: 'bob',
    password: '$2b$10$745F5oUAIc/TxK8bGBX2qukzuMt2O6gLoNGdBIyq6xCL5MghKcR1q',
    name: 'Bob',
    email: 'bob@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
];

export async function findByUsername(username) {
  return users.find((user) => user.username === username);
}

export async function findById(id) {
  return users.find((user) => user.id === id);
}

export async function createUser(user) {
  const created = { ...user, id: Date.now().toString() };
  users.push(created);
  return created.id;
}
