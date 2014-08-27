var Sequelize = require('sequelize')
var color_type;

module.exports = function(sequelize){

    color_type = sequelize.define('ColorType', {
        color_type_name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'color_type'
    })

    return color_type;
}