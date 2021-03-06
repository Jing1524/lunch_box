const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = "f6061d4f96ac4588b843ec662758b43c";
const APP_CERTIFICATE = "1f627689aa6949cc99b76a58bd94b033";

const router = require("express").Router();
module.exports = router;

const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(500).json({ error: "channel is required" });
  }
  let uid = req.query.uid;
  if (!uid || uid === "") uid = 0;
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
  return res.json({ token: token });
};

router.get("/access_token", nocache, generateAccessToken);
