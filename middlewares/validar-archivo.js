const { response } = require("express")



const validarArchivoSubir = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file ) {
        return res.status(400).json({errors:[{ msg: 'No hay archivos que subir - validarArchivoSubir --- middlewares'}]});
    }

    next();

}


module.exports = {
    validarArchivoSubir
}
