const { urlSchema } = require("../db/mongoDb/models/index");
const { userSchema } = require("../db/mongoDb/models/index");
const commonDBOperation = require("../service/dbMasterService")

const getAnalyticsByAlias = async (req, res) => {
    try {
        const { alias } = req.params; 
        const user = req.session?.user; 

        if (!user?.userId) {
            throw new Error("User not found");
        }

        const checkAlias = await urlSchema.findOne({
            userID: user.userId, 
            alias, 
        });

        if (!checkAlias) {
            throw new Error("Alias not found");
        }

        const result = await urlSchema.aggregate([
            {
                $match: {
                    userID: user.userId, 
                    alias, 
                },
            },
            {
                $lookup: {
                    from: "urllogs", 
                    localField: "uniqueUrlID", 
                    foreignField: "urlId", 
                    as: "logs", 
                },
            },
            {
                $project: {
                    totalClicks: { $size: "$logs" },
                    uniqueClicks: {
                        $size: {
                            $setUnion: {
                                $map: {
                                    input: "$logs",
                                    as: "log",
                                    in: "$$log.geoIp", 
                                },
                            },
                        },
                    },
                    clicksByDate: {
                        $map: {
                            input: [0, 1, 2, 3, 4, 5, 6, 7], 
                            as: "daysAgo",
                            in: {
                                date: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: "day",
                                                amount: "$$daysAgo",
                                            },
                                        },
                                    },
                                },
                                count: {
                                    $size: {
                                        $filter: {
                                            input: "$logs",
                                            as: "log",
                                            cond: {
                                                $eq: [
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: "$$log.createdAt",
                                                        },
                                                    },
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: {
                                                                $dateSubtract: {
                                                                    startDate: new Date(),
                                                                    unit: "day",
                                                                    amount: "$$daysAgo",
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        return res.success({
            data: result,
            message: "Analytics fetched successfully",
        });
    } catch (error) {
        console.error("Error in getAnalyticsByAlias:", error);
        return res.internalServerError({
            error: error.message || "Failed to fetch analytics",
        });
    }
};


const overAllAnalytics = async (req, res) => {
    try {
        const user = req.session.user;
        if (!(user && user.userId)) throw new Error("User not found");

        const userId = user.userId;

        const result = await userSchema.aggregate([
            {
                $match: { userId },
            },
            {
                $lookup: {
                    from: "urls",
                    localField: "userId",
                    foreignField: "userId",
                    as: "urls",
                },
            },
            {
                $lookup: {
                    from: "urllogs",
                    localField: "userId",
                    foreignField: "userId",
                    as: "logs",
                },
            },
            {
                $project: {
                    totalUrls: { $size: "$urls" },
                    totalClicks: { $size: "$logs" },
                    uniqueClicks: {
                        $size: {
                            $setUnion: {
                                $map: {
                                    input: "$logs",
                                    as: "log",
                                    in: "$$log.geoIp",
                                },
                            },
                        },
                    },
                    clicksByDate: {
                        $map: {
                            input: [0, 1, 2, 3, 4, 5, 6, 7],
                            as: "daysAgo",
                            in: {
                                date: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: "day",
                                                amount: "$$daysAgo",
                                            },
                                        },
                                    },
                                },
                                count: {
                                    $size: {
                                        $filter: {
                                            input: "$logs",
                                            as: "log",
                                            cond: {
                                                $eq: [
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: "$$log.createdAt",
                                                        },
                                                    },
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: {
                                                                $dateSubtract: {
                                                                    startDate: new Date(),
                                                                    unit: "day",
                                                                    amount: "$$daysAgo",
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    osType: {
                        $map: {
                            input: { $setUnion: "$logs.os" },
                            as: "os",
                            in: {
                                osName: "$$os",
                                uniqueClicks: {
                                    $size: {
                                        $setUnion: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$logs",
                                                        as: "log",
                                                        cond: { $eq: ["$$log.os", "$$os"] },
                                                    },
                                                },
                                                as: "log",
                                                in: "$$log.geoIp",
                                            },
                                        },
                                    },
                                },
                                uniqueUsers: {
                                    $size: {
                                        $setUnion: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$logs",
                                                        as: "log",
                                                        cond: { $eq: ["$$log.os", "$$os"] },
                                                    },
                                                },
                                                as: "log",
                                                in: "$$log.sessionId",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    deviceType: {
                        $map: {
                            input: { $setUnion: "$logs.platform" },
                            as: "platform",
                            in: {
                                deviceName: "$$platform",
                                uniqueClicks: {
                                    $size: {
                                        $setUnion: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$logs",
                                                        as: "log",
                                                        cond: { $eq: ["$$log.platform", "$$platform"] },
                                                    },
                                                },
                                                as: "log",
                                                in: "$$log.geoIp",
                                            },
                                        },
                                    },
                                },
                                uniqueUsers: {
                                    $size: {
                                        $setUnion: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$logs",
                                                        as: "log",
                                                        cond: { $eq: ["$$log.platform", "$$platform"] },
                                                    },
                                                },
                                                as: "log",
                                                in: "$$log.sessionId",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        return res.success({
            data: result,
            message: "Overall analytics fetched successfully",
        });
    } catch (error) {
        console.error("Error in overAllAnalytics:", error);
        return res.internalServerError({ error: "Failed to fetch overall analytics" });
    }
};


const getTopics = async (model) => {
    try {
        const result = await commonDBOperation.allDetails(model)
        const uniqueTopics = [...new Set(result.map((item) => item))];
        return uniqueTopics;
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw new Error("Failed to fetch topics.");
    }
};

const getTopic = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!(user && user.userId)) {
            throw new Error('User not found');
        }
        const result = await getTopics(urlSchema);
        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
};

const analyticsByTopic = async (req, res) => {
    try {
        const { topic } = req.params;
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const findTopic = await commonDBOperation.checkExists(urlSchema, "topic", topic);
        if (!findTopic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        const result = await userSchema.aggregate([
            {
                $match: {
                    userId: user.userId,
                },
            },
            {
                $lookup: {
                    from: "urls",
                    localField: "userId",
                    foreignField: "userID",
                    as: "urls",
                    pipeline: [
                        { $match: { topic } },
                    ],
                },
            },
            {
                $set: {
                    urlIds: {
                        $map: {
                            input: "$urls",
                            as: "url",
                            in: "$$url.uniqueUrlID",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "urllogs",
                    let: { urlIds: "$urlIds" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$urlId", "$$urlIds"] },
                            },
                        },
                    ],
                    as: "urlLogs",
                },
            },
            {
                $project: {
                    totalClicks: { $size: "$urlLogs" },
                    uniqueClicks: {
                        $size: {
                            $setUnion: {
                                $map: {
                                    input: "$urlLogs",
                                    as: "log",
                                    in: "$$log.geoIp",
                                },
                            },
                        },
                    },
                    clicksByDate: {
                        $map: {
                            input: [0, 1, 2, 3, 4, 5, 6, 7],
                            as: "daysAgo",
                            in: {
                                date: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: "day",
                                                amount: "$$daysAgo",
                                            },
                                        },
                                    },
                                },
                                count: {
                                    $size: {
                                        $filter: {
                                            input: "$urlLogs",
                                            as: "log",
                                            cond: {
                                                $eq: [
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: "$$log.createdAt",
                                                        },
                                                    },
                                                    {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: {
                                                                $dateSubtract: {
                                                                    startDate: new Date(),
                                                                    unit: "day",
                                                                    amount: "$$daysAgo",
                                                                },
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    urls: {
                        $map: {
                            input: "$urls",
                            as: "url",
                            in: {
                                shortUrl: {
                                    $concat: [
                                        process.env.BASE_URL,
                                        "/api/shorten/",
                                        "$$url.alias",
                                    ],
                                },
                                totalClicks: {
                                    $size: {
                                        $filter: {
                                            input: "$urlLogs",
                                            as: "log",
                                            cond: {
                                                $eq: ["$$log.urlId", "$$url.uniqueUrlID"],
                                            },
                                        },
                                    },
                                },
                                uniqueClicks: {
                                    $size: {
                                        $setUnion: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$urlLogs",
                                                        as: "log",
                                                        cond: { $eq: ["$$log.urlId", "$$url.uniqueUrlID"] },
                                                    },
                                                },
                                                as: "log",
                                                in: "$$log.geoIp",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "No data found for the specified topic." });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error in analyticsByTopic:", error);
        return res.status(500).json({ error: "Failed to fetch analytics data by topic." });
    }
};


module.exports = {
    getTopic,
    getAnalyticsByAlias,
    overAllAnalytics,


    analyticsByTopic
};
