// src/lib/api.ts
import { Configuration, LogsApi } from '@/api-client';

const config = new Configuration({
  basePath: 'https://datalog-backend.onrender.com', // your FastAPI backend
});

export const logsApi = new LogsApi(config);
