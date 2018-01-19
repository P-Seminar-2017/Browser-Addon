class SQLHandler {

  static getSQLData(fach, klasse, stufe, onSuccess, onError) {

    Navigation.showLoader(true);

    $.get("http://api.lakinator.bplaced.net/request.php", {
      fach: "" + encodeURIComponent(fach),
      klasse: "" + encodeURIComponent(klasse),
      stufe: "" + encodeURIComponent(stufe),
      key: "917342346673"
    }, function(data, status, xhr) {
      Navigation.showLoader(false);

      if (status == "success") {
        console.log(data);

        if (data.success == "true") {

          if (data.data.length == 0) {
            onError("Nichts gefunden");
          } else {
            onSuccess(data.data);
          }

        } else {
          onError("Ein Fehler ist aufgetreten");
        }

      } else {
        //Connection Error
        onError("Verbindung fehlgeschlagen");
      }
    });
  }


  static deleteSQLData(sql_id, onReady) {
    Navigation.showLoader(true);

    $.get("http://api.lakinator.bplaced.net/request.php", {
      id: "" + sql_id,
      key: "917342346673"
    }, function(data, status, xhr) {
      Navigation.showLoader(false);

      if (status == "success") {
        console.log(data);

        if (data.success == "true") {
          Navigation.showMessage("Eintrag erfolgreich gelöscht");
        } else {
          Navigation.showMessage("Löschen fehlgeschlagen");
        }
      } else {
        //Connection Error
      }

      onReady();
    });

  }


  static editSQLData(sql_id, text, onReady) {
    Navigation.showLoader(true);

    $.get("http://api.lakinator.bplaced.net/request.php", {
      id: "" + sql_id,
      text: "" + encodeURIComponent(text),
      key: "917342346673"
    }, function(data, status, xhr) {
      Navigation.showLoader(false);

      if (status == "success") {
        console.log(data);

        if (data.success == "true") {
          Navigation.showMessage("Eintrag erfolgreich editiert");
        } else {
          Navigation.showMessage("Editieren fehlgeschlagen");
        }
      } else {
        //Connection Error
      }

      onReady();
    });

  }



  static generateSQLList(id_where, sql_data, active, onUpdate) {
    $("#homework_listview").remove();
    $(id_where).append("<ul id='homework_listview' class='collapsible' data-collapsible='expandable'></ul>");

    for (let i = 0; i < sql_data.length; i++) {
      let d = new Date(Number.parseInt(sql_data[i].date));
      let datestring = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();

      let head = "";
      if (sql_data[i].type == "NEXT") {
        head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Nächste Stunde";
      } else if (sql_data[i].type == "NEXT2") {
        head = "Hausaufgabe aufgegeben am <span style='color:red'>" + datestring + "</span>, Abgabe: Übernächste Stunde";
      } else if (sql_data[i].type == "DATE") {
        head = "Hausaufgabe/Notiz für <span style='color:red'>" + datestring + "</span>";
      }

      $("#homework_listview").append("<li> <div class='collapsible-header'" + (active ? "active" : "") + "><h6>" + head + "</h6></div> <div class='collapsible-body'> <div class='row'>   <div id='text-view." + sql_data[i].id + "' class='col s8'><span><h6>" + decodeURIComponent(sql_data[i].text) + "</h6></span></div> <div class='col s2'><a class='btn-floating waves-effect waves-light green'><i id='edit-btn." + sql_data[i].id + "' class='material-icons'>edit</i></a></div> <div class='col s2'><a class='btn-floating waves-effect waves-light red'><i id='del-btn." + sql_data[i].id + "' class='material-icons'>delete</i></a></div> </div> </div> </li>");

      //Delete button
      let v = "del-btn." + sql_data[i].id;

      document.getElementById(v).addEventListener("click", function(event) {
        let innerID = event.target.id.split(".")[1];
        SQLHandler.deleteSQLData(innerID, onUpdate);
      });

      //Edit button
      let v2 = "edit-btn." + sql_data[i].id;

      function edit(event) {
        let innerID = event.target.id.split(".")[1];
        let old_text = document.getElementById("text-view." + innerID).innerHTML.split(">")[2].split("<")[0];
        document.getElementById("edit-btn." + innerID).innerHTML = "save";
        document.getElementById("text-view." + innerID).innerHTML = "<div class='input-field'><input id='new-text." + innerID + "' value='" + old_text + "' type='text'><label class='active' for='new-text." + innerID + "'>Neuer Text</label></div>";

        document.getElementById("edit-btn." + innerID).removeEventListener("click", edit);

        document.getElementById(event.target.id).addEventListener("click", function(event) {
          let innerID2 = event.target.id.split(".")[1];
          let v3 = "new-text." + innerID2;

          SQLHandler.editSQLData(innerID2, document.getElementById(v3).value, onUpdate);
        });
      }

      document.getElementById(v2).addEventListener("click", edit);
    }

    //Updaten vom collapsible
    $('.collapsible').collapsible();
  }
}
