ZASTO BAS OVAKVA STRUKTURA API LAYER-A

- useUserController zoves samo ako zoves funkcije koje ne zahtevaju autorizaciju (ovaj kontroler ne mora da bude hook al nema veze)
- useUserControllerAuth korisnik ako ti trebaju endpointi koji zahtevaju autorizaciju

Controleri moraju da budu tsx, i moraju da budu react hookovi, zato sto oni koriste context koji je specifican za react i da bi
mogli da citamo kontekst moramo da budemo unutar react komponente
React hookovi pocinju sa use... i u sustini su funkcije koje pozivamo koje vracaju funkciju koju zapravo zovemo unutar react komponente

- Mogo sam da stavim i ovo u hooks folder jer su ovo sve hookovi, ali mi ima vise smisla da stoji ovde u api folder

- Svaki Controller vraca objekat koji sadrzi funkcije koje pozivaju endpoint na serveru, moze i svaka funkcija da se stavi u poseban fajl ali mislim da nema potrebe

- Obicna axios instanca se koristi za api pozive koje ne zahtevaju nikakvu autorizaciju dok
  axiosPrivate se koristi kada je potreba autorizacija

- U UserController su svi endpointi koji su isti za svakog tipa usera, ali mora da se prosledi kao argument tip korisnika da bi funkcija znala koji endpont da pozove
- Kasnije ce najverovatnije da se kreira MajstorControler, KorisnikControler... koji sadrze jedinstvene funkcije samo za tog tipa korisnika

- Odlucio sam da ne stavljam da se hook-u userController-a ne prosledjuje tip usera vec svakoj funkciji pojedinacno, zato sto kada se pozove hook za userController on mora
  da bude odmah na pocetku react komponente i to nas ogranicava da se odmah odlucimo za tip, medjutim odredjene react komponente tek kasnije saznaju koj user endpoint zele da pozovu
PROBLEM SA OVIM: 
- posto unutar userControllera moram odma da znam tip korisnika (sto nije moguce ako funckiji prosledjujem tip a ne hook-u) da bi prosledio usePrivateAxios hooku, ovo nije dobro resenje
  Onda moram da kreiram novi kontroler koji ce samo da koristi axiosPrivate i onda tom hook-u prosledjuem tip usera, i u taj kontroler guram funkcije koje zahtevaju autorizaciju jer
  smo tada sigurni da nemamo potrebe da zovemo endponte za vise tipa korisnika (jer samo jedan tip korisnika moze da bude ulogovan na jednom racunaru duh)

- Posto se koristi axios moze da se kreira centralizovno handlovanje error-a (koji se radi uz pomoz interceptora), ali mora da se uradi tako da moze da se izabere
  da li zelomo da korisimo global error handler ili lokalan, jer handlovanje error nije isto za svaki endpoint, problem je sto vec korisimo iterceptor za nesto drugo.
  Da ne bi komplikovali stvari previse za sada svaki api poziv posebno handluje error, to jeste pisanje jednog te istog koda vise puta ali nema da te boli glava da nesto ne crkne