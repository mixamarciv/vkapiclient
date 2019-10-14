@SET curpath=%~dp0
@SET curdisk=%curpath:~0,2%
@CALL "%curpath%/set_path.bat"

@CLS
SET PATH=c:\pp\pg\Microsoft VS Code\;%PATH%


start Code.exe

@cmd
