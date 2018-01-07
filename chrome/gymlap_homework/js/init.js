function initialize() {

  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    fullscreen: false,
    fullscreen_data: null
  }, function(storage) {
    load(storage.loadFromWebsite, storage.fullscreen, storage.fullscreen_data);
  });

  function load(loadFromWebsite, fullscreen, fullscreen_data) {
    Navigation.showAll(false);
    Navigation.showLoader(true);

    loadPageData(loadFromWebsite, fullscreen, fullscreen_data);

    Navigation.showLoader(false);
    Navigation.showHeadline(true);
    Navigation.showChooseForm(true);
    Navigation.showEdit(true);
  }

  function loadPageData(loadFromWebsite, fullscreen, fullscreen_data) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "load"
      }, function(response) {
        //Check ob Response gesendet wurde
        if (!response) response = {
          status: "error"
        };
        console.log(response);

        global_loaded_values.type = response.status;

        if (response.status == "single" && loadFromWebsite) {

          global_loaded_values.teacher = response.lehrer;

          //Website angepasste Initialisierung
          updateCheckbox(checkbox_oberstufe_id, response.oberstufe);
          if (response.oberstufe) {
            global_loaded_values.klassen.oberstufe = [response.klasse];
            global_loaded_values.faecher["q" + response.klasse] = [response.fach];
            global_loaded_values.kurse["q" + response.klasse][response.fach] = [response.kurs];
          } else {
            global_loaded_values.klassen.unterstufe = [response.klasse];
            global_loaded_values.faecher.unterstufe = [response.fach];
            global_loaded_values.stufen[response.fach] = [response.kurs];
          }

        } else if (response.status == "multiple" && loadFromWebsite) {
          global_loaded_values.teacher = response.lehrer;

          global_loaded_values.faecher = response.faecher;
          global_loaded_values.stufen = response.stufen;
          global_loaded_values.kurse = response.kurse;
          global_loaded_values.klassen = response.klassen;

        } else if (response.status == "error" || !loadFromWebsite) {

          if (fullscreen) {
            console.log("Fullscreen!");
            global_loaded_values = fullscreen_data;
            console.log(global_loaded_values);

            chrome.storage.sync.set({
              fullscreen: false,
              fullscreen_data: null
            }, function() {
              console.log("Fullscreen Temp-Data gelöscht");
            });

          } else {
            //DEBUG
            //global_loaded_values.type = "multiple";
          }
        }


        //Initialisierung der Oberfläche
        console.log(global_loaded_values);
        if (global_loaded_values.type == "single") {
          if (global_loaded_values.faecher.unterstufe.length == 0) {
            var temp = global_loaded_values.faecher.q11.length == 0 ? "12" : "11";

            //Oberstufe
            updateCheckbox(checkbox_oberstufe_id, true);
            updateDropdown(dropdown_fach_id, global_loaded_values.faecher["q" + temp][0], false, []);
            updateDropdown(dropdown_klasse_id, global_loaded_values.klassen.oberstufe[0], false, []);
            updateDropdown(dropdown_stufe_id, global_loaded_values.kurse["q" + temp][0], false, []);
          } else {
            //Unterstufe
            updateCheckbox(checkbox_oberstufe_id, false);
            updateDropdown(dropdown_fach_id, global_loaded_values.faecher.unterstufe[0], false, []);
            updateDropdown(dropdown_klasse_id, global_loaded_values.klassen.unterstufe[0], false, []);
            updateDropdown(dropdown_stufe_id, global_loaded_values.stufen[global_loaded_values.faecher.unterstufe[0]][0], false, []);
          }


        } else if (global_loaded_values.type == "multiple") {

          updateDropdown(dropdown_fach_id, "Fach", true, global_loaded_values.faecher.unterstufe);
          updateDropdown(dropdown_klasse_id, "Klasse", true, global_loaded_values.klassen.unterstufe);
          updateDropdown(dropdown_stufe_id, "Stufe", true, global_loaded_values.stufen);

        } else if (global_loaded_values.type == "error") {
          //Standard Initialisierung
          updateCheckbox(checkbox_oberstufe_id, false);
          updateDropdown(dropdown_fach_id, "Fach", true, faecher.unterstufe);
          updateDropdown(dropdown_klasse_id, "Klasse", true, unterstufe);
          updateDropdown(dropdown_stufe_id, "Stufe", true, unterstufe_stufen);
        }

      });
    });
  }
}
