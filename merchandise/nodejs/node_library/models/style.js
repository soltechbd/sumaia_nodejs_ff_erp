var Sequelize = require('sequelize')
var style_table;

module.exports = function(sequelize){

    style_table = sequelize.define('newstylename', {
        style_name: {type: Sequelize.STRING, unique: true}
    },{
        tableName: 'style_table'
    })

    return style_table;
}