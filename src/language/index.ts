import { get } from "lodash";
import en from "@language/en/en.json";

const language = localStorage.getItem("language");
const languages: Map<string, object> = new Map([
  ["en", en],
]);

const fallback = "en";
export const trans = (key: string, lang?: string): string => {
  return get(languages.get(lang ?? language ?? fallback), key, key);
};
