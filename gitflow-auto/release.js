#!/usr/bin/env node

const process = require('process');
const git = require('nodegit-flow');

git.Repository.open('..').then(function(repository) {
    git.Flow.getReleasePrefix(repository)
        .then(function(releasePrefix) {
            repository.getReferences(3).then(function(references) {
                var referenceNames = references.map(function(reference) {
                    return reference.name();
                });
                var releaseReferenceNames = referenceNames.filter(function(referenceName) {
                    return referenceName.includes(releasePrefix);
                });
                if (releaseReferenceNames.length != 1) {
                    throw new Error('No or more than one reference with "release" in its name found')
                }
                var replaceRegExp = new RegExp('.*' + releasePrefix);
                var version = releaseReferenceNames[0].replace(replaceRegExp,'');
                console.log(version);
            });
        });
    // git.Flow.open(repository).then(function(flow) {
    //     flow.getReleasePrefix(flow);
    // }).then(function(releasePrefix) {
    // });
//  NodeGit.Flow.open(repository)
//    .then((flow) => {
//      return flow.getMasterBranch();
//    })
//    .then((masterBranchName) => {
//      console.log(masterBranchName); // => master
//    });

});

// process.env.VERSION = 

