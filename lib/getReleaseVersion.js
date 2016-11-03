#!/usr/bin/env node
function getReleaseVersion() {
    const process = require('process');
    const git = require('nodegit-flow');

    var repository = git.Repository.open('..');
    var releasePrefix = repository.then(function(repository) {
        return git.Flow.getReleasePrefix(repository);
    });
    var references = repository.then(function(repository) {
        return repository.getReferences(3);
    });
    var releaseVersion = Promise.all([releasePrefix,references]).then(function(results) {
        var [prefix, refs] = results;
        var referenceNames = refs.map(function(reference) {
            return reference.name();
        });
        var releaseReferenceNames = referenceNames.filter(function(referenceName) {
            return referenceName.includes(prefix);
        });
        if (releaseReferenceNames.length != 1) {
            throw new Error('No or more than one reference with "getReleaseVersion" in its name found')
        }
        var replaceRegExp = new RegExp('.*' + prefix);
        var version = releaseReferenceNames[0].replace(replaceRegExp,'');
        console.log(version);
        return version;
    });
    return releaseVersion;

}

getReleaseVersion().then(function(version) {
    console.log('ha');
    console.log(version);
});

module.exports = getReleaseVersion;