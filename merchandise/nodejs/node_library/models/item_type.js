var Sequelize = require('sequelize')
var type_item;

module.exports = function(sequelize){

    type_item = sequelize.define('type_item', {
        name:{type: Sequelize.STRING, unique: true},
        status: Sequelize.TEXT,
        comment: Sequelize.TEXT
    },{
        tableName: 'type_item',
        underscored: true
    })

    return type_item;
}