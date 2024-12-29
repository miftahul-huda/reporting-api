const { Model, DataTypes } = require('sequelize');

class ReportFieldModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            reportID: DataTypes.STRING,
            fieldName: DataTypes.STRING,
            fieldLabel: DataTypes.STRING,
        }, 
        { sequelize, modelName: 'reportfield', tableName: 'reportfield', force: force });
    }
}

module.exports = ReportFieldModel;