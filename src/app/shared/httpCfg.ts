// Set httpClinet HOST address here; 
const hostOptions = {
    'localhost': 'http://localhost:3000/',
    'aws'      : 'http://18.218.72.63:80/api/'
};

let option = 'aws';
let host = hostOptions[option];

const SubDomains = {
    participant: `${host}participant`,
    company    : `${host}company`,
    event      : `${host}event`,
    setting    : `${host}setting`,

};

function setHost(host: string) {
    option = host;
    host = hostOptions[option];
    console.log(host);
 }

export { SubDomains, setHost };
