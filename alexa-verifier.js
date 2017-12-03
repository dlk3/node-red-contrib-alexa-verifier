module.exports = function(RED) {
	function verify(config) {
		var verifier = require('alexa-verifier');
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function(msg) {
			if (!node.credentials.hasOwnProperty('applid')) {
				node.error('The alexa verifier node\'s Application ID property needs to be set', msg);
			} else if (!msg.payload.hasOwnProperty('session')) {
				msg.payload = 'The incoming request did not contain a msg.payload.session property object, which suggests that it was not an Alexa skill request'; 
				msg.statusCode = 401;
				node.send(msg);
			} else if (msg.payload.session.application.applicationId != node.credentials.applid) {
				msg.payload = 'The skill request contained an Application ID which did not match the one configured in the alexa verifier node'; 
				msg.statusCode = 401;
				node.send(msg);
			} else if (!msg.req.headers.hasOwnProperty('signaturecertchainurl')) {
				msg.payload = 'The skill request did not contain a msg.req.headers.signaturecertchainurl property.  It is not possible to validate the request signature without this URL.'; 
				msg.statusCode = 401;
				node.send(msg);
			} else {
				//  Use alexa-verifier to verify the request's signature
				var url = msg.req.headers.signaturecertchainurl;
				var signature = msg.req.headers.signature;
				var body = JSON.stringify(msg.req.body);
				var messages = {
					'request body invalid json': 'The request body is not a valid JSON object.  The signature cannot be verified.',
					'missing certificate url': 'The msg.req.headers.signaturecertchainurl property is empty.  The signature cannot be verified.',
					'missing signature': 'The msg.req.headers.signature property is empty.  There is no signature to verify.',
					'missing request (certificate) body': 'The msq.req.body property is empty.  There is no message content to check the signature against.',
					'invalid signature (not base64 encoded)': 'The signature is not properly Base64 encoded and connot be verified.',
					'invalid signature': 'Verification failed: the signature provided is not valid.'
				}
				verifier(url, signature, body, function(err) {
					if (err) {
						if (err in messages) {
							msg.payload = messages[err];
						} else {
							msg.payload = 'Verification failed: ' + err;
						}
						msg.statusCode = 401;
					}
					node.send(msg);
				});
			}
        });
    }
	RED.nodes.registerType('alexa verifier',verify, {
		credentials: {
			applid: {type:'text'}
		}
	});
}
