//const LoggerModel  = require( './modules/models/loggermodel')

const { Sequelize, Model, DataTypes } = require('sequelize');
const process = require('process');
const ReportFieldModel = require("./modules/models/reportfieldmodel")
const ReportModel = require("./modules/models/reportmodel")
const ChartConfigModel = require("./modules/models/chartconfigmodel")


const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: process.env.DBENGINE ,
    logging:false
});


class Initialization {
    static getSequelize()
    {
        return sequelize;
    }

    static async initializeDatabase(){

        let force = false;
        ChartConfigModel.initialize(sequelize, force);
        ReportFieldModel.initialize(sequelize, force);
        ReportModel.initialize(sequelize, force);


        await sequelize.sync();
    }
}

module.exports = Initialization



