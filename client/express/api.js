const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');

const app = express();
const port = 3001;

app.use(cors());
app.use(fileupload());

app.post('/upload/image', (req, res) => {
	const image = req.files.image;
	const imageName = randomText(20) + "." + image.name.split(".")[1]
	const uploadPath = __dirname + '/../public/uploadImage/' + imageName;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	image.mv(uploadPath, function (err) {
		if (err) {
			console.error(err);
			res.writeHead(500, {
				'Content-Type': 'application/json'
			})
			res.end(JSON.stringify({ status: 'error', message: err }))
			return
		}

		res.writeHead(200, {
			'Content-Type': 'application/json'
		})
		res.end(JSON.stringify({ status: 'success', path: '/uploadImage/' + imageName }))
	});
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

function randomText(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}