#!/bin/sh
echo "$PWD"
cd "${BASH_SOURCE%/*}" || exit                             # cd into the bundle and use relative paths

d=`date +%Y-01-01`
ny=$(date -I -d "$d + 1 year")
while [ "$d" != "$ny" ]; do
    month=$(date --date=$d '+%m')
    if [ -f "data/data.ave.shed.temp.${month}.dat" ]; then
        gnuplot -e "input='data/data.ave.shed.temp.${month}.dat'" -e "output='out/shed_month_ave_temp_${month}.png'" plot.last_month_ave
        gnuplot -e "input='data/data.month.shed.temp.${month}.dat'" -e "output='out/shed_month_temp_${month}.png'" plot.last_month
    fi
    d=$(date -I -d "$d + 1 month")
done

gnuplot -e "input='data/data.ave.shed.temp.recent.dat'" -e "output='out/shed_month_ave_temp.png'" plot.last_month_ave
gnuplot -e "input='data/data.month.shed.temp.recent.dat'" -e "output='out/shed_month_temp.png'" plot.last_month
