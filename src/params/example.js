const Parameters = require('strong-params').Parameters;

module.exports = (parameters)=>{
    return Parameters(parameters)
            .permit(
                'name',
                'description'
            ).value()
}