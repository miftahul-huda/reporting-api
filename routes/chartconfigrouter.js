const CrudRouter = require("./crudrouter");

class ChartConfigRouter extends CrudRouter{
    static getRouter(logic)
    {
        var router = super.getRouter(logic);        
        let me = this;
        router.get("/report/:reportID", function (req, res){
        
            let logic = router.logic;
            console.log("LOGIC")
            console.log(logic)
        
            let reportID = req.params.reportID;

            logic.getChartConfigByReportID( reportID).then(function (os)
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

module.exports = ChartConfigRouter;