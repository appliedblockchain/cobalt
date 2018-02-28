
 /**
  * Generates linked bytecode that can be deployed using deployed dependencies' addresses
  *
  * @param {string} bytecode unlinked bytecode, with references to contract dependencies
  * @param {<library name>: <library address>} Libraries linking addresses
  * @return {string} Linked bytecode
  */
function linkLibraries(bytecode, links = {}) {
  return Object.keys(links).reduce((processedBytecode, library) => {
    const reference = links[library].substr(2) // remove the leading '0x' from the address
    const replacementRegex = new RegExp(`_+.*${library}.*_+`, 'g') // any mention to the name of the library with a leading and a trailing underscore

    return processedBytecode.replace(replacementRegex, reference)
  }, bytecode)
}

module.exports = linkLibraries
