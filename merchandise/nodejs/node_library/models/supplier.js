var Sequelize = require('sequelize')
var supplier;

module.exports = function(sequelize){

    supplier = sequelize.define('newsupplier', {
        supplier_name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'supplier'
    })

    return supplier;
}