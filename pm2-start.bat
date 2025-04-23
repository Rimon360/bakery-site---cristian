@echo off

cd "F:\xampp\htdocs\1.-----------Projects---------\15.cristianbalciza -- 206$\bekaryproject\frontend"
serve -s dist -l 3000

cd "F:\xampp\htdocs\1.-----------Projects---------\15.cristianbalciza -- 206$\bekaryproject\backend"
pm2 resurrect