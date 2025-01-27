const shortid = require('shortid');
const { urlSchema } = require("../db/mongoDb/models/index");
const { userSchema } = require("../db/mongoDb/models/index");
const { urlLogs } = require("../db/mongoDb/models/index");
const { baseUrl } = require('../db/config/configService')
const generateUniqueId = require("../utils/random")
const commonDBOperation = require("../service/dbMasterService")
const { redisConnect } = require('../service/redisConfig')


const createShortenUrl = async (req, res) => {
    try {
        const user = req.session.user;

        if (!(user && user.userId)) {
            return res.notFound({ message: 'User not found' });
        }

        // Generate alias (either custom or random)
        const alias = req.body.customAlias ? req.body.customAlias : shortid.generate();

        // Validate the long URL
        if (!req.body.longUrl) {
            return res.badRequest({ message: 'Long URL is required' });
        }

        // Ensure baseUrl is defined
        if (!baseUrl) {
            throw new Error('Base URL is not configured');
        }

        const shortUrl = `${baseUrl}/${alias}`;

        const data = {
            uniqueUrlID: generateUniqueId(),
            userID: user.userId,
            longUrl: req.body.longUrl,
            shortUrl: shortUrl,
            customAlias: !!req.body.customAlias,
            topic: req.body.topic,
            alias: alias,
        };

        // Cache the URL in Redis
        await redisConnect.set(
            `shortUrl:${data.alias}`,
            JSON.stringify(data),
            'EX',
            3600 // Expires in 1 hour
        );

        // Save the data to the database
        const saveData = await commonDBOperation.save(urlSchema, data);

        if (!saveData) {
            return res.badRequest({ message: 'Something went wrong while saving the data.' });
        }

        res.status(200).json({
            data: { shortUrl: saveData.shortUrl, createdAt: saveData.createdAt },
            message: 'Short URL created successfully',
        });
    } catch (error) {
        console.error('Error in createShortenUrl:', error.message || error);
        res.internalServerError({ message: `Server error: ${error.message}` });
    }
};



const redirectShortenUrl = async (req, res, next) => {
    try {
        const sessionId = req.session.user?.sessionId;
        const { alias } = req.params;

        const cachedUrl = await redisConnect.get(`shortUrl:${alias}`);
        let getUrl;

        if (cachedUrl) {
            getUrl = JSON.parse(cachedUrl);
        } else {
            getUrl = await commonDBOperation.checkExists(urlSchema, 'alias', alias);

            if (!getUrl) {
                return res.notFound({ message: 'URL not found' });
            }
            await redisConnect.set(
                `shortUrl:${alias}`,
                JSON.stringify(getUrl),
                'EX',
                3600
            );
        }

        if (!getUrl.longUrl) {
            return res.notFound({ message: 'Long URL not found' });
        }

        const userAgent = req.useragent;
        const urlLogsData = {
            logId: generateUniqueId(),
            urlId: getUrl.uniqueUrlID,
            userId: getUrl.userID,
            sessionId: sessionId,
            geoIp: req.headers['x-forwarded-for'] || req.ip,
            os: userAgent.os && userAgent.os !== 'unknown' ? userAgent.os : 'Unknown OS',
            platform: userAgent.platform && userAgent.platform !== 'unknown' ? userAgent.platform : 'Unknown Platform',
            browser: userAgent?.browser || 'unknown',
            browserVersion: userAgent?.version || 'unknown',
            source: userAgent?.source || 'unknown',
        };

        if (userAgent?.os !== 'unknown') {
            await commonDBOperation.save(urlLogs, urlLogsData);
        }

        return res.success({data: { longUrl: getUrl.longUrl }, message: 'Redirecting...' });
    } catch (error) {
        return res.internalServerError({ message: 'An error occurred.' });
    }
};


module.exports = {
    createShortenUrl,
    redirectShortenUrl
}