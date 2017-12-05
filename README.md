# node-red-contrib-alexa-verifier

This node performs the security checks mandated by Amazon in the 
[Alexa Skills Kit](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html) for Alexa skills hosted as external web services.  It confirms that 
the incoming request contains a valid request signature and a recent timestamp.

The skill's Application ID must be checked seperately. Some skills requests, 
AudioPlayer status updates for example, do not contain an Application ID.

This node is a wrapper for Mike Reinstein&rsquo;s 
[alexa-verifier](https://github.com/mreinstein/alexa-verifier) NodeJS 
module.

## Outputs

If the incoming request does not pass the verification checks, a msg with a msg.statusCode
set and a payload containing an error message describing the reason for the failure 
will be emitted through the "invalid" output port.

If the incoming request passes the checks, the request will be emitted unchanged
through the "valid" output port.

## License

This program is made available under the terms of the GNU General Public License.  Please 
see the LICENSE file distributed with this progam or https://www.gnu.org/licenses/ 
for a copy of this license.
