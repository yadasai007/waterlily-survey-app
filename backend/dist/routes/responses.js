"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responseController_1 = require("../controllers/responseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes
router.get('/user', auth_1.authenticateToken, responseController_1.getUserResponses);
router.get('/:id', auth_1.authenticateToken, responseController_1.getResponse);
exports.default = router;
