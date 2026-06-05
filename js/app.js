// ============================================
// GHIZZO — IO SONO GHIZZO LIVE
// app.js — data, UI, countdown, modal, Firebase Wall
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ============ DATA ============ */

const RELEASE_DATE = new Date("2026-06-06T00:00:00+02:00"); // 00:00 CEST Italia

/* ============ VIDEO ============
   Per pubblicare il videoclip basta cambiare VIDEO_CONFIG.

   Esempi:
   - YouTube:  { kind: "youtube", id: "dQw4w9WgXcQ" }
   - Vimeo:    { kind: "vimeo",   id: "76979871"   }
   - MP4 locale: { kind: "mp4",   src: "assets/video/io-sono-ghizzo.mp4", poster: "assets/img/ghizzo-1.png" }
   - Nessun video (mostra placeholder): { kind: "none" }
*/
const VIDEO_CONFIG = { kind: "none" };

const LYRICS = {
  "un-giorno-qualunque": `[Verse]
C'è stato un tempo
che correvo senza guardare
come una macchina lanciata nella notte
senza sapere dove andare

E mi bastava
avere il mondo tra le mani
un pallone da rincorrere
e qualche sogno per domani

Poi certe strade
ti cambiano direzione
e lasciano silenzi dentro al petto
che non conoscevano parole

Ma sono ancora qui
con qualche cicatrice in più
e una gran voglia di gridare
che non è finita mai

[Chorus]
Quando si accendono le luci
Ghizzo è già pronto alla follia
cantiamo forte con gli amici
finché la notte scappa via

Quando si accendono le luci
e il mondo sembra andare via
io tengo stretto ogni secondo
come fosse l'ultimo che ho

E non lo lascio andare

[Verse]
La notte adesso
ha un sapore differente
riempio le piazze di sorrisi
e di facce che non vedo mai per niente

E mentre il basket
mi richiama dentro il fuoco
sento il rumore del cuore battere forte
come non faceva da un po'

E vedo Ghizzo nello specchio
con gli stessi occhi di sempre
ma dentro un po' più grande
e molto meno fragile

[Bridge]
Per tutte le volte
che pensavo fosse tardi

Per tutte le porte
che si sono chiuse piano

Per ogni abbraccio
che avrei voluto trattenere

Per ogni notte
che non tornerà più

Adesso sono qui

Più vivo
più vero

Più pronto a consumare il cielo

[Final Chorus]
Quando si accendono le luci
io voglio esserci ancora
cantare forte con gli amici
finché arriva l'aurora

Quando si accendono le luci
e sento tutti intorno a me
so che la vita non si aspetta

E allora vivila

Finché ce n'è`,

  "io-sono-ghizzo": `[Verse 1]
Le luci accese sopra il parquet
ma io non entro mai davvero
resto fermo dentro i miei perché
mentre il tempo mi passa leggero

Ho la partita dentro di me
ma non riesco a uscire fuori
ogni paura fa più rumore
di tutti quanti gli altri errori

[Pre-Chorus]
E mi ripeto "devi solo provarci"
ma la testa mi porta via
resto fermo a guardare gli altri
mentre perdo la mia scia

[Chorus]
Io sono Ghizzo, voglio Jimmy Trash
non resto fermo dentro di me
anche da qui io spingo ancora gas
finché non cambio tutto di me

Io sono Ghizzo, resta scritto qua
anche se cado poi torno su
entro un attimo, cambia la faccia
e finalmente mi vedo di più

[Verse 2]
Stop, respiro, silenzio totale
c'è solo il suono delle suole
ogni passo diventa reale
quando smetto di avere paura

Non è il campo che non mi vuole
sono io che resto indietro
ma stavolta tengo lo sguardo
e non mi nascondo più dentro

[Bridge]
E adesso basta guardare giù
non devo dimostrare a nessuno
questa partita la gioco io
contro quello che ero prima

[Chorus]
Io sono Ghizzo, voglio Jimmy Trash
ora lo senti come sto qua
difendo forte, non passo mai
questa energia non va più via

Io sono Ghizzo, non si spegne più
quello che ho dentro si vedrà
entro piccolo, esco più grande
e per un attimo cambia la realtà

[Outro]
E forse domani ricado giù
ma questa volta
so come si fa`,

  "mirko-party-events": `[Verse 1]
Non è solo un venerdì sera
non è solo stare qua
c'è qualcosa che si accende
quando parte la città

Luci basse, casse alte
gente che mi guarda già
ma stavolta non sto fermo
questa è roba mia

[Pre-Chorus]
Ho messo insieme le facce giuste
senza troppe regole
c'è chi accende, chi tiene il ritmo
chi la notte la sa muovere

Uno sistema tutto quanto
uno non si ferma mai
siamo dentro a questa idea
che non si spegne ormai

[Chorus]
Mirko Party Events
lo senti, parte e non si ferma
Mirko Party Events
questa notte ci trasforma

Tutti sanno cosa fare
tutti dentro a questa idea
Mirko Party Events
e la festa porta via

[Verse 2]
C'è chi spinge sulla cassa
c'è chi cura ogni dettaglio
c'è chi muove tutta la scena
senza fare mai rumore

Io li guardo e già capisco
che funziona più di me
questa cosa è diventata
più grande di com'è

[Pre-Chorus]
Ogni ruolo è scritto addosso
ognuno sa dov'è
non serve dire niente
quando il ritmo prende te

E la gente si muove
come avessimo una legge
ma è solo energia
che gira e non si spegne

[Bridge]
Non è solo fare festa
è dare forma a quello che sei
quando tutto gira insieme
non lo fermi più ormai

E non è più solo mio
quello che sta succedendo
è qualcosa che ci lega
mentre il mondo resta spento

[Chorus]
Mirko Party Events
lo senti, alza questa fiamma
Mirko Party Events
è la notte che richiama

Tutti dentro, stessa corsa
non si torna più indietro
Mirko Party Events
questa volta resta dentro

[Outro]
E domani forse passa
ma stanotte no
stanotte no`,

  "finche-ce-ne": `[Verse 1]
Certe notti restano addosso
come un segno che non va via
tra un parcheggio vuoto e un sogno
che non sapevo fosse mio

Ho rincorso mille strade
senza chiedermi perché
poi ho capito passo dopo passo
che mi stavano portando qui da te

[Pre-Chorus]
E non importa quante volte
ho perso il ritmo dentro me
ogni errore mi ha insegnato
a restare in piedi e dire

[Chorus]
Finché ce n'è
io resto ancora qua
sotto queste stesse luci
che mi hanno visto già

Finché ce n'è
non smetto di provarci
tra un tiro e una canzone
tra la notte e i miei passi

[Verse 2]
C'è il rumore del pallone
che rimbalza dentro me
e le voci dei miei amici
che mi tengono perché

Ogni festa, ogni partita
ogni volta che ho sbagliato
mi ha lasciato qualcosa dentro
che non ho mai dimenticato

[Pre-Chorus]
E adesso vedo più lontano
anche quando è buio ormai
perché tutto quello che ero
mi ha portato fino a qua

[Bridge]
Ghizzo è ancora nei silenzi
Mirko accende la città
e c'è un fuoco che adesso
non si spegnerà

Siamo quelli delle notti
che non tornano indietro
quelli che hanno perso tutto
per sentirsi più veri

[Chorus]
Finché ce n'è
io resto ancora qua
con la voce tra la gente
che mi chiama e se ne va

Finché ce n'è
non smetto di provarci
questa vita è un giro strano
ma continuo a restarci

[Final Chorus]
Finché ce n'è
alzate un po' le mani
che stanotte siamo vivi
più di ieri, più di domani

Finché ce n'è
cantiamo tutti insieme
che ogni istante è tutto quello
che davvero ci sostiene

[Outro]
Quando si accendono le luci
io voglio esserci ancora

Finché ce n'è`,

  "tra-due-luci-live": `Versione LIVE del brano "Tra Due Luci",
originariamente contenuta in "Ghizzo Fluo" (2025).

Registrata dal vivo nella stessa notte
del resto di "Io Sono Ghizzo Live".

--- TESTO ---

Ti vedo arrivare da lì, scarpe da gioco ma giacca chic
Hai fretta di andar via ma resti un minuto qui
C'è il suono del fischio in testa, ma anche un beat che ti resta
E tu mi dici: "Non lo so, non lo so"

Schiacci contro la vita ma poi decorala tu
In campo sei un uragano, la notte un déjà-vu
La gente ti chiama forte, ma tu confondi le porte
E dici ancora: "Non lo so, non lo so"

No che non sei solo un altro giocatore
Non dirlo mai, non è solo sudore
No che non sei solo il re delle feste
C'è di più, non c'è una parte che resta
Tra due luci ti accendi e ti spegni, Ghizzo
Tra silenzi e riflettori
E tu rispondi ancora: "Non lo so"

Pallone tra le mani, la testa in un locale
Scaldi la folla ma cerchi un posto normale
Ti alleni con gli orari ma balli fino a tardi
E dici ancora: "Non lo so, non lo so"

C'è chi ti vuole sempre deciso
Ma tu cambi forma come un sorriso
Tra la sirena e il brindisi
Tu sei l'anima e i lividi

E no, no che non devi scegliere adesso
Non dirlo mai, non tutto ha un compromesso
E no, tra canestri e champagne
La tua strada è proprio questa
Na-na-na, na-na-na-na, na-na-na, na-na-na
Na-na-na-na, na-na-na-na, tra due luci, Ghizzo, brillerai`,

  "jimmy-trash": `[Verse 1]
Guardo il campo e proprio lì la palla cade
Io che sbaglio un altro tiro da dimenticare
Dopo un po' la mia fiducia scompare
E mi sfogo con le parole da sparare

Faccio finta di esser forte nella squadra
Ma so bene che il talento non mi aiuta
L'unica arma che davvero so usare
È la lingua, e giuro, so come colpire

[Chorus]
Sono Jimmy Trash, ti sto già parlando
Dimmi se reggi, perché sto arrivando
Non so tirare, non so difendere
Ma so come farti impazzire per sempre

Sono Jimmy Trash, e so cosa fare
Ti prendo la testa, ti faccio sbagliare
Tu perdi il controllo, ti giochi la gara
E mentre protesti, la palla è già andata

[Verse 2]
Sento che ormai ti sto entrando nel gioco
Non è più questione di talento
Se ti vedo perdere il controllo
So che sto vincendo davvero

E poi, ti carichi di falli già
Senza sapere come finirà
E poi te la prendi, ma capita

Faccio finta di esser forte nella squadra
Ma so bene che il talento non mi aiuta

[Chorus]
Sono Jimmy Trash, ti sto già parlando
Dimmi se reggi, perché sto arrivando
Non so tirare, non so difendere
Ma so come farti impazzire per sempre

Sono Jimmy Trash, e so cosa fare
Ti prendo la testa, ti faccio sbagliare
Tu perdi il controllo, ti giochi la gara
E mentre protesti, la palla è già andata

[Outro]
Ultimo tiro, la tua buonanotte
Ma chi se ne frega, io resto presente
Ti guardo mentre impazzisci sul campo
Io voglio che cadi, che perdi così

Sono Jimmy Trash, ti sto già parlando
Dimmi se reggi, perché sto arrivando
Non so tirare, non so difendere
Ma so come farti impazzire per sempre`,

  "tra-due-luci": `[Verse 1]
Ti vedo arrivare da lì, scarpe da gioco ma giacca chic
Hai fretta di andar via ma resti un minuto qui
C'è il suono del fischio in testa, ma anche un beat che ti resta
E tu mi dici: "Non lo so, non lo so"

Schiacci contro la vita ma poi decorala tu
In campo sei un uragano, la notte un déjà-vu
La gente ti chiama forte, ma tu confondi le porte
E dici ancora: "Non lo so, non lo so"

[Chorus]
No che non sei solo un altro giocatore
Non dirlo mai, non è solo sudore
No che non sei solo il re delle feste
C'è di più, non c'è una parte che resta
Tra due luci ti accendi e ti spegni, Ghizzo
Tra silenzi e riflettori
E tu rispondi ancora: "Non lo so"

[Verse 2]
Pallone tra le mani, la testa in un locale
Scaldi la folla ma cerchi un posto normale
Ti alleni con gli orari ma balli fino a tardi
E dici ancora: "Non lo so, non lo so"

[Chorus]
No che non sei solo un altro giocatore
Non dirlo mai, non è solo sudore
No che non sei solo il re delle feste
C'è di più, non c'è una parte che resta
Tra due luci ti accendi e ti spegni, Ghizzo
Tra silenzi e riflettori
E tu rispondi ancora: "Non lo so"

[Bridge]
C'è chi ti vuole sempre deciso
Ma tu cambi forma come un sorriso
Tra la sirena e il brindisi
Tu sei l'anima e i lividi

[Outro]
E no, no che non devi scegliere adesso
Non dirlo mai, non tutto ha un compromesso
E no, tra canestri e champagne
La tua strada è proprio questa
Na-na-na, na-na-na-na, na-na-na, na-na-na
Na-na-na-na, na-na-na-na, tra due luci, Ghizzo, brillerai`,

  "party-time": `[Verse 1]
All'inizio era solo una stanza
due casse rotte e una bottiglia in bilico
Una torta sbagliata per Laura
e i palloncini legati a un citofono

Playlist sbagliata, gente in ritardo
lui rideva: "Dai che parte il ricordo"
Anche se nessuno ballava
lui già vedeva la strada

[Pre-Chorus]
E anche se il tempo passava
e le luci si spegnevano presto
Lui teneva acceso un sogno
dove ogni sbaglio era un gesto

[Chorus]
E adesso canta la città
"Ghizzo, fai brillare l'anima!"
Da un garage all'Himalaya
porta il beat con la stessa faccia
Non ha mai avuto il vestito giusto
ma ha sempre avuto la musica
E se Jimmy Trash è fuoco e rabbia
Ghizzo è la notte che abbraccia

[Verse 2]
Festa di laurea saltata
perché il proiettore mandava il meteo
Poi quella a tema anni '80
ma nessuno capiva il concetto

Ma Ghizzo prendeva appunti
tra figuracce e bicchieri rotti
Diceva: "Un giorno sarà diverso
avrò la notte nel petto"

[Pre-Chorus]
E tra luci che tremano ancora
e l'ansia di fare tutto perfetto
Ha trovato il suo stile
nel caos più diretto

[Chorus]
E adesso canta la città
"Ghizzo, fai brillare l'anima!"
Sotto led e coriandoli d'oro
fa danzare chi resta da solo
Non ha mai avuto il passo più figo
ma adesso comanda la musica
E se Jimmy Trash è schiacciata e sfida
Ghizzo è magia che vibra

[Bridge]
Non è mai stato il più trendy
né il primo della lista
Ma ha capito che il cuore
vale più di una pista

E adesso chi balla
non vuole più andar via
Perché Ghizzo c'è sempre
dove vibra l'energia

[Final Chorus]
E adesso canta la città
"Ghizzo, fai brillare l'anima!"
Ogni notte è una firma sua
una favola sotto la luna
Non ha mai avuto il biglietto giusto
ma ha sempre invitato la vita
E se Jimmy Trash vola per vincere
Ghizzo fa festa infinita`,

  "ghizzo-devastante": `[Verse 1]
Un po' mi mancherà,
sentirli commentar,
sbagliavo troppe scelte

Passaggi fatti male,
tiri da dimenticare,
sentivo solo offese

Le urla del coach che si arrabbia
mentre sto in panchina

Mi dicono "svegliati,
impara la disciplina!"

[Pre-Chorus]
I falli e le cadute
Le urla dalla tribuna
Le spalle un po' più dure

Ricordati di me,
che forzavo ogni tiro

Senza mai pensare
a quel passaggio giusto in più

Ricordati di me,
sempre in ritardo lì

Ma quante volte
devo ancora dirti
Ma quante

[Chorus]
Ma quante volte
devo ancora dirti che mi spiace
Che non ero capace
A giocare senza farmi notare

Non capivo che bastava migliorare
Difendere e aiutare
Avevo dubbi su di me, ma so che

Voglio, voglio io,
solo io, soltanto io, ah

Ti dirò, cambierà,
e chissene frega

Lascio tutto il resto,
non è importante
Ora sono devastante
Ora sono devastante

[Verse 2]
Pensa che classico
Sempre perso dentro un gioco statico
Restavo fermo senza dare
Né difesa, né rimbalzi

Uh, ma guarda un po'
Ora segno e tutti si accorgono
Che bastava impegnarmi davvero
Ora mi sento più leggero

So quando tagliare
e quando passo

Buonanotte, io resto ancora un po' in campo
Che ho voglia di urlare
e sentire l'impatto

[Bridge]
Adesso non mi fermo
Potrei pure stare a marcarli da solo
Fare la parte di quello che vola

Se te la sentirai
Tu ricordati di me

In difesa dentro al campo
A chiudere ogni spazio
e non sbagliare più un rimbalzo

Ricordati di me,
che ora so aiutare

Ma quante cose
devo ancora dirti
Ma quante

[Final Chorus]
Ma quante volte
devo ancora dirti che mi spiace
Che non ero capace
A giocare senza farmi notare

Non capivo che bastava migliorare
Difendere e aiutare
Avevo dubbi su di me, ma so che

Voglio, voglio io,
solo io, soltanto io, ah

Ti dirò, cambierà,
e chissene frega

Lascio tutto il resto,
non è importante
Ora sono devastante
GHIZZO è devastante`
};

