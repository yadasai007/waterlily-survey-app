"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testController_1 = require("../controllers/testController");
const router = express_1.default.Router();
// Public test routes (no authentication required)
router.get('/', testController_1.getTestData);
router.post('/survey', testController_1.createTestSurvey);
exports.default = router;
