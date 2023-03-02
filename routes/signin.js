import passport from 'passport'

export const signinPassport = passport.authenticate('signup', { failureRedirect: '../signin-error' })

export const signin = (req, res, next)=>{ 
        
    req.session.username = req.user.username

    res.redirect('../')
    next()

}

