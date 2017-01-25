exports = module.exports = function getToken (req) {
  const header = req.header.authorization
  console.log(header)
  if (!header) {
    return null
  }
  const parts = header.split(' ')
  console.log(parts.length)
  if (parts.length !== 2) {
    return null
  }
  const scheme = parts[0]
  const token = parts[1]
  if (/^xiaowu$/i.test(scheme)) {
    return token
  }
  return null
}
