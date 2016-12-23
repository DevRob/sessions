const knex = require('./db')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(authenticate))

function authenticate(email, password, done) {
  db("users")
    .where("email", email)
    .first()
    .then((user) => {
      if(!user || user.password !== password) {
        return done(null, false, {message: "wrong user or password"})
      }

      done(null, user)
    }, done)
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  db("users")
    .where("id", id)
    .first()
    .then((user) => {
      done(null, user)
    }, done )
})
