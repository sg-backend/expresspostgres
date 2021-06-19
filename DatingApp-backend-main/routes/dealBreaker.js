const router = require("express").Router();
const DealBreaker_controller = require("../controllers/DealBreaker");

router.post("/dealBreaker/updateDealBreakerDetails", DealBreaker_controller.updateDealBreakerDetails);

router.get("/dealBreaker/getDealBreakerDetails", DealBreaker_controller.getDealBreakerDetails);

module.exports = router;