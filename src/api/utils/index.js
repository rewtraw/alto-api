const errorHandler = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(function (e) {
        if (e.message.includes('NotFoundError')) {
          console.log(e.message ? e.message : e)
          res.sendStatus(404)
        } else {
          console.log(e.message ? e.message : e)
          res.sendStatus(400)
        }
      })
  }
module.exports = {
  errorHandler
}
