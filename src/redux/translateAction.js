import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "../constants";

//bütün dilleri
export const getLanguages = createAsyncThunk(
  "translate/getLanguages",
  async () => {
    //API isteği atar
    const res = await axios.request(options);
    //payload'ı return etma
    return res.data.data.languages;
  }
);

//Çevirme
export const translateText = createAsyncThunk(
  "translate/Text",
  async ({ sourceLang, targetLang, text }) => {
    //API isteğine gönderilecek parametreleri ayarlama
    const params = new URLSearchParams();
    params.set("source_language", sourceLang.value);
    params.set("target_language", targetLang.value);
    params.set("text", text);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "4a33083243mshd021647818f6392p16c21cjsne7d5015d461b",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: params,
    };

    //Yukarıdaki ayarlara göre API isteği atar
    const res = await axios.request(options);

    //cevabı slice'a aktar
    return res.data.data.translatedText;
  }
);
