import path from 'path'
import url from 'url'
import {packer, webpack} from 'lerna-packer'
import {babelTargetsLegacyEsmFirst} from 'lerna-packer/packer/babelEsModules.js'
import {makeModulePackageJson, copyRootPackageJson, transformerForLegacyEsmFirst} from 'lerna-packer/packer/modulePackages.js'
import fs from 'fs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

packer({
    apps: {
        reactUseSnackDemo: {
            root: path.resolve(__dirname, 'packages', 'react-use-snack'),
            rootSrc: 'demo/src',
            template: path.resolve(__dirname, 'packages', 'react-use-snack/demo/public/index.html'),
            contentBase: path.resolve(__dirname, 'packages', 'react-use-snack/demo/public'),
            port: 9240,
            main: path.resolve(__dirname, 'packages', 'react-use-snack/demo/src/index.tsx'),
            dist: path.resolve(__dirname, 'dist', 'react-use-snack-demo'),
            devServer: {
                client: {
                    overlay: false,
                    progress: false,
                },
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                }),
            ],
            publicPath: '/',
        },
    },
    backends: {},
    packages: {
        reactUseSnack: {
            name: 'react-use-snack',
            root: path.resolve(__dirname, 'packages', 'react-use-snack'),
            entry: path.resolve(__dirname, 'packages', 'react-use-snack/src/'),
            babelTargets: babelTargetsLegacyEsmFirst,
        },
    },
}, __dirname, {
    afterEsModules: (packages, pathBuild, isServing) => {
        return Promise.all([
            makeModulePackageJson(transformerForLegacyEsmFirst)(
                Object.keys(packages).reduce(
                    (packagesFiltered, pack) =>
                        packages[pack].esmOnly ? packagesFiltered : {...packagesFiltered, [pack]: packages[pack]},
                    {},
                ),
                pathBuild,
            ),
            ...(isServing ? [] : [copyRootPackageJson()(packages, pathBuild)]),
        ]).then(() => undefined).catch((e) => {
            console.error('ERROR after-es-mod', e)
            return Promise.reject(e)
        })
    },
})
    .then(([execs, elapsed]) => {
        if(execs.indexOf('doServe') !== -1) {
            console.log('[packer] is now serving (after ' + elapsed + 'ms)')
        } else {
            if(execs.indexOf('doBuild') !== -1 && execs.indexOf('doBuildBackend') !== -1) {
                const nodePackages = []

                const saver = nodePackages.map((pkg) => {
                    return new Promise(((resolve, reject) => {
                        const packageFile = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json')).toString())
                        // todo: for backends: here check all `devPackages` etc. an replace local-packages with `file:` references,
                        //       then copy the `build` of that package to e.g. `_modules` in the backend `build`
                        if(packageFile.exports) {
                            packageFile.exports = Object.keys(packageFile.exports).reduce((exp, pkgName) => ({
                                ...exp,
                                [pkgName]:
                                    packageFile.exports[pkgName].startsWith('./build/') ?
                                        '.' + packageFile.exports[pkgName].slice('./build'.length) :
                                        packageFile.exports[pkgName].startsWith('./src/') ?
                                            '.' + packageFile.exports[pkgName].slice('./src'.length) :
                                            packageFile.exports[pkgName],
                            }), packageFile.exports)
                        }
                        if(packageFile.main && packageFile.main.startsWith('build/')) {
                            packageFile.main = packageFile.main.slice('build/'.length)
                        }
                        if(packageFile.main && packageFile.main.startsWith('src/')) {
                            packageFile.main = packageFile.main.slice('src/'.length)
                        }
                        if(packageFile.typings && packageFile.typings.startsWith('build/')) {
                            packageFile.typings = packageFile.typings.slice('build/'.length)
                        }
                        if(packageFile.typings && packageFile.typings.startsWith('src/')) {
                            packageFile.typings = packageFile.typings.slice('src/'.length)
                        }
                        if(packageFile.types && packageFile.types.startsWith('build/')) {
                            packageFile.types = packageFile.types.slice('build/'.length)
                        }
                        if(packageFile.types && packageFile.types.startsWith('src/')) {
                            packageFile.types = packageFile.types.slice('src/'.length)
                        }
                        fs.writeFile(path.join(pkg, 'build', 'package.json'), JSON.stringify(packageFile, null, 4), (err) => {
                            if(err) {
                                reject(err)
                                return
                            }
                            resolve()
                        })
                    }))
                })
                Promise.all(saver)
                    .then(() => {
                        console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
                        process.exit(0)
                    })
                    .catch((e) => {
                        console.error('packerConfig', e)
                    })
            } else {
                console.log('[packer] finished successfully (after ' + elapsed + 'ms)', execs)
                process.exit(0)
            }
        }
    })
    .catch((e) => {
        console.error('[packer] finished with error(s)', e)
        process.exit(1)
    })

