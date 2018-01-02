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

        global_loaded_values["type"] = response.status;

        if (response.status == "single" && loadFromWebsite) {
          //Website angepasste Initialisierung
          updateCheckbox(checkbox_oberstufe_id, response.oberstufe);
          if (response.oberstufe) {
            //Oberstufe
            updateDropdown(dropdown_fach_id, kursToFach(response.klasse, response.kurs), false, getFaecher(response.klasse));
            updateDropdown(dropdown_klasse_id, response.klasse, false, oberstufe);
            updateDropdown(dropdown_stufe_id, response.kurs, false, []);
          } else {
            //Unterstufe
            updateDropdown(dropdown_fach_id, response.fach, false, []); //Alt: updateDropdown(dropdown_fach_id, "Fach", true, getFaecher(response.klasse));
            updateDropdown(dropdown_klasse_id, response.klasse, false, []); //Alt: updateDropdown(dropdown_klasse_id, response.klasse, false, unterstufe);
            updateDropdown(dropdown_stufe_id, response.kurs, false, []); //Alt: updateDropdown(dropdown_stufe_id, response.kurs, false, unterstufe_stufen);
          }

        } else if (response.status == "multiple" && loadFromWebsite) {
          //TODO Website angepasste Initialisierung

          //global_loaded_values

        } else if (response.status == "error") {
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
