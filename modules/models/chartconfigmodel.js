const { Model, DataTypes } = require('sequelize');

class ChartConfigModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            reportID: DataTypes.STRING,
            chartTitle: DataTypes.STRING,
            labelField: DataTypes.STRING,
            datasetField: DataTypes.STRING,
            summaryField: DataTypes.STRING,
            summaryFunction: DataTypes.STRING,
            chartType: DataTypes.STRING
        }, 
        { sequelize, modelName: 'chartconfig', tableName: 'chartconfig', force: force });
    }
}

module.exports = ChartConfigModel;