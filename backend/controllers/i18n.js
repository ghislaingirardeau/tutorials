const en = {
    message: 'hello world'
}
const fr = {
    message: 'salut les gens'
}

exports.getDatas = async (req, res, next) => {
    let jsonToSend
    if (req.lang === 'en') {
        jsonToSend = en
    } else {
        jsonToSend = fr
    }
    res.send(jsonToSend)
    res.status(200).json(jsonToSend)
}