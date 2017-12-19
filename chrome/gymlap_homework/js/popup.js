$(document).ready(function() {

  /*
   *
   * PRELOADER
   *
   */

  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    manualTime: false,
    loadingTime: false
  }, function(storage) {
    preload(storage.loadFromWebsite, storage.loadingTime, storage.manualTime);
  });

  function preload(loadFromWebsite, loadingTime, manualTime) {
    $("#loader").hide();
    $("#main").hide();
    $("#after-submit").hide();

    loadPageData(loadFromWebsite);

    if (manualTime) {
      //Standard im HTML
    } else {
      //Timepicker entfernen
      $("#form_timepicker1").hide();
      $("#form_datepicker1").removeClass("s6").addClass("s12");
    }

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

    $.get("http://api.lakinator.bplaced.net/request.php", {
      fach: "" + data.fach,
      klasse: "" + data.klasse,
      stufe: "" + data.stufe,
      date: "" + data.date,
      text: "" + data.text
    }, function(data, status, xhr) {
      if (status == "success") {
        $("#after-submit").append("<h5 class='center-align'>" + "- Daten erfolgreich gespeichert -" + "</h5>");
        $("#after-submit").append("<h6 class='center-align'>Response: </br>" + data + "</h6>");

        $("#loader").delay(500).fadeOut();
        $("#after-submit").delay(1000).fadeIn();
      } else {
        $("#after-submit").append("<h5 class='center-align'>" + "- Error: " + status + " -" + "</h5>");

        $("#loader").delay(500).fadeOut();
        $("#after-submit").delay(1000).fadeIn();
      }
    });

  }

  /*
   *
   * BUTTON SEND
   *
   * Function to use timestamp (d_date) in JAVA:
   *
   * public String longToDate(Long l) {
   *    java.util.Calendar c = java.util.Calendar.getInstance();
   *    c.setTime(new java.util.Date(l));
   *    return String.format("%s.%s.%s %s:%s",
   *            c.get(Calendar.DATE),
   *            (c.get(Calendar.MONTH) + 1),
   *            c.get(Calendar.YEAR),
   *            c.get(Calendar.HOUR_OF_DAY),
   *            c.get(Calendar.MINUTE)
   *    );
   *  }
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

    var temp_val = $("#timepicker1").val();
    var hours = temp_val[0] + temp_val[1];
    var minutes = temp_val[3] + temp_val[4];

    var d_date = new Date(year, month, day, hours, minutes).getTime();

    var d_text = $("#textarea1").val();

    // !Debug!
    // var d_array = ["Fach: " + d_fach, "Klasse: " + d_klasse, "Stufe/Kurs: " + d_stufe, "Abgabedatum: " + d_date, "Hausi: " + d_text];
    // console.log(d_array);

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

  var $datepicker = $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 6,
    today: 'Heute',
    clear: 'Löschen',
    close: 'Ok',
    format: 'dddd, dd mmmm yyyy',
    monthsFull: ['Januar', 'Februar', 'M\u00E4rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'M\u00E4rz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    weekdaysLetter: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    closeOnSelect: false
  });

  var date_picker = $datepicker.pickadate('picker');
  date_picker.set('select', new Date());

  /*
   *
   * Timepicker
   *
   */

  var $timepicker = $('.timepicker').pickatime({
    default: 'now',
    fromnow: 0,
    twelvehour: false,
    donetext: 'OK',
    cleartext: 'Löschen',
    canceltext: 'Zurück',
    autoclose: false,
    ampmclickable: true
  });

  $timepicker.val("16:00"); //Default value

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
    unterstufe: ["Biologie", "Chemie", "Deutsch", "Englisch", "Französisch",
      "Geographie", "Geschichte", "Informatik", "Italienisch", "Kunst", "Latein",
      "Mathe", "Musik", "Physik", "Katholisch", "Evangelisch", "Ethik", "Sozialkunde", "Spanisch", "Sport", "Wirtschaft"
    ],
    q11: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik", "Geschichte", "Biologie", "Geographie", "Wirtschaft", "Französisch", "Sozialkunde", "Chemie", "Italienisch", "Latein", "Katholisch", "Evangelisch", "Ethik"],
    q12: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik"]
  }
  var unterstufe = ["5", "6", "7", "8", "9", "10"];
  var unterstufe_stufen = ["a", "b", "c", "d"];
  var oberstufe = ["11", "12"];
  var oberstufe_kurse = {
    q11: {
      Geschichte: ["1g1", "1g2", "1g3", "1g4"],
      Biologie: ["1b2", "1b2"],
      Geographie: ["1geo1", "1geo2"],
      Wirtschaft: ["1wr1", "1wr2", "1wr3"],
      Französisch: ["3f0"],
      Deutsch: ["1d1", "1d2", "1d3", "1d4"],
      Englisch: ["1e1", "1e2", "1e3", "1e4"],
      Mathe: ["1m1", "1m2", "1m3", "1m4"],
      Physik: ["1ph1", "1ph2"],
      Informatik: ["1inf0"],
      Sozialkunde: ["1sk1", "1sk2", "1sk3", "1sk4"],
      Chemie: ["1ch1", "1ch2"],
      Italienisch: ["1it0"],
      Latein: ["1l0"],
      Katholisch: ["1k1", "1k2", "1k3"],
      Evangelisch: ["1ev0"],
      Ethik: ["1eth0"]
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
    window.close(); //Sicherheitshalber
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

  $selectDropdown.prop("disabled", array.length == 0);

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
