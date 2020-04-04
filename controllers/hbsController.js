const hbsController={
    ifCD:function(arg1, options) {
        if (arg1 == "Classic Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    },

    ifFD: function(arg1, options) {
        if (arg1 == "Family Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    }, 

    ifED: function(arg1, options) {
        if (arg1 == "Executive Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    },

    ifJS: function(arg1, options) {
        if (arg1 == "Junior Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    },

    ifES: function(arg1, options) {
        if (arg1 == "Executive Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    },

    ifGS: function(arg1, options) {
        if (arg1 == "Grand Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    },

    format:function(text) {
        return parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
module.exports = hbsController;