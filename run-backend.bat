@echo off
echo ========================================================
echo Starting SpeakEasy Spring Boot Backend (Port 8085)...
echo ========================================================
cd /d "%~dp0backend"
mvn spring-boot:run
pause
