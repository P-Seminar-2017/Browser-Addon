$(document).ready(function() {

  var box_loadFromWebsite_id = "#box-loadFromWebsite";
  var label_loadFromWebsite_id = "#label-loadFromWebsite";

  var box_manualTime_id = "#box-manualTime";
  var label_manualTime_id = "#label-manualTime";

  var box_loadingTime_id = "#box-loadingTime";
  var label_loadingTime_id = "#label-loadingTime";

  //Laden
  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    manualTime: false,
    loadingTime: false
  }, function(storage) {
    //Updaten von den Bestandteilen
    $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (storage.loadFromWebsite ? "On" : "Off"));
    $(box_loadFromWebsite_id).prop("checked", storage.loadFromWebsite);

    $(label_manualTime_id).text("Manuell Zeit zum Erinnern der Schüler einstellen - " + (storage.manualTime ? "On" : "Off"));
    $(box_manualTime_id).prop("checked", storage.manualTime);

    $(label_loadingTime_id).text("Ladezeiten simulieren - " + (storage.loadingTime ? "On" : "Off"));
    $(box_loadingTime_id).prop("checked", storage.loadingTime);
  });


  $(box_loadFromWebsite_id).on("change", function() {
    var value = $(box_loadFromWebsite_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      loadFromWebsite: value
    }, function() {
      $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (value ? "On" : "Off"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });


  $(box_manualTime_id).on("change", function() {
    var value = $(box_manualTime_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      manualTime: value
    }, function() {
      $(label_manualTime_id).text("Manuell Zeit zum Erinnern der Schüler einstellen - " + (value ? "On" : "Off"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });


  $(box_loadingTime_id).on("change", function() {
    var value = $(box_loadingTime_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      loadingTime: value
    }, function() {
      $(label_loadingTime_id).text("Ladezeiten simulieren - " + (value ? "On" : "Off"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });

});
