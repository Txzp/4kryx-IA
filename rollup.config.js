import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"

export default {
    input: "src/index.js",
    output: {
        file: "dist/4kryxAI.plugin.js",
        format: "cjs",
        exports: "default",
        // preserve betterdiscord metadata block at the very top
        banner: `/**
 * @name 4kryxAI
 * @author Txzp
 * @description advanced modular ai assistant integrated inside discord using openrouter stream api
 * @version 1.0.0
 * @source https://github.com/Txzp/4kryx-IA
 */`
    },
    plugins: [
        resolve(),
        babel({
            babelHelpers: "bundled",
            presets: ["@babel/preset-react"],
            extensions: [".js", ".jsx"]
        })
    ]
}