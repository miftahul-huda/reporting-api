const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");

class ReportFieldLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/reportfieldmodel");
        return model;
    }

    static getPk(){
        return "id";
    }

    static getWhere(search)
    {
        let where = {
            fieldName : {
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
}

module.exports = ReportFieldLogic;