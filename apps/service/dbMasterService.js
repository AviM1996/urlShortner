const configService = require("../db/config/configService")
const MongoDbOperations=require("../db/mongoDb/database-service/dbOparetionService")

console.log(MongoDbOperations);

let dbOperations;

switch (configService.dbType) {
    case "mongodb":
        dbOperations = MongoDbOperations;
        break;
    default:
        throw new Error(`Unsupported database type: ${configService.dbType}`);
}

const commonDBOperation = {
    save: async (model, data) => {
        return await dbOperations.create(model, data);
    },
    edit: async (model, id, data) => {
        return await dbOperations.update(model, id, data);
    },
    singleDetails: async (model, id) => {
        return await dbOperations.single(model, id);
    },
    allDetails: async (model) => {
        return await dbOperations.all(model);
    },
    checkExists: async (model, field,data) => {
        return await dbOperations.checkExists(model, field,data);
    },
};

module.exports = commonDBOperation;

