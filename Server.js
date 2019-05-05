'use strict';

var glx = require('greenlock-express').create({
    version: 'draft-11'
    , server: 'https://acme-staging-v02.api.letsencrypt.org/directory'
    //, server: 'https://acme-v02.api.letsencrypt.org/directory'
    , approveDomains: myApproveDomains

    , configDir: '~/acme/'      // Writable directory where certs will be saved


    //, configDir: require('path').join(require('os').homedir(),'acme','ect')
    // Using your express app:
    // simply export it as-is, then include it here
    , app: require('./app.js')
    /* CHANGE TO A VALID EMAIL */
    , email: 'meagtechnologies@gmail.com '                              // Email for Let's Encrypt account and Greenlock Security
    , agreeTos: true                                            // Accept Let's Encrypt ToS
    , communityMember: true                                     // Join Gr
    //, debug: true
});

var server = glx.listen(8080, 4443);
server.on('listening', function () {
    console.info(server.type + " listening on", server.address());
});



function myApproveDomains(opts) {
    console.log('sni:', opts.domain);

    // must be 'meagtechnologies.net' or start with 'meagtechnologies.net'
    if ('meagtechnologies.net' !== opts.domain
        && 'meagtechnologies.net' !== opts.domain.split('.').slice(1).join('.')) {
        return Promise.reject(new Error("we don't serve your kind here: " + opts.domain));
    }

    // the primary domain for the cert
    opts.subject = 'meagtechnologies.net';
    // the altnames (including the primary)
    opts.domains = [opts.subject, '*.meagtechnologies.net'];

    if (!opts.challenges) { opts.challenges = {}; }
    opts.challenges['http-01'] = require('le-challenge-fs').create({});
    // Note: When implementing a dns-01 plugin you should make it check in a loop
    // until it can positively confirm that the DNS changes have propagated.
    // That could take several seconds to a few minutes.
    opts.challenges['dns-01'] = require('le-challenge-dns').create({});

    // explicitly set account id and certificate.id
    opts.account = { id: opts.email };
    opts.certificate = { id: opts.subject };

    return Promise.resolve(opts);
}
