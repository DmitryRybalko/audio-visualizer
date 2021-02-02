uniform float time;
varying vec2 vUv;
uniform float reverb;

void main()
{
    vec3 color1 = vec3(0.0, 0.7778, 0.65694);
    vec3 color2 = vec3(0.0, 0.0, 0.121); 
    float PI = 3.1415;
    float threshold = 0.0005;
    float line = cos(reverb / 2.0 * 0.1 + PI * 300.0 * ( -0.395 * vUv.y * 0.1) + time);
    float lineAbs = abs(line);
    float colorTransition = 0.0;
    float sk = 0.0;
    if (line < 0.0){
        colorTransition = -1.0;
    }
    else {
        colorTransition = 1.0;
    }
    colorTransition = (colorTransition + 1.0) / 2.0;

    if(lineAbs < threshold) {
        sk = (threshold - lineAbs) / threshold;
        colorTransition = line * (1.0 - sk) * colorTransition;
    }
    vec3 finalColor = color1*colorTransition + color2*(1.0 - colorTransition);

    gl_FragColor = vec4(finalColor, 1.0);
    
}