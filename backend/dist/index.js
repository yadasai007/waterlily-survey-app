"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const surveys_1 = __importDefault(require("./routes/surveys"));
const responses_1 = __importDefault(require("./routes/responses"));
const test_1 = __importDefault(require("./routes/test")); // Add this import
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/surveys', surveys_1.default);
app.use('/api/responses', responses_1.default);
app.use('/api/test', test_1.default); // Add this line
// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Waterlily Survey API',
        version: '1.0.0',
        documentation: '/api/test'
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test API available at: http://localhost:${PORT}/api/test`);
});
