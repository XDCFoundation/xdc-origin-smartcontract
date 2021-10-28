async function ethereumProviders() {
    const detectEthereumProvider = require('@metamask/detect-provider');
    window.ethereum.enable();
    return await detectEthereumProvider();
}

console.log('detectEthereumProvider is starteeeeeeeeed');