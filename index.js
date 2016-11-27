'use strict';

var fs = require('fs');

var Logger = function() {
    this.types = [];
    this.date = new Date();
    this.month = this.date.getMonth();
    this.getData(this.addNewData.bind(this));
}

Logger.prototype = {
    getData: function(cb) {
        fs.readFile('data/data.json', this.gotData.bind(this, cb));
    },

    gotData: function(cb, err, file) {
        if (err) {
            return;
        }
        this.data = JSON.parse(file);
        cb();
    },

    processData: function() {
        this.generateLastMonth();
        this.generateLastMonthAverages();
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
        fs.writeFile('data/data.json', JSON.stringify(this.data, null, 4), this.getData(this.processData.bind(this)));
    },

    generateLastMonth: function() {
        this.types.forEach(
            type => {
                let data = this.data[type].slice(-12*24*30);
                let string = '';
                data.forEach(a => {
                    string += `${a.date} ${a.value}\n`;
                })
                fs.writeFile(`data/data.month.${type}.dat`, string, ()=>{});
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
                fs.writeFile(`data/data.ave.${type}.dat`, string, ()=>{});
			}
		)
	}
}

module.exports = new Logger();
