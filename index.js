const fs = require('fs');
const http = require('http');
const url = require('url');

//////////////////////
//files


//Blocking
/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
const textOut = `This is what we know about the avocado: ${textIn} \n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written');


//Non-blocking
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) =>{
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
            fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
                const textAppended = `${data2} \n ${data3}`;
                fs.writeFile(`./txt/output-append.txt`, textAppended, 'utf-8', err => {
                    console.log('File written.')
                })
        });
    });
});

console.log('Will read file!')
*/

//////////////////
//server

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
 
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not_organic');
    }
    else{
        output = output.replace(/{%NOT_ORGANIC%}/g, '');
    }

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/products-data/data.json`, 'utf-8'); 
const dataObject = JSON.parse(data);

//Overview page
const server = http.createServer((req, res) => {
    
    const {query, pathname} = url.parse(req.url, true);

    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200, {'Content-type':'text/html'});

        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    }//Product page
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }//API
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);
    }//NOT FOUND
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page could not be found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server listening to requests on port 8000');
});
