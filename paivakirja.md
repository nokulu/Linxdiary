# Linux-perusteet – Oppimispäiväkirja 

**Kone:** Lenovo ThinkPad E480  
**Käyttöjärjestelmä:** Garuda Linux (Arch, KDE Plasma)  
**Shellit:** bash → zsh (Oh My Zsh)  
**Paketinhallinta:** pacman + paru (AUR)

---

## Päivä 1 — ti 23.9.2025: Asennus & “opiskelukuntoon"

### Tehtävä: Asenna Linux koneelle ja dokumentoi askeleet
**Ratkaisu:**  
Tein puhtaan asennuksen ThinkPadiin. Loin USB-tikun Ventoylla, boottaus USB:ltä, Garudan asennus BTRFS:lle. varmistin AHCI:n. Garudan asennus itse graafisella liittymällä, liian laiska komentojen kautta asennukseen.

```bash
# ISO USB:lle (Ventoy)
ventoy -I /dev/sdX
cp Garuda-*.iso /media/$USER/VENTOY/

# Asennuksen jälkeen nopea tsekki
lsblk -f
lscpu | grep -E 'Model name|CPU\(s\)|Thread'
uname -a
```

### Tehtävä: Laita distro “opiskelukuntoon” (perussoftat, dev-työkalut)
**Ratkaisu:**  
Päivitin koko järjestelmän, asensin peruspaketit, pyenvin Pythonille ja VS Coden. Laitoin gitin kuntoon.
```bash
sudo pacman -Syu --noconfirm
sudo pacman -S --needed git curl wget vim nano tree htop ripgrep fd bat unzip tar --noconfirm

# AUR-helper (paru)
sudo pacman -S --needed base-devel --noconfirm
paru -V || (git clone https://aur.archlinux.org/paru.git && cd paru && makepkg -si)

# VS Code (OSS)
sudo pacman -S code --noconfirm

# Python (pyenv)
sudo pacman -S --needed pyenv openssl zlib xz tk readline libffi bzip2 --noconfirm
pyenv install 3.12.5 && pyenv global 3.12.5 && python --version

# Git
git config --global user.name "Minä Itse"
git config --global user.email "mina@example.com"
git config --global init.defaultBranch main
```

---

## Päivä 2 — ke 24.9.2025: OS, Wayland/X11 ja Kernel

### Tehtävä: Kerro omin sanoin mitä käyttöjärjestelmä tekee
**Ratkaisu:**  
Käyttis on “välissä”: se ajastaa prosessit, hallitsee muistia, laitteita (ajurit), tiedostoja ja verkkoa. Softa pyytää palveluita syscallien kautta, käyttöjärjestelmä tekee likaisen työn.

### Tehtävä: Selvitä työpöytä ja sessiotyyppi; valitse Wayland/X11
**Ratkaisu:**  
Garuda käyttää KDE Plasmaa. Testasin molemmat, mutta päädyin **X11:een**, koska **NVIDIA-yhteensopivuus** on käytännössä tasaisempi (ajoittain vähemmän kummallisuuksia kuin Waylandilla).
```bash
echo "$XDG_CURRENT_DESKTOP"    # KDE
echo "$XDG_SESSION_TYPE"       # wayland / x11
loginctl show-session "$XDG_SESSION_ID" -p Type
# Tarkistin saatavilla olevat sessiot
ls /usr/share/xsessions/       # plasma.desktop jne.
ls /usr/share/wayland-sessions # plasmawayland.desktop
```
Valitsin SDDM-kirjautumisruudusta “Plasma (X11)”. Halutessa voi pakottaa oletuksen:
```bash
sudo mkdir -p /etc/sddm.conf.d
printf "[Autologin]\nSession=plasma.desktop\n" | sudo tee /etc/sddm.conf.d/session.conf
```

### Tehtävä: Mitä LTS tarkoittaa tässä kontekstissa
**Ratkaisu:**  
LTS = pitkä tuki (harvemmat päivitykset, pidempi ylläpito). Arch/Garuda on rolling, eli koko järjestelmää ei sidota LTS-sykleihin (kernelistä on olemassa myös LTS-paketti, jos haluaa rauhallisemman ytimenversion).

