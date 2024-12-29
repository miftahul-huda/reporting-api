const CrudRouter = require("./crudrouter");

class ChartRouter{
    static getRouter(logic)
    {
        var express = require('express');
        var router = express.Router();    
        router.logic = logic;
        
        let me = this;
        router.get("/:id", function (req, res){
        
            let logic = router.logic;
            console.log("LOGIC")
            console.log(logic)
        
            let chartConfigID = req.params.id;

            logic.generateChartByChartConfigID( chartConfigID).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        });

        return router;
    }
}

module.exports = ChartRouter;