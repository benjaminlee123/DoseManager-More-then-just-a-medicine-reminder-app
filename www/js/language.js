document.addEventListener("deviceready", languagePage);

function languagePage() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );

  // referencing buttons from html
  const englishBtn = document.getElementById("engButton");
  const chineseBtn = document.getElementById("chiButton");
  const malayBtn = document.getElementById("malayButton");
  const tamilBtn = document.getElementById("tamilButton");

  //referencing google widget
  var languageSelect = document.getElementById("google_translate_element");

  // adding event listeners to each button
  englishBtn.addEventListener("click", function () {
    languageSelect.querySelector(".goog-te-combo").value = "en";
    //Trigger translation
    languageSelect
      .querySelector(".goog-te-combo")
      .dispatchEvent(new Event("change"));
  });
  chineseBtn.addEventListener("click", function () {
    languageSelect.querySelector(".goog-te-combo").value = "zh-CN";
    //Trigger translation
    languageSelect
      .querySelector(".goog-te-combo")
      .dispatchEvent(new Event("change"));
  });
  malayBtn.addEventListener("click", function () {
    languageSelect.querySelector(".goog-te-combo").value = "ms";
    //Trigger translation
    languageSelect
      .querySelector(".goog-te-combo")
      .dispatchEvent(new Event("change"));
  });
  tamilBtn.addEventListener("click", function () {
    languageSelect.querySelector(".goog-te-combo").value = "ta";
    //Trigger translation
    languageSelect
      .querySelector(".goog-te-combo")
      .dispatchEvent(new Event("change"));
  });
}
