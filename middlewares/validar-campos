const {validationResult} = require ('express-validator');


//next, es lo que tenemos que llamar si este middleware pasa
const validarCampos= ( req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    //Si llega a este punto, sigue con el middleware y si no hay más middleware, sigue con el controlador
    next();
}

module.exports = {
    validarCampos

}