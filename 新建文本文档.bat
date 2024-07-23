@echo off
SETLOCAL

REM 创建文件夹
mkdir my_project
cd my_project
mkdir css
mkdir js
mkdir lang
mkdir img
mkdir blog
mkdir blog\articles
mkdir square

REM 创建文件
echo.> index.html
echo.> css\style.css
echo.> css\tailwind.css
echo.> js\app.js
echo.> js\builder.js
echo.> js\i18n.js
echo.> js\export.js
echo.> js\history.js
echo.> js\utils.js
echo.> lang\en.json
echo.> lang\id.json
echo.> lang\zh.json
echo.> img\logo.png
echo.> blog\index.html
echo.> blog\articles\article1.html
echo.> blog\articles\article2.html
echo.> square\index.html

echo 项目目录结构已创建。
ENDLOCAL
