$(document).ready(function () {

  let box_loadFromWebsite_id = "#box-loadFromWebsite";
  let label_loadFromWebsite_id = "#label-loadFromWebsite";
  let box_disableHelp_id = "#box-disableHelp";
  let label_disableHelp_id = "#label-disableHelp";

  let input_fach_id = "#fach_name_input";
  let create_btn_id = "#create-btn";

  let active_fach = "";

  //Laden
  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    disableHelp: false
  }, function (storage) {
    //Updaten von den Bestandteilen
    $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (storage.loadFromWebsite ? "An" : "Aus"));
    $(box_loadFromWebsite_id).prop("checked", storage.loadFromWebsite);

    $(label_disableHelp_id).text("Hilfen deaktivieren - " + (storage.disableHelp ? "An" : "Aus"));
    $(box_disableHelp_id).prop("checked", storage.disableHelp);

    if (!storage.disableHelp) $('.tap-target').tapTarget('open');
  });


  $(box_loadFromWebsite_id).on("change", function () {
    let value = $(box_loadFromWebsite_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      loadFromWebsite: value
    }, function () {
      $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (value ? "An" : "Aus"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });

  $(box_disableHelp_id).on("change", function () {
    let value = $(box_disableHelp_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      disableHelp: value
    }, function () {
      $(label_disableHelp_id).text("Hilfen deaktivieren - " + (value ? "An" : "Aus"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });

  $('.modal').modal();
  $(input_fach_id).val("");

  $(create_btn_id).click(function() {
    let value = $(input_fach_id).val();
    active_fach = value;
    $(input_fach_id).val("");
    SQLHandler.editSQLSchoolData("gymlap", value, "", "", "", 0, 0, 0, loadSQL);
  });

  loadSQL();

  function loadSQL() {
    //Load sql school data

    function onSuccess(data) {

      function onUpdate() {
        SQLHandler.getSQLSchoolData("gymlap", onSuccess, onError);
      }

      function onActiveFachChanged(new_active_fach) {
        active_fach = new_active_fach;
      }

      SQLHandler.generateSQLSchoolDataList("#schoolDataSettings", data, active_fach, onActiveFachChanged, onUpdate);
    }

    function onError(error) {
      console.log("[SCHOOL_DATA] Error: " + error);
    }

    SQLHandler.getSQLSchoolData("gymlap", onSuccess, onError);
  }

});
