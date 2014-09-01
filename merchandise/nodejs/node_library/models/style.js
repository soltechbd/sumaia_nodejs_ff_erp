var Sequelize = require('sequelize')
var style_table;

module.exports = function(sequelize){

    style_table = sequelize.define('style_table', {
        name: {type: Sequelize.STRING, unique: true}
    },{
        tableName: 'style_table',
        underscored: true
    })

    return style_table;
}