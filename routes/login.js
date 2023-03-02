import passport from 'passport'

export const loginPassport = passport.authenticate('login', { failureRedirect: '../login-error' })

export const login = (req, res, next)=>{
    req.session.username = req.user.username;
    res.redirect('../')
    next()
}

