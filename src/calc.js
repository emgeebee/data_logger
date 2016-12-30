'use strict';

var fs = require('fs');

var Calc = function(types, month) {
    this.types = types;
    this.data = {};
    this.date = new Date();
    this.year = this.lastYear = this.date.getFullYear();
    this.month = month || this.date.getMonth() + 1;
    if (this.month === 1) {
        this.lastMonth = 12;
        this.lastYear = this.year - 1;
    } else {
        this.lastMonth = this.month - 1;
    }
    this.dataFolder = `${__dirname}/../data`;
    this.file = `${this.dataFolder}/data-${this.year}-${this.month}.json`;
    if (!month) {
        this.last4weeks = true;
        this.counter = 0;
        this.lastFile = `${this.dataFolder}/data-${this.lastYear}-${this.lastMonth}.json`;
        this.getData(this.lastFile);
    } else {
        this.getData(this.file);
    }
}

Calc.prototype = {
    getData: function(file) {
        fs.readFile(file, this.gotData.bind(this));
    },

    gotData: function(err, file) {
        if (err && err.code == 'ENOENT') {
            file = '{}';
        } else if (err) {
            return;
        }
        let newData = JSON.parse(file);
        this.types.forEach(
            type => {
                if (!this.data[type]) {
                    this.data[type] = [];
                }
                this.data[type].push(...newData[type]);
            }
        )
        if (this.last4weeks && this.counter < 1) {
            this.counter++;
            this.getData(this.file);
            return
        }
        this.generateLastMonth();
        this.generateLastMonthAverages();
    },

    generateLastMonth: function() {
        this.types.forEach(
            type => {
                let data = this.data[type].slice(-12*24*30);
                let string = '';
                data.forEach(a => {
                    string += `${a.date} ${a.value}\n`;
                })
                let output = this.last4weeks ? 'recent' : this.month;
                fs.writeFile(`${this.dataFolder}/data.month.${type}.${output}.dat`, string, ()=>{});
            }
        );
    },

	generateLastMonthAverages: function() {
		this.types.forEach(
			type => {
                let data = this.data[type].slice(-12*24*30);
                let avObj = {};
				data.forEach(a => {
					let date = new Date(a.date);
					if (!avObj[date.getHours()]) {
						avObj[date.getHours()] = [];
					}
					avObj[date.getHours()].push(a.value);
				})

				let string = '';
				for (let hour of Object.keys(avObj)) {
					let sum = 0;
					avObj[hour].forEach(val => {sum += parseInt(val)});
					string += `${hour} ${sum/avObj[hour].length}\n`;
				}	
                let output = this.last4weeks ? 'recent' : this.month;
                fs.writeFile(`${this.dataFolder}/data.ave.${type}.${output}.dat`, string, ()=>{});
			}
		)
	}
}

module.exports = Calc;
