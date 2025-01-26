const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");

class ChartConfigLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/chartconfigmodel");
        return model;
    }

    static getPk(){
        return "id";
    }

    static getWhere(search)
    {
        let where = {
            chartTitle : {
                [Op.like] : "%" + search + "%"
            } 
        }
        return where;
    }

    static getOrder()
    {
        let order = [['createdAt', 'DESC']];
        return order;
    }

    static async getChartConfigByReportID(reportID)
    {
        try
        {
            let model = this.getModel();
            let result = await model.findAll({
                where: {
                    reportID: reportID
                }
            })

            return { success: true, payload: result}
        }
        catch(e)
        {
            console.log(e)
            throw e;
        }
    }
}

module.exports = ChartConfigLogic;