# stupa-wahltool
Wahltool für Stupa Wahl 2017

Benutzt werden sollen: MongoDB, Nodejs und irgendein JS Framework

Operations:
* FreeBSD Server
* Webserver und Datenbank in verschiedenen Jails
* Kompiliert von Source
* pf firewall

Testdata:

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

{"name":"Max Winfo",
"course":"Wirtschaftsinformatik",
"year":"2015",
"email": "max.winfo@nordakademie.de"
}

{"name":"Ingrid BWL",
"course":"Betriebswirtschaftslehre",
"year":"2014",
"email": "ingrid.bwl@nordakademie.de"
}

{"name":"Peter Wing",
"course":"Wirtschaftsingeuneurwesen",
"year":"2016",
"email": "peter.wing@nordakademie.de"
}

{"name":"Kevin Ainf",
"course":"Angewandte Informatik",
"year":"2013",
"email": "kevin.ainf@nordakademie.de"
}
```