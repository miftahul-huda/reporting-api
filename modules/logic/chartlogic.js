const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");
const ReportModel = require("../models/reportmodel")
const ChartConfigModel = require("../models/chartconfigmodel")
const Initialization = require("../../initialization")

class ChartLogic 
{

    static async executeQuery(sqlQuery, dbHost, dbName, dbUser, dbPassword, dbEngine, labelField, datasetField, summaryField, summaryFunction)
    {
        try
        {
            const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
                host: dbHost,
                dialect: dbEngine ,
                logging:false
            });

            let labelSql = sqlQuery.replace("*", "DISTINCT " + labelField);
            let labelData = await sequelize.query(labelSql, { type: sequelize.QueryTypes.SELECT });

            let dataSetSql = sqlQuery.replace("*", "DISTINCT " + datasetField);
            let dataSetData = await sequelize.query(dataSetSql, { type: sequelize.QueryTypes.SELECT });
            

            let summaryExpression = summaryFunction  + "(" + summaryField + ") AS summary";
            let fieldnames = [labelField, datasetField, summaryExpression].join(",");
            console.log("fieldnames")
            console.log(fieldnames)
            let sql = sqlQuery.replace("*", fieldnames)
            sql += " GROUP BY " + labelField + ", " + datasetField;

            console.log(sql)

            let data = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
            return { data: data, labels: labelData, datasets: dataSetData };

        }
        catch(error)
        {
            throw error;
        }
    }

    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getChartConfig(data, labelField, datasetField, summaryField, summaryFunction, chartType )
    {
        let labels = data.labels;
        let datasets = data.datasets;
        let dataItems  = data.data;
        let configDatasets = [];
        let values = [];

        labelField = labelField.split(".")
        labelField = labelField[labelField.length - 1]
        labelField = labelField.replace(/\"/gi, "")

        datasetField = datasetField.split(".")
        datasetField = datasetField[datasetField.length - 1]
        datasetField = datasetField.replace(/\"/gi, "")


        dataItems.map((item)=>{
            let value = { key: item[labelField] + "_" + item[datasetField], value: item["summary"] };
            values.push(value);
        })

        let realLabels = [];


        labels.map((label)=>
        {
            console.log(labelField)
            console.log(label)
            realLabels.push(label[labelField]);
        })

        let realDatasets = [];

        datasets.map((dataset)=>
        {
            realDatasets.push(dataset[datasetField  ]);
        })

        realDatasets.map((dataset)=>{
            let datasetLabelData = [];

            realLabels.map((label)=>{
                let key = label + "_" + dataset;
                let value = values.find(i => i.key === key);
                if(value != null)
                    datasetLabelData.push(value.value);
                else
                    datasetLabelData.push("0");
            });

            let itemConfig = {
                label: dataset,
                data: datasetLabelData,
                backgroundColor: this.getRandomColor(),
                borderColor: this.getRandomColor(),
                borderWidth: 1
            }
            configDatasets.push(itemConfig);
        })

        let configData = {
            labels: realLabels,
            datasets: configDatasets
        }

        const config = 
        {
            type: chartType,
            data: configData,
            options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
            }
        }
        
        return config;

    }

    static async generateChartByChartConfigID(chartConfigID)
    {   
        try
        {
            let chartconfigs = await ChartConfigModel.findOne({ where: {
                id: chartConfigID
            } });

            console.log(chartconfigs)

            let report = await ReportModel.findOne({ where: {
                IDReport: chartconfigs.reportID
            } });



            let data = await this.executeQuery(report.sqlQuery, report.dbHost, report.dbName, report.dbUser, report.dbPassword, report.dbEngine, chartconfigs.labelField, chartconfigs.datasetField, chartconfigs.summaryField, chartconfigs.summaryFunction);
            let chartconfig = this.getChartConfig(data, chartconfigs.labelField, chartconfigs.datasetField, chartconfigs.summaryField, chartconfigs.summaryFunction, chartconfigs.chartType);

            return { success: true, payload: chartconfig };

        }
        catch(error)
        {
            throw { success: false, message: '', error: error };
        }

    }
}

module.exports = ChartLogic;