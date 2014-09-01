var Sequelize = require('sequelize')
var item_type;

module.exports = function(sequelize){

    item_type = sequelize.define('itemType', {
        item_type_name:{type: Sequelize.STRING, unique: true},
        item_type_status: Sequelize.TEXT,
        comment: Sequelize.TEXT
    },{
        tableName: 'item_type'
    })

    return item_type;
}