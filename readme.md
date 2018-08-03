# Task

Paruošti real-time žinučių apsikeitimo sistemą naudojant socket.io ant
node.js.

Front-end dailies daryt nebūtina (ir reikalavimų jokių nėra), jei bus
galima jungles per https://www.npmjs.com/package/wscat.


Sistema turi tūrėti bent 1 public ir bent 1 private kanalą. Į private
kanalą patekti galima tik įvedus tam tikrą kodą (tarkim "secret").


Prisijungtus prie public kanalo, kanalas turėtų pasisveikinti.

Parašius žinutę "count" kanalas gražina prisijungusių klientų skaičių.

Kas 5 sekundes, kanalas siunčia random skaičių visiems kanalo dalyviams
(visiem ta patį).


Prisijungus prie private kanalo, dalyvis turi galėti parašyti žinutę, tą
žinutę turi gauti tik kitas dalyvis, kuris taip pat yra prisijungęs prie
šio kanalo.