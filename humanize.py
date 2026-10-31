from pathlib import Path
import re
D=Path(__file__).resolve().parent/'dist'
changes={
'ZweiKlang · Zwei Köpfe. Ein Groove.':'ZweiKlang · DJ-Duo aus Freiburg',
'Zwei Köpfe.<br>Ein <em>Groove.</em>':'Wir sind<br>ZweiKlang.',
'House, der sich nach dem Moment anfühlt.<br>Von der goldenen Stunde bis tief in die Nacht.':'Wir sind ghostak und artemis aus Freiburg und legen zusammen House auf. Hier findet ihr unsere Sets, ein paar Bilder und alles für eine Booking-Anfrage.',
'Independent DJ duo · Freiburg im Breisgau':'DJ-Duo aus Freiburg',
'Unseren Sound entdecken':'Ein Set anhören',
'Runterkommen. Reinhören.':'Zu unserer Musik',
'House music. Good company.':'Musik und Kontakt',
'Aus Freiburg. Für den Moment.':'ghostak &amp; artemis · Freiburg',
'Einfach mal<br><em>treiben lassen.</em>':'Unser Set vom<br>Opfinger Baggersee',
'Ein Set vom Opfinger Baggersee.<br>Organischer Groove, tiefe Bässe und Zeit zum Abschalten.':'Am Opfinger Baggersee aufgenommen. Wenn ihr hören wollt, was wir spielen, hört hier rein.',
'The lakeside session':'Auf SoundCloud',
'Opfinger<br>Baggersee.':'Reinhören',
'Ein Stück Sommer zum Mitnehmen. Unser DJ-Set direkt auf SoundCloud.':'Das ganze Set findet ihr auf SoundCloud. Ihr könnt es auch direkt hier im Player starten.',
'ZK / FREIBURG SESSIONS':'ZWEIKLANG / DJ-SET',
'GOOD MUSIC. GOOD COMPANY.':'AUFGENOMMEN AM OPFINGER BAGGERSEE',
'Recorded moments':'Videos',
'Nicht nur hören.<br><em>Dabei sein.</em>':'Unsere DJ-Sets auf YouTube',
'Besondere Orte. Echte Sessions. Unser Sound.':'Weitere Aufnahmen findet ihr auf unserem YouTube-Kanal.',
'Zwei Freunde.<br>Eine <em>Frequenz.</em>':'ghostak &amp; artemis',
'Wir sind ghostak &amp; artemis aus Freiburg. Was uns verbindet? Die Begeisterung für House.':'Wir kommen beide aus Freiburg und hören schon lange gerne House.',
'Irgendwann wurde aus gemeinsam Musik hören gemeinsam auflegen. Heute spielen wir in Bars und Clubs und nehmen seit 2025 auch YouTube-Sets auf – mit besonderen Locations und Drohnen-Shots von Artemis.':'Irgendwann haben wir angefangen, zusammen aufzulegen. Seitdem spielen wir in Bars und Clubs und nehmen seit 2025 auch Sets für YouTube auf. Die Drohnenaufnahmen macht Artemis.',
'Live & Erinnerungen':'Auftritte',
'Gute Orte.<br><em>Noch bessere Nächte.</em>':'Wo wir aufgelegt haben',
'Ein Blick zurück auf unsere Sessions.<br>Neue Termine? Schreib uns.':'Hier findet ihr einige unserer bisherigen Auftritte und Aufnahmen. Für neue Termine schreibt uns gerne.',
'Euer Ort.<br><em>Unser Sound.</em>':'ZweiKlang buchen',
'Jeder Gig beginnt bei euch: mit der Location, der Stimmung und dem Moment. Format, Dauer und Preis stimmen wir gemeinsam ab.':'Ihr sucht DJs für eure Bar, euren Club oder eine private Veranstaltung? Schreibt uns, was ihr vorhabt. Dann besprechen wir Musik, Technik, Dauer und Preis.',
'01 / LIVE':'DJ-Set',
'02 / FILM':'Video',
'03 / ALL NIGHT':'Langer Abend',
'Ein Abend,<br>der bleibt.':'Live auflegen',
'Eure Location.<br>Unsere Session.':'Ein Set bei euch aufnehmen',
'Vom ersten Track<br>bis zum letzten.':'All Night Long',
'Live DJ Set für Bar, Café oder Club. Von entspanntem Ambiente bis zur Main Time.':'Wir legen in Bars, Cafés und Clubs auf. Welche Musik passt, besprechen wir vorher mit euch.',
'YouTube-Kooperation mit Musik, Verlinkung und Drohnen-Shots eurer Location.':'Wir nehmen ein DJ-Set bei euch auf und veröffentlichen es auf YouTube. Verlinkung und Drohnenaufnahmen können wir mit einplanen.',
'All Night Long. Ein durchgehender musikalischer Bogen für euren ganzen Abend.':'Wir können auch den ganzen Abend übernehmen. Musikrichtung und Ablauf klären wir gemeinsam.',
"Let's make it happen":'Kontakt',
'Der nächste<br>gute Abend<br>beginnt <em>hier.</em>':'Schreibt uns.',
'Club-Slot, Rooftop, private Session oder gemeinsame Idee: Wir freuen uns, von euch zu hören.':'Für Bookings oder eine gemeinsame Idee erreicht ihr uns per E-Mail oder WhatsApp. Datum, Ort und ungefähre Spielzeit helfen uns bei der Planung.',
'Dein nächster guter Abend':'Booking-Anfrage',
'Erzähl uns von deiner Idee.':'Was habt ihr vor?',
'Vibe, Zeitfenster, Technik – was habt ihr vor?':'Was plant ihr? Wie lange sollen wir spielen und welche Technik ist vor Ort?',
'Zusammen klingt’s<br><em>einfach besser.</em>':'Über uns',
'House ist unser gemeinsamer Nenner. Alles andere entsteht im Moment.':'Wir sind ghostak und artemis und machen zusammen Musik als ZweiKlang.',
'Vom Zuhören<br>zum <em>Auflegen.</em>':'Wie es angefangen hat',
'Wir haben uns schon immer für House begeistert – und irgendwann beschlossen, selbst gemeinsam hinter die Decks zu gehen.':'Wir haben beide gerne House gehört und irgendwann beschlossen, zusammen aufzulegen.',
'Ob Bar, Club oder draußen: Wir stimmen jedes Set auf den Ort und die Stimmung ab. Seit 2025 halten wir unsere Sessions auch auf YouTube fest. Artemis ergänzt die Aufnahmen mit Drohnen-Shots.':'Was wir spielen, hängt vom Abend ab. In einer Bar passt etwas anderes als im Club. Draußen nehmen wir auch gerne Sets auf, die ihr euch auf YouTube anschauen könnt.',
'Sessions / The collection':'YouTube',
'Ein Ort.<br>Ein Set. <em>Ein Gefühl.</em>':'Unsere Sets',
'Unsere Sessions zum Eintauchen – direkt auf YouTube.':'Hier könnt ihr euch unsere aufgenommenen Sets anschauen. Ein Klick öffnet das Video auf YouTube.',
'Live / In good company':'Auftritte',
'Am besten<br><em>zusammen.</em>':'Live mit ZweiKlang',
'Musik ist ein guter Grund, sich zu treffen.':'Hier seht ihr, wo wir bisher gespielt und Sets aufgenommen haben.',
'Einen Abend planen':'Booking anfragen',
'Weitere<br><em>Erinnerungen.</em>':'Weitere Auftritte',
'404 / Kurz aus dem Takt':'Fehler 404',
'Der Beat geht<br><em>woanders weiter.</em>':'Seite nicht gefunden',
'Diese Seite gibt es leider nicht.':'Unter dieser Adresse gibt es keine Seite. Über die Startseite findet ihr unsere Musik und Kontaktdaten.',
'Zurück zur Musik':'Zur Startseite',
'Club night':'Bar / Club',
'Outdoor session':'Draußen',
'Rooftop session':'Rooftop',
'Live &amp; Archiv':'Bisherige Auftritte',
'FROM FREIBURG<br>WITH GROOVE.':'ghostak &amp; artemis',
}
for p in D.glob('*.html'):
 s=p.read_text()
 for a,b in changes.items():s=s.replace(a,b)
 s=re.sub(r'<div class="floating-note">.*?</div>','',s)
 s=re.sub(r'<div class="duo-stamp"[^>]*>.*?</div>','',s)
 s=re.sub(r'<div class="genre-band"[^>]*>.*?</div></div>','',s)
 s=re.sub(r'<div class="footer-wordmark"[^>]*>.*?</div>','',s)
 s=re.sub(r'<span class="hero-coordinate">.*?</span>','',s)
 s=re.sub(r'<blockquote>.*?</blockquote>','',s)
 s=re.sub(r'<div class="container legacy-wrap">.*?</details></div>','',s)
 s=re.sub(r'(<p class="eyebrow">)<span>\d+ /</span>\s*',r'\1',s)
 s=s.replace('<span class="brand-mark" aria-hidden="true"><i></i><i></i></span>','<img class="brand-logo" src="assets/logo.png" alt="" width="38" height="38">')
 s=s.replace('<span>ZweiKlang<span class="brand-period">.</span></span>','<span>ZweiKlang</span>').replace('<span>ZweiKlang.</span>','<span>ZweiKlang</span>')
 p.write_text(s)
