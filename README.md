#Adding data

`node index.js bedroom.temp=5`

#Plotting graphs

`gnuplot  -e "input='data/data.ave.bedroom.temp.dat'" -e "output='out/bedroom_month_ave_temp.png'" plot.last_month_ave_temp`
