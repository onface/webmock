var fs = require('fs')

module.exports = fs.readFileSync(require('path').join(__dirname, './doc.ejs.html')).toString()
