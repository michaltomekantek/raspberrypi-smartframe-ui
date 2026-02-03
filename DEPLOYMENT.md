# Szybkie uruchamianie na Raspberry Pi

Jeśli masz już folder `dist` na malince, wykonaj:

1. Instalacja serwera:
sudo npm install -g serve

2. Uruchomienie:
serve -s dist -l 3000

Aplikacja będzie dostępna pod adresem IP Twojej malinki na porcie 3000.
Pamiętaj o uruchomieniu backendu Python na porcie 8000!