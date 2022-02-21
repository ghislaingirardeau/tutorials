const en = {
    message: 'hello world'
}
const fr = {
    message: 'salut les gens'
}

exports.getDatas = async (req, res, next) => {
    let jsonToSend
    if (req.body.lang === 'en') {
        jsonToSend = en
    } else {
        jsonToSend = fr
    }
    res.status(200).json(jsonToSend)
}