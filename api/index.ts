import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the routes from our Express server
registerRoutes(app).catch(console.error);

export default app;
