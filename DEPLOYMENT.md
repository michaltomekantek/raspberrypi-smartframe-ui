# Uruchamianie na Raspberry Pi

## Krok 1: Przygotowanie folderu `dist`
Folder `dist` zawiera gotową aplikację. Aby go stworzyć, musisz mieć zainstalowany `npm`.

**Na Raspberry Pi:**
```bash
sudo apt update && sudo apt install -y nodejs npm
npm install
npm run build
```
Po tych komendach w Twoim folderze pojawi się katalog `dist`.

## Krok 2: Uruchomienie strony (Opcja Python - najprostsza)
Jeśli masz już folder `dist`, uruchom serwer:
```bash
python3 -m http.server 3000 --directory dist
```

## Krok 3: Uruchomienie strony (Opcja npm - profesjonalna)
```bash
sudo npm install -g serve
serve -s dist -l 3000
```

---
**Pamiętaj:** Backend (skrypt Python z API) musi działać równolegle na porcie 8000!