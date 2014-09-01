var Sequelize = require('sequelize')
var buyer_table;

module.exports = function(sequelize){

    buyer_table = sequelize.define('buyer_table', {
        name: {type: Sequelize.STRING, unique: true}
    },{
        tableName: 'buyer_table',
        underscored: true
    })

    return buyer_table;
}