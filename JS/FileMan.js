const fs = require('fs');

class FileMan
{
    lock;
    constructor()
    {
        this.lock = false;
    }

}

module.exports = FileMan