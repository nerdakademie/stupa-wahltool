import React from 'react';

function Home() {
  return (
    <div>
      <h3>{'Willkommen bei der StuPa-Wahl 2018'}</h3>
      <p>{'Hier kannst du für die aufgestellten Kandidaten deine Stimme abgeben!'} <br />
        {'Du hast insgesamt 4 Stimmen, die in einem Vorgang genutzt werden können. Bereits abgegebene Stimmen können nicht mehr zurückgezogen werden, nicht abgegebene können nicht später vergeben werden.'}</p>
        <p>{'Der Aufstellungs-Zeitraum ist: '}<b>{'Mittwoch, 21.02. 00:00 Uhr – 25.02. 23:59 Uhr'}</b>{'. Danach beginnt die Wahl.'}</p>
        <p>{'Der Wahl-Zeitraum ist: '}<b>{'Montag, 26.02. 00:00 Uhr – 04.03. 23:59 Uhr'}</b>{'. Danach werden die künftigen Mitglieder des StuPas bekanntgegeben.'}</p>
      <p>{'Du wirst eine Mail bekommen, in der dein Token ist, mit dem du verifizierst, dass die abgegebenen Stimmen wirklich von dir kommen. Aus diesem Grund ist es wichtig, dass dein Postfach leer genug ist und dass du deine Wahlmail nicht weiterleitest!'}</p>
      <p>{'Es ist möglich, dass im laufenden Prozess neue Features eingebaut werden.'} <br />
        {'Alle Rechtschreibfehler gehören zum Design und sind gewollt.'}</p>
      <p>{'Bei Fragen, Anmerkungen und Verbesserungsideen meldet euch bitte bei Finja per Mail an '}<a href='mailto:finja.hauschild@nordakademie.de'>{'finja.hauschild@nordakademie.de'}</a></p>

    </div>);
}

export default Home;
