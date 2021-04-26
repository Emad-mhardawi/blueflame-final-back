exports.notFound = (req, res, next)=>{
    const error = new Error(`not found- ${req.originalUrl}`)
    res.status(404);
    next(error)
}


exports.errorHandler = (err, req, res, next)=>{
    const statucCode = res.statusCode ===200 ? 500 : res.statusCode;
    res.status(statucCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV ==='production'? null : err.stack
    })
}

