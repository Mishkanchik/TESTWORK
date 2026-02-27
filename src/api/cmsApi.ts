// src/api/cmsApi.ts
import axios, { AxiosError } from "axios";
import type { AllowedSource, Topic } from "@/types"; // припускаю, що типи вже є

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

if (!STRAPI_URL) {
    console.error("VITE_STRAPI_URL не задано в .env файлі!");
}

const cmsApi = axios.create({
    baseURL: `${STRAPI_URL}/api`,
    timeout: 10000, // 10 секунд — щоб не зависало назавжди
    headers: {
        "Content-Type": "application/json",
    },
});

// Опціонально: глобальний обробник помилок
cmsApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Сервер відповів з помилкою (4xx, 5xx)
            console.error("Strapi помилка:", {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            // Запит зроблено, але відповіді немає (мережа, CORS, сервер вимкнений)
            console.error("Strapi недоступний:", error.message);
        } else {
            console.error("Помилка налаштування запиту:", error.message);
        }
        return Promise.reject(error);
    }
);

export const getAllowedSources = async (): Promise<AllowedSource[]> => {
    try {
        const res = await cmsApi.get("/allowed-sources", {
            params: {
                "filters[active][$eq]": true,
            },
        });

        console.log("Джерела з Strapi (повна відповідь):", res.data);

        if (!res.data.data || !Array.isArray(res.data.data)) {
            console.warn("Джерела: не масив");
            return [];
        }

        const sources = res.data.data.map((item: any) => {
            console.log("Один джерело:", item); // для дебагу
            return {
                id: item.sourceId as string || item.id?.toString() || "unknown",
                name: item.name as string || "Без назви",
            };
        });

        console.log("Оброблені джерела:", sources);
        return sources;
    } catch (error) {
        console.error("Помилка джерел:", error);
        return [];
    }
};

export const getTopics = async (): Promise<Topic[]> => {
    try {
        const res = await cmsApi.get("/topics");

        console.log("Теми з Strapi (повна відповідь):", res.data);

        if (!res.data.data || !Array.isArray(res.data.data)) {
            console.warn("Теми: не масив");
            return [];
        }

        const topics = res.data.data.map((item: any) => {
            console.log("Одна тема:", item); // ключовий лог — подивись сюди

            // keywords — якщо це repeatable, то масив об'єктів { keyword: "..." }
            const keywords = item.keywords
                ? item.keywords.map((k: any) => k.keyword || k || "").filter(Boolean)
                : [];

            return {
                id: item.id as string | number,
                name: item.name as string || "Без назви",
                keywords,
            };
        });

        console.log("Оброблені теми:", topics);
        return topics;
    } catch (error) {
        console.error("Помилка тем:", error);
        return [];
    }
};