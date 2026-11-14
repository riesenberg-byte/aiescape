# PWA-Starts im Dashboard

Die installierte App öffnet `/pwa-start.html`. Die datenfreie HTML-Seite leitet
sofort zur bisherigen Startseite weiter. Die explizite Manifest-ID bewahrt die
bisherige App-Identität; vorhandene Installationen müssen das Manifest aktualisieren.
Keine Cookies, Nutzerkennungen, Tracking-Skripte oder zusätzlichen Dienste.

Das private Dashboard zählt erfolgreiche GET-Abrufe dieses Startpfads aus
vorhandenen Cloudflare-Aggregaten. Query-Filter wie `?source=pwa` sind im
Free-Tarif nicht verfügbar. Gezählt werden Online-Abrufe, keine eindeutigen
Personen oder Installationen. Offline-Starts und das Fokussieren offener Fenster
bleiben unsichtbar; alte Installationen zählen erst nach dem Manifest-Update.
Der Startpfad gehört nicht in den Offline-Precache, da Vorabrufe sonst Starts
vortäuschen. Service Worker leiten bei fehlendem Netz zur bisherigen App weiter.
