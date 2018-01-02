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
      fach: "" + data.fach,
      klasse: "" + data.klasse,
      stufe: "" + data.stufe,
      type: "" + data.type,
      date: "" + data.date,
      text: "" + data.text,
      key: "917342346673"
    }, function(data, status, xhr) {
      if (status == "success") {
        console.log(data);

        if (data.success == "true") {
          $("#homework_submit").append("<h5 class='center-align'>" + "- Daten erfolgreich gespeichert für " + data.data.klasse + " " + data.data.stufe + " in " + data.data.fach + " -" + "</h5>");

          $("#homework_submit").append("<ul id='saved_listview' class='collapsible' data-collapsible='expandable'></ul>");

          var d = new Date(Number.parseInt(data.data.date));
          var datestring = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();

          var head = "";
          if (data.data.type == "NEXT") {
            head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Nächste Stunde";
          } else if (data.data.type == "NEXT2") {
            head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Übernächste Stunde";
          } else if (data.data.type == "DATE") {
            head = "Hausaufgabe/Notiz für <span style='color:red'>" + datestring + "</span>";
          }

          $("#saved_listview").append("<li> <div class='collapsible-header active'><h6>" + head + "</h6></div> <div class='collapsible-body'> <div class='row'>   <div class='col s10'><span><h6>" + data.data.text + "</h6></span></div> <div class='col s2'><a class='btn-floating waves-effect waves-light red'><i id='del-btn." + data.data.id + "' class='material-icons'>delete</i></a></div> </div> </div> </li>");

          //Delete button
          var v = "del-btn." + data.data.id;

          document.getElementById(v).addEventListener("click", function(event) {
            var innerID = event.target.id.split(".")[1];
            deleteSQLData(innerID);
          });

          //Updaten vom collapsible
          $('.collapsible').collapsible();
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
      getSQLData(fa, kl, st);
    }

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

    if ($(homework_view).css("display") == "block") {
      getSQLData(null, "11", null);
    }

    if (isOb) {
      //Oberstufe ist ausgewählt
      //Alle Dropdowns updaten
      updateDropdown(dropdown_fach_id, "Fach", true, []);
      updateDropdown(dropdown_klasse_id, "Klasse", true, oberstufe);
      updateDropdown(dropdown_stufe_id, "Kurs", true, []);
    } else {
      //Unterstufe ist ausgewählt
      //Alle Dropdowns updaten
      updateDropdown(dropdown_fach_id, "Fach", true, getFaecher("5")); //TODO: replace with response.klasse -> global_loaded_values
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
      updateDropdown(dropdown_fach_id, "Fach", true, getFaecher("11")); // Updaten der jeweiligen Fächer
    } else if (kl == "12") {
      //Checkbox ändern
      updateCheckbox(checkbox_oberstufe_id, true);
      //Kurse zum gewählten Fach suchen und updaten
      updateDropdown(dropdown_stufe_id, "Kurs", true, loadKurse("12", fa));
      updateDropdown(dropdown_fach_id, "Fach", true, getFaecher("12")); // Updaten der jeweiligen Fächer
    } else {
      //nix
    }

    if ($(homework_view).css("display") == "block") {
      getSQLData(fa, kl, st);
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
      getSQLData(fa, kl, st);
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

    getSQLData($(dropdown_fach_id).val(), $(dropdown_klasse_id).val(), $(dropdown_stufe_id).val());
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


function getSQLData(fach, klasse, stufe) {

  Navigation.showLoader(true);

  $.get("http://api.lakinator.bplaced.net/request.php", {
    fach: "" + fach,
    klasse: "" + klasse,
    stufe: "" + stufe,
    key: "917342346673"
  }, function(data, status, xhr) {
    if (status == "success") {
      console.log(data);

      $("#homework_view").empty();

      if (data.success == "true") {

        if (data.data.length == 0) {
          $("#homework_view").append("<h6>Nichts gefunden</h6>");
        } else {
          $("#homework_view").append("<ul id='homework_listview' class='collapsible' data-collapsible='expandable'></ul>");
          for (var i = 0; i < data.data.length; i++) {
            var d = new Date(Number.parseInt(data.data[i].date));
            var datestring = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();

            var head = "";
            if (data.data[i].type == "NEXT") {
              head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Nächste Stunde";
            } else if (data.data[i].type == "NEXT2") {
              head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Übernächste Stunde";
            } else if (data.data[i].type == "DATE") {
              head = "Hausaufgabe/Notiz für <span style='color:red'>" + datestring + "</span>";
            }

            $("#homework_listview").append("<li> <div class='collapsible-header'><h6>" + head + "</h6></div> <div class='collapsible-body'> <div class='row'>   <div class='col s10'><span><h6>" + data.data[i].text + "</h6></span></div> <div class='col s2'><a class='btn-floating waves-effect waves-light red'><i id='del-btn." + data.data[i].id + "' class='material-icons'>delete</i></a></div> </div> </div> </li>");

            //Delete button
            var v = "del-btn." + data.data[i].id;

            document.getElementById(v).addEventListener("click", function(event) {
              var innerID = event.target.id.split(".")[1];
              deleteSQLData(innerID);
            });
          }

          //Updaten vom collapsible
          $('.collapsible').collapsible();
        }

      } else {
        $("#homework_view").append("<h6>Ein Fehler ist aufgetreten</h6>");
      }

    } else {
      //Connection Error
      $("#homework_view").append("<h6>Verbindung fehlgeschlagen</h6>");
    }

    Navigation.showLoader(false);
  });
}


function deleteSQLData(sql_id) {
  Navigation.showLoader(true);

  $.get("http://api.lakinator.bplaced.net/request.php", {
    id: "" + sql_id,
    key: "917342346673"
  }, function(data, status, xhr) {
    console.log(data);


    Navigation.showLoader(false);
    if (data.success == "true") {
      $("#booklist-link").click(); //Daten aktualisieren
      Navigation.showMessage("Eintrag erfolgreich gelöscht");
    } else {
      Navigation.showMessage("Fehler beim löschen");
    }

  });

}







/**/