// available:true => link Suno attivo (primo singolo)
// available:false => link disabilitato fino al lancio dell'album
const NEW_ALBUM = [
  { id: "un-giorno-qualunque", title: "Un Giorno Qualunque", suno: "https://suno.com/s/RA4jQRrSiPjXcbKI",                  available: false },
  { id: "io-sono-ghizzo",      title: "Io Sono Ghizzo",      suno: "https://suno.com/s/MITudM6UZla4yuOe",                  available: true,  single: true },
  { id: "mirko-party-events",  title: "Mirko Party Events",  suno: "https://suno.com/s/svJaT2l74G2vW9lW",                  available: false },
  { id: "finche-ce-ne",        title: "Finché ce n'è",       suno: "https://suno.com/song/dba6cd11-554a-416b-9c7a-6623bf0fe291", available: false },
  { id: "tra-due-luci-live",   title: "Tra Due Luci (Live)", suno: "https://suno.com/s/c2K32NcyGIhNIAe0",                  available: false }
];

const OLD_ALBUM = [
  { id: "jimmy-trash",       title: "Jimmy Trash",       suno: "https://suno.com/s/msEzjYFOmfusqMQM" },
  { id: "tra-due-luci",      title: "Tra Due Luci",      suno: "https://suno.com/s/BR1G2enqiKb9vIGQ" },
  { id: "party-time",        title: "Party Time",        suno: "https://suno.com/s/gNKB4LsLIuvP3kET" },
  { id: "ghizzo-devastante", title: "Ghizzo Devastante", suno: "https://suno.com/s/iSOlNbpdUoPxgwqq" }
];

