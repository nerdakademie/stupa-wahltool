# stupa-wahltool
Wahltool für die Stupa Wahl 2017

Für dieses Projekt wurden React, Nodejs und MongoDB verwendet

Sollten dir Fehler auffallen erstelle bitte ein Issue.

Gerne kannst du an den offenen Themen Mitarbeiten (siehe Issues). Dafür einfach einen PR stellen.

Testdata:

Studenten von Datei importieren:
```shell
mongoimport --db "stupa" --collection "students" --type json --file "stupawahl_utf8.json" --jsonArray
```

Phasenstart und Ende importieren:
```shell
mongoimport --db "stupa" --collection "stages" --type json --file "documentation/stages.json" --jsonArray
```

Contestant:
```json

{"name":"TestContestant1",
"course":"TestCourse",
"year":"1900",
"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
"image": "testpath"
}
```

Student
```json

{"firstName":"Max",
"lastName": "Winfo",
"course":"Wirtschaftsinformatik",
"year":"2015",
"centuria": "I15c",
"email": "max.winfo@nordakademie.de"
}

{"firstName":"Ingrid",
"lastName": "BWL",
"course":"Betriebswirtschaftslehre",
"year":"2014",
"centuria": "B14a",
"email": "ingrid.bwl@nordakademie.de"
}

{"firstName":"Peter",
"lastName": "Wing",
"course":"Wirtschaftsingeuneurwesen",
"year":"2016",
"centuria": "W16b",
"email": "peter.wing@nordakademie.de"
}

{"firstName":"Kevin",
"lastName": "Ainf",
"course":"Angewandte Informatik",
"year":"2013",
"centuria": "A13x",
"email": "kevin.ainf@nordakademie.de"
}
```