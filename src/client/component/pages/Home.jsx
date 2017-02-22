import React from 'react';

export default React.createClass({
  render() {
    return <div>
        <h3>Willkommen bei der Stupa Wahl 2017</h3>
        <p>
            Via „Mich aufstellen“ kannst du dich als Kandidat aufstellen. Bitte beschreibe dort, wieso du Teil des neuen StuPa werden möchtest. <br/>
            <span style={{'color': 'red'}}>Achtung:</span> Du kannst deinen Text nicht mehr ändern, wenn du ihn einmal hinzugefügt hast!
            </p>
        <p>
            Der Zeitraum, in welchem du dich aufstellen kannst, ist: <b>Donnerstag, 22.02. 9:00 Uhr - 01.03. 9:00 Uhr</b>. Danach beginnt der Wahlzeitraum.
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
      </div>;
  }
});
