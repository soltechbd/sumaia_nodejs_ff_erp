var Sequelize = require('sequelize')
var item;

module.exports = function (sequelize) {

    item = sequelize.define('newitem', {
        item_name: Sequelize.STRING,
        item_type: {
            type: Sequelize.INTEGER,
            references: "item_type",
            referencesKey: "id"
        },
        unit_type: {
            type: Sequelize.INTEGER,
            references: "unit_type",
            referencesKey: "id"
        },
        item_description: Sequelize.STRING,
        item_color: {
            type: Sequelize.INTEGER,
            references: "color_type",
            referencesKey: "id"
        },

        item_supplier: {
            type: Sequelize.INTEGER,
            references: "supplier",
            referencesKey: "id"
        },
        item_comment: Sequelize.STRING
    }, {
        tableName: 'item'
    })

    return item;
}