var Sequelize = require('sequelize')
var unit_type;

module.exports = function(sequelize){

    unit_type = sequelize.define('UnitType', {
        unit_type_name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'unit_type'
    })

    return unit_type;
}