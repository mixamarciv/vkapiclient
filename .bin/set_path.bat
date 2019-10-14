::@SetLocal EnableDelayedExpansion
:: this_file_path - путь к текущему бат/bat/cmd файлу
@SET this_file_path=%~dp0

:: this_disk - диск на котором находится текущий бат/bat/cmd файл
@SET this_disk=%this_file_path:~0,2%

:: переходим в текущий каталог
::@%this_disk%
::CD "%this_file_path%"

:: задаем основные пути для запуска скрипта
@SET pg=c:\pg

::git
@SET GIT_PATH=%pg%\app\Git
@SET PATH=%GIT_PATH%;%GIT_PATH%\bin;%PATH%;

::nodejs
@SET NODEJS_PATH=%pg%\app\nodejs
@SET NODEJS_MODULES_PATH=%this_file_path%\..\node_modules\.bin
@SET NODEJS_MODULES_PATH2=%this_file_path%\..\..\node_modules\.bin
@SET NODEJS_MODULES_PATH3=%this_file_path%\..\..\..\node_modules\.bin
@SET PATH=%NODEJS_PATH%;%NODEJS_PATH%\bin;%NODEJS_MODULES_PATH%;%NODEJS_MODULES_PATH2%;%NODEJS_MODULES_PATH3%;%PATH%

::go
@SET GOROOT=%pg%\app\go
:: пути к исходным кодам программы на go
@SET GOPATH=%this_file_path%\..
@SET PATH=%GOROOT%;%GOROOT%\bin;%PATH%;
@SET PATH=%GOPATH%;%PATH%;

::python
@SET PYTHON_PATH=%pg%\app\python3
@SET PYTHON_PATH=%pg%\app\python2
@SET PATH=%PYTHON_PATH%;%PATH%;

::mingw
::@SET MINGW_PATH=%pg%\app\mingw64
@SET MSYS_PATH=%pg%\app\msys64
@SET PATH=%MSYS_PATH%\mingw64\bin;%MSYS_PATH%\usr\bin;%PATH%;

::meteor
@SET METEOR_PATH=%UserProfile%\AppData\Local\.meteor
@SET PATH=%METEOR_PATH%;%PATH%

::php
@SET PHP_PATH=c:\_db_web\php5\
@SET PATH=%PHP_PATH%;%PATH%

::Android
@SET ANDROID_HOME=C:\Users\user\AppData\Local\Android\sdk
@SET ANDROID_HOME=%pg%\app\Android_sdk\tools
@SET PATH=%PATH%;%ANDROID_HOME%

::PostgreSQL
@SET PATH=%PATH%;c:\PostgreSQL\pg10\bin

::пути к повершелл
@SET PATH=c:\windows\system32;%PATH%
@SET PATH=%PATH%;%SYSTEMROOT%\System32\WindowsPowerShell\v1.0

::chocolatey
@SET CHOCO_PATH=%pg%\app\chocolatey;
@SET PATH=%CHOCO_PATH%;%CHOCO_PATH%\bin;%PATH%
@SET PATH=%PATH%;%CHOCO_PATH%\tools\chocolateyInstall\bin

::AutoHotkey
@SET PATH=%PATH%;%pg%\app\AutoHotkey\

::java
@SET JDK=%pg%\app\jdk1.8.0_221\
@SET JRE=%pg%\app\jre1.8.0_221\
@SET PATH=%PATH%;%JDK%;%JDK%\bin;%JRE%;%JRE%\bin;

::chromedriver
@SET CROMEDRIVER=%pg%\app\chromedriver
@SET PATH=%PATH%;%CROMEDRIVER%;
