import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // 추가
import { createServer as createViteServer } from "vite";
import cookie from "cookie";

// __dirname 직접 정의 (ESM 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // Vite 개발 서버 생성
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares); // Vite 미들웨어 등록

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      console.log("✅ SSR 요청 들어옴:", url);

      // http 헤더 쿠키에서 사용자 이름 추출
      const parsedCookies = cookie.parse(req.headers.cookie || "");
      const username = parsedCookies.username;

      // html 템플릿 읽기
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);

      // SSR 엔트리 파일 로드
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      // SSR 렌더링
      const { appHtml, items } = await render(url, username);

      console.log("✅ SSR 데이터:", items);

      // 템플릿에 렌더링 결과 삽입
      const initialDataScript = `<script>window.__INITIAL_ITEMS__ = ${JSON.stringify(
        items
      )};</script>`;
      const html = template.replace(
        `<!--app.html-->`,
        `${appHtml}${initialDataScript}`
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error("❌ SSR 에러:", e);
      res.status(500).end((e as Error).message);
    }
  });

  app.listen(5173, () => {
    console.log("✅ Server running at http://localhost:5173");
  });
}

createServer();
