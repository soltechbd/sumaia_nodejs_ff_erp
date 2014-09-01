var Sequelize = require('sequelize')
var item;

module.exports = function (sequelize) {

    item = sequelize.define('item', {
        item_name: Sequelize.STRING,
        item_type: {
            type: Sequelize.INTEGER,
            references: "type_item",
            referencesKey: "id"
        },
        unit_type: {
            type: Sequelize.INTEGER,
            references: "type_unit",
            referencesKey: "id"
        },
        item_description: Sequelize.STRING,
        item_color: {
            type: Sequelize.INTEGER,
            references: "type_color",
            referencesKey: "id"
        },

        item_supplier: {
            type: Sequelize.INTEGER,
            references: "supplier",
            referencesKey: "id"
        },
        item_comment: Sequelize.STRING
    }, {
        tableName: 'item',
        underscored: true
    })

    return item;
}