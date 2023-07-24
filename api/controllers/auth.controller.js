// import User from '../models/user.model.js'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

// const handleError = (err, res) => {
//   console.error(`[ERROR]`)
//   console.log(err)
// }

// function signup(req, res) {
//   const hashed_pwd = bcrypt.hashSync(req.body.password, 10)

//   User.create({ ...req.body, password: hashed_pwd })
//     .then((user) => {
//       const user_data = { ...user }
//       const token = jwt.sign(user_data, process.env.SECRET, {
//         expiresIn: '1h',
//       })

//       return res.status(200).json({ token, msg: 'Gracias por registrarte' })
//     })
//     .catch((err) => res.status(403).json({ error: err.message }))
// }

// async function login(req, res) {

//   await User.findOne({ where: { email: req.body.email } })
//     .then((user) => {
//       if (!user) return res.status(401).json({ error: 'Email o contraseña incorrecto' })
//       if (user.access === false) return res.status(401).json({ error: 'No estás autorizado' })

//       bcrypt.compare(req.body.password, user.password, (err, result) => {
//         if (!result) {
//           return res.json({ error: `Contraseña incorrecta para el email ${req.body.email}` })
//         }
//         const user_data = { ...user.dataValues }

//         const token = jwt.sign(user_data, process.env.SECRET, {
//           expiresIn: '7d',
//         })

//         return res.json({ token: token, ...user_data })
//       })
//     })
//     .catch((err) => handleError(err, res))
// }

// export { signup, login }
