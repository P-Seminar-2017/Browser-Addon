var checkbox_oberstufe_id = "#oberstufe-box";
var dropdown_fach_id = "#select_fach";
var dropdown_klasse_id = "#select_klasse";
var dropdown_stufe_id = "#select_stufe";
var dropdown_abgabe_id = "#select_date";


//TODO Schuldaten anders laden und vervollständigen/anpassen

//Objekt dass alle Daten enthält die gerade von der Website geladen wurden
var global_loaded_values = {
  type: "",
  faecher: {
    unterstufe: [],
    q11: [],
    q12: []
  },
  stufen: [],
  kurse: {
    q11: [],
    q12: []
  }
}

var faecher = {
  unterstufe: ["Biologie", "Chemie", "Deutsch", "Englisch", "Französisch",
    "Geographie", "Geschichte", "Informatik", "Italienisch", "Kunst", "Latein",
    "Mathe", "Musik", "Physik", "Katholisch", "Evangelisch", "Ethik", "Sozialkunde", "Spanisch", "Sport", "Wirtschaft"
  ],
  q11: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik", "Geschichte", "Biologie", "Geographie", "Wirtschaft", "Französisch", "Sozialkunde", "Chemie", "Italienisch", "Latein", "Katholisch", "Evangelisch", "Ethik"],
  q12: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik"]
}
var unterstufe = ["5", "6", "7", "8", "9", "10"];
var unterstufe_stufen = ["a", "b", "c", "d"];
var oberstufe = ["11", "12"];
var oberstufe_kurse = {
  q11: {
    Geschichte: ["1g1", "1g2", "1g3", "1g4"],
    Biologie: ["1b2", "1b2"],
    Geographie: ["1geo1", "1geo2"],
    Wirtschaft: ["1wr1", "1wr2", "1wr3"],
    Französisch: ["3f0"],
    Deutsch: ["1d1", "1d2", "1d3", "1d4"],
    Englisch: ["1e1", "1e2", "1e3", "1e4"],
    Mathe: ["1m1", "1m2", "1m3", "1m4"],
    Physik: ["1ph1", "1ph2"],
    Informatik: ["1inf0"],
    Sozialkunde: ["1sk1", "1sk2", "1sk3", "1sk4"],
    Chemie: ["1ch1", "1ch2"],
    Italienisch: ["1it0"],
    Latein: ["1l0"],
    Katholisch: ["1k1", "1k2", "1k3"],
    Evangelisch: ["1ev0"],
    Ethik: ["1eth0"]
  },
  q12: {
    Deutsch: ["1d1", "1d2"],
    Englisch: ["1e1", "1e2"],
    Mathe: ["1m1", "1m2"],
    Physik: ["1ph1", "1ph2"]
  }
};


//TODO Make Data class

function kursToFach(kl, ku) {
  var arr_kurse = [];
  var arr_names = [];
  var result = "FACH_NOT_FOUND";

  if (kl == "11") {
    arr_kurse = oberstufe_kurse.q11;
  } else if (kl == "12") {
    arr_kurse = oberstufe_kurse.q12;
  }
  arr_names = Object.getOwnPropertyNames(arr_kurse);

  for (var i = 0; i < arr_names.length; i++) {
    if (arr_kurse[arr_names[i]].includes(ku)) {
      result = arr_names[i];
      break;
    }
  }

  return result;
}


function getFaecher(klasse) {
  var f = [];

  if (klasse == "11") {
    f = faecher.q11;
  } else if (klasse == "12") {
    f = faecher.q12;
  } else {
    f = faecher.unterstufe;
  }

  return f;
}


function loadKurse(klasse, fach) {
  var kurse = [];

  if (fach == undefined) {
    if (klasse == "11") kurse = oberstufe_kurse.q11;
    else if (klasse == "12") kurse = oberstufe_kurse.q12;
  } else {
    if (klasse == "11") {
      kurse = oberstufe_kurse.q11[fach];
      kurse = kurse != undefined ? kurse : []; // Falls Fach nicht vorhanden ist es leer
    } else if (klasse == "12") {
      kurse = oberstufe_kurse.q12[fach];
      kurse = kurse != undefined ? kurse : []; // Falls Fach nicht vorhanden ist es leer
    }
  }

  return kurse;
}
