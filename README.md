# Kreator szablonów i formularzy

## Opis projektu

Aplikacja do tworzenia i zarządzania szablonami dokumentów oraz formularzami. System pozwala na:

- Tworzenie i zarządzania polami formularzy
- Tworzenie formularzy z wybranych pól
- Tworzenie szablonów dokumentów z możliwością dynamicznego wstawiania pól

## Struktura projektu

Projekt składa się z kilku głównych modułów:
- **Moduł pól formularzy** - zarządzanie definicjami pól
- **Moduł formularzy** - tworzenie i zarządzanie formularzami
- **Moduł szablonów** - tworzenie i zarządzanie szablonami dokumentów
- **Interfejs użytkownika** - komponenty UI do interakcji z systemem

Struktura katalogów:
```
.
├── api                      # Endpointy API
│   ├── create.php           # Tworzenie elementów
│   ├── delete.php           # Usuwanie elementów
│   ├── list.php             # Listowanie elementów
│   ├── load.php             # Ładowanie pojedynczego elementu
│   └── update.php           # Aktualizacja elementów
├── config.php               # Konfiguracja aplikacji
├── db                       # Warstwa bazodanowa
│   ├── database.sqlite      # Plik bazy danych SQLite
│   └── db.php               # Klasa dostępu do bazy danych
├── media                    # Pliki mediów
├── public                   # Pliki dostępne publicznie
│   ├── css                  # Arkusze stylów
│   │   ├── editor.css       # Style dla edytora
│   │   ├── index.css        # Style dla strony głównej
│   │   └── main.css         # Główne style
│   ├── editor.html          # Strona edytora
│   ├── index.html           # Strona główna
│   └── js                   # Skrypty JavaScript
│       ├── editor.js        # Logika edytora
│       ├── index.js         # Logika strony głównej
│       └── partials         # Komponenty JS
│           ├── edit.js      # Komponent edycji
│           ├── new.js       # Komponent tworzenia
│           └── table.js     # Komponent tabeli
└── README.md                # Ten plik
```

## Funkcjonalność

### Pola formularzy
- Tworzenie nowych pól formularzy
- Edycja istniejących pól
- Usuwanie pól
- Przeglądanie listy pól

### Formularze
- Tworzenie formularzy z wyborem pól
- Edycja formularzy z możliwością dodania/usunięcia pól
- Usuwanie formularzy
- Przeglądanie listy formularzy z ich zawartością

### Szablony
- Tworzenie szablonów tekstowych
- Wstawianie dynamicznych pól do szablonów
- Edycja i usuwanie szablonów
- Podgląd listy szablonów

## Technologie
| Warstwa | Technologie |
|---------|-------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | PHP 7.4+ |
| Baza danych | SQLite 3 |
| Inne narzędzia | Git |

## Instalacja

### Dla początkujących (z serwerem Apache)

```bash
# Krok 1: Przejdź do domyślnego katalogu serwera Apache
# W systemie Windows (XAMPP)
cd C:\xampp\htdocs\

# W systemie Linux (Apache)
cd /var/www/html/

# Krok 2: Pobierz i rozpakuj projekt
# Opcja A: Pobierz plik ZIP i rozpakuj go tutaj
# Opcja B: Użyj komendy git jeśli jest zainstalowany
git clone https://github.com/TheR0ck3t/lab_18-19.git

# Krok 3: Włączenie rozszerzenia SQLite3 w PHP
# W systemie Windows (XAMPP):
# - Otwórz C:\xampp\php\php.ini w notatniku
# - Znajdź linię ";extension=sqlite3" i usuń średnik z początku
# - Zapisz plik i uruchom ponownie serwer Apache

# W systemie Linux:
sudo apt-get install php-sqlite3
sudo systemctl restart apache2

# Krok 4: Nadaj wymagane uprawnienia (tylko Linux)
# W systemie Windows ten krok możesz pominąć
sudo chmod -R 755 lab_18-19/
sudo chmod -R 777 lab_18-19/db/ lab_18-19/media/

# Krok 5: Otwórz projekt w przeglądarce
# http://localhost/lab_18-19/
```

### Dla zaawansowanych

```bash
# Krok 1: Sklonuj repozytorium do wybranej lokalizacji
git clone https://github.com/TheR0ck3t/lab_18-19.git
cd lab_18-19

# Krok 2: Upewnij się, że PHP i SQLite są zainstalowane
php -v
php -m | grep sqlite

# Jeśli SQLite3 nie jest zainstalowany:
# Na Debian/Ubuntu:
sudo apt-get install php-sqlite3

# Na CentOS/RHEL:
sudo yum install php-sqlite3

# Na macOS z Homebrew:
brew install php

# Krok 3: Sprawdź i edytuj php.ini jeśli potrzeba
# Znajdź lokalizację php.ini
php --ini

# Edytuj php.ini i odkomentuj lub dodaj linię:
# extension=sqlite3
# Następnie zrestartuj serwer

# Krok 4: Skonfiguruj uprawnienia dla plików danych
chmod -R 755 .
chmod -R 777 db/ media/

# Krok 5: Dostosuj config.php według potrzeb (opcjonalnie)
```

## Uruchomienie

### Dla początkujących

```bash
# Jeśli instalacja została wykonana w domyślnym katalogu serwera:

# Krok 1: Uruchom serwer Apache
# W systemie Windows: uruchom XAMPP Control Panel i włącz Apache
# W systemie Linux: 
sudo systemctl start apache2

# Krok 2: Otwórz przeglądarkę i wpisz:
# http://localhost/lab_18-19/
```

### Dla zaawansowanych

```bash
# Sposób 1: Wbudowany serwer PHP
php -S 0.0.0.0:8000 -t /

# Sposób 2: Konfiguracja dedykowanego wirtualnego hosta w Apache
<VirtualHost *:80>
    ServerName lab_18-19.local
    DocumentRoot /ścieżka/do/projektu/public
    <Directory /ścieżka/do/projektu/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Pamiętaj, aby dodać wpis w pliku hosts:
# 127.0.0.1 lab_18-19.local
```

## Wymagania systemowe
- PHP 7.4 lub wyższy
- SQLite3
- Nowoczesna przeglądarka internetowa (Chrome, Firefox, Safari, Edge)