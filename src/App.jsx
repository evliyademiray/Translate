import React, { useMemo, useState } from "react";
import "./style.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLanguages, translateText } from "./redux/translateAction";
import Select from "react-select";
import { setTranslated } from "./redux/translateSlice";

const App = () => {
  const state = useSelector((store) => store.translate);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const [sourceLang, setSourceLang] = useState({
    label: "Turkish",
    value: "tr",
  });
  const [targetLang, setTargetLang] = useState({
    label: "English",
    value: "en",
  });

  //Dil verilerini alır ve store'a aktarır
  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  //API'dan gelen dizi içerisindeki code ve name değerlerine sahip objeleri,
  //label ve value değerlerine sahip objelere çevirme

  //?Ancak buradaki map bileşeninin top -level code olduğu için bileşen
  //?her render edildiğinde tekrardan çalışır
  //!Bunu önlemek için useMemo kullandık

  const refinedData = useMemo(
    () =>
      state.languages.map((lang) => ({
        label: lang.name,
        value: lang.code,
      })),
    [state.languages]
  );

  //dilleri değiş

  const handleSwap = () => {
    setTargetLang(sourceLang);
    setSourceLang(targetLang);

    //alt inputtaki veriyi üsttekine aktarma
    setText(state.translatedText);
    //üst iputtaki veriyi alttakine yani store'a aktarma
    dispatch(setTranslated(text));
  };

  return (
    <div id="main-page">
      <div className="container">
        <h1>Translate it!</h1>
        {/* Üst Kısım */}
        <div className="upper">
          <Select
            className="select"
            onChange={setSourceLang}
            isLoading={state.isLangsLoading}
            isDisabled={state.isLangsLoading}
            options={refinedData}
            value={sourceLang}
          />
          <button onClick={handleSwap}>Değiştir</button>
          <Select
            className="select"
            onChange={setTargetLang}
            isLoading={state.isLangsLoading}
            isDisabled={state.isLangsLoading}
            options={refinedData}
            value={targetLang}
          />
        </div>

        {/* Orta Kısım */}
        <div className="middle">
          <div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            {state.isTranslateLoading && (
              <ul className="wave-menu">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            )}
            <textarea value={state.translatedText} disabled />
          </div>
        </div>

        {/* Alt Kısım */}
        <button
          onClick={() =>
            dispatch(translateText({ sourceLang, targetLang, text }))
          }
        >
          Çevir
        </button>
      </div>
    </div>
  );
};

export default App;
