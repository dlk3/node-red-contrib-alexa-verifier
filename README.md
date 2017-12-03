# node-red-contrib-alexa-verifier

This node performs the security checks mandated by Amazon in the [Alexa Skills Kit](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html).  It confirms that the incoming request contains the correct Application ID, a valid request signature, and a recent timestamp.

This node is a wrapper for Mike Reinstein's [alexa-verifier](https://github.com/mreinstein/alexa-verifier) NodeJS module, extended to also verify the skill's Application ID.

## Usage

You must configure this node with your Alexa skill's Application ID

## Output

If the incoming request does not pass the verification checks, then msg.payload will contain an error message describing the reason for the failure and msg.statusCode will be set.  The next node in your flow should check for these conditions and route the msg object accordingly.

If the incoming request passes the checks, the request will ba passed through unchanged to the next node in your flow.  It will not contain a msg.statusCode property.

