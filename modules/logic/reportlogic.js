const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");

class ReportLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/reportmodel");
        return model;
    }

    static getPk(){
        return "IDReport";
    }

    static getWhere(search)
    {
        let where = {
            reportName : {
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

    static async create(o)
    {
        try
        {
            console.log("CREATE")
            let newO = await super.create(o);
            for(let idx = 0; idx < o.reportFields.length; idx++)
            {
                o.reportFields[idx].reportID = o.IDReport;
                o.reportFields[idx].id = null;
            }
            const ReportFieldModel = require("../models/reportfieldmodel");
            await ReportFieldModel.bulkCreate(o.reportFields);
            return { success: true, payload: newO }
        }
        catch(error)
        {
            console.log(error)
            throw { success: false, message: '', error: error };
        }
    }

    static async update(id, o)
    {
        try
        {
            console.log("UPDATE")
            console.log(id)
            let newO = await super.update(id, o)
            const ReportFieldModel = require("../models/reportfieldmodel");
            await ReportFieldModel.destroy({ where: { reportID: id } });
            for(let idx = 0; idx < o.reportFields.length; idx++)
            {
                o.reportFields[idx].reportID = o.IDReport;
                o.reportFields[idx].id = null;
            }
            await ReportFieldModel.bulkCreate(o.reportFields);
            return { success: true, payload: newO }

        }
        catch(error)
        {
            console.log(error)
            throw { success: false, message: '', error: error };

        }
    }

    static async get(id) 
    {
        try 
        {
            let newO = await super.get(id);
            let ooo = JSON.parse( JSON.stringify(newO.payload));

            const ReportFieldModel = require("../models/reportfieldmodel");
            let reportFields = await ReportFieldModel.findAll({ where: { reportID: id } });
            ooo.reportFields = reportFields;
            return { success: true, payload: ooo }
        }   
        catch(e)
        {
            throw { success: false, message: '', error: e };
        } 
    }

    static async getFieldsFromQuery(info)
    {
        try
        {
            console.log("info")
            console.log(info)
            
            const sequelize = new Sequelize(info.dbName, info.dbUser, info.dbPassword, {
                host: info.dbHost, // e.g., 'localhost',
                dialect: info.dbEngine, // or 'postgres', 'sqlite', etc.
            });

            let sqlQuery = info.sqlQuery;
            sqlQuery += " LIMIT 1"
            let result = await sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });
            console.log(result)
            if(result != null && result.length > 0)
            {
                let keys = Object.keys(result[0])
                const fieldNames = keys; 
                return { success: true, payload: fieldNames  };
            }
            else
            {
                return {success: false, message: "There should be at least one data row in the result of the query"}
            }

        }
        catch(error)
        {
            console.log("error")
            console.log(error)
            
            return { success: false, message: '', error: error };
        }
    }
}

module.exports = ReportLogic;