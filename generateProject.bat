@echo off
set /p moduleName1="Module name like Automizy-Email-Editor: "
set /p moduleName2="Module name like AutomizyEmailEditor: "
set /p moduleName3="Module name like automizy-email-editor: "
set /p moduleNameshort="Module name in short like aee: "
set /p moduleVariable="Module showrt variable like $AEE: "
set /p moduleDescription="Module description: "

set isConfirm=y
set /p isConfirm=Please confirm the new module informations [y/n] (default - y)?:

IF NOT "%isConfirm%"=="y" GOTO EXIT0

set target=..\generatedModules\%moduleName1%

mkdir %target%
xcopy /Y /S /Q "." "%target%"
rmdir /S /Q %target%\node_modules
rmdir /S /Q %target%\.bower
rmdir /S /Q %target%\.idea
rmdir /S /Q %target%\src\vendor


fart.exe -r -c -- %target%\src\* Automizy-Menu %moduleName1%
fart.exe -r -c -- %target%\src\* AutomizyMenu %moduleName2%
fart.exe -r -c -- %target%\src\* automizy-menu %moduleName3%
fart.exe -r -c -- %target%\src\* am %moduleNameshort%
fart.exe -r -c -- %target%\src\* $AM %moduleVariable%
fart.exe -r -c -- %target%\src\* AutomizyMenuDescription "%moduleDescription%"

fart.exe -c -- %target%\* Automizy-Menu %moduleName1%
fart.exe -c -- %target%\* AutomizyMenu %moduleName2%
fart.exe -c -- %target%\* automizy-menu %moduleName3%
fart.exe -c -- %target%\* am %moduleNameshort%
fart.exe -c -- %target%\* $AM %moduleVariable%
fart.exe -c -- %target%\* AutomizyMenuDescription "%moduleDescription%"

ren %target%\src\am.html %moduleNameshort%.html
ren %target%\src\am.js %moduleNameshort%.js
ren %target%\src\am.css %moduleNameshort%.css

cd %~dp0\%target%
call npmBowerGrunt.bat

echo New module created!
pause;

:EXIT0