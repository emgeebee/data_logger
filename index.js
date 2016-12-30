'use strict';

var fs = require('fs');
var Calc = require('./src/calc');

var Logger = function() {
    this.types = [];
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    this.dataFolder = `${__dirname}/data`;
    this.file = `${this.dataFolder}/data-${this.year}-${this.month}.json`;
    this.getData();
}

Logger.prototype = {
    getData: function() {
        fs.readFile(this.file, this.gotData.bind(this));
    },

    gotData: function(err, file) {
        if (err && err.code == 'ENOENT') {
            file = '{}';
        } else if (err) {
            return;
        }
        console.log(file);
        this.data = JSON.parse(file);
        this.addNewData();
    },

    processData: function(err) {
        if (err) {
            console.log(err);
            return;
        }
        new Calc(this.types);
        new Calc(this.types, this.month);
    },

    addNewData: function() {
        process.argv.forEach(arg => {
            let [type, value] = arg.split('=');
            if (typeof value !== 'undefined') {
                this.types.push(type);
                if (!this.data[type]) {
                    this.data[type] = [];
                }
                this.data[type].push({
                    date: new Date(),
                    value: value
                })
            }
        })
        this.data = JSON.parse(JSON.stringify(this.data));
        fs.writeFile(this.file, JSON.stringify(this.data, null, 4), this.processData.bind(this));
    },

    generateLastMonth: function() {
        this.types.forEach(
            type => {
                let data = this.data[type].slice(-12*24*30);
                let string = '';
                data.forEach(a => {
                    string += `${a.date} ${a.value}\n`;
                })
                fs.writeFile(`${this.dataFolder}/data.month.${type}.${this.month}.dat`, string, ()=>{});
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
                fs.writeFile(`${this.dataFolder}/data.ave.${type}.${this.month}.dat`, string, ()=>{});
			}
		)
	}
}

module.exports = new Logger();
