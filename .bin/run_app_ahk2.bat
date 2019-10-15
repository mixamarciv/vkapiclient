@CALL "%~dp0/set_path.bat"

@CLS
TITLE apptitle2
CD "%~dp0/.."
node app_vkapisocket.js
@pause
