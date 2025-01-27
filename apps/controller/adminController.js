const { userSchema } = require("../db/mongoDb/models/index");


const getAllUser = async (req, res) => {
    try {
        const users = await userSchema.find();
        if (!users.length > 0) {
           return res.notFound({ data: [users], message: "All User Fatched Successfully" })

        }
        res.success({ data: users, message: "All User Fatched Successfully" })

    } catch (error) {
        return res.internalServerError({message: error.message})
    }
}




module.exports = {
    getAllUser
}