#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	// Horizontal White Lines
	if(mod(vTextureCoord.y * 10.0 - timeFactor, 2.0) > 1.0)
		color = vec4(1.0,1.0,1.0,1.0);

	// Distance to center
	float distanceToCenter = sqrt(pow(vTextureCoord.x - 0.25, 2.0) + pow(vTextureCoord.y - 0.25, 2.0));

	// Color to use (1.0 Pure Color from Texture, 0.0 Black Color)
	float colorMultiplier = 1.0 - (sqrt(2.0) * 2.0 * distanceToCenter);

	gl_FragColor =  vec4(color.rgb * colorMultiplier, 1.0);
}
