$(document).ready(function() {

  /*
   *
   * PRELOADER
   *
   */

  initialize(); //init.js

  function finish(data) {
    Navigation.showEdit(false);
    Navigation.showView(false);
    Navigation.showChooseForm(false);
    Navigation.showHeadline(false);
    Navigation.showLoader(true);

    $.get("http://api.lakinator.bplaced.net/request.php", {
      fach: "" + encodeURIComponent(data.fach),
      klasse: "" + encodeURIComponent(data.klasse),
      stufe: "" + encodeURIComponent(data.stufe),
      type: "" + encodeURIComponent(data.type),
      date: "" + encodeURIComponent(data.date),
      text: "" + encodeURIComponent(data.text),
      key: "917342346673"
    }, function(data, status, xhr) {
      if (status == "success") {
        console.log(data);

        if (data.success == "true") {

          function reloadOnEdit() {
            $("#homework_submit").empty();

            function onSuccess(data) {
              $("#homework_submit").append("<h5 style='margin-bottom:30px' class='center-align'>" + "- Daten erfolgreich gespeichert für " + decodeURIComponent(data[0].klasse) + " " + decodeURIComponent(data[0].stufe) + " in " + decodeURIComponent(data[0].fach) + " -" + "</h5>");

              SQLHandler.generateSQLList("#homework_submit", data, true, function() {
                reloadOnEdit(); //Daten aktualisieren
              });

              Navigation.showLoader(false);
              Navigation.showSubmit(true);
            }

            function onError(error) {
              $("#homework_submit").append("<h6>" + error + "</h6>");

              Navigation.showLoader(false);
              Navigation.showSubmit(true);
            }

            SQLHandler.getSQLData($(dropdown_fach_id).val(), $(dropdown_klasse_id).val(), $(dropdown_stufe_id).val(), onSuccess, onError);

            //Updaten vom collapsible
            $('.collapsible').collapsible();
          }

          reloadOnEdit();

        } else {
          $("#homework_submit").append("<h5 class='center-align'>" + "- Datenspeicherung fehlgeschlagen -" + "</h5>");
          $("#homework_submit").append("<p class='center-align'>" + "- " + data.error + " -" + "</p>");
        }

        Navigation.showLoader(false);
        Navigation.showSubmit(true);
      } else {
        //Connection Error
        $("#homework_submit").append("<h5 class='center-align'>" + "- Error: " + status + " -" + "</h5>");

        Navigation.showLoader(false);
        Navigation.showSubmit(true);
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

  $("#submit-btn").on("click", function() {

    //Data Validation für alle

    var d_fach = $(dropdown_fach_id).val();
    if (d_fach == null) {
      Navigation.showMessage("Fach nicht angegeben!");
      return;
    }

    var d_klasse = $(dropdown_klasse_id).val();
    if (d_klasse == null) {
      Navigation.showMessage("Klasse nicht angegeben!");
      return;
    }

    var d_stufe = $(dropdown_stufe_id).val();
    if (d_stufe == null) {
      Navigation.showMessage("Stufe nicht angegeben!");
      return;
    }

    var d_type = $(dropdown_abgabe_id).val();

    if (d_type == "DATE") {
      var year = $('.datepicker').pickadate('picker').get('highlight', 'yyyy');
      var month = $('.datepicker').pickadate('picker').get('highlight', 'mm');
      month -= 1; //JS zählt Monate von 0 nach 11
      var day = $('.datepicker').pickadate('picker').get('highlight', 'dd');

      d_date = new Date(year, month, day, 8).getTime();

    } else {
      d_date = new Date().getTime();
    }

    var d_text = $("#textarea1").val();
    if (d_text == "") {
      Navigation.showMessage("Kein Text angegeben!");
      return;
    }

    // !Debug!
    //var d_array = ["Fach: " + d_fach, "Klasse: " + d_klasse, "Stufe/Kurs: " + d_stufe, "Typ: " + d_type, "Timestamp/Datum: " + d_date, "Text: " + d_text];
    //console.log(d_array);

    finish({
      fach: d_fach,
      klasse: d_klasse,
      stufe: d_stufe,
      type: d_type,
      date: d_date,
      text: d_text
    });
  });

  /*
   *
   * DATEPICKER
   *
   */

  $('.datepicker').pickadate({
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

  $('.datepicker').pickadate('picker').set('select', new Date());

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

  //Character counter

  $("#textarea1").characterCounter();

  //Collapsible

  $('.collapsible').collapsible();

  //
  //Fach Dropdown
  //

  $(dropdown_fach_id).on("change", function() {
    var fa = $(this).val();
    var isOb = $(checkbox_oberstufe_id).prop("checked");
    var kl = $(dropdown_klasse_id).val();
    var st = $(dropdown_stufe_id).val();

    if ($(homework_view).css("display") == "block") {
      $("#booklist-link").click(); //Daten aktualisieren
    }

    if (isOb) {
      //Oberstufe ist ausgewählt
      if (kl == "11" || kl == "12") {
        updateDropdown(dropdown_stufe_id, "Kurs", true, global_loaded_values.kurse["q" + kl][fa]);
      } else {
        //Keine Klasse ausgewählt -> Kurs Dropdown wird leer gemacht
        updateDropdown(dropdown_stufe_id, "Kurs", true, []);
      }
    } else {
      //Unterstufe ist ausgewählt
      updateDropdown(dropdown_stufe_id, "Stufe", true, global_loaded_values.stufen[fa]);
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

    if ($(homework_view).css("display") == "block") {
      $("#booklist-link").click(); //Daten aktualisieren
    }

    if (global_loaded_values.type == "single") {
      //So lassen wie es war
      updateCheckbox(checkbox_oberstufe_id, (!isOb));
    } else if (global_loaded_values.type == "multiple") {
      if (isOb) {
        //Oberstufe ist ausgewählt
        //Alle Dropdowns updaten
        updateDropdown(dropdown_fach_id, "Fach", true, []);
        updateDropdown(dropdown_klasse_id, "Klasse", true, global_loaded_values.klassen.oberstufe);
        updateDropdown(dropdown_stufe_id, "Kurs", true, []);
      } else {
        //Unterstufe ist ausgewählt
        //Alle Dropdowns updaten
        updateDropdown(dropdown_fach_id, "Fach", true, global_loaded_values.faecher.unterstufe);
        updateDropdown(dropdown_klasse_id, "Klasse", true, global_loaded_values.klassen.unterstufe);
        updateDropdown(dropdown_stufe_id, "Stufe", true, []);
      }
    } else if (global_loaded_values.type == "error") {
      
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
    if (kl == "11" || kl == "12") {
      //Checkbox ändern
      updateCheckbox(checkbox_oberstufe_id, true);
      updateDropdown(dropdown_fach_id, "Fach", true, global_loaded_values.faecher["q" + kl]); // Updaten der jeweiligen Fächer
      if (fa != null) updateDropdown(dropdown_stufe_id, "Kurs", true, global_loaded_values.kurse["q" + kl][fa]); //Kurse zum gewählten Fach suchen und updaten
    } else {
      //nix
    }

    if ($(homework_view).css("display") == "block") {
      $("#booklist-link").click(); //Daten aktualisieren
    }
  });

  //
  //Stufe Dropdown
  //

  $(dropdown_stufe_id).on("change", function() {
    var fa = $(dropdown_fach_id).val();
    var isOb = $(checkbox_oberstufe_id).prop("checked");
    var kl = $(dropdown_klasse_id).val();
    var st = $(this).val();

    if ($(homework_view).css("display") == "block") {
      $("#booklist-link").click(); //Daten aktualisieren
    }
  });

  //
  //Date Dropdown
  //

  $(dropdown_abgabe_id).on("change", function() {

    if ($(this).val() == "DATE") {
      $("#datepicker1").prop("disabled", false);
    } else {
      $("#datepicker1").prop("disabled", true);
    }

  });

  /*
   *
   * Navbar Buttons
   *
   */

  $("#home-link").on("click", function() {
    $("#headline").text("Hausaufgaben hier eintragen");
    Navigation.showAll(false);
    Navigation.showHeadline(true);
    Navigation.showEdit(true);
    Navigation.showChooseForm(true);
  });

  $("#booklist-link").on("click", function() {
    $("#headline").text("Hausaufgaben hier ansehen");
    Navigation.showAll(false);
    Navigation.showHeadline(true);
    Navigation.showChooseForm(true);
    Navigation.showView(true);

    $("#homework_view").empty();

    function onSuccess(data) {
      SQLHandler.generateSQLList("#homework_view", data, false, function() {
        $("#booklist-link").click(); //Daten aktualisieren
      });
    }

    function onError(error) {
      $("#homework_view").append("<h6>" + error + "</h6>");
    }

    SQLHandler.getSQLData($(dropdown_fach_id).val(), $(dropdown_klasse_id).val(), $(dropdown_stufe_id).val(), onSuccess, onError);

  });

  $("#fullscreen-link").on("click", function() {
    chrome.tabs.create({
      url: "popup.html"
    });
    window.close(); //Sicherheitshalber
  });

  $("#settings-link").on("click", function() {
    chrome.tabs.create({
      url: "options.html"
    });
    window.close(); //Sicherheitshalber
    //chrome.runtime.openOptionsPage();
  });

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
