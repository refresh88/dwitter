import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';

//TODO: Make it secure!
const jwtSecretKey = 'v6^lRkTX!JBJQ5%PBcIeHYJ9eg0D4q!K';
const jwtExprireInDays = '2d';
const bcryptSaltRounds = 12;

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    // 이미 있는 user면 거부
    return res.status(409).json({ message: `${username} already exists` });
  }
  // 없는 username이면 password를 해싱(암호화)
  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  // 사용자를 만들어줌. 여기서 나오는 userId를 통해 token을 만듬.
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ messgae: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(201).json({ token, username });
}

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExprireInDays });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
