const app = express();

// your beautiful code...

if (import.meta.env.PROD) {
  app.listen(3000);
}

export const viteNodeApp = app;