uniform vec2 u_mouse;
uniform vec2 u_viewport;
uniform float u_time;
uniform vec3 u_color;
uniform sampler2D u_map;
uniform sampler2D u_gradientMap;
uniform float u_radius;

varying vec2 v_uv;

float median(float r, float g, float b) 
{
    return max(min(r, g), min(max(r, g), b));
}

float createCircle() 
{
    vec2 viewportUv = gl_FragCoord.xy / u_viewport;
    float viewportAspect = u_viewport.x / u_viewport.y;

    vec2 mousePoint = vec2(u_mouse.x , 1.1 - u_mouse.y);
    float circleRadius = max(0.0, u_radius / u_viewport.x) ;

    vec2 shapeUv = viewportUv - mousePoint;
    shapeUv /= vec2(1.0, viewportAspect);
    shapeUv += mousePoint;

    float dist = distance(shapeUv, mousePoint);
    dist = smoothstep(circleRadius, circleRadius, dist);
    
    return dist;
}

void main() 
{
    float circle = createCircle();
    float width = 0.1;
    float lineProgress = 0.3;
    vec3 mysample = texture2D(u_map, v_uv).rgb;
    float gr = texture2D(u_gradientMap, v_uv).r;

    float sigDist = median(mysample.r, mysample.g, mysample.b) - 0.5;
    float fill = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
    

    // stroke
    float border = sigDist;
    float outline  = smoothstep(0.0, border, sigDist);
    outline  *= 1.0 - smoothstep(width - border, width, sigDist);


    // gradient
    float grgr = fract(3.0 * gr + u_time / 10.0);
    float start = smoothstep(0.0, 0.01, grgr);
    float end = smoothstep(lineProgress, lineProgress, grgr);
    float mask = start * end;
    mask = max(0.2, mask);

    float finalAlpha = outline * mask + fill * circle;

    gl_FragColor = vec4(u_color.xyz, finalAlpha);
}