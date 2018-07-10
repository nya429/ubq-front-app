const hostOptions = {
    'localhost': 'http://localhost:3000/',
    'aws'      : 'http://18.218.72.63:80/api/'
};
const HOST = hostOptions['aws'];

const SubDomains = {
    participant: `${HOST}participant`,
    company    : `${HOST}company`,
    event      : `${HOST}event`,

};



export { SubDomains };
