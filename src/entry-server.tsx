import { renderToString } from "react-dom/server";
import App from "./App";
import { fetchItems } from "./api/itemApi";
import { useItemStore } from "./store/useItemStore";
import { StaticRouter } from "react-router-dom";

// zustand 초기화 함수(스토어가 여러개인 경우 확장)

// ssr 함수
export async function render(url: string, username?: string) {
  // 데이터 페칭
  const items = username ? await fetchItems(username) : [];
    useItemStore.setState({items});
  
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  return { appHtml, items }
}