import app from "./app";
import { testConnection } from "./config/db";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await testConnection();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
