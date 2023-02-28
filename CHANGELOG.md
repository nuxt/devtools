## [0.2.5](https://github.com/nuxt/devtools-poc/compare/v0.2.4...v0.2.5) (2023-02-28)


### Bug Fixes

* **client:** make iframe-client reactive ([7f1df2c](https://github.com/nuxt/devtools-poc/commit/7f1df2caa0f204d1be63dcb47ebf1163c7bc98da))
* **client:** make ws connection non-blocking ([6ed46e0](https://github.com/nuxt/devtools-poc/commit/6ed46e0542aea839f8d0eaac5fa27b020b12fbd7))
* deprioritize `runtime` categoray in components ([14d3857](https://github.com/nuxt/devtools-poc/commit/14d38572969a32cbd644dfa0466cd9e165da746f))
* filter out lazy runtime component ([507cae2](https://github.com/nuxt/devtools-poc/commit/507cae280da29dbb4ae507a5d299910e69a67c96))
* **ui-kit:** make make code block reactive to color mode ([2c530d8](https://github.com/nuxt/devtools-poc/commit/2c530d81d16ff0ddbe0137f0737fd67786515e3f))
* **ui-kit:** runtime utils reference ([2111622](https://github.com/nuxt/devtools-poc/commit/211162226e9c879f9345423a7a0d9d522abf3798))


### Features

* add storage tab ([#100](https://github.com/nuxt/devtools-poc/issues/100)) ([c153313](https://github.com/nuxt/devtools-poc/commit/c15331343b6ffac0cb1e82a4d7abdd232155e100))
* disconnect indicator ([579e091](https://github.com/nuxt/devtools-poc/commit/579e09143c364a39a4202aa010522509ff7e9fef))
* extract resize panel ([a30ea5f](https://github.com/nuxt/devtools-poc/commit/a30ea5f4ba4981f42c52cf0fc093c3939d8cc631))
* **ui-kit:** introduce `NCodeBlock` and `NMarkdown` components ([f9a4f4b](https://github.com/nuxt/devtools-poc/commit/f9a4f4b04b5ec8354df5f2c4cc70f93659396d56))



## [0.2.4](https://github.com/nuxt/devtools-poc/compare/v0.2.3...v0.2.4) (2023-02-28)


### Bug Fixes

* hooks extend type ([019bad4](https://github.com/nuxt/devtools-poc/commit/019bad409fc8b49da86ef7d2de063392f1943c50))
* **ui-kit:** remove nuxt components override ([132bafe](https://github.com/nuxt/devtools-poc/commit/132bafe8d2954c342317d7d17e6984641b90c465))


### Features

* able to disable inspectors, close [#103](https://github.com/nuxt/devtools-poc/issues/103) ([56d9c56](https://github.com/nuxt/devtools-poc/commit/56d9c567076b29194d94e61217cf08dc137446d1))
* add show workspace filter to component graph ([ad8118e](https://github.com/nuxt/devtools-poc/commit/ad8118e44b3dbb04ef0c586d48df4dab8c9998f1))
* **client:** add splitpanes for resizable columns ([#101](https://github.com/nuxt/devtools-poc/issues/101)) ([2846ab2](https://github.com/nuxt/devtools-poc/commit/2846ab286ea661d640920b4988a99b967fdbcfba))
* re-layout component views ([2db818a](https://github.com/nuxt/devtools-poc/commit/2db818a7a326770b027bdd4c0782dda88c070fa0))
* **ui-kit:** expose `NSectionBlock` and `NIconTitle`, introduce `NSelect` ([#102](https://github.com/nuxt/devtools-poc/issues/102)) ([cebe031](https://github.com/nuxt/devtools-poc/commit/cebe03138ec6f9469904c80230ff81fdb5f333df))



## [0.2.3](https://github.com/nuxt/devtools-poc/compare/v0.2.2...v0.2.3) (2023-02-24)


### Bug Fixes

* always extends `fs.allow` ([0c07ee0](https://github.com/nuxt/devtools-poc/commit/0c07ee08ed5588fed6f678d1f9e2b69275fe690a))
* improve isGlobalInstall detection ([500215d](https://github.com/nuxt/devtools-poc/commit/500215d1f58aae5ca52708423142bbb3f3708a5c))



## [0.2.2](https://github.com/nuxt/devtools-poc/compare/v0.2.1...v0.2.2) (2023-02-24)


### Bug Fixes

* external vite ([fc78ef6](https://github.com/nuxt/devtools-poc/commit/fc78ef67978ecebfe876b6ee9f7037f547b0621a))



## [0.2.1](https://github.com/nuxt/devtools-poc/compare/v0.2.0...v0.2.1) (2023-02-24)


### Bug Fixes

* always show shortcut tip ([01ddd67](https://github.com/nuxt/devtools-poc/commit/01ddd67b4acf45f4f81fe87d90f0d6e0b6892b5e))
* should not override Vite's default `fs.allow` ([9b24dd7](https://github.com/nuxt/devtools-poc/commit/9b24dd76a6f4bcd3ab184a62836b44c86b55573f))



# [0.2.0](https://github.com/nuxt/devtools-poc/compare/v0.1.6...v0.2.0) (2023-02-23)


### Bug Fixes

* **button:** remove zoom from buttons to allow double tap on phone ([#195](https://github.com/nuxt/devtools-poc/issues/195)) ([f22200c](https://github.com/nuxt/devtools-poc/commit/f22200cb2c38d34cd39c464551cb22dcebe38353))
* click outside handling, fix [#90](https://github.com/nuxt/devtools-poc/issues/90) ([40ddb1d](https://github.com/nuxt/devtools-poc/commit/40ddb1d5a6b4d253e58d8c48dc6176ce82e91e8e))
* correctly exit inspector, close [#94](https://github.com/nuxt/devtools-poc/issues/94) ([3900d6b](https://github.com/nuxt/devtools-poc/commit/3900d6b4c861c54f37345702820cdf94e03a7e17))
* move back to components view when selecting a component ([8a62d1f](https://github.com/nuxt/devtools-poc/commit/8a62d1fdcd3495567e9ffb79e3a144beb33a56a8)), closes [#93](https://github.com/nuxt/devtools-poc/issues/93)
* nuxt ui playground, close [#188](https://github.com/nuxt/devtools-poc/issues/188), close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([#192](https://github.com/nuxt/devtools-poc/issues/192)) ([7268b3c](https://github.com/nuxt/devtools-poc/commit/7268b3c635bf8a0692afbc02869e9cc24916cc46))
* **templates:** avoid using blur in no-animation mode, disable animation in Safari ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([23e09be](https://github.com/nuxt/devtools-poc/commit/23e09be0f13946255beca03bb0fa473b6fc99d1f))
* **ui:** `NTextInput` fill width ([de5c772](https://github.com/nuxt/devtools-poc/commit/de5c7725169d88b4b6b4d090c40460f71ddc92f4))
* **ui:** always add global style ([3951517](https://github.com/nuxt/devtools-poc/commit/39515175f179e754dab802d729751b731fa2e4d8))
* **ui:** auto wrap for example layout, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([57a4d9e](https://github.com/nuxt/devtools-poc/commit/57a4d9ee886f17fc251f7583618faaee07ada138))
* **ui:** color-mode using nuxt module ([#86](https://github.com/nuxt/devtools-poc/issues/86)) ([779131e](https://github.com/nuxt/devtools-poc/commit/779131e753ff22fd14a4cb35d4ceb429cbeb7693))
* **ui:** colors ([31a33d6](https://github.com/nuxt/devtools-poc/commit/31a33d6d3b731c703cf90cbd99e03521bcb2bb1e))
* **ui:** darkmode style ([9e1e5fe](https://github.com/nuxt/devtools-poc/commit/9e1e5fea6851cad5dc2c05dad1d42a3ffccfd95c))
* **ui:** explicit imports ([822e8cb](https://github.com/nuxt/devtools-poc/commit/822e8cb91e392fd1d674f1342da4a89ca2ed479f))
* **ui:** fix cjs stub paths ([00e6dc3](https://github.com/nuxt/devtools-poc/commit/00e6dc3e0e21aa9c7d105329d098e293adb73557))
* **ui:** fix color mode toggle on Nuxt ([8f03da2](https://github.com/nuxt/devtools-poc/commit/8f03da290daec7d9479fd529e98adbd975d10b6c))
* **ui:** improve background contrast ([6344904](https://github.com/nuxt/devtools-poc/commit/634490447c0d092fc2498657cbb4a94fbbbbb759))
* **ui:** let nuxt/kit resolve module source ([#117](https://github.com/nuxt/devtools-poc/issues/117)) ([79c08fa](https://github.com/nuxt/devtools-poc/commit/79c08fa41a134a43929ced4544ebe93dfa6c1513))
* **ui:** make carbon icons as deps ([a530f04](https://github.com/nuxt/devtools-poc/commit/a530f04a53202a6d6e111ed0b1b4a8c4c7d17074))
* **ui:** use `NuxtLink` ([202b1c7](https://github.com/nuxt/devtools-poc/commit/202b1c7b4243f453f643c438a52bf7ec8c398090))
* use repo for detecting logo ([b7b3980](https://github.com/nuxt/devtools-poc/commit/b7b39802f91f7aa5615c060af5b71da8328e5d5c))


### Features

* add `@nuxt/ui` ([b5b4baa](https://github.com/nuxt/devtools-poc/commit/b5b4baa5fe5119c597b00d1518168148351b82bf))
* add Typography preset ([#130](https://github.com/nuxt/devtools-poc/issues/130)) ([e3d332e](https://github.com/nuxt/devtools-poc/commit/e3d332e12f684794a7b0e1307f654247b5781fa2)), closes [#129](https://github.com/nuxt/devtools-poc/issues/129)
* click outside to close, close [#90](https://github.com/nuxt/devtools-poc/issues/90) ([f6d8d31](https://github.com/nuxt/devtools-poc/commit/f6d8d315dfb71b27b2de395429e0a0c5e1ed0a9a))
* init component details ([e9096a5](https://github.com/nuxt/devtools-poc/commit/e9096a5b5f37a389d8e22d51f0635a8bee43e4ae))
* introduce local module entry ([0b42fde](https://github.com/nuxt/devtools-poc/commit/0b42fde10d2bf30183ef00f104319c6ee8ff595a))
* new design welcome template ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([9129b96](https://github.com/nuxt/devtools-poc/commit/9129b9686f4a6700a6868350379f988b303b76b1))
* refresh page ([1a924e1](https://github.com/nuxt/devtools-poc/commit/1a924e177beb3a76797f18bea86c1f0a49850090))
* rename icon to logo slot and add content logo ([#108](https://github.com/nuxt/devtools-poc/issues/108)) ([1391b8f](https://github.com/nuxt/devtools-poc/commit/1391b8fe459f4ab9e8687f9fd6d148a9b822b21a))
* rename to `@nuxt/devtools-ui-kit` ([e0ac298](https://github.com/nuxt/devtools-poc/commit/e0ac2982226ec6a2dbaf1f01a53b94f94faea8e2))
* **ui:** add props for input type ([#48](https://github.com/nuxt/devtools-poc/issues/48)) ([933e99a](https://github.com/nuxt/devtools-poc/commit/933e99a1a687dea1d57680d652e7611722aa9010))
* **ui:** enable transformers for unocss ([55e1dd1](https://github.com/nuxt/devtools-poc/commit/55e1dd1cd143771d4b68c03b162a9dc85648231f))
* **ui:** expose unocss preset ([7125735](https://github.com/nuxt/devtools-poc/commit/71257356af40703975fe80750f92f1fc677fae7c))
* **ui:** extend example layout ([#98](https://github.com/nuxt/devtools-poc/issues/98)) ([51a2875](https://github.com/nuxt/devtools-poc/commit/51a2875b09683209dd8e4ccea1df39a1637bb593))
* **ui:** improve dark mode ssr ([8dbd968](https://github.com/nuxt/devtools-poc/commit/8dbd968a27bfc8121ec74f2feedc863d2979b8ac))
* **ui:** new NDarkToggle renderless component helper ([ecf8a69](https://github.com/nuxt/devtools-poc/commit/ecf8a694ea0fdead6c9d3b8276a0e2eb6b682d26))
* **ui:** suport both prefixed and unprefixed icons ([be8306e](https://github.com/nuxt/devtools-poc/commit/be8306ef70028305147d821c456b7c8a0bd8eb6b))
* **ui:** support dark mode for examples ([32d18fb](https://github.com/nuxt/devtools-poc/commit/32d18fbf92841f0670f2ca3f8d3d75542e8dc397))
* update deps ([02d0b94](https://github.com/nuxt/devtools-poc/commit/02d0b94951c5055222f853ef5a295d6a6ec39b88))



## [0.1.6](https://github.com/nuxt/devtools/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools/issues/86) ([92ccf1c](https://github.com/nuxt/devtools/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.5](https://github.com/nuxt/devtools/compare/v0.1.4...v0.1.5) (2023-02-22)


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools/issues/82)) ([70907e0](https://github.com/nuxt/devtools/commit/70907e0a536efa657f449dd0450e7851726daf91))


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools/issues/84) ([87b3232](https://github.com/nuxt/devtools/commit/87b3232b06e73c04412fc4b4564941611fc86932))

### [0.1.4](https://github.com/nuxt/devtools/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools/issues/78) ([c572ed0](https://github.com/nuxt/devtools/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))

### [0.1.3](https://github.com/nuxt/devtools/compare/v0.1.2...v0.1.3) (2023-02-16)


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools/issues/66)) ([8683c50](https://github.com/nuxt/devtools/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools/issues/71)) ([a90b825](https://github.com/nuxt/devtools/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools/issues/70)) ([63bf34f](https://github.com/nuxt/devtools/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools/issues/62) ([e1ff704](https://github.com/nuxt/devtools/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools/issues/41) ([87d64db](https://github.com/nuxt/devtools/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools/issues/61) ([c7f83f8](https://github.com/nuxt/devtools/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools/issues/51)) ([8c05e32](https://github.com/nuxt/devtools/commit/8c05e322965d7da41f9e1b075b688597586bf660))

### [0.1.2](https://github.com/nuxt/devtools/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))

### [0.1.1](https://github.com/nuxt/devtools/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools/issues/42) ([fb70274](https://github.com/nuxt/devtools/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
