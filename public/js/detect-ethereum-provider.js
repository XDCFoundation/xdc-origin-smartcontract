const detectEthereumProvider = require('@metamask/detect-provider');

async function ethereumProviders(){
    return await detectEthereumProvider();
}