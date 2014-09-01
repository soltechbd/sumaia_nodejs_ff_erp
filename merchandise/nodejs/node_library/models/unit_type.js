var Sequelize = require('sequelize')
var type_unit;

module.exports = function(sequelize){

    type_unit = sequelize.define('type_unit', {
        name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'type_unit',
        underscored: true
    })

    return type_unit;
}