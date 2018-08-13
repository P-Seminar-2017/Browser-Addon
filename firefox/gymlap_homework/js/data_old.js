var faecher = {
    unterstufe: ["Biologie", "Chemie", "Deutsch", "Englisch", "Französisch",
        "Geographie", "Geschichte", "Informatik", "Italienisch", "Kunst", "Latein",
        "Mathe", "Musik", "Physik", "Katholisch", "Evangelisch", "Ethik", "Sozialkunde", "Spanisch", "Sport", "Wirtschaft"
    ],
    q11: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik", "Geschichte", "Biologie", "Geographie", "Wirtschaft", "Französisch", "Sozialkunde", "Chemie", "Italienisch", "Latein", "Katholisch", "Evangelisch", "Ethik"],
    q12: ["Deutsch", "Englisch", "Mathe", "Physik", "Informatik"]
};


var stufen = {
    Biologie: ["a", "b", "c", "d"],
    Chemie: ["a", "b", "c", "d"],
    Deutsch: ["a", "b", "c", "d"],
    Englisch: ["a", "b", "c", "d"],
    Französisch: ["a", "b", "c", "d"],
    Geographie: ["a", "b", "c", "d"],
    Geschichte: ["a", "b", "c", "d"],
    Informatik: ["a", "b", "c", "d"],
    Italienisch: ["a", "b", "c", "d"],
    Kunst: ["a", "b", "c", "d"],
    Latein: ["a", "b", "c", "d"],
    Mathe: ["a", "b", "c", "d"],
    Musik: ["a", "b", "c", "d"],
    Physik: ["a", "b", "c", "d"],
    Katholisch: ["a", "b", "c", "d"],
    Evangelisch: ["a", "b", "c", "d"],
    Ethik: ["a", "b", "c", "d"],
    Sozialkunde: ["a", "b", "c", "d"],
    Spanisch: ["a", "b", "c", "d"],
    Sport: ["a", "b", "c", "d"],
    Wirtschaft: ["a", "b", "c", "d"]
};

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