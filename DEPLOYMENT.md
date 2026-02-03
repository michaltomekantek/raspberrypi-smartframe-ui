# Instrukcja dla Raspberry Pi (Gotowa Paczka)

Ta instrukcja zakłada, że zbudowałeś projekt wcześniej (`npm run build`) i przesłałeś folder `dist` na Raspberry Pi.

## 1. Instalacja Node.js
Jeśli jeszcze nie masz Node.js na malince:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Uruchomienie serwera
Na Raspberry Pi nie potrzebujesz już `npm install` ani `npm run build`. Wystarczy zainstalować lekki serwer i wskazać folder `dist`:

```bash
sudo npm install -g serve
# Przejdź do folderu z projektem i uruchom:
serve -s dist -l 3000
```

## 3. Dostęp
Aplikacja jest dostępna pod adresem: `http://<IP_TWOJEGO_PI>:3000`

---
**Zaleta:** Oszczędzasz czas i RAM na Raspberry Pi. Pamiętaj tylko, aby po każdej zmianie w kodzie uruchomić `npm run build` przed wysłaniem plików na malinkę.