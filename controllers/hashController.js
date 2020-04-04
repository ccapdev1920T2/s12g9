const crypto = require('crypto');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

var sha256 = function(password, salt){
    var hash = crypto.createHmac('sha256', salt); 
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

const hashController = {
    
    
    saltHashPassword: function(userpassword) {
        var salt = genRandomString(16); 
        var passwordData = sha256(userpassword, salt);
        // console.log('UserPassword = '+userpassword);
        var temp = [];
        temp[0] = passwordData.passwordHash;
        temp[1] = passwordData.salt;
        return temp;
    },
    
    validPassword: function(inputpassword, salt, hashdb){ 
        var hash = sha256(inputpassword, salt);
        // console.log(hash.passwordHash);
        return hash.passwordHash === hashdb;
    }
    
}

module.exports = hashController;