// CustomShader.js
export const vertexShader = `
    varying vec4 vPosition;

    void main() {
        vPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = vPosition;
    }
`;

export const fragmentShaderFourierEpicycle = `
`;

export const fragmentShaderPixelatedNeon = `
    varying vec4 vPosition;
    uniform vec2 resolution;
    uniform float time;

    vec3 palette( float t) {
        vec3 a = vec3(0.2, 1., 1.);
        vec3 b = vec3(1., 0.5, 0.2);
        vec3 c = vec3(1., 0.2, 0.5);
        vec3 d = vec3(0.263, 0.416, 0.557);

        return a + b*cos( 4.2*(c*t+d) );
    }

    void main() {
        // Use vPosition to get the world coordinates of the fragment
        vec2 uv = vPosition.xy / vPosition.w;
        uv.x *= resolution.x / resolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);

        // Pixelize result with uv
        float pixelSize = 10.0;
        float screenSize = min(resolution.x, resolution.y);
        uv = floor(uv * screenSize / pixelSize) / screenSize * pixelSize;

        for (float i = 0.0; i < 4.0; i++) {
            // return the fractionnal part of uv
            uv = fract(uv * 1.5) - 0.5;

            // exp part to create center to border movement
            float d = length(uv) * exp(-length(uv0));

            // use the palette method to modify color over time
            vec3 color = palette(length(uv0) + i*0.4 + time*0.1);

            // sin of time to create the movement
            d = sin(d * 8. + time*0.15) / 8.;
            
            // abs to have inside and outside coloration
            d = abs(d);

            // pow to increase the black contrasts
            d = pow(0.01 / d, 1.5);

            finalColor += color * d;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

export const fragmentShaderMandelbrotZoom = `
    varying vec4 vPosition;
    uniform vec2 resolution;
    uniform float time;

    float distanceToMandelbrot( in vec2 c )
    {
        #if 1
        {
            float c2 = dot(c, c);
            // skip computation inside M1 - https://iquilezles.org/articles/mset1bulb
            if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
            // skip computation inside M2 - https://iquilezles.org/articles/mset2bulb
            if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;
        }
        #endif
    
        // iterate
        float di =  1.0;
        vec2 z  = vec2(0.0);
        float m2 = 0.0;
        vec2 dz = vec2(0.0);
        for( int i=0; i<400; i++ )
        {
            if( m2>1024.0 ) { di=0.0; break; }
    
            // Z' -> 2·Z·Z' + 1
            dz = 2.0*vec2(z.x*dz.x-z.y*dz.y, z.x*dz.y + z.y*dz.x) + vec2(1.0,0.0);
                
            // Z -> Z² + c			
            z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
                
            m2 = dot(z,z);
        }
    
        // distance	
        // d(c) = |Z|·log|Z|/|Z'|
        float d = 0.5*sqrt(dot(z,z)/dot(dz,dz))*log(dot(z,z));
        if( di>0.5 ) d=0.0;
        
        return d;
    }
    
    void main()
    {
        vec2 uv = vPosition.xy / vPosition.w;
        uv.x *= resolution.x / resolution.y;
    
        // animation	
        float tz = 0.5 - 0.5*cos(0.05*time);
        float zoo = pow( 0.5, 16.0*tz );
        vec2 c = vec2(-0.5006,.520) + uv*zoo;
    
        // distance to Mandelbrot
        float d = distanceToMandelbrot(c);
        
        // do some soft coloring based on distance
        d = clamp( pow(4.0*d/zoo,0.2), 0.0, 1.0 );
        
        vec3 col = vec3(d);
        
        gl_FragColor = vec4( col, 1.0 );
    }
`;
