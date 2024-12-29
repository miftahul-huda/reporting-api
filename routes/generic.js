const CrudRouter = require("./crudrouter");

class GenericRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = super.getRouter(logic);
        return router;
    }
}

module.exports = GenericRouter;