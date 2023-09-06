document.addEventListener("deviceready", languagePage);

function languagePage() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );

  //returns profile id
  function getProfileIdFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};
    params.id = urlParams.get("id");
    params.pic = urlParams.get("pic");
    return params;
  }

  //home button
  var homeBtn = document.getElementById("backToHomeBtn");
  homeBtn.addEventListener("click", handlebackToHomeBtnClick);

  function handlebackToHomeBtnClick(event) {
    var profile = getProfileIdFromURL();
    console.log(profile);
    window.location.href = `home.html?id=${profile.id}&pic=${profile.pic}`;
  }

  // referencing language buttons from html
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
