function initialize() {

  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false
  }, function(storage) {
    load(storage.loadFromWebsite);
  });

  function load(loadFromWebsite) {
    Navigation.showAll(false);
    Navigation.showLoader(true);

    loadPageData(loadFromWebsite);

    Navigation.showLoader(false);
    Navigation.showHeadline(true);
    Navigation.showChooseForm(true);
    Navigation.showEdit(true);
  }

  function loadPageData(loadFromWebsite) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "load"
      }, function(response) {
        //Check ob Response gesendet wurde
        console.log(response);
        if (!response) response = {
          status: "error"
        };

        global_loaded_values.type = response.status;

        if (response.status == "single" && loadFromWebsite) {

          global_loaded_values.teacher = response.lehrer;

          //Website angepasste Initialisierung
          updateCheckbox(checkbox_oberstufe_id, response.oberstufe);
          if (response.oberstufe) {
            global_loaded_values.klassen.oberstufe = [response.klasse];
            global_loaded_values.faecher["q" + response.klasse] = [response.fach];
            global_loaded_values.kurse["q" + response.klasse][response.fach] = [response.kurs];

            console.log(global_loaded_values);

            //Oberstufe
            updateDropdown(dropdown_fach_id, response.fach, false, []);
            updateDropdown(dropdown_klasse_id, response.klasse, false, []);
            updateDropdown(dropdown_stufe_id, response.kurs, false, []);
          } else {
            global_loaded_values.klassen.unterstufe = [response.klasse];
            global_loaded_values.faecher.unterstufe = [response.fach];
            global_loaded_values.stufen[response.fach] = [response.kurs];

            console.log(global_loaded_values);

            //Unterstufe
            updateDropdown(dropdown_fach_id, response.fach, false, []);
            updateDropdown(dropdown_klasse_id, response.klasse, false, []);
            updateDropdown(dropdown_stufe_id, response.kurs, false, []);
          }

        } else if (response.status == "multiple" && loadFromWebsite) {
          //Website angepasste Initialisierung
          global_loaded_values.teacher = response.lehrer;

          global_loaded_values.faecher = response.faecher;
          global_loaded_values.stufen = response.stufen;
          global_loaded_values.kurse = response.kurse;
          global_loaded_values.klassen = response.klassen;

          console.log(global_loaded_values);

          updateDropdown(dropdown_fach_id, "Fach", true, global_loaded_values.faecher.unterstufe);
          updateDropdown(dropdown_klasse_id, "Klasse", true, global_loaded_values.klassen.unterstufe);
          updateDropdown(dropdown_stufe_id, "Stufe", true, global_loaded_values.stufen);

        } else if (response.status == "error" || !loadFromWebsite) {
          //DEBUG
          global_loaded_values.type = "multiple";

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
