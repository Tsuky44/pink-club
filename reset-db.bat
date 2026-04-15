@echo off
echo Suppression de la base de donnees...
if exist "data\gallery.db" del /f "data\gallery.db"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
echo.
echo Recreation de la migration...
npx prisma migrate dev --name init --skip-seed --accept-data-loss
echo.
echo Generation du client Prisma...
npx prisma generate
echo.
echo Termine!
pause
