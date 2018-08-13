function initialize() {

  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    fullscreen: false,
    fullscreen_data: null
  }, function (storage) {
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
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "load"
      }, function (response) {
        //Check ob Response gesendet wurde
        if (!response) response = {
          status: "error"
        };
        console.log("[PAGE_RESPONSE]");
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

          initUI();

        } else if (response.status == "multiple" && loadFromWebsite) {
          global_loaded_values.teacher = response.lehrer;

          global_loaded_values.faecher = response.faecher;
          global_loaded_values.stufen = response.stufen;
          global_loaded_values.kurse = response.kurse;
          global_loaded_values.klassen = response.klassen;

          initUI();

        } else if (response.status == "error" || !loadFromWebsite) {

          if (fullscreen) {
            console.log("Fullscreen!");

            global_loaded_values = fullscreen_data;

            console.log("[FULLSCREEN_DATA]");
            console.log(global_loaded_values);

            chrome.storage.sync.set({
              fullscreen: false,
              fullscreen_data: null
            }, function () {
              console.log("Fullscreen Temp-Data gelöscht");
            });

            initUI();

          } else {
            //Load data from sql server

            function onSuccess(data) {
              console.log("[SCHOOL_DATA]");
              console.log(data);

              //
              //make data to usable data... duh
              //
              let stufen = {};
              let faecher = {
                unterstufe: [],
                q11: [],
                q12: [],
                q13: []
              };
              let oberstufe_kurse = {
                q11: {},
                q12: {},
                q13: {}
              };

              for (let i = 0; i < data.length; i++) {
                //stufen
                if (data[i].unterstufe.length > 0) {
                  stufen[data[i].fach] = data[i].unterstufe;
                }

                //faecher
                if (data[i].unterstufe.length > 0) { //i know it's a duplicate
                  faecher.unterstufe.push(data[i].fach);
                }
                for (let j = 11; j <= 13; j++) {
                  if (data[i].oberstufe.includes("" + j)) faecher["q" + j].push(data[i].fach);
                }

                //kurse
                for (let j = 11; j <= 13; j++) {
                  if (data[i].oberstufe.includes("" + j)) {
                    if (data[i]["kursanzahl_" + j] == 1) {
                      oberstufe_kurse["q" + j][data[i].fach] = [];
                      oberstufe_kurse["q" + j][data[i].fach].push("1" + data[i].kurskuerzel + "0");
                    } else {
                      oberstufe_kurse["q" + j][data[i].fach] = [];
                      for (let k = 1; k <= data[i]["kursanzahl_" + j]; k++) {
                        oberstufe_kurse["q" + j][data[i].fach].push("1" + data[i].kurskuerzel + k);
                      }
                    }
                  }
                }

              }

              global_loaded_values.type = "multiple";
              global_loaded_values.faecher = faecher;
              global_loaded_values.klassen.unterstufe = unterstufe;
              global_loaded_values.klassen.oberstufe = oberstufe;
              global_loaded_values.stufen = stufen;
              global_loaded_values.kurse = oberstufe_kurse;

              initUI();
            }

            function onError(error) {
              console.log("[SCHOOL_DATA] Error: " + error);
            }

            SQLHandler.getSQLSchoolData("gymlap", onSuccess, onError);
          }
        }

      });
    });
  }

  function initUI() {
    //Initialisierung der Oberfläche
    console.log("[GLOBAL_DATA]");
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
      updateDropdown(dropdown_fach_id, "Fach", true, global_loaded_values.faecher.unterstufe);
      updateDropdown(dropdown_klasse_id, "Klasse", true, global_loaded_values.klassen.unterstufe);
      updateDropdown(dropdown_stufe_id, "Stufe", true, global_loaded_values.stufen);
    }
  }
}
