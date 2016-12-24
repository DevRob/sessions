const bcrypt = require('bcrypt-nodejs')
const db = require('./db')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(authenticate))
passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

function authenticate(email, password, done) {
  db("users")
    .where("email", email)
    .first()
    .then((user) => {
      if(!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: "wrong user or password"})
      }

      done(null, user)
    }, done)
}

function register(req, email, password, done) {
  db("users")
    .where("email", email)
    .first()
    .then((user) => {
      if(user) {
        return done(null, false, {message: "user already exist with this email address"})
      }
      if (password !== req.body.password2) {
        return done(null, false, {message: "passowds don't match"})
      }

      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: email,
        password: bcrypt.hashSync(password)
      }

      db("users")
        .insert(newUser)
        .catch(function(err) {
           console.log(err);
        })
        .then((ids) => {
          newUser.id = ids[0]
          done(null, newUser)
        })
        .catch(function(err) {
           console.log(err);
        })
    })
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
    }, done)
})
