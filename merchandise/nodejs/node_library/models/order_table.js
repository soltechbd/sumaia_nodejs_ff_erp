var Sequelize = require('sequelize')
var order_table;

module.exports = function(sequelize){

    order_table = sequelize.define('order_table', {

        buyer_id:  {
            type: Sequelize.INTEGER,
            references: "buyer_table",
            referencesKey: "id"
        },
        style_id:  {
            type: Sequelize.INTEGER,
            references: "style_table",
            referencesKey: "id"
        },
        po_number: Sequelize.TEXT,
        shipment_date: Sequelize.DATE,
        quantity: Sequelize.TEXT,
        meta_data: Sequelize.TEXT

    },{
        tableName: 'order_table',
        underscored: true
    })

    return order_table;
}