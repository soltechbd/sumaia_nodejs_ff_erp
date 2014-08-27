var Sequelize = require('sequelize')
var item;

module.exports = function(sequelize){

    item = sequelize.define('newitem', {
        item_name: Sequelize.STRING,
        item_type: Sequelize.INTEGER,
        unit_type: Sequelize.INTEGER,
        item_description: Sequelize.STRING,
        item_color: Sequelize.INTEGER,
        item_supplier: Sequelize.INTEGER,
        item_comment: Sequelize.STRING

    },{
        tableName: 'item'
    })

    return item;
}