#Adding data

`node index.js bedroom.temp=5`

#Plotting graphs

`gnuplot -e "input='data/data.ave.shed.temp.dat'" -e "output='out/shed_month_ave_temp.png'" plot.last_month_ave`
`gnuplot -e "input='data/data.month.shed.temp.dat'" -e "output='out/shed_month_temp.png'" plot.last_month`
