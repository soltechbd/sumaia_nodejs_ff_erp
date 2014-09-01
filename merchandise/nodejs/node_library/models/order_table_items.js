var Sequelize = require('sequelize')
var order_items_table;

module.exports = function(sequelize){

    order_items_table = sequelize.define('order_items_table', {

        order_id: {
            type: Sequelize.INTEGER,
            references: "order_table",
            referencesKey: "id"
        },
        item_id: {
            type: Sequelize.INTEGER,
            references: "item",
            referencesKey: "id"
        },
        unit_number: Sequelize.INTEGER,
        unit_type_id: {
            type: Sequelize.INTEGER,
            references: "type_unit",
            referencesKey: "id"
        },
        color_id: {
            type: Sequelize.INTEGER,
            references: "type_color",
            referencesKey: "id"
        },
        total_quantity: Sequelize.INTEGER,
        quantity_unit_type_id: Sequelize.INTEGER,
        supplier_id:  {
            type: Sequelize.INTEGER,
            references: "supplier",
            referencesKey: "id"
        },
        excess_percentage: Sequelize.INTEGER,
        total_quantity_with_excess_percentage: Sequelize.INTEGER,
        comment: Sequelize.TEXT

    },{
        tableName: 'order_items_table',
        underscored: true
    })

    return order_items_table;
}