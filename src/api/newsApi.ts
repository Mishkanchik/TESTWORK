// src/api/newsApi.ts
import axios from "axios";
import type { NewsResponse } from "@/types";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

if (!NEWS_API_KEY) {
  console.error("VITE_NEWS_API_KEY не задано в .env файлі!");
}

const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: NEWS_API_KEY,
  },
});

// Глобальний лог помилок
newsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("NewsAPI помилка:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });
    return Promise.reject(error);
  }
);

export const getTopHeadlines = async (params: {
  sources?: string;
  q?: string;
  pageSize?: number;
  page?: number;
  sortBy?: "publishedAt" | "relevancy" | "popularity";
}) => {
  const queryParams: any = {
    pageSize: 20,
    ...params,
  };

  // Важливо: якщо є sources — НЕ додаємо country (інакше 400 або порожній результат)
  if (params.sources) {
    delete queryParams.country;
    delete queryParams.category;
  } else {
    queryParams.country = "us"; // дефолт тільки якщо джерел немає
  }

  console.log("Запит до NewsAPI top-headlines:", queryParams);

  const res = await newsApi.get<NewsResponse>("/top-headlines", { params: queryParams });
  console.log("Відповідь top-headlines:", res.data);

  return res.data;
};

export const searchEverything = async (params: {
  q: string;
  sources?: string;
  from?: string;
  sortBy?: string;
}) => {
  const queryParams = {
    pageSize: 20,
    language: "en",
    ...params,
  };

  console.log("Запит до NewsAPI everything:", queryParams);

  const res = await newsApi.get<NewsResponse>("/everything", { params: queryParams });
  console.log("Відповідь everything:", res.data);

  return res.data;
};