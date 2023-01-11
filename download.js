import fs from 'fs'
import axios from 'axios';
import GoogleSheet from './classes/GoogleSheet.mjs'
import path from 'path'
import dotenv from 'dotenv';
import FormData from 'form-data';  
import { findProperty } from "./api/properties/getProperties.mjs"
import { jsonPatchProperty } from "./api/properties/patchProperty.mjs"
import { uploadFile } from "./api/fileUpload/uploadFile.mjs"
dotenv.config()
const keyFile = path.resolve('./esmax-import.json')

const sheetID = process.env.SHEET_ID
const sheet = await GoogleSheet.fromId(sheetID, keyFile)
const { values } = await sheet.getValuesInRange('urls', 'A:B')
const errors = []
const delay = ms => new Promise(res => setTimeout(res, ms));

async function downloadFile(fileUrl, taskAsset, index) {
	return await axios.get(fileUrl, {responseType: 'stream'})
		.then(async function (response) {
			// handle success
			console.log(`${index}.- Status ${response.data.statusCode} - External file URL ${fileUrl} downloaded successfully`);
			
			const fileName = `${taskAsset._id}***${response.headers['content-disposition'].split('"')[1]}`;
			const filePath = path.resolve('./files', fileName);
			const writer = fs.createWriteStream(filePath, {flags: 'w'});
			await response.data.pipe(writer);
			const asd = await new Promise((resolve, reject) => {
				writer.on('finish', resolve({fileName}));
				writer.on('error', reject);
			})
			if (!asd) return null;
			await delay(5000);
			return asd;
		})
		.catch(function (error) {
			// handle error
			console.log(error);
			return null
		})
		.finally(function () {
			// always executed
			return null
		});
}

function prepareFile(fileName) {
	const filePath = `./files/${fileName}`
	const formData = new FormData();
	formData.append('file', fs.readFileSync(filePath, { encoding: null }), fileName)
	formData.append('uploadInput', JSON.stringify({ public: false, context: {} }))
	return {fileName, body: formData}
}

async function uploadToCotalker(uploadData, fileIndex) {
	const uploadedFile = await uploadFile(uploadData.body, uploadData.fileName)
	if (!uploadedFile) {
		const errorMsg = `${fileIndex}.- Error while uploading file ${JSON.stringify(uploadData.fileName)}`
		console.log(errorMsg);
		errors.push(errorMsg);
		return null;
	}
	const assetId = uploadData.fileName.split('---')[0];
	let patchBody = [
		{op: 'add', path: '/schemaInstance/links_adjuntos/-', 
		value: `${process.env.FILE_UPLOAD_BASE_URL}/${uploadedFile.key}`}
	];
	if (fileIndex === 1) patchBody = [
		{op: 'add', path: '/schemaInstance/links_adjuntos', 
		value: [`${process.env.FILE_UPLOAD_BASE_URL}/${uploadedFile.key}`]}
	];
	const jsonPatchAsset = await jsonPatchProperty(assetId, patchBody, true);
	if (!jsonPatchAsset) {
		console.log('Error while patching asset. ' + JSON.stringify(patchBody));
		return null;
	}
	console.log(`Asset ${assetId} patched successfully - ${JSON.stringify(jsonPatchAsset.name)} - ${JSON.stringify(jsonPatchAsset.schemaInstance.links_adjuntos)}`)
	return await delay(500);
}

const getAssetFromIdentifier = async (taskIdentifier) => {
	const properties = await findProperty({
		"propertyType": "solicitud_sspp", 
		"schemaInstance.identificador_unico_asset": taskIdentifier
	});
	if (!properties.length) {
		const errorMsg = `Error while finding property for task: ${taskIdentifier}`;
		console.log(errorMsg);
		errors.push(errorMsg);
		return null
	}
	return properties[0];
}

try {
	let iterationIndex = 0;
	const ROWS_TO_SKIP = 0;
	const filesForIdentifier = {};
	for (const rawFileData of values.slice(1)) { // slice(1) for headers row
		iterationIndex++;
		const [taskIdentifier, fileUrl] = rawFileData;
		if (!filesForIdentifier[taskIdentifier]) filesForIdentifier[taskIdentifier] = [fileUrl];
		else filesForIdentifier[taskIdentifier].push(fileUrl)
	}
	console.log(`Grouped files: \n${Object.keys(filesForIdentifier).map(id => `${id}: ${filesForIdentifier[id].length}`).join('\t')}`);

	iterationIndex = 0;
	
	for (const taskIdentifier of Object.keys(filesForIdentifier)) {
		iterationIndex++;
		if (iterationIndex < ROWS_TO_SKIP + 1) continue; // debugging: skip first N rows
		console.log(`${iterationIndex}.- Working on id ${taskIdentifier}: ${filesForIdentifier[taskIdentifier].length} files`)
		const asset = await getAssetFromIdentifier(taskIdentifier);
		if (!asset) continue;
		const localFileNames = []
		for (const externalUrl of filesForIdentifier[taskIdentifier]) {
			const localFile = await downloadFile(externalUrl, asset, iterationIndex);
			if (!localFile) continue;
			localFileNames.push(localFile.fileName);
		}
		await delay(1000);
		console.log(`${iterationIndex}.- Local files: \n${localFileNames.join('\n')}`);
		let fileIndex = 1;
		for (const localFileName of localFileNames) {
			const uploadData = prepareFile(localFileName);
			if (!uploadData) continue;
			const uploadedFileData = await uploadToCotalker(uploadData, fileIndex);
			console.log(uploadedFileData);
			fileIndex++;
		}
	}
	fs.writeFileSync('./errores_en_archivos.json', JSON.stringify(errors, null, 2));

} catch (e) {
	console.log(JSON.stringify(e));
	fs.writeFileSync('./error_fatal.json', JSON.stringify(e, null, 2));
}
