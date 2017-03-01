import React from 'react';

export default React.createClass({
  render() {
    return <div>
        <h3>Willkommen bei der Stupa Wahl 2017</h3>
            <p>
            Via „Aufstellen“ kannst du dich als Kandidat aufstellen. Bitte beschreibe dort, wieso du Teil des neuen StuPa werden möchtest. <br/>
                Deinen Text und dein Bild kannst du bis zum Wahlbeginn anpassen.
            </p>
        <p>
            Der Zeitraum, in welchem du dich aufstellen kannst, ist: <b>Donnerstag, 23.02. 9:00 Uhr - 02.03. 9:00 Uhr</b>. Danach beginnt der Wahlzeitraum.
        </p>
        <p>
            Du wirst eine E-Mail bekommen, in der du deine Aufstellung verifizieren musst. Somit wird sichergestellt, dass nur du dich selbst aufstellen kannst. Aus diesem Grund ist es notwendig, dass in deinem Postfach genug Platz für neue E-Mails ist.
        </p>
        <p>
            Es ist möglich, dass im laufenden Prozess neue Features eingebaut werden. <br/>
            Alle Rechtschreibfehler gehören zum Design und sind gewollt. <br/>
            Erstellt wurde das Wahltool kurzfristig von der Nerdakademie. Der besondere Dank gilt hierbei Michel Wohlert, Max Schumann, Malte Schlünz, Philip Barwikowski und Finja Hauschild.
        </p>
        <p>
            Bei Fragen, Anmerkungen und Verbesserungsideen meldet euch bitte bei Finja per Mail an <a href="mailto:finja.hauschild@nordakademie.de">finja.hauschild@nordakademie.de</a>
        </p>

        <h3>Changelog</h3>
            <b>v1.2.0</b>
            <ul>
                <li>Abstimmung implementiert</li>
                <li>Phasen-Middleware implementiert</li>
                <li>Bugfixes für den Mailer</li>
                <li>Anpassen des Rate Limit an die NAK-Server</li>
            </ul>
            <b>v1.1.2</b>
            <ul>
                <li>CSS Fehler bei der Navigation behoben</li>
            </ul>
            <b>v1.1.1</b>
            <ul>
                <li>Hintergrundfarbe angepasst um Kontrast zu erhöhen</li>
            </ul>
            <b>v1.1.0</b>
            <ul>
                <li>Die Aufstellung kann nun bearbeitet werden</li>
                <li>Minor Bugfixing</li>
            </ul>
            <br />
            <b>v1.0.11</b>
            <ul>
                <li>Kompatibilität mit Internet Explorer wiederhergestellt</li>
                <li>Fehler bei der Generierung des Widerrufen-Links behoben</li>
            </ul>
      </div>;
  }
});