### Tehtävä: Kernelin tehtävät, tiiviisti
**Ratkaisu:**  
Ajoitus, muistinhallinta (virtuaalimuisti), prosessit/säikeet, ajurit, VFS, IPC, verkkopino. Ydin tekee kaiken raskaan noston, mitä käyttäjätila ei saa/voi.

---

## Päivä 3 — to 25.9.2025: Tiedostot & Komennot

### Tehtävä: Piirrä ja tarkista hakemistopuu
**Ratkaisu:**  
Tein pienen rungon “harjoitukset/”-kansion alle ja varmistin rakenteen `tree`llä.
```bash
mkdir -p ~/harjoitukset/viikko39/tiedostot/puu/{a,b,c}
touch ~/harjoitukset/viikko39/tiedostot/puu/{README.md,a/one.txt,b/two.txt,c/three.txt}
tree -ap ~/harjoitukset/viikko39/tiedostot/puu
```

### Tehtävä: Aja `lsblk` ja tulkitse levyasettelu
**Ratkaisu:**  
Tunnistin EFI-osion, BTRFS-rootin ja mahdolliset datalevyt. Helppo tapa on listata myös tiedostojärjestelmät ja mountit.
```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
df -hT
```

### Tehtävä: Kirjoita monirivinen komento (rivi kerrallaan)
**Ratkaisu:**  
Harjoittelin rivinvaihdolla (\) ja tyylillä kirjoittaa **rivi kerrallaan**.
```bash
ls   -l --all   --human-readable   --inode   --ignore=Desktop ~
```

### Tehtävä: Sovi itselle kansiorakenne tehtäville
**Ratkaisu:**  
Päätin muodon `~/harjoitukset/<viikko>/<osio>/<tehtava>/`. Se pitää kaiken löydettävänä ja siistinä.

### Tehtävä: Avaa nykykansio graafisessa selaimessa
**Ratkaisu:**  
Garudassa tämä laukaisee Dolphinin:
```bash
xdg-open .
```

### Tehtävä: Kokeile iso/pieni kirjain -nimet ja välilyönnit
**Ratkaisu:**  
Linux on case-sensitive. Harjoittelin välilyönnit lainauksilla ja takaviivoilla.
```bash
mkdir CaseSensitive casesensitive CASESENSITIVE
mkdir "Hakemiston Nimi"; cd "Hakemiston Nimi"; cd ..
mv "Hakemiston Nimi" hakemiston_nimi
```

### Tehtävä: Käytä `date`:a laskemaan aika eteenpäin
**Ratkaisu:**  
Man-sivun syntaksilla laskin 2 vrk 19 h 42 min eteenpäin:
```bash
date --date='today + 2 days + 19 hours + 42 minutes'
```

### Tehtävä: Aja valmis skripti ja lajittele syntyvä sälä
**Ratkaisu:**  
Annoin skriptin sylkeä tiedostoja ja siivosin ne `find`+`mv`:llä.
```bash
mkdir -p ~/harjoitukset/39/komennot/skripti && cd $_
wget https://raw.githubusercontent.com/sourander/linux-perusteet/refs/heads/main/kurssitiedostot/peruskaytto_luo_filut.sh
chmod +x peruskaytto_luo_filut.sh
./peruskaytto_luo_filut.sh
# lajittelu
find . -type f -maxdepth 1 -print0 | xargs -0 -I{} mv "{}" ./sorted/
```

---

## Päivä 4 — pe 26.9.2025: Käyttäjät & oikeudet

### Tehtävä: Tutki /etc/passwd, /etc/group, /etc/shadow, /etc/gshadow
**Ratkaisu:**  
Katselin mitä kenttiä missäkin on ja tarkistin oikeudet.
```bash
stat -c '%a %n' /etc/passwd /etc/group /etc/shadow /etc/gshadow
```

### Tehtävä: Mikä on nologin ja miksi sitä käytetään
**Ratkaisu:**  
`nologin` estää kirjautumisen (hyödyllinen taustakäyttäjille).
```bash
command -v nologin && /usr/bin/nologin || /usr/sbin/nologin
```

### Tehtävä: Omat ryhmät ja oikeudet
**Ratkaisu:**  
Listasin oman käyttäjätiedon ja ryhmät.
```bash
id
groups $USER
```

