const Parameters = require('strong-params').Parameters;

module.exports = (parameters)=>{
    return Parameters(parameters)
            .permit(
                'id',
                'name',
                'description'
            ).value()
}