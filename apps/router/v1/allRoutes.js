const express = require('express');
const router = express.Router();
const authController = require('../../controller/authController');
const urlShorterController = require('../../controller/urlShorterController');
const analyticsController = require('../../controller/analyticsController');
const { passport } = require("../../controller/authController");
const { isSession } = require('../../middleware/authSession')
const visitedSession=require('../../service/session')



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/404' }), (req, res) => {
  console.log('Authenticated user:', req.user); // Log `req.user`
  if (req.user) {
      req.session.user = { ...req.user.toObject(), sessionId: req.session.id };
      console.log('Session after login:', req.session);
      res.redirect('/');
  } else {
      res.status(401).json({ message: 'Authentication failed' });
  }
});


router.get('/me', isSession, authController.getProfile)
router.get('/logout', isSession, authController.logout)

router.post("/shorten",isSession, urlShorterController.createShortenUrl);
router.get("/shorten/:alias",visitedSession, urlShorterController.redirectShortenUrl);

router.get('/overAll', analyticsController.overAllAnalytics)

router.get('/topic', analyticsController.getTopic)//Done
router.get('/topic/:topic',visitedSession,analyticsController.analyticsByTopic) //done
router.get('/:alias',visitedSession,analyticsController.getAnalyticsByAlias) //done
router.get('/overAll', analyticsController.overAllAnalytics)

module.exports = router;
