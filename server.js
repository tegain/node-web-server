const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// Tell Express we want to use handlebars templating
// http://expressjs.com/en/guide/using-template-engines.html
// And tell handlebars to add support for partials files
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

/**
 * Middlewares are called in order.
 * We have to use static middleware AFTER maintenance middleware
 * if we want to protect the /public folder.
 */

// Add new middleware
// Call `next()` when middleware is complete
app.use((req, res, next) => {
	const now = new Date().toString();
	const log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to write to server.log.');
		}
	});
	next();
});

app.use((req, res, next) => {
	res.render('maintenance.hbs');
});

// Use Express middleware for static assets
// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// Passing JSON directly
// app.get('/', (req, res) => {
// 	res.send({
//     name: 'Thomas',
//     likes: ['Sports', 'Cinema']
//   });
// });

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home page',
		welcomeMessage: 'Welcome on this website!'
	});
});

app.get('/about', (req, res) => {
	// Render specific template, from the default 'Views' folder
  res.render('about.hbs', {
  	pageTitle: 'About page'
	});
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(3000, () => {
	console.log('Server is up on port 3000');
});