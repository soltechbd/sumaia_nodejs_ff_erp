var Sequelize = require('sequelize')
var supplier;

module.exports = function(sequelize){

    supplier = sequelize.define('supplier', {
       name: {type: Sequelize.STRING, unique: true},
        comment: Sequelize.TEXT
    },{
        tableName: 'supplier',
        underscored: true
    })

    return supplier;
}