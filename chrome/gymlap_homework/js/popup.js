$(document).ready(function() {

  /*
   *
   * PRELOADER
   *
   */

  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    loadingTime: false
  }, function(storage) {
    preload(storage.loadFromWebsite, storage.loadingTime);
  });

  function preload(loadFromWebsite, loadingTime) {
    $("#loader").hide();
    $("#main").hide();
    $("#after-submit").hide();

    loadPageData(loadFromWebsite);

    if (loadingTime) {
      $("#loader").delay(500).fadeIn().delay(1000).fadeOut();
      $("#main").delay(2000).fadeIn();
    } else {
      $("#main").fadeIn();
    }
  }

  function loadPageData(loadFromWebsite) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "load"
      }, function(response) {
        //Check ob Response valid ist
        if (!response) response = {
          success: false
        };

        if (response.success && loadFromWebsite) {
          //Website angepasste Initialisierung
          updateCheckbox(checkbox_oberstufe_id, response.oberstufe);
          if (response.oberstufe) {
            //Oberstufe
            updateDropdown(dropdown_fach_id, kursToFach(response.klasse, response.kurs), false, loadFaecher(response.klasse));
            updateDropdown(dropdown_klasse_id, response.klasse, false, oberstufe);
            updateDropdown(dropdown_stufe_id, response.kurs, false, []);
          } else {
            //Unterstufe
            updateDropdown(dropdown_fach_id, "Fach", true, loadFaecher("5")); //TODO: replace "5" with response.klasse
            updateDropdown(dropdown_klasse_id, response.klasse, false, unterstufe);
            updateDropdown(dropdown_stufe_id, "Stufe", true, unterstufe_stufen);
          }

        } else {
          //Standard Initialisierung
          updateCheckbox(checkbox_oberstufe_id, false);
          updateDropdown(dropdown_fach_id, "Fach", true, faecher.unterstufe);
          updateDropdown(dropdown_klasse_id, "Klasse", true, unterstufe);
          updateDropdown(dropdown_stufe_id, "Stufe", true, unterstufe_stufen);
        }

      });
    });
  }

  function finish(data) {
    $("#loader").hide();
    $("#main").hide();

    $("#loader").delay(500).fadeIn();
    //$("#loader").delay(500).fadeIn().delay(1000).fadeOut();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $("#after-submit").append("<h5 class='center-align'>" + "- Daten erfolgreich gespeichert -" + "</h5>");
        $("#after-submit").append("<h6 class='center-align'>Response: </br>" + xhttp.responseText + "</h6>");

        $("#loader").delay(500).fadeOut();
        $("#after-submit").delay(1000).fadeIn();
      }
    };

    var url = `http://api.lakinator.bplaced.net/request.php?fach=${data.fach}&klasse=${data.klasse}&stufe=${data.stufe}&date=${data.date}&text=${data.text}`;

    xhttp.open("GET", url, true);
    xhttp.send();

  }

  /*
   *
   * BUTTON SEND
   *
   */

  var btn = document.getElementById("submit-btn");
  btn.addEventListener("click", function() {
    //TODO Daten schicken (wohin?)
    var d_fach = $(dropdown_fach_id).val();
    var d_klasse = $(dropdown_klasse_id).val();
    var d_stufe = $(dropdown_stufe_id).val();

    //var d_date = $('.datepicker').val();
    var year = $('.datepicker').pickadate('picker').get('highlight', 'yyyy');
    var month = $('.datepicker').pickadate('picker').get('highlight', 'mm');
    month -= 1; //JS zählt Monate von 0 nach 11
    var day = $('.datepicker').pickadate('picker').get('highlight', 'dd');

    var d_date = new Date(year, month, day).getTime();
    var d_text = $("#textarea1").val();


    var d_array = ["Fach: " + d_fach, "Klasse: " + d_klasse, "Stufe/Kurs: " + d_stufe, "Abgabedatum: " + d_date, "Hausi: " + d_text];

    finish({
      fach: d_fach,
      klasse: d_klasse,
      stufe: d_stufe,
      date: d_date,
      text: d_text
    });
  });

  /*
   *
   * DATEPICKER
   *
   */

  var $input = $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 6,
    today: 'Heute',
    clear: 'Loeschen',
    close: 'Ok',
    format: 'dddd, dd mmmm yyyy',
    monthsFull: ['Januar', 'Februar', 'M\u00E4rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'M\u00E4rz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    weekdaysLetter: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    closeOnSelect: false
  });

  var picker = $input.pickadate('picker');
  picker.set('select', new Date());

  /*
   *
   * DROPDOWNS
   *
   */

  $('select').material_select();
  $('select').on('contentChanged', function() {
    // re-initialize (update)
    $(this).material_select();
  });

  //TODO Schuldaten anders laden und vervollständigen/anpassen
  //http://www.utf8-zeichentabelle.de/

  var faecher = {
    unterstufe: ["Biologie", "Chemie", "Deutsch", "Englisch", "Franz\u00f6sisch",
      "Geographie", "Geschichte", "Informatik", "Italienisch", "Kunst", "Latein",
      "Mathe", "Musik", "Physik", "Religion", "Ethik", "Sozialkunde", "Spanisch", "Sport", "Wirtschaft"
    ],
    q11: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik"],
    q12: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik"]
  }
  var unterstufe = ["5", "6", "7", "8", "9", "10"];
  var unterstufe_stufen = ["a", "b", "c", "d"];
  var oberstufe = ["11", "12"];
  var oberstufe_kurse = {
    q11: {
      Deutsch: ["1d1", "1d2", "1d3", "1d4"],
      Englisch: ["1e1", "1e2", "1e3", "1e4"],
      Mathe: ["1m1", "1m2", "1m3", "1m4"],
      Physik: ["1ph1", "1ph2"],
      Informatik: ["1inf0"],
      Sozialkunde: ["1sk1", "1sk2"]
    },
    q12: {
      Deutsch: ["1d1", "1d2"],
      Englisch: ["1e1", "1e2"],
      Mathe: ["1m1", "1m2"],
      Physik: ["1ph1", "1ph2"]
    }
  };

  var checkbox_oberstufe_id = "#oberstufe-box";
  var dropdown_fach_id = "#select_fach";
  var dropdown_klasse_id = "#select_klasse";
  var dropdown_stufe_id = "#select_stufe";

  //
  //Fach Dropdown
  //

  $(dropdown_fach_id).on("change", function() {
    var fa = $(this).val();
    var isOb = $(checkbox_oberstufe_id).prop("checked");
    var kl = $(dropdown_klasse_id).val();
    var st = $(dropdown_stufe_id).val();

    if (isOb) {
      //Oberstufe ist ausgewählt
      if (kl == "11") {
        updateDropdown(dropdown_stufe_id, "Kurs", true, loadKurse("11", fa));
      } else if (kl == "12") {
        updateDropdown(dropdown_stufe_id, "Kurs", true, loadKurse("12", fa));
      } else {
        //Keine Klasse ausgewählt -> Kurs Dropdown wird leer gemacht
        updateDropdown(dropdown_stufe_id, "Kurs", true, []);
      }
    } else {
      //Unterstufe ist ausgewählt
    }

  });

  //
  //Checkbox
  //

  $(checkbox_oberstufe_id).on("change", function() {
    var fa = $(dropdown_fach_id).val();
    var isOb = $(this).prop("checked");
    var kl = $(dropdown_klasse_id).val();
    var st = $(dropdown_stufe_id).val();

    if (isOb) {
      //Oberstufe ist ausgewählt
      //Alle Dropdowns updaten
      updateDropdown(dropdown_fach_id, "Fach", true, []);
      updateDropdown(dropdown_klasse_id, "Klasse", true, oberstufe);
      updateDropdown(dropdown_stufe_id, "Kurs", true, []);
    } else {
      //Unterstufe ist ausgewählt
      //Alle Dropdowns updaten
      updateDropdown(dropdown_fach_id, "Fach", true, loadFaecher("5")); //TODO: replace with response.klasse
      updateDropdown(dropdown_klasse_id, "Klasse", true, unterstufe);
      updateDropdown(dropdown_stufe_id, "Stufe", true, unterstufe_stufen);
    }
  });

  //
  //Klasse Dropdown
  //

  $(dropdown_klasse_id).on("change", function() {
    var fa = $(dropdown_fach_id).val();
    var isOb = $(checkbox_oberstufe_id).prop("checked");
    var kl = $(this).val();
    var st = $(dropdown_stufe_id).val();

    //Anhand der gewählten Klasse alles updaten
    if (kl == "11") {
      //Checkbox ändern
      updateCheckbox(checkbox_oberstufe_id, true);
      //Kurse zum gewählten Fach suchen und updaten
      updateDropdown(dropdown_stufe_id, "Kurs", true, loadKurse("11", fa));
      updateDropdown(dropdown_fach_id, "Fach", true, loadFaecher("11")); // Updaten der jeweiligen Fächer
    } else if (kl == "12") {
      //Checkbox ändern
      updateCheckbox(checkbox_oberstufe_id, true);
      //Kurse zum gewählten Fach suchen und updaten
      updateDropdown(dropdown_stufe_id, "Kurs", true, loadKurse("12", fa));
      updateDropdown(dropdown_fach_id, "Fach", true, loadFaecher("12")); // Updaten der jeweiligen Fächer
    } else {
      //nix
    }
  });


  /*
   *
   * Options Page
   *
   */

  $("#settings-link").on("click", function() {
    chrome.tabs.create({
      url: "options.html"
    });
    //chrome.runtime.openOptionsPage();
  });




  //Muss hier drin sein wegen lokalen Variablen
  //TODO: Ändern
  function kursToFach(kl, ku) {
    var arr_kurse = [];
    var arr_names = [];
    var result = "FACH_NOT_FOUND";

    if (kl == "11") {
      arr_kurse = oberstufe_kurse.q11;
    } else if (kl == "12") {
      arr_kurse = oberstufe_kurse.q12;
    }
    arr_names = Object.getOwnPropertyNames(arr_kurse);

    for (var i = 0; i < arr_names.length; i++) {
      if (arr_kurse[arr_names[i]].includes(ku)) {
        result = arr_names[i];
        break;
      }
    }

    return result;
  }


  function loadFaecher(klasse) {
    var f = [];

    if (klasse == "11") {
      f = faecher.q11;
    } else if (klasse == "12") {
      f = faecher.q12;
    } else {
      f = faecher.unterstufe;
    }

    return f;
  }


  function loadKurse(klasse, fach) {
    var kurse = [];

    if (fach == undefined) {
      if (klasse == "11") kurse = oberstufe_kurse.q11;
      else if (klasse == "12") kurse = oberstufe_kurse.q12;
    } else {
      if (klasse == "11") {
        kurse = oberstufe_kurse.q11[fach];
        kurse = kurse != undefined ? kurse : []; // Falls Fach nicht vorhanden ist es leer
      } else if (klasse == "12") {
        kurse = oberstufe_kurse.q12[fach];
        kurse = kurse != undefined ? kurse : []; // Falls Fach nicht vorhanden ist es leer
      }
    }

    return kurse;
  }
});


function updateCheckbox(boxid, value) {
  var $checkbox = $(boxid);
  var val = $checkbox.val();

  //Nur updaten wenn der Wert anders ist
  if (val != value) $checkbox.prop("checked", value);
}


function updateDropdown(dropdownid, active, disabled, array) {
  // clear contents
  var $selectDropdown = $(dropdownid).empty().html(' ');

  // add new value
  var value = active;
  var d = disabled ? "disabled" : "";

  $selectDropdown.append($("<option " + d + " selected></option>").attr("value", value).text(value));
  for (var i = 0; i < array.length; i++) {
    if (array[i] != active) {
      value = array[i];
      $selectDropdown.append($("<option></option>").attr("value", value).text(value));
    }
  }

  // trigger event
  $selectDropdown.trigger("contentChanged");
}









/**/