const PRESS = [
  {
    source: "ROLLING STONE ITALIA",
    rating: "★★★★☆",
    title: "Ghizzo, la voce di Senago che adesso riempie i palazzetti",
    quote: "«Quando si accendono le luci io voglio esserci ancora.» Bastano dieci secondi del live di apertura per capire che 'Io Sono Ghizzo Live' non è un disco, è una presa di parola. Il cantautore lombardo arriva al centro del discorso pop italiano con un'energia che non si vedeva da tempo.",
    author: "di Lorenzo Vannini · 4 giugno 2026"
  },
  {
    source: "ROCKOL",
    rating: "★★★★★",
    title: "Da Mirko Party Events al palco: il caso Ghizzo spiegato bene",
    quote: "«Non è solo fare festa, è dare forma a quello che sei», ci dice mentre prova il soundcheck. Il ragazzo del 2003 ha trasformato un'organizzazione di eventi privati in un universo musicale coerente, e oggi dal vivo dimostra di avere già la maturità di un nome importante.",
    author: "di Giada Marchetti · 3 giugno 2026"
  },
  {
    source: "LA REPUBBLICA — SPETTACOLI",
    rating: "RECENSIONE",
    title: "«Il basket mi ha insegnato a tenere lo sguardo». Intervista a Ghizzo",
    quote: "«Tutto quello che ero mi ha portato fino a qua. Io Sono Ghizzo è nata così: stop, respiro, silenzio totale, e poi entri. Il resto è solo crescere.» Una conversazione tra parquet, azienda di famiglia e le notti della Brianza.",
    author: "di Marco Sironi · 2 giugno 2026"
  },
  {
    source: "SKY TG24",
    rating: "INTERVISTA",
    title: "Ghizzo annuncia il tour 2026 nei palazzetti italiani",
    quote: "«Settembre parto e non mi fermo finché ce n'è. Forum Assago, Unipol Arena, Inalpi: voglio che ogni sera la gente alzi un po' le mani e si senta più viva.» Il cantautore lombardo apre il tour il 18 settembre da Milano.",
    author: "Redazione Sky TG24 · 1 giugno 2026"
  },
  {
    source: "BILLBOARD ITALIA",
    rating: "ALBUM OF THE WEEK",
    title: "'Io Sono Ghizzo Live': cinque tracce e un'identità chiarissima",
    quote: "La distanza tra 'Ghizzo Fluo' del 2025 e questo live è la distanza che passa tra una promessa e un fatto. Il cantautore di Senago oggi semplicemente è: arriva, prende il palco, lo tiene. Voto: 8.5.",
    author: "di Valeria Costa · 5 giugno 2026"
  },
  {
    source: "ALL MUSIC ITALIA",
    rating: "★★★★☆",
    title: "«Stanotte siamo vivi più di ieri»: cronaca di un rito collettivo",
    quote: "In quaranta minuti scarsi c'è tutto: il pallone che rimbalza, la cassa che spinge, i silenzi del Bridge in 'Mirko Party Events'. È un live che suona come un disco vero, costruito con la consapevolezza di chi sa già dove vuole arrivare.",
    author: "di Filippo Crespi · 5 giugno 2026"
  },
  {
    source: "VANITY FAIR ITALIA",
    rating: "COVER STORY",
    title: "«Tra canestri e champagne, la mia strada è proprio questa»",
    quote: "«Mi chiedono sempre di scegliere: sportivo o cantante, palestra o palcoscenico. La verità è che brillo proprio sul confine. Tra due luci, come dicevo già nel primo disco.» Sei pagine con Ghizzo, ventitré anni, in copertina con la giacca chic sopra la canotta.",
    author: "di Cecilia Mariani · 4 giugno 2026"
  },
  {
    source: "GAZZETTA DELLO SPORT",
    rating: "SPORT & MUSICA",
    title: "Ghizzo: dal parquet al palco, una crescita da playmaker",
    quote: "«Il basket mi ha insegnato la lettura del gioco prima ancora del canestro. Adesso so quando tagliare e quando passare — vale per la partita, vale per i pezzi.» Il giocatore-cantautore racconta come la disciplina del campo abbia dato struttura anche alla sua musica.",
    author: "di Tommaso Bellini · 3 giugno 2026"
  },
  {
    source: "IL FATTO QUOTIDIANO — CULTURA",
    rating: "INTERVISTA",
    title: "«Ora sono devastante». Ghizzo, ritratto di un'evoluzione",
    quote: "Da 'Ghizzo Devastante' — il manifesto della maturità sportiva del 2025 — a 'Io Sono Ghizzo Live'. Una linea retta che attraversa difese chiuse, festa infinita e voce in primo piano. «Adesso so quando tagliare e quando passare. Anche con le parole.»",
    author: "di Anna Fior · 2 giugno 2026"
  }
];

