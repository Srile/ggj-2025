#include "lib/Compatibility.frag"

#define USE_LIGHTS

#define FEATURE_WITH_FOG
#define FEATURE_TONEMAPPING

#define USE_NORMAL
#define USE_MATERIAL_ID
#define USE_TEXTURE_COORDS

#if NUM_LIGHTS > 0
#define USE_POSITION_WORLD
#endif

#include "lib/Uniforms.glsl"
#include "lib/Inputs.frag"
#include "lib/Math.glsl"

#if NUM_LIGHTS > 0
#include "lib/Quaternion.glsl"
#include "lib/Lights.frag"
#endif

#include "lib/Surface.frag"
#include "lib/Packing.frag"
#include "lib/Materials.frag"

#ifdef TONEMAPPING
#include "lib/Color.glsl"
#endif

struct Material {
    lowp vec4 ambientColor;
    lowp vec4 diffuseColor;
    lowp vec4 specularColor;

#ifdef WITH_FOG
    lowp vec4 fogColor;
#endif

    mediump float time;
    mediump float strength;

    lowp uint shininess;
};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

mediump float phongDiffuseBrdf(mediump vec3 lightDir, mediump vec3 normal) {
    return max(0.0, dot(lightDir, normal));
}

mediump float phongSpecularBrdf(mediump vec3 lightDir, mediump vec3 normal, mediump vec3 viewDir, mediump float shininess) {
    mediump vec3 reflection = reflect(lightDir, normal);
    return pow(max(dot(viewDir, reflection), 0.0), shininess);
}

void main() {
    Material mat = decodeMaterial(fragMaterialId);

    lowp vec4 finalDiffuseColor = mat.diffuseColor;
    lowp vec4 finalAmbientColor = mat.ambientColor*finalDiffuseColor;
    lowp vec4 finalSpecularColor = mat.specularColor;
    finalSpecularColor.rgb *= finalSpecularColor.a;

    /* Ambient color */
    outColor.rgb = finalAmbientColor.rgb;
    outColor.a = finalDiffuseColor.a;

    mediump float shininess = float(mat.shininess);

    /* Normal */
    SurfaceData surface = computeSurfaceData(fragNormal);
    mediump vec3 normal = surface.normal;

    #if NUM_LIGHTS > 0
    /* Normally the view vector points to the viewer, but we can save ourselves
     * some negations this way. By passing the standard outward light vector to
     * reflect() (which expects an incident vector), these two cancel out. */
    mediump vec3 viewDir = normalize(fragPositionWorld - viewPositionWorld);
    bool useSpecular = finalSpecularColor.a != 0.0 && shininess != 0.0;

    lowp uint i = 0u;
    for(; i < pointLightCount; ++i) {
        mediump vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = distanceAttenuation(distSq, lightData.a);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb*phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        outColor.rgb += attenuation*value*lightData.rgb;
    }

    lowp uint endSpotLights = pointLightCount + spotLightCount;
    for(; i < endSpotLights; ++i) {
        mediump vec4 lightData = lightColors[i];
        /* dot product of mediump vec3 can be NaN for distances > 128 */
        highp vec3 lightPos = lightPositionsWorld[i];
        highp vec3 lightDirAccurate = lightPos - fragPositionWorld;
        mediump float distSq = dot(lightDirAccurate, lightDirAccurate);
        mediump float attenuation = distanceAttenuation(distSq, lightData.a);

        if(attenuation < 0.001)
            continue;

        mediump vec3 lightDir = lightDirAccurate;
        lightDir *= inversesqrt(distSq);

        highp vec3 spotDir = lightDirectionsWorld[i];
        attenuation *= spotAttenuation(lightDir, spotDir, lightParameters[i].x, lightParameters[i].y);

        if(attenuation < 0.001)
            continue;

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb*phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        outColor.rgb += attenuation*value*lightData.rgb;
    }

    lowp uint endSunLights = pointLightCount + spotLightCount + sunLightCount;
    for(; i < endSunLights; ++i) {
        mediump vec4 lightData = lightColors[i];
        mediump vec3 lightDir = lightDirectionsWorld[i];

        /* Add diffuse color */
        mediump vec3 value = finalDiffuseColor.rgb*
            phongDiffuseBrdf(lightDir, normal);
        /* Add specular color */
        if(useSpecular) {
            value += finalSpecularColor.rgb*
                phongSpecularBrdf(lightDir, normal, viewDir, shininess);
        }
        outColor.rgb += value*lightData.a*lightData.rgb;
    }

    #endif

    #ifdef WITH_FOG
    float dist = gl_FragCoord.z/gl_FragCoord.w;
    float fogFactor = fogFactorExp2(dist, mat.fogColor.a*0.2);
    outColor.rgb = mix(outColor.xyz, mat.fogColor.rgb, fogFactor);
    #endif

    #ifdef TONEMAPPING
    outColor.rgb = tonemap(outColor.rgb);
    #endif

    float strength = dot(normal, -viewDir);

    vec3 wobble = vec3(sin(mod(mat.time, 2.0*PI) + fragTextureCoords.st*2.0*PI), 1.0);

    outColor.rgb = mat.diffuseColor.rgb*strength + mat.specularColor.rgb*wobble*(1.0 - strength)*mat.strength;
}
