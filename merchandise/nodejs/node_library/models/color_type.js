var Sequelize = require('sequelize')
var type_color;

module.exports = function(sequelize){

    type_color = sequelize.define('type_color', {
        name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'type_color',
        underscored: true
    })

    return type_color;
}