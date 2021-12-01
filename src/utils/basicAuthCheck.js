import initializeBasicAuth from 'nextjs-basic-auth'

const users = [
  { user: 'user', password: 'password' },
  { user: 'admin', password: 'admin' },
]

export default initializeBasicAuth({ users })
