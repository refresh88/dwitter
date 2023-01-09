import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';

const AUTH_ERROR = { message: 'Authentication Error' };

// 모든 요청에 대해서 헤더에 Authorization을 확인하고 jwt에서 ok 했다고 하더라도
// 실제로 사용자가 database에 존재하는지 한번더 검증해주는 logic을 처리하는 미들웨어
export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(' ')[1];
  //TODO: Make it secure
  jwt.verify(
    token,
    'v6^lRkTX!JBJQ5%PBcIeHYJ9eg0D4q!K',
    async (error, decoded) => {
      if (error) {
        return res.status(401).json(AUTH_ERROR);
      }
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      req.userId = user.id; // req.customData
      next();
    }
  );
};
