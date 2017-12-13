chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch (message.type) {
      case "load":
        var success = false;
        var oberstufe = false;
        var klasse = "";
        var kurs = "";

        //Seite genau überprüfen ob verwertbare Daten drauf sind
        //TODO: WebUntis Pattern an Lehrer anpassen
        var pattern = new RegExp("[a-zA-Z]*:\/\/neilo\.webuntis\.com\/WebUntis\/#\/basic\/main");
        if (pattern.test(window.location.href)) {
          success = true;

          //TODO: Oberstufe oder Unterstufe herausfinden
          oberstufe = true;

          //TODO: Klasse bekommen
          klasse = "11";

          //Kurs bekommen (oder, falls vorhanden, die Klassenstufe)
          var kurs = document.getElementsByTagName("tr")[1].cells[4].innerHTML;
        }

        //Response senden
        sendResponse({
          success: success,
          oberstufe: oberstufe,
          klasse: klasse,
          kurs: kurs
        });

        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);
