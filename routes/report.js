const CrudRouter = require("./crudrouter");

class ReportRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = super.getRouter(logic);
        router.post("/fields", (req, res)=>{
            console.log("/report/fields")
            let logic = router.logic;
            let info = req.body;
            console.log(info)
            logic.getFieldsFromQuery(info).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                res.send(err);
            })
        })
        return router;
    }
}

module.exports = ReportRouter;