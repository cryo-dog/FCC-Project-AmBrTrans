
const translateHandler = async () => {
  const textArea = document.getElementById("text-input");
  const localeArea = document.getElementById("locale-select");
  const errorArea = document.getElementById("error-msg");
  const translatedArea = document.getElementById("translated-sentence");
  
  const stuff = {"text": textArea.value, "locale": localeArea.value};
  errorArea.innerText = "";
  translatedArea.innerText = "";

  const data = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  });

  const parsed = await data.json();
  if (parsed.error) {
    errorArea.innerText = JSON.stringify(parsed);
    return;
  }

  // TR text
  //const keyword = "usually";
  //const highlightedText = parsed.translation.replaceAll(keyword, `<span class="highlight">${keyword}</span>`); 


  // Org. code 
  //translatedArea.innerHTML = highlightedText;
  
  // TR text ende
  // org Code: 
  translatedArea.innerHTML = parsed.translation;

  return;
};

document.getElementById("translate-btn").addEventListener("click", translateHandler)
