import React from 'react';

function Home() {
  return (
    <div>
      <h3>{'Willkommen bei der Vorstandswahl der Fachschaft AINF 2017'}</h3>
      <p>{'Hier kannst du für die aufgestellten Kandidaten deine Stimme abgeben!'} <br />
        {'Du hast insgesamt 2 Stimmen. Es ist möglich, dass du z.B. erst eine Person wählst und später die zweite Stimme ergänzt. Bereits abgegebene Stimmen können nicht mehr zurückgezogen werden.'}</p>
      <p>{'Der Zeitraum, in welchem du dich aufstellen kannst, ist: '}<b>{'Sonntag, 19.03. 10:00 Uhr – Mittwoch, 22.03. 10:00 Uhr.'}</b></p>
      <p>{'Der Wahlzeitraum ist: '}<b>{'Mittwoch, 22.03. 10:00 Uhr – Samstag, 25.03. 10:00 Uhr.'}</b></p>
      <p>{'Danach wird der künftige Vorstand bekanntgegeben.'}</p>
      <p>{'Du wirst eine Mail bekommen, in der dein Token ist, mit dem du verifizierst, dass die abgegebenen Stimmen wirklich von dir kommen. Aus diesem Grund ist es wichtig, dass dein Postfach leer genug ist und dass du deine Wahlmail nicht weiterleitest!'}</p>
      <p>{'Es ist möglich, dass im laufenden Prozess neue Features eingebaut werden.'} <br />
        {'Alle Rechtschreibfehler gehören zum Design und sind gewollt.'} <br />
        {'Gebastelt wurde das Tool von der Nerdakademie für die StuPa-Wahl 2017. Es wurde von Michel Wohlert und Finja Hauschild für die Vorstandswahl angepasst.'}</p>
      <p>{'Bei Fragen, Anmerkungen und Verbesserungsideen meldet euch bitte bei Finja per Mail an '}<a href='mailto:finja.hauschild@nordakademie.de'>{'finja.hauschild@nordakademie.de'}</a></p>

    </div>);
}

export default Home;
