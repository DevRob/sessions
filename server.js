const express = require('express')
const session = require('express-session')

express()
  .use(session({ secret: "You like cats", resave: false, saveUninitialized: false }))
  .get("/", (req, res, next) => {
    res.send(req.session)
  })
  .get("/set", (req, res, next) => {
    req.session.name = "Rob"
    res.send(req.session)
  })
  .listen(3000)
