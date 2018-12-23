$(document).ready(function () {

  let box_loadFromWebsite_id = "#box-loadFromWebsite";
  let label_loadFromWebsite_id = "#label-loadFromWebsite";
  let box_disableHelp_id = "#box-disableHelp";
  let label_disableHelp_id = "#label-disableHelp";

  let input_api_key_id = "#api-key-input";
  let icon_api_key_id = "#icon-connection-status";
  let link_api_key_update_id = "#api-connection-update-link";

  let input_fach_id = "#fach_name_input";
  let create_btn_id = "#create-btn";
  let autorenew_btn_id = "#autorenew";

  let active_fach = "";

  //Laden
  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    disableHelp: false,
    apiKey: ""
  }, function (storage) {
    //Updaten von den Bestandteilen
    $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (storage.loadFromWebsite ? "An" : "Aus"));
    $(box_loadFromWebsite_id).prop("checked", storage.loadFromWebsite);

    $(label_disableHelp_id).text("Hilfen deaktivieren - " + (storage.disableHelp ? "An" : "Aus"));
    $(box_disableHelp_id).prop("checked", storage.disableHelp);

    if (!storage.disableHelp) $('.tap-target').tapTarget('open');

    $(input_api_key_id).val(storage.apiKey);
    Materialize.updateTextFields();

    //API Key Validation
    SQLHandler.verifyAPIKey(storage.apiKey,
      //Success
      function () {
        $(icon_api_key_id).text("cloud_done");
        if ($(icon_api_key_id).hasClass("red-text")) $(icon_api_key_id).removeClass("red-text");
        if ($(icon_api_key_id).hasClass("blue-text")) $(icon_api_key_id).removeClass("blue-text");
        if (!$(icon_api_key_id).hasClass("green-text")) $(icon_api_key_id).addClass("green-text");

        $(link_api_key_update_id).attr("data-tooltip", "Verified");
        $('.tooltipped').tooltip();
      },
      //Error
      function () {
        $(icon_api_key_id).text("cloud_off");
        if ($(icon_api_key_id).hasClass("green-text")) $(icon_api_key_id).removeClass("green-text");
        if ($(icon_api_key_id).hasClass("blue-text")) $(icon_api_key_id).removeClass("blue-text");
        if (!$(icon_api_key_id).hasClass("red-text")) $(icon_api_key_id).addClass("red-text");

        $(link_api_key_update_id).attr("data-tooltip", "Error");
        $('.tooltipped').tooltip();
      });
  });

  //Load from website
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

  //Disable/Enable help
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

  //API Input
  $(input_api_key_id).keyup(function (e) {

    if (e.which == 13) {
      //Enter pressed
      $(link_api_key_update_id).click();
    } else {
      $(icon_api_key_id).text("cloud_upload");
      if ($(icon_api_key_id).hasClass("red-text")) $(icon_api_key_id).removeClass("red-text");
      if ($(icon_api_key_id).hasClass("green-text")) $(icon_api_key_id).removeClass("green-text");
      if (!$(icon_api_key_id).hasClass("blue-text")) $(icon_api_key_id).addClass("blue-text");

      $(link_api_key_update_id).attr("data-tooltip", "Klicken zum Überprüfen");
      $('.tooltipped').tooltip();
    }

  });

  //API refresh button
  $(link_api_key_update_id).click(function () {
    let value = $(input_api_key_id).val();

    //Speichern
    chrome.storage.sync.set({
      apiKey: value
    }, function () {
      location.reload();
    });

  });


  //Footer
  $('.modal').modal();
  $(input_fach_id).val("");

  $(create_btn_id).click(function () {
    let value = $(input_fach_id).val();
    active_fach = value;
    $(input_fach_id).val("");
    SQLHandler.editSQLSchoolData("gymlap", value, "a,b,c,d", "", "", 0, 0, 0, loadSQL);
  });

  $(autorenew_btn_id).click(function () {
    SQLHandler.updateSQLData(function (changes) {
      if (changes <= 0) Navigation.showMessage("Keine Einträge gelöscht");
      else if (changes == 1) Navigation.showMessage(changes + " Eintrag gelöscht!");
      else if (changes > 1) Navigation.showMessage(changes  + " Einträge gelöscht!");
    }, function (error) {
      Navigation.showMessage(error);
    });
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