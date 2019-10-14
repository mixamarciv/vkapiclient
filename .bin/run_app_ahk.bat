@CALL "%~dp0/set_path.bat"

@CLS
TITLE apptitle1
CD "%~dp0/.."
node app.js
@pause