const TOUR = [
  { date: "18 SET", city: "Milano",   venue: "Mediolanum Forum (Assago)" },
  { date: "24 SET", city: "Torino",   venue: "Inalpi Arena" },
  { date: "02 OTT", city: "Bologna",  venue: "Unipol Arena (Casalecchio)" },
  { date: "10 OTT", city: "Roma",     venue: "Palazzo dello Sport" },
  { date: "17 OTT", city: "Firenze",  venue: "Mandela Forum" },
  { date: "24 OTT", city: "Napoli",   venue: "Palapartenope" },
  { date: "07 NOV", city: "Bari",     venue: "Palaflorio" },
  { date: "14 NOV", city: "Padova",   venue: "Kioene Arena" },
  { date: "22 NOV", city: "Senago",   venue: "PalaSenago — Home Show" }
];

/* ============ FIREBASE ============ */

const firebaseConfig = {
  apiKey: "AIzaSyCv_bgaQEEn_GdDVwISZEPTUsgVKeV9vUg",
  authDomain: "ghizzo-wall.firebaseapp.com",
  projectId: "ghizzo-wall",
  storageBucket: "ghizzo-wall.firebasestorage.app",
  messagingSenderId: "4259442671",
  appId: "1:4259442671:web:23d7d523cb9a97d560901a",
  measurementId: "G-HC40J91L9T"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);
