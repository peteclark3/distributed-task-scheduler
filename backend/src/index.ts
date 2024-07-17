import 'module-alias/register';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import routes from './routes';

const app = express();

// Increase the limit for JSON payloads
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
