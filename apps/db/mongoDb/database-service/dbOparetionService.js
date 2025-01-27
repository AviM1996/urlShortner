class MongoDbOperations {

    static async create(model, data) {
        try {
            const createData = new model(data)
            const newCreateData = await createData.save()
            return newCreateData;
        } catch (error) {
            throw new Error(`Error in save operation: ${error.message}`);
        }
    }

    static async update(model, id, data) {
        try {
            const updatedData = await model.findByIdAndUpdate(id, data, { new: true }).exec();
            if (!updatedData) {
                throw new Error('Document not found or no update made');
            }
            return updatedData;
        } catch (error) {
            throw new Error(`Error in edit operation: ${error.message}`);
        }
    }

    static async single(model, id) {
        try {
            const data = await model.findById(id).exec();
            if (!data) {
                throw new Error('data not found');
            }
            return data;
        } catch (error) {
            throw new Error(`Error in findOne operation: ${error.message}`);
        }
    }

    static async all(model) {
        try {
            const data = await model.find().exec();
            return data;
        } catch (error) {
            throw new Error(`Error in findAllDetails operation: ${error.message}`);
        }
    }

    static async deleteOp(model, id, data) {
        try {
            const deleteData = await model.findByIdAndUpdate(id, data, { new: true }).exec();
            if (!deleteData) {
                return false
            }
            return true
        } catch (error) {
            throw new Error(`Error in deleteData operation: ${error.message}`);
        }
    }

    static async checkExists(model, field, value) {
        try {
            const query = { [field]: value }; // Dynamic field
            const existing = await model.findOne(query);

            if (!existing) {
                return false;
            }
            return existing;
        } catch (error) {
            throw new Error(`Error in checkExists operation: ${error.message}`);
        }
    }
}

module.exports = MongoDbOperations