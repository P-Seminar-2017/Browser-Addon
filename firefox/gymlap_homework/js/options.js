$(document).ready(function() {

  var box_loadFromWebsite_id = "#box-loadFromWebsite";
  var label_loadFromWebsite_id = "#label-loadFromWebsite";

  //Laden
  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false
  }, function(storage) {
    //Updaten von den Bestandteilen
    $(label_loadFromWebsite_id).text("Daten von der WebUntis Website laden - " + (storage.loadFromWebsite ? "On" : "Off"));
    $(box_loadFromWebsite_id).prop("checked", storage.loadFromWebsite);
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

});
