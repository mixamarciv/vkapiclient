import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import html from 'rollup-plugin-html';
import visualizer from 'rollup-plugin-visualizer';
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from 'rollup-plugin-terser';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import multiEntry from "rollup-plugin-multi-entry";
import builtins from 'rollup-plugin-node-builtins';

let production = 0;
let expPath = '../docs';
let otherOpt = { format: 'iife', sourcemap: true, name: 'main' };

export default [{
    input: 'src/main.js',
    output: [{ file: expPath + '/bundle.js', ...otherOpt }],
    plugins: [
        svelte({
            dev: !production,
            css: css => { css.write(expPath + '/bundle.css'); }
        }),
        resolve(),
        commonJs(),
        postcss(),
        html(),
        sizeSnapshot(),
        visualizer(),
        builtins(),
        //!production && livereload(expPath),
        production && terser()
    ],
    watch: { clearScreen: false }
}];
