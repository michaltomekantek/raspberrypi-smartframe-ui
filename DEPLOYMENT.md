# Uruchamianie na Raspberry Pi

## Krok 0: Jeśli nie masz npm
Zainstaluj Node.js i npm:
```bash
sudo apt update
sudo apt install -y nodejs npm
```

## Krok 1: Uruchomienie (Opcja A - przez npm)
Zainstaluj serwer:
```bash
sudo npm install -g serve
```
Uruchom:
```bash
serve -s dist -l 3000
```

## Krok 1: Uruchomienie (Opcja B - przez Python)
Jeśli nie chcesz instalować npm, użyj wbudowanego serwera Python:
```bash
python3 -m http.server 3000 --directory dist
```

---
**Pamiętaj:** Backend (skrypt Python z API) musi działać równolegle na porcie 8000!