### Tehtävä: Luo testikäyttäjä ja ryhmä, lisää jäsenyys
**Ratkaisu:**  
Loin *testuser*:in, lisäsin ryhmään ja testasin kirjautumisen.
```bash
sudo useradd -m testuser
sudo passwd testuser
sudo groupadd mygrp
sudo usermod -aG mygrp testuser
sudo su - testuser
exit
```

### Tehtävä: Poista käyttäjä (kotihakemistoineen) ja ryhmä
**Ratkaisu:**
```bash
sudo userdel -r testuser
sudo groupdel mygrp
```

### Tehtävä: Pidennä sudo-salasanan aikakatkaisua
**Ratkaisu:**  
Tein droppitiedoston 60 minuutiksi; tarkistin syntaksin.
```bash
echo 'Defaults timestamp_timeout=60,timestamp_type=global' | sudo tee /etc/sudoers.d/timeout
sudo visudo -c
```

### Tehtävä: Rakenna oikeuksien harjoittelupuu ja verifioi
**Ratkaisu:**  
Rakensin rungon ja varmistin tulosteen `tree -ap`:lla.
```bash
mkdir -p ~/harjoitukset/39/kayttooikeudet/tehtava1/{my,inner}
touch ~/harjoitukset/39/kayttooikeudet/tehtava1/{my/tralalaa,my/dingdingdong,inner/peace}
tree -ap ~/harjoitukset/39/kayttooikeudet/tehtava1
```

### Tehtävä: Aja oikeuksien tarkistusskripti (tavoite 21/21)
**Ratkaisu:**
```bash
cd ~/harjoitukset/39/kayttooikeudet
wget https://raw.githubusercontent.com/sourander/linux-perusteet/refs/heads/main/kurssitiedostot/tarkista_kayttooikeudet.sh
chmod +x tarkista_kayttooikeudet.sh
./tarkista_kayttooikeudet.sh tehtava1
```

---

## Päivä 5 — la 27.9.2025: Terminaali & standardivirrat

### Tehtävä: Aja `tty` sekä pseudo- että virtuaaliterminaalissa
**Ratkaisu:**  
Kirjasin laitetiedot ja vaihdoin TTY:ltä takaisin graafiseen.
```bash
# pseudo
tty; echo "$XDG_SESSION_TYPE"; loginctl
# virtuaali
sudo chvt 4
tty; loginctl
sudo chvt 2
```

### Tehtävä: Asenna zsh ja tunnista startup-eroja
**Ratkaisu:**  
Asensin zsh:n ja huomasin odotetusti, ettei .bashrc päde siellä.
```bash
sudo pacman -S zsh --noconfirm
zsh
```

### Tehtävä: Mitä `tee` tekee; näytä esimerkki
**Ratkaisu:**  
`tee` kopioi putken ulostulon sekä tiedostoon että ruudulle.
```bash
echo "hello" | tee out.txt
cat out.txt
```

### Tehtävä: Ohjaa stdout ja stderr erikseen
**Ratkaisu:**
```bash
ls -1 ~/Downloads > list-of-my-downloads.txt
find /root -name "bashrc" 2> errors.log
```

### Tehtävä: Tutki PATH ja muotoile se putkilla luettavaksi
**Ratkaisu:**  
Listasin PATHin rivitettynä ja numeroituna.
```bash
printenv PATH | tr ':' '\n' | nl
```

---

## Päivä 6 — su 28.9.2025: Startup-tiedostot & Oh My Zsh

### Tehtävä: Tulosta tervehdys Bashin aloituksessa (PID/PPID)
**Ratkaisu:**
```bash
echo 'echo "Hello! I am $$ (parent $PPID)"' >> ~/.bashrc
```

### Tehtävä: Asenna Oh My Zsh ja vaihda oletusshell
**Ratkaisu:**  
Asensin Oh My Zsh:n ja vaihdoin oletukseksi.
```bash
sudo pacman -S --needed zsh git curl --noconfirm
sh -c "
$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s "$(command -v zsh)"
```

