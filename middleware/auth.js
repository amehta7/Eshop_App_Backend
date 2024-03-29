import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  //console.log(authHeader)

  if (!authHeader) {
    return res.status(401).send('Please Login first to access this endpoint!')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = await jwt.verify(token, process.env.jwtPrivateKey)
    //console.log(payload)

    let expiry = payload.exp

    if (Math.floor(new Date().getTime() / 1000) >= expiry) {
      return res.status(403).send('Token has expired!')
    }

    req.user = payload
    next()
  } catch (error) {
    res.status(401).send('Unauthorized User')
  }
}
