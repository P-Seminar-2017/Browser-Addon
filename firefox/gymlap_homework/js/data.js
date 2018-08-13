var checkbox_oberstufe_id = "#oberstufe-box";
var dropdown_fach_id = "#select_fach";
var dropdown_klasse_id = "#select_klasse";
var dropdown_stufe_id = "#select_stufe";
var dropdown_abgabe_id = "#select_date";


//TODO Schuldaten anders laden und vervollständigen/anpassen

//Objekt dass alle Daten enthält die gerade von der Website geladen wurden
var global_loaded_values = {
  teacher: "",
  type: "",
  faecher: {
    unterstufe: [],
    q11: [],
    q12: []
  },
  klassen: {
    unterstufe: [],
    oberstufe: []
  },
  stufen: {

  },
  kurse: {
    q11: {

    },
    q12: {

    }
  }
}

var unterstufe = ["5", "6", "7", "8", "9", "10"];
var unterstufe_stufen = ["a", "b", "c", "d", "e"];
var oberstufe = ["11", "12", "13"];


//TODO Make Data class

function kursToFach(kl, ku) {
  let arr_kurse = [];
  let arr_names = [];
  let result = "FACH_NOT_FOUND";

  arr_kurse = oberstufe_kurse["q" + kl];

  arr_names = Object.getOwnPropertyNames(arr_kurse);

  for (let i = 0; i < arr_names.length; i++) {
    if (arr_kurse[arr_names[i]].includes(ku)) {
      result = arr_names[i];
      break;
    }
  }

  return result;
}


function getFaecher(klasse) {
  let f = [];

  if (klasse == "11") {
    f = global_loaded_values.faecher.q11;
  } else if (klasse == "12") {
    f = global_loaded_values.faecher.q12;
  } else {
    f = global_loaded_values.faecher.unterstufe;
  }

  return f;
}


function loadKurse(klasse, fach, bAll) {
  let kurse = [];

  if (bAll) {
    //Alle kurse für ein fach zurückgeben
    kurse = oberstufe_kurse.q["q" + klasse][fach];
    kurse = kurse != undefined ? kurse : []; // Falls Fach nicht vorhanden -> leeres array
  } else {
    //Nur die gerade geladenen kurse für ein fach zurückgeben
    for (let i = 0; i < global_loaded_values.kurse["q" + klasse].length; i++) {
      //Wenn ein Kurs zum gesuchten Fach passt dann zum array pushen
      if (kursToFach(klasse, global_loaded_values.kurse["q" + klasse][i]) == fach) {
        kurse.push(global_loaded_values.kurse["q" + klasse][i]);
      }
    }
  }

  return kurse;
}
