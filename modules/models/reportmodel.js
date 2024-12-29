const { Model, DataTypes } = require('sequelize');

class ReportModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            IDReport: DataTypes.STRING,
            reportName: DataTypes.STRING,
            sqlQuery: DataTypes.TEXT,
            dbHost: DataTypes.STRING,
            dbName: DataTypes.STRING,
            dbUser: DataTypes.STRING,
            dbPassword: DataTypes.STRING,
            dbEngine: DataTypes.STRING,
        }, 
        { sequelize, modelName: 'report', tableName: 'report', force: force });
    }
}

module.exports = ReportModel;