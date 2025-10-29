import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const config = {
  input: {
    index: 'src/index.ts',
    index_post: 'src/index_post.ts'
  },
  output: {
    dir: 'dist',
    esModule: true,
    format: 'es',
    sourcemap: true
  },
  plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs()]
}

export default config
