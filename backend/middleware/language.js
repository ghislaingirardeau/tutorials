const language = (req, res, next) => {
    try {
        const lang = req.acceptsLanguages('fr', 'es', 'en')
        if (lang) { // if found, attach it as property to the request
            req.lang = lang
        } else { // else set the default language
            req.lang = 'en'
        }
        next()
    }
    catch (error) {
        res.status(401).json({error :'Requête non authentifié !'})
    }
}

module.exports = language