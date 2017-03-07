import React from 'react';

function Home() {
  return (
    <div>
      <h3>{'Willkommen bei der Stupa Wahl 2017'}</h3>
      <p>{'Hier kannst du für die aufgestellten Kandidaten deine Stimme abgeben!'} <br />
        {'Du hast insgesamt 4 Stimmen. Es ist möglich, dass du z.B. erst eine Person wählst und später noch welche ergänzt. Bereits abgegebene Stimmen können nicht mehr zurückgezogen werden.'}</p>
      <p>{'Der Zeitraum, in welchem du wählen kannst, ist: '}<b>{'Donnerstag, 02.03. 14:00 Uhr – 09.03. 14:00 Uhr'}</b>{'. Danach werden die künftigen Mitglieder des StuPas bekanntgegeben.'}</p>
      <p>{'Du wirst eine Mail bekommen, in der dein Token ist, mit dem du verifizierst, dass die abgegebenen Stimmen wirklich von dir kommen. Aus diesem Grund ist es wichtig, dass dein Postfach leer genug ist und dass du deine Wahlmail nicht weiterleitest!'}</p>
      <p>{'Es ist möglich, dass im laufenden Prozess neue Features eingebaut werden.'} <br />
        {'Alle Rechtschreibfehler gehören zum Design und sind gewollt.'} <br />
        {'Gebastelt wurde das Tool kurzfristig von der Nerdakademie. Der besondere Dank gilt hierbei Michel Wohlert, Max Schumann, Malte Schlünz, Philip Barwikowski und Finja Hauschild.'}</p>
      <p>{'Bei Fragen, Anmerkungen und Verbesserungsideen meldet euch bitte bei Finja per Mail an '}<a href='mailto:finja.hauschild@nordakademie.de'>{'finja.hauschild@nordakademie.de'}</a></p>

      <h3>{'Changelog'}</h3>
      <b>{'v1.3.0'}</b>
      <ul>
        <li>{'Wahlergebnis Front und Backend'}</li>
        <li>{'Minor Bugfixing'}</li>
      </ul>
      <b>{'v1.2.7'}</b>
      <ul>
        <li>{'Änderung des Speicherformat für Stimmen'}</li>
        <li>{'Anpassung der Datenbank (Update und Schema Veränderungen)'}</li>
      </ul>
      <b>{'v1.2.6'}</b>
      <ul>
        <li>{'Anpassungen der Startphase der Abstimmung '}</li>
        <li>{'Anpassungen der Mailvorlage für den Versand der Wahltokens'}</li>
      </ul>
      <b>{'v1.2.5'}</b>
      <ul>
        <li>{'Mail-Versand nun auf 150 Mails alle 10 Minuten nach Abspreche mit Herrn Singer'}</li>
        <li>{'Vote-Checkbox nun direkt unter dem Namen'}</li>
      </ul>
      <b>{'v1.2.4'}</b>
      <ul>
        <li>{'Speicherung der Email zu dem Token als bcrypt hash'}</li>
      </ul>
      <b>{'v1.2.3'}</b>
      <ul>
        <li>{'CSS Fehler in der ContestantVote form behoben'}</li>
      </ul>
      <b>{'v1.2.2'}</b>
      <ul>
        <li>{'CSS für mobile Geräte optimiert'}</li>
      </ul>
      <b>{'v1.2.1'}</b>
      <ul>
        <li>{'Bugfixing für die Wahl'}</li>
        <li>{'Benutzung von Promises anstatt Callbacks'}</li>
        <li>{'Minor Bugfixing'}</li>
      </ul>
      <b>{'v1.2.0'}</b>
      <ul>
        <li>{'Abstimmung implementiert'}</li>
        <li>{'Phasen-Middleware implementiert'}</li>
        <li>{'Bugfixes für den Mailer'}</li>
        <li>{'Anpassen des Rate Limit an die NAK-Server'}</li>
      </ul>
      <b>{'v1.1.2'}</b>
      <ul>
        <li>{'CSS Fehler bei der Navigation behoben'}</li>
      </ul>
      <b>{'v1.1.1'}</b>
      <ul>
        <li>{'Hintergrundfarbe angepasst um Kontrast zu erhöhen'}</li>
      </ul>
      <b>{'v1.1.0'}</b>
      <ul>
        <li>{'Die Aufstellung kann nun bearbeitet werden'}</li>
        <li>{'Minor Bugfixing'}</li>
      </ul>
      <br />
      <b>{'v1.0.11'}</b>
      <ul>
        <li>{'Kompatibilität mit Internet Explorer wiederhergestellt'}</li>
        <li>{'Fehler bei der Generierung des Widerrufen-Links behoben'}</li>
      </ul>
    </div>);
}

export default Home;
