# Instrukcja dla Raspberry Pi Zero 2 W

## 1. Instalacja Node.js
Zalecam wersję LTS (np. 20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Zwiększenie pamięci SWAP (Ważne dla Pi Zero 2 W!)
Budowanie projektu (npm install/build) na 512MB RAM może się zawiesić. Zwiększ tymczasowo pamięć wymiany:
```bash
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Zmień CONF_SWAPSIZE=100 na CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## 3. Przygotowanie i budowanie
W folderze z kodem:
```bash
npm install
npm run build
```
Po zakończeniu powstanie folder `dist`.

## 4. Uruchomienie serwera
Zainstaluj lekki serwer `serve`:
```bash
sudo npm install -g serve
# Uruchomienie na porcie 3000
serve -s dist -l 3000
```

## 5. Dostęp do aplikacji
Otwórz przeglądarkę na innym urządzeniu i wpisz:
`http://<IP_TWOJEGO_PI>:3000`

*Pamiętaj, aby Twój backend (serwer Python) również działał na tym samym Raspberry Pi na porcie 8000.*