### Tehtävä: Vaihda Zsh-teema
**Ratkaisu:**  
Pistin *agnoster*:in ja latasin shellin uudelleen.
```bash
sed -i 's/^ZSH_THEME=.*/ZSH_THEME="agnoster"/' ~/.zshrc
exec zsh
```

### Tehtävä: Edestakainen vaihto Bashin ja Zsh:n välillä
**Ratkaisu:**
```bash
chsh -s /bin/bash
chsh -s /usr/bin/zsh
```

---

## Päivä 7 — ma 29.9.2025: Paketinhallinta, prosessit, systemd/cron/lokit, kontit, SSH, tmux, FS

### Tehtävä: Ota haltuun oman distron paketinhallinta
**Ratkaisu:**  
Kertasin pacmanin peruskomennot ja tarkistin pakettien sisällöt.
```bash
pacman -V && man pacman
pacman -Qi tldr && pacman -Ql tldr | head
```

### Tehtävä: Asenna ohjelma Snapilla ja tarkista minne se menee
**Ratkaisu:**
```bash
sudo pacman -S snapd --noconfirm
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap || true
sudo snap install hello-world
snap list; ls /var/lib/snapd/snaps
```

### Tehtävä: Flatpak: asennus + yksi ohjelma + sijainnit
**Ratkaisu:**
```bash
sudo pacman -S flatpak --noconfirm
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install -y flathub com.obsproject.Studio
flatpak list; ls ~/.local/share/flatpak
```

### Tehtävä: Asenna Go ja aja Hello World
**Ratkaisu:**
```bash
sudo pacman -S go --noconfirm
go version
cat > hello.go <<'EOF'
package main
import "fmt"
func main() { fmt.Println("Hello, World!") }
EOF
go run hello.go
```

### Tehtävä: Selvitä oman shellin PID/PPID ja listaa ne
**Ratkaisu:**
```bash
echo "PID=$$ PPID=$PPID"
ps -o pid,ppid,cmd -p $$ -p $PPID
```

### Tehtävä: Prosessin käynnistys taustalle ja hallinta
**Ratkaisu:**  
Käynnistin `sleep`:in, katsoin `jobs`:it, toin eteen ja lopetin.
```bash
sleep 1234 &
jobs -l
fg %1
kill %1
```

### Tehtävä: Tapa prosessi siististi ja väkisin
**Ratkaisu:**
```bash
kill -SIGTERM <pid>
kill -9 <pid>
```

### Tehtävä: Tee yksinkertainen systemd user -service
**Ratkaisu:**  
Pieni “hello minuutin välein” -palvelu user-tilassa.
```bash
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/hello.service <<'EOF'
[Unit]
Description=Say hello periodically
[Service]
Type=simple
ExecStart=/bin/bash -lc 'while true; do echo hello; sleep 60; done'
EOF
systemctl --user daemon-reload
systemctl --user enable --now hello.service
journalctl --user -u hello.service -f
```

### Tehtävä: Ajasta rivi crontabiin (minuutin välein)
**Ratkaisu:**
```bash
(crontab -l; echo '* * * * * echo "$(date) hello" >> ~/cron.log') | crontab -
tail -f ~/cron.log
```

### Tehtävä: Tutki lokit journalctl:llä
**Ratkaisu:**
```bash
journalctl -xe
journalctl --since "1 hour ago"
journalctl -u hello.service --user -f
```

### Tehtävä: Aja “hello-world” -kontti
**Ratkaisu:**  
Tarkistin Dockerin ja ajoin testikontin.
```bash
docker --version
sudo docker run hello-world
```

### Tehtävä: Luo SSH-avain ja testaa yhteys; tmuxin perusflow
**Ratkaisu:**
```bash
# SSH
ssh-keygen -t ed25519 -C "mina@example.com laptop-e480"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com || true

# tmux
sudo pacman -S tmux --noconfirm
tmux new -s kurssi    # irrota: Ctrl-b d
tmux attach -t kurssi
```

### Tehtävä: Tiedostojärjestelmät – katsele levyt, osiot, LVM
**Ratkaisu:**  
Tarkastelin turvallisesti.
```bash
lsblk -f
sudo blkid
df -hT
```

---

## Muistiinpanot
- Kuvakaappaukset: `~/Pictures/linux-perusteet/2025-09-23..29/`.