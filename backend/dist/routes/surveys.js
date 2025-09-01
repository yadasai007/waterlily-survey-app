"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surveyController_1 = require("../controllers/surveyController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public route (if you want surveys to be publicly accessible)
// router.get('/:id', getSurvey);
// Protected routes
router.get('/:id', auth_1.authenticateToken, surveyController_1.getSurvey);
router.post('/:id/responses', auth_1.authenticateToken, surveyController_1.submitResponse);
exports.default = router;
