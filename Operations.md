###Operations

Die Produktionsumgebung läuft auf einer FreeBSD 11 VM.

Ports runterladen:
```shell
sudo portsnap fetch && sudo portsnap extract
```

Notwendige Tools laden:
```shell
sudo pkg upgrade && sudo pkg install htop screen nano portmaster
```

PhantomJS kompilieren:
```shell
sudo portmaster -G lang/phantomjs
```