const wallCol = collection(db, "wall");

/* ============ NAV ============ */

const navBurger = document.getElementById("navBurger");
const navLinks  = document.getElementById("navLinks");

navBurger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navBurger.classList.toggle("is-open", open);
  navBurger.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navBurger.classList.remove("is-open");
    navBurger.setAttribute("aria-expanded", "false");
  });
});

/* ============ COUNTDOWN ============ */

const cdEls = {
  days:  document.getElementById("cdDays"),
  hours: document.getElementById("cdHours"),
  mins:  document.getElementById("cdMins"),
  secs:  document.getElementById("cdSecs"),
  cap:   document.getElementById("cdCaption")
};

function tickCountdown() {
  const now = new Date();
  const diff = RELEASE_DATE - now;

  if (diff <= 0) {
    cdEls.days.textContent = cdEls.hours.textContent =
    cdEls.mins.textContent = cdEls.secs.textContent = "00";
    cdEls.cap.innerHTML = '<strong style="color:var(--fluo-3)">FUORI ORA</strong> · Io Sono Ghizzo Live è disponibile';
    return;
  }
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  cdEls.days.textContent  = String(d).padStart(2, "0");
  cdEls.hours.textContent = String(h).padStart(2, "0");
  cdEls.mins.textContent  = String(m).padStart(2, "0");
  cdEls.secs.textContent  = String(sec).padStart(2, "0");
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ============ TRACKLIST + DISCO ============ */

const tracksNew = document.getElementById("tracksNew");
NEW_ALBUM.forEach(t => {
  const li = document.createElement("li");
  li.className = "track" + (t.single ? " track--single" : "");
  li.dataset.id = t.id;

  const badge = t.single
    ? `<span class="track__badge track__badge--out">PRIMO SINGOLO · FUORI ORA</span>`
    : `<span class="track__badge track__badge--soon">DAL 6 GIUGNO · 00:00</span>`;

  li.innerHTML = `
    <span class="track__num"></span>
    <div>
      <div class="track__title">${t.title}</div>
      <div class="track__meta">${badge}</div>
    </div>
    <span class="track__action">TESTO ↗</span>
  `;
  li.addEventListener("click", () => openLyrics(t));
  tracksNew.appendChild(li);
});

const discoNew = document.getElementById("discoNew");
NEW_ALBUM.forEach(t => {
  const li = document.createElement("li");
  const linkHtml = t.available
    ? `<a href="${t.suno}" target="_blank" rel="noopener">SUNO ↗</a>`
    : `<span class="disco__locked" title="Disponibile dal 6 giugno alle 00:00">🔒 6 GIU · 00:00</span>`;
  li.innerHTML = `<span>${t.title}${t.single ? ' <em class="disco__tag">SINGOLO</em>' : ''}</span>${linkHtml}`;
  discoNew.appendChild(li);
});

const discoOld = document.getElementById("discoOld");
OLD_ALBUM.forEach(t => {
  const li = document.createElement("li");
  li.className = "album__track";
  li.innerHTML = `
    <button type="button" class="album__tracktitle" data-id="${t.id}">${t.title} <span class="album__lyrtag">TESTO</span></button>
    <a href="${t.suno}" target="_blank" rel="noopener">SUNO ↗</a>
  `;
  // click sul titolo apre il modal con lyrics
  li.querySelector(".album__tracktitle").addEventListener("click", () => {
    openLyrics({ ...t, available: true });
  });
  discoOld.appendChild(li);
});

/* ============ PRESS ============ */

const pressList = document.getElementById("pressList");
PRESS.forEach(p => {
  const card = document.createElement("article");
  card.className = "press__card";
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
      <span class="press__source">${p.source}</span>
      <span class="press__rate">${p.rating}</span>
    </div>
    <h3 class="press__title">${p.title}</h3>
    <p class="press__quote">${p.quote}</p>
    <p class="press__author">${p.author}</p>
  `;
  pressList.appendChild(card);
});

/* ============ TOUR ============ */

const tourList = document.getElementById("tourList");
TOUR.forEach(d => {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="tour__date">${d.date}</span>
    <span><span class="tour__city">${d.city}</span><br><span class="tour__venue">${d.venue}</span></span>
    <span class="track__action">SOLD OUT?</span>
  `;
  tourList.appendChild(li);
});

/* ============ VIDEO ============ */

function renderVideo() {
  const host = document.getElementById("videoPlayer");
  if (!host) return;
  const cfg = VIDEO_CONFIG;
  if (!cfg || cfg.kind === "none") return; // lascia il placeholder

  let inner = "";
  if (cfg.kind === "youtube" && cfg.id) {
    inner = `<iframe
      src="https://www.youtube-nocookie.com/embed/${cfg.id}?rel=0&modestbranding=1"
      title="Videoclip Io Sono Ghizzo"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen loading="lazy"></iframe>`;
  } else if (cfg.kind === "vimeo" && cfg.id) {
    inner = `<iframe
      src="https://player.vimeo.com/video/${cfg.id}?dnt=1"
      title="Videoclip Io Sono Ghizzo"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen loading="lazy"></iframe>`;
  } else if (cfg.kind === "mp4" && cfg.src) {
    const poster = cfg.poster ? ` poster="${cfg.poster}"` : "";
    inner = `<video controls playsinline preload="metadata"${poster}>
      <source src="${cfg.src}" type="video/mp4">
      Il tuo browser non supporta il tag video.
    </video>`;
  }
  if (inner) host.innerHTML = inner;
}
renderVideo();

/* ============ LYRICS MODAL ============ */

const modal = document.getElementById("lyricsModal");
const lyricsTitle = document.getElementById("lyricsTitle");
const lyricsBody  = document.getElementById("lyricsBody");
const lyricsSuno  = document.getElementById("lyricsSuno");

function openLyrics(track) {
  lyricsTitle.textContent = track.title;
  lyricsBody.textContent  = LYRICS[track.id] || "Testo non disponibile.";
  if (track.available) {
    lyricsSuno.href = track.suno;
    lyricsSuno.textContent = track.single ? "ASCOLTA IL SINGOLO SU SUNO ↗" : "ASCOLTA SU SUNO ↗";
    lyricsSuno.classList.remove("is-disabled");
    lyricsSuno.removeAttribute("aria-disabled");
  } else {
    lyricsSuno.removeAttribute("href");
    lyricsSuno.textContent = "🔒 DISPONIBILE DAL 6 GIUGNO · 00:00";
    lyricsSuno.classList.add("is-disabled");
    lyricsSuno.setAttribute("aria-disabled", "true");
  }
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLyrics() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
modal.addEventListener("click", e => {
  if (e.target.matches("[data-close]")) closeLyrics();
  if (e.target === lyricsSuno && lyricsSuno.classList.contains("is-disabled")) {
    e.preventDefault();
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeLyrics();
});

/* ============ WALL — FIRESTORE ============ */

const wallGrid    = document.getElementById("wallGrid");
const wallForm    = document.getElementById("wallForm");
const wallName    = document.getElementById("wallName");
const wallMsg     = document.getElementById("wallMsg");
const wallStatus  = document.getElementById("wallStatus");
const wallSubmit  = document.getElementById("wallSubmit");

function setStatus(msg, kind = "") {
  wallStatus.textContent = msg;
  wallStatus.className = "wall-form__status" + (kind ? " is-" + kind : "");
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function timeAgo(date) {
  if (!date) return "ora";
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s fa`;
  if (s < 3600) return `${Math.floor(s/60)}m fa`;
  if (s < 86400) return `${Math.floor(s/3600)}h fa`;
  return `${Math.floor(s/86400)}g fa`;
}

function renderWall(docs) {
  if (!docs.length) {
    wallGrid.innerHTML = '<p class="wall__loading">Ancora nessun messaggio. Lascia il primo!</p>';
    return;
  }
  wallGrid.innerHTML = docs.map((d, i) => {
    const colorCls = "note--c" + ((i % 6) + 1);
    const name = escapeHtml(d.name || "Anonimo");
    const msg  = escapeHtml(d.message || "");
    const when = d.createdAt ? timeAgo(d.createdAt.toDate()) : "ora";
    return `
      <div class="note ${colorCls}">
        <p class="note__msg">${msg}</p>
        <div class="note__foot">
          <span class="note__name">${name}</span>
          <span class="note__time">${when}</span>
        </div>
      </div>
    `;
  }).join("");
}

// Sottoscrizione realtime
try {
  const q = query(wallCol, orderBy("createdAt", "desc"), limit(200));
  onSnapshot(q, snap => {
    const docs = snap.docs.map(d => d.data());
    renderWall(docs);
  }, err => {
    console.error("Wall subscribe error:", err);
    wallGrid.innerHTML = '<p class="wall__loading">Errore nel caricamento del muro. Riprova fra poco.</p>';
  });
} catch (e) {
  console.error(e);
}

// Invio messaggio
wallForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = wallName.value.trim();
  const message = wallMsg.value.trim();
  if (!name || !message) return;

  wallSubmit.disabled = true;
  setStatus("Sto appendendo il messaggio…");

  try {
    await addDoc(wallCol, {
      name: name.slice(0, 40),
      message: message.slice(0, 240),
      createdAt: serverTimestamp()
    });
    wallMsg.value = "";
    setStatus("Messaggio appeso al muro!", "ok");
    setTimeout(() => setStatus(""), 2500);
  } catch (err) {
    console.error(err);
    setStatus("Errore: " + (err.message || "riprova fra poco."), "error");
  } finally {
    wallSubmit.disabled = false;
  }
});
