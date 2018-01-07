chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch (message.type) {
      case "load":
        var status = "";

        //Seite genau überprüfen ob verwertbare Daten drauf sind
        //TODO: WebUntis Pattern an Lehrer anpassen -> https://neilo.webuntis.com/WebUntis/?school=Gymlap#classregpage?ttid=199497
        var single_class_pattern = new RegExp("[a-zA-Z]*:\/\/neilo\.webuntis\.com\/WebUntis\/\?school=Gymlap#classregpage\?ttid=[0-9]*");
        //Listview WebUntis Seite von allen Klassen des Tages -> TODO genauen Link herausfinden
        var multiple_class_pattern = new RegExp("[a-zA-Z]*:\/\/neilo\.webuntis\.com\/WebUntis\/\?school=Gymlap#classregpage\?ttid=[0-9]*");

        //!Debug!
        var testPattern = new RegExp("file:\/\/\/C:\/Users\/Schalk\/Desktop\/webuntis\.html");
        single_class_pattern = testPattern;
        //!Debug!

        if (single_class_pattern.test(window.location.href)) {
          status = "single";
          var fach = "";
          var oberstufe = false;
          var klasse = "";
          var kurs = "";
          var lehrer = "";

          //Klasse: $(".hiddenBox .foo table tbody tr:eq(0) td:eq(2)")
          //Lehrer: $(".hiddenBox .foo table tbody tr:eq(1) td:eq(2)")
          //Kurs/Fach: $(".hiddenBox .foo table tbody tr:eq(2) td:eq(2)")

          var klasseFull = $(".hiddenBox .foo table tbody tr:eq(0) td:eq(2)").text();
          kurs = $(".hiddenBox .foo table tbody tr:eq(2) td:eq(2)").text();

          //TODO Ober- oder Unterstufe?
          fach = $(".hiddenBox .foo table tbody tr:eq(2) td:eq(2)").text();

          //Klasse bekommen
          klasse = klasseFull.replace(/[^0-9]/g, '');

          //Oberstufe oder Unterstufe herausfinden
          oberstufe = klasse >= 11;

          //TODO Kurs bekommen (oder, falls vorhanden, die Klassenstufe)
          if (!oberstufe) var kurs = klasseFull.replace(/[0-9]/g, '');
          else kurs = "1e4";

          //Lehrer
          lehrer = $(".hiddenBox .foo table tbody tr:eq(1) td:eq(2)").text();

          //Response senden
          sendResponse({
            lehrer: lehrer,
            status: status,
            fach: fach,
            oberstufe: oberstufe,
            klasse: klasse,
            kurs: kurs
          });

        } else if (multiple_class_pattern.test(window.location.href)) {
          status = "multiple";
          var lehrer = "";
          var faecher = {
            unterstufe: [],
            q11: [],
            q12: []
          };
          var klassen = {
            unterstufe: [],
            oberstufe: []
          };
          var stufen = {

          };
          var kurse = {
            q11: {

            },
            q12: {

            }
          };

          /*  //Debug test
             var faecher = {
               unterstufe: ["Deutsch", "Englisch"],
               q11: ["Physik", "Englisch"],
               q12: []
             };
             var klassen = {
               unterstufe: ["9", "10"],
               oberstufe: ["11"]
             };
             var stufen = {
               Deutsch: ["a", "c"],
               Englisch: ["b", "c", "d"]
             };
             var kurse = {
               q11: {
                 Physik: ["1ph1"],
                 Englisch: ["1e1", "1e4"]
               },
               q12: {

               }
             };*/

          //TODO Daten von der Seite holen

          //For-Schleife über alle container und dann daten rauslesen!

          //Response senden
          sendResponse({
            lehrer: lehrer,
            status: status,
            faecher: faecher,
            klassen: klassen,
            stufen: stufen,
            kurse: kurse
          });

        } else {
          status = "error";

          //Response senden
          sendResponse({
            status: status
          });
        }

        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);
