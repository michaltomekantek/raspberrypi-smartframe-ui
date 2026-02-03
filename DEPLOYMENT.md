# Instrukcja wdrożenia na Raspberry Pi

## 1. Instalacja Node.js
Jeśli jeszcze nie masz Node.js, zainstaluj go:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Budowanie projektu
Przejdź do folderu z kodem i wykonaj:
```bash
npm install
npm run build
```
Po zakończeniu powstanie folder `dist`.

## 3. Uruchomienie aplikacji
Możesz użyć lekkiego serwera `serve`:
```bash
npx serve -s dist -l 3000
```
Aplikacja będzie dostępna pod adresem IP Twojego Raspberry Pi na porcie 3000.

## 4. Konfiguracja API
W pliku `src/components/ImageUpload.tsx` znajdziesz linię:
`const response = await fetch('http://127.0.0.1:8000/upload', ...`

Jeśli planujesz wgrywać zdjęcia z innych urządzeń w tej samej sieci (np. smartfona), zmień `127.0.0.1` na adres IP swojego Raspberry Pi (np. `192.168.1.15`).

## 5. Autostart (Opcjonalnie)
Aby aplikacja startowała sama po włączeniu Pi, użyj `pm2`:
```bash
sudo npm install -g pm2
pm2 start "npx serve -s dist -l 3000" --name smart-frame-ui
pm2 save
pm2 startup