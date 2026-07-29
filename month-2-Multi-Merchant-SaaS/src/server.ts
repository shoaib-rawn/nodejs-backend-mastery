import { env } from './config/env';
import app from './app';

app.listen(env.PORT, () => {
  console.log(`🚀 E-Commerce API Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
