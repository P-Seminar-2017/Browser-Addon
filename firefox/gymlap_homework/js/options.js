$(document).ready(function() {

  var box_loadFromWebsite_id = "#box-loadFromWebsite";
  var label_loadFromWebsite_id = "#label-loadFromWebsite";

  var box_loadingTime_id = "#box-loadingTime";
  var label_loadingTime_id = "#label-loadingTime";

  //Laden
  chrome.storage.sync.get({
    //Default
    loadFromWebsite: false,
    loadingTime: false
  }, function(storage) {
    //Updaten von den Bestandteilen
    $(label_loadFromWebsite_id).text("Load Data from WebUntis Website - " + (storage.loadFromWebsite ? "On" : "Off"));
    $(box_loadFromWebsite_id).prop("checked", storage.loadFromWebsite);

    $(label_loadingTime_id).text("Simulate loading times - " + (storage.loadingTime ? "On" : "Off"));
    $(box_loadingTime_id).prop("checked", storage.loadingTime);
  });

  $(box_loadFromWebsite_id).on("change", function() {
    var value = $(box_loadFromWebsite_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      loadFromWebsite: value
    }, function() {
      $(label_loadFromWebsite_id).text("Load Data from WebUntis Website - " + (value ? "On" : "Off"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });


  $(box_loadingTime_id).on("change", function() {
    var value = $(box_loadingTime_id).prop("checked");

    //Speichern
    chrome.storage.sync.set({
      loadingTime: value
    }, function() {
      $(label_loadingTime_id).text("Simulate loading times - " + (value ? "On" : "Off"));
    });

    Materialize.toast("Gespeichert!", 2000, "rounded");
  });

});
