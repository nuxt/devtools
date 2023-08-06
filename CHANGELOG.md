## [0.7.5](https://github.com/nuxt/devtools/compare/v0.7.4...v0.7.5) (2023-08-06)


### Bug Fixes

* add AuthRequiredPanel to AuthConfirmDialog ([#367](https://github.com/nuxt/devtools/issues/367)) ([ce53651](https://github.com/nuxt/devtools/commit/ce53651d24def0803e79526a122bc478247cbf60))
* requestForAuth devServer host ([#357](https://github.com/nuxt/devtools/issues/357)) ([5e89ce8](https://github.com/nuxt/devtools/commit/5e89ce85c8da655d46352078cc0fd6c6078715ed))
* **server-routes:** clear error onResponse ([#356](https://github.com/nuxt/devtools/issues/356)) ([313fa1b](https://github.com/nuxt/devtools/commit/313fa1b2ec5bc111613a81c971a89742b7bf7bef))


### Features

* add tooltip to buttons ([#359](https://github.com/nuxt/devtools/issues/359)) ([4a29829](https://github.com/nuxt/devtools/commit/4a298296c7029ba33a675f1f2210d69d03d03faa))
* minimize panel on inactive ([#361](https://github.com/nuxt/devtools/issues/361)) ([2b92663](https://github.com/nuxt/devtools/commit/2b92663343657606ee5debe10d745b3e04ea1059))
* quicktype ([#351](https://github.com/nuxt/devtools/issues/351)) ([41ff4ad](https://github.com/nuxt/devtools/commit/41ff4adddaf4faca1608ffc61bd2161c7d497050))



## [0.7.4](https://github.com/nuxt/devtools/compare/v0.7.3...v0.7.4) (2023-08-01)


### Bug Fixes

* find vite client path automatically, close [#352](https://github.com/nuxt/devtools/issues/352) ([b78d04f](https://github.com/nuxt/devtools/commit/b78d04f43ac5929047b5eb9e7db922b870e57777))



## [0.7.3](https://github.com/nuxt/devtools/compare/v0.7.2...v0.7.3) (2023-08-01)


### Bug Fixes

* the panel is stuttering when dragging on the mobile end ([#350](https://github.com/nuxt/devtools/issues/350)) ([6677dd7](https://github.com/nuxt/devtools/commit/6677dd7918a9c2e1e854275b0f9ebacb1d468f0c))
* upgrade `vite-plugin-inspect`, close [#324](https://github.com/nuxt/devtools/issues/324) ([ea41a5d](https://github.com/nuxt/devtools/commit/ea41a5d33f1b727b96ca32133c83058b9ece419e))



## [0.7.2](https://github.com/nuxt/devtools/compare/v0.7.1...v0.7.2) (2023-07-31)


### Bug Fixes

* pinned tabs filter ([#348](https://github.com/nuxt/devtools/issues/348)) ([5c26895](https://github.com/nuxt/devtools/commit/5c268953331643c116c152d29fa0c9d49767fce0))
* **ui-kit:** dialog closing and a11y ([#346](https://github.com/nuxt/devtools/issues/346)) ([95bd0a1](https://github.com/nuxt/devtools/commit/95bd0a1bc346f5bd83259f56ec0dcdb414bfc665))


### Features

* **assets:** add rename and delete action ([#343](https://github.com/nuxt/devtools/issues/343)) ([55f6863](https://github.com/nuxt/devtools/commit/55f6863be3b24b48ec3582f93e44c4a6d205d796))
* enhance state editor ([#349](https://github.com/nuxt/devtools/issues/349)) ([ad56f47](https://github.com/nuxt/devtools/commit/ad56f473f1244845a7350cd82ade335384ab3a38))
* support preview video assets ([#347](https://github.com/nuxt/devtools/issues/347)) ([b4dfc37](https://github.com/nuxt/devtools/commit/b4dfc378109815e7bda1ae1c10c266f03c98636f))



## [0.7.1](https://github.com/nuxt/devtools/compare/v0.7.0...v0.7.1) (2023-07-23)


### Bug Fixes

* **kit:** broken types for `useDevtoolsClient()` ([#340](https://github.com/nuxt/devtools/issues/340)) ([934b1d4](https://github.com/nuxt/devtools/commit/934b1d42930c45cbaea70a66de8100d43821b386))
* **kit:** types for `renderCodeHighlight` ([#341](https://github.com/nuxt/devtools/issues/341)) ([d4e1541](https://github.com/nuxt/devtools/commit/d4e1541a48e09f595cfd9320d8f30e243cec7d0e))


### Features

* **server-routes:** add cookies tab ([#338](https://github.com/nuxt/devtools/issues/338)) ([33e1417](https://github.com/nuxt/devtools/commit/33e1417ce85c90b146b2abf8b221edf30840b736))



# [0.7.0](https://github.com/nuxt/devtools/compare/v0.6.7...v0.7.0) (2023-07-20)


### Bug Fixes

* analyze build without git ([#320](https://github.com/nuxt/devtools/issues/320)) ([76a566b](https://github.com/nuxt/devtools/commit/76a566ba1b2eb7b34130075d5334f1b734c8e809))
* **client:** close button add zIndex ([#315](https://github.com/nuxt/devtools/issues/315)) ([37427ec](https://github.com/nuxt/devtools/commit/37427ec8281ba790827b0b77a08bfddeed90a785))
* do not sync floating panel state across tabs ([41752b2](https://github.com/nuxt/devtools/commit/41752b2366f84b6827a55fbcac113e72dbe051e0))
* **plugin-metrics:** properly forward all args, close [#337](https://github.com/nuxt/devtools/issues/337) ([ec1c821](https://github.com/nuxt/devtools/commit/ec1c82169a8459c4d70c757bed4cf4c48137b48c))
* respect Nuxt's `devServer` config when creating request for auth URL ([#328](https://github.com/nuxt/devtools/issues/328)) ([7d766ac](https://github.com/nuxt/devtools/commit/7d766ac86bf1e8cfe380e9d865255592629066f1))
* **server-routes:** filter only dir as collection ([#329](https://github.com/nuxt/devtools/issues/329)) ([4d2f842](https://github.com/nuxt/devtools/commit/4d2f842e3aca31a0e2fee9b5cb216261c11d4f62))
* **timeline:** duplication injection ([f5e3766](https://github.com/nuxt/devtools/commit/f5e37662261c7d380e530d0bb66a4dac66a08723))
* **timeline:** error tolerant promising checking ([762a669](https://github.com/nuxt/devtools/commit/762a669dcbee99fe2319d8f74014bd27f46e259b))
* **timeline:** filter logic ([414ad1c](https://github.com/nuxt/devtools/commit/414ad1ce39ad15d85559ca3bf519ff10f418dab3))
* **timeline:** result check ([72c877b](https://github.com/nuxt/devtools/commit/72c877b0b4009f73e93f4a5ebd304208b7d22e2e))
* use `error-stack-parser-es` ([8c1974b](https://github.com/nuxt/devtools/commit/8c1974b12b99cce73443cfcf9cc1765f3d4ea7fd))


### Features

* **assets:** add watcher ([#336](https://github.com/nuxt/devtools/issues/336)) ([bde6a6a](https://github.com/nuxt/devtools/commit/bde6a6a5e298fa2bf4e8e6f952b364dfa6def42d))
* **assets:** tree view for list mode ([#335](https://github.com/nuxt/devtools/issues/335)) ([57b9ca5](https://github.com/nuxt/devtools/commit/57b9ca5b1c65c1d9fb4f923835926b983d7289d6))
* experimental timeline ([#323](https://github.com/nuxt/devtools/issues/323)) ([99073e4](https://github.com/nuxt/devtools/commit/99073e4788511f9681c77438fc9f77d959ece5c9))
* install modules at once ([#333](https://github.com/nuxt/devtools/issues/333)) ([03f9a8c](https://github.com/nuxt/devtools/commit/03f9a8cb041926e96e81076211281fbcefd95457))
* **server-routes:** add global default inputs ([#321](https://github.com/nuxt/devtools/issues/321)) ([80a284f](https://github.com/nuxt/devtools/commit/80a284ffa5710f21a206a799b5769844fba5a115))
* **server-routes:** toggle view ([#310](https://github.com/nuxt/devtools/issues/310)) ([81b2816](https://github.com/nuxt/devtools/commit/81b2816716e278519f6c5b6a3817d4f152126a8c))
* set module search field autofocus ([#313](https://github.com/nuxt/devtools/issues/313)) ([dd1a177](https://github.com/nuxt/devtools/commit/dd1a17774ce68af2ed2c7682eb25f7156bcc3224))
* split screen support ([#327](https://github.com/nuxt/devtools/issues/327)) ([f2eee67](https://github.com/nuxt/devtools/commit/f2eee67dafc2b428de806356f8490c5468fa440c))
* **timeline:** dialog to enable with one click ([92dfd21](https://github.com/nuxt/devtools/commit/92dfd21aece17323f1c12b005fd990f161e47382))
* **timeline:** list view ([9601cb4](https://github.com/nuxt/devtools/commit/9601cb4463b451df58165f3df91672f1c8ad3961))
* **timeline:** scale on Alt+wheel ([1050e05](https://github.com/nuxt/devtools/commit/1050e05e4aa2da9220e6ce6186b891c47a995fb0))



## [0.6.7](https://github.com/nuxt/devtools/compare/v0.6.6...v0.6.7) (2023-07-05)


### Bug Fixes

* **navbar:** center items ([#307](https://github.com/nuxt/devtools/issues/307)) ([43ff171](https://github.com/nuxt/devtools/commit/43ff1715c78ad25fbd214dacd4e03034352a5659))
* **server-routes:** fixed boolean undefined value ([#304](https://github.com/nuxt/devtools/issues/304)) ([95f3dd8](https://github.com/nuxt/devtools/commit/95f3dd88602f2bd0a5e51af670b09b12dc7ff1b8))
* **server-routes:** make sure input's key has value ([#306](https://github.com/nuxt/devtools/issues/306)) ([8f25d72](https://github.com/nuxt/devtools/commit/8f25d72a8964d9bb8db2a402f55ace794aaf972d))


### Features

* allow pinning tabs ([059f98b](https://github.com/nuxt/devtools/commit/059f98bfcb2a8db9440837796f6d089ee18b33cd))
* **server-routes:** display latest selected route ([#309](https://github.com/nuxt/devtools/issues/309)) ([2977264](https://github.com/nuxt/devtools/commit/2977264b6c36705f114d04ea0d48f29f64845b9e))



## [0.6.6](https://github.com/nuxt/devtools/compare/v0.6.5...v0.6.6) (2023-06-30)


### Bug Fixes

* handle when iframe is failed to create ([ace5d5b](https://github.com/nuxt/devtools/commit/ace5d5b1710c59e49872fc22c578d5c6cf2f4722))
* stackblitz support ([33e83ae](https://github.com/nuxt/devtools/commit/33e83aeaac25da112a6f4f2cdcbb2658af065758))



## [0.6.5](https://github.com/nuxt/devtools/compare/v0.6.4...v0.6.5) (2023-06-30)


### Bug Fixes

* open DevTools back when open file in embedded VS Code ([#299](https://github.com/nuxt/devtools/issues/299)) ([45dc415](https://github.com/nuxt/devtools/commit/45dc415977e2634a19d36db648bbd92d3589d53f))
* **plugins:** change execution time position ([#294](https://github.com/nuxt/devtools/issues/294)) ([2b5f8e5](https://github.com/nuxt/devtools/commit/2b5f8e539e443a41bca906c53c6cc7bcf51bc0d1))
* **server-routes:** fixed same path different methods ([#301](https://github.com/nuxt/devtools/issues/301)) ([6dd8eb3](https://github.com/nuxt/devtools/commit/6dd8eb3f93738764eb17f48740accf41b34b9798))
* try catch iframe cross-domain error ([ddf41ea](https://github.com/nuxt/devtools/commit/ddf41eaf0ea845eb393120ca60a6650931bc169d))


### Features

* **server-routes:** json-editor for tab inputs ([#297](https://github.com/nuxt/devtools/issues/297)) ([ee3b446](https://github.com/nuxt/devtools/commit/ee3b446fac26798ff223dfbdff9b41f3fd6c8cff))
* **server-routes:** preview for pdfs ([#300](https://github.com/nuxt/devtools/issues/300)) ([5dd6ea7](https://github.com/nuxt/devtools/commit/5dd6ea7ceb79ee8ce75c2e44fb887ce142424171))



## [0.6.4](https://github.com/nuxt/devtools/compare/v0.6.3...v0.6.4) (2023-06-26)


### Bug Fixes

* disable iframe interactive on dragging ([cc84ccf](https://github.com/nuxt/devtools/commit/cc84ccf7849aeaea149d1614db2de3265ae46343))
* prevent floating panel to dragged outside of window ([#290](https://github.com/nuxt/devtools/issues/290)) ([6d315cd](https://github.com/nuxt/devtools/commit/6d315cd05198f65c4767cae3d2aba7523054abd1))
* respect safe area, close [#272](https://github.com/nuxt/devtools/issues/272) ([2d84e4f](https://github.com/nuxt/devtools/commit/2d84e4f5e53d3d29dbc61f512e0218908cb32e51))


### Features

* add PiP flag settings link ([#292](https://github.com/nuxt/devtools/issues/292)) ([d21e24f](https://github.com/nuxt/devtools/commit/d21e24fa5fb77d6e1b421734d972251412d196a3))
* **server-routes:** preview for media type ([#291](https://github.com/nuxt/devtools/issues/291)) ([b56c860](https://github.com/nuxt/devtools/commit/b56c86081fb500241a511c23d2569a33a49c2825))



## [0.6.3](https://github.com/nuxt/devtools/compare/v0.6.2...v0.6.3) (2023-06-23)


### Bug Fixes

* add button and font reset to floating panel ([f819b0c](https://github.com/nuxt/devtools/commit/f819b0cdd6dc7378ed4ac0cea86b52b022be76d1))
* **ComponentGraph:** show global components in different color ([#278](https://github.com/nuxt/devtools/issues/278)) ([41a881d](https://github.com/nuxt/devtools/commit/41a881de63a45f7a9ca66f4fef3cd78adb4251c8))
* **overview:** modules count ([#284](https://github.com/nuxt/devtools/issues/284)) ([2ef2664](https://github.com/nuxt/devtools/commit/2ef26646d5226d49820983fdd96bedb887084b0f))


### Features

* popup devtools as Picture-in-Picture ([#282](https://github.com/nuxt/devtools/issues/282)) ([a65f50e](https://github.com/nuxt/devtools/commit/a65f50ee4a36182e05c32494d11c41716b23da96))
* **server-routes:** group routes by type ([#256](https://github.com/nuxt/devtools/issues/256)) ([6899cbb](https://github.com/nuxt/devtools/commit/6899cbbd1839224c6ac7508208c0b5f81ddb076d))
* **server-routes:** read routes from nitro ([#286](https://github.com/nuxt/devtools/issues/286)) ([2cf46b0](https://github.com/nuxt/devtools/commit/2cf46b066aaf835e0bc34ce975f1447a48274b68))



## [0.6.2](https://github.com/nuxt/devtools/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools/issues/277)) ([980ad3c](https://github.com/nuxt/devtools/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools/issues/279)) ([7f922df](https://github.com/nuxt/devtools/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools/issues/271) ([63e2a19](https://github.com/nuxt/devtools/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools/issues/257)) ([306c6a5](https://github.com/nuxt/devtools/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools/issues/262) ([594a352](https://github.com/nuxt/devtools/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools/issues/247)) ([3cf828e](https://github.com/nuxt/devtools/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools/issues/266)) ([4b02cca](https://github.com/nuxt/devtools/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools/issues/240)) ([0760252](https://github.com/nuxt/devtools/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools/issues/241)) ([16f726c](https://github.com/nuxt/devtools/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools/issues/192) ([c27f80b](https://github.com/nuxt/devtools/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools/issues/238)) ([5162bdd](https://github.com/nuxt/devtools/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools/issues/239)) ([31c92f5](https://github.com/nuxt/devtools/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools/issues/224)) ([782e0da](https://github.com/nuxt/devtools/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools/issues/234) ([3311f11](https://github.com/nuxt/devtools/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools/issues/236) ([83b775a](https://github.com/nuxt/devtools/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools/issues/222)) ([501682b](https://github.com/nuxt/devtools/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools/issues/190)) ([2344afd](https://github.com/nuxt/devtools/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools/issues/232)) ([3b99477](https://github.com/nuxt/devtools/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools/issues/227) ([0caa4de](https://github.com/nuxt/devtools/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools/issues/209)) ([b94de30](https://github.com/nuxt/devtools/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools/issues/215)) ([44fce14](https://github.com/nuxt/devtools/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools/issues/207)) ([9f17662](https://github.com/nuxt/devtools/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools/issues/202) ([e9ab49f](https://github.com/nuxt/devtools/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools/issues/205)) ([19fda12](https://github.com/nuxt/devtools/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools/issues/206) ([d63cf58](https://github.com/nuxt/devtools/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools/issues/184) ([73ef44c](https://github.com/nuxt/devtools/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools/issues/197)) ([3075fc1](https://github.com/nuxt/devtools/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools/issues/199)) ([aec5192](https://github.com/nuxt/devtools/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools/issues/200)) ([9551479](https://github.com/nuxt/devtools/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools/issues/195) ([76b3c7a](https://github.com/nuxt/devtools/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools/issues/178)) ([646fb9b](https://github.com/nuxt/devtools/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools/issues/187)) ([f47060e](https://github.com/nuxt/devtools/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools/issues/186)) ([2791d3e](https://github.com/nuxt/devtools/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools/issues/183) ([4f49cd4](https://github.com/nuxt/devtools/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools/issues/181)) ([f3d61da](https://github.com/nuxt/devtools/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools/issues/159)) ([5722c5b](https://github.com/nuxt/devtools/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools/issues/165) ([bba0496](https://github.com/nuxt/devtools/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools/issues/169) ([8bec14f](https://github.com/nuxt/devtools/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools/issues/163) ([e1af4a0](https://github.com/nuxt/devtools/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools/issues/164)) ([02bd75d](https://github.com/nuxt/devtools/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools/issues/170)) ([069ac33](https://github.com/nuxt/devtools/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools/issues/133)) ([d440f14](https://github.com/nuxt/devtools/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools/issues/153) ([ede19a7](https://github.com/nuxt/devtools/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools/issues/137) ([d608a0f](https://github.com/nuxt/devtools/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools/issues/138)) ([310117a](https://github.com/nuxt/devtools/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools/issues/132) ([0572b18](https://github.com/nuxt/devtools/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools/issues/113) ([f172ffb](https://github.com/nuxt/devtools/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools/issues/131)) ([96080a8](https://github.com/nuxt/devtools/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools/issues/125)) ([df3b1db](https://github.com/nuxt/devtools/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools/issues/120)) ([fd99453](https://github.com/nuxt/devtools/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools/issues/134)) ([4deb883](https://github.com/nuxt/devtools/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools/issues/116)) ([4a403e2](https://github.com/nuxt/devtools/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools/issues/105)) ([0813626](https://github.com/nuxt/devtools/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools/issues/117) ([df4a35f](https://github.com/nuxt/devtools/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



## [0.2.5](https://github.com/nuxt/devtools/compare/v0.2.4...v0.2.5) (2023-02-28)


### Bug Fixes

* **client:** make iframe-client reactive ([7f1df2c](https://github.com/nuxt/devtools/commit/7f1df2caa0f204d1be63dcb47ebf1163c7bc98da))
* **client:** make ws connection non-blocking ([6ed46e0](https://github.com/nuxt/devtools/commit/6ed46e0542aea839f8d0eaac5fa27b020b12fbd7))
* deprioritize `runtime` categoray in components ([14d3857](https://github.com/nuxt/devtools/commit/14d38572969a32cbd644dfa0466cd9e165da746f))
* filter out lazy runtime component ([507cae2](https://github.com/nuxt/devtools/commit/507cae280da29dbb4ae507a5d299910e69a67c96))
* **ui-kit:** make make code block reactive to color mode ([2c530d8](https://github.com/nuxt/devtools/commit/2c530d81d16ff0ddbe0137f0737fd67786515e3f))
* **ui-kit:** runtime utils reference ([2111622](https://github.com/nuxt/devtools/commit/211162226e9c879f9345423a7a0d9d522abf3798))


### Features

* add storage tab ([#100](https://github.com/nuxt/devtools/issues/100)) ([c153313](https://github.com/nuxt/devtools/commit/c15331343b6ffac0cb1e82a4d7abdd232155e100))
* disconnect indicator ([579e091](https://github.com/nuxt/devtools/commit/579e09143c364a39a4202aa010522509ff7e9fef))
* extract resize panel ([a30ea5f](https://github.com/nuxt/devtools/commit/a30ea5f4ba4981f42c52cf0fc093c3939d8cc631))
* **ui-kit:** introduce `NCodeBlock` and `NMarkdown` components ([f9a4f4b](https://github.com/nuxt/devtools/commit/f9a4f4b04b5ec8354df5f2c4cc70f93659396d56))



## [0.2.4](https://github.com/nuxt/devtools/compare/v0.2.3...v0.2.4) (2023-02-28)


### Bug Fixes

* hooks extend type ([019bad4](https://github.com/nuxt/devtools/commit/019bad409fc8b49da86ef7d2de063392f1943c50))
* **ui-kit:** remove nuxt components override ([132bafe](https://github.com/nuxt/devtools/commit/132bafe8d2954c342317d7d17e6984641b90c465))


### Features

* able to disable inspectors, close [#103](https://github.com/nuxt/devtools/issues/103) ([56d9c56](https://github.com/nuxt/devtools/commit/56d9c567076b29194d94e61217cf08dc137446d1))
* add show workspace filter to component graph ([ad8118e](https://github.com/nuxt/devtools/commit/ad8118e44b3dbb04ef0c586d48df4dab8c9998f1))
* **client:** add splitpanes for resizable columns ([#101](https://github.com/nuxt/devtools/issues/101)) ([2846ab2](https://github.com/nuxt/devtools/commit/2846ab286ea661d640920b4988a99b967fdbcfba))
* re-layout component views ([2db818a](https://github.com/nuxt/devtools/commit/2db818a7a326770b027bdd4c0782dda88c070fa0))
* **ui-kit:** expose `NSectionBlock` and `NIconTitle`, introduce `NSelect` ([#102](https://github.com/nuxt/devtools/issues/102)) ([cebe031](https://github.com/nuxt/devtools/commit/cebe03138ec6f9469904c80230ff81fdb5f333df))



## [0.2.3](https://github.com/nuxt/devtools/compare/v0.2.2...v0.2.3) (2023-02-24)


### Bug Fixes

* always extends `fs.allow` ([0c07ee0](https://github.com/nuxt/devtools/commit/0c07ee08ed5588fed6f678d1f9e2b69275fe690a))
* improve isGlobalInstall detection ([500215d](https://github.com/nuxt/devtools/commit/500215d1f58aae5ca52708423142bbb3f3708a5c))



## [0.2.2](https://github.com/nuxt/devtools/compare/v0.2.1...v0.2.2) (2023-02-24)


### Bug Fixes

* external vite ([fc78ef6](https://github.com/nuxt/devtools/commit/fc78ef67978ecebfe876b6ee9f7037f547b0621a))



## [0.2.1](https://github.com/nuxt/devtools/compare/v0.2.0...v0.2.1) (2023-02-24)


### Bug Fixes

* always show shortcut tip ([01ddd67](https://github.com/nuxt/devtools/commit/01ddd67b4acf45f4f81fe87d90f0d6e0b6892b5e))
* should not override Vite's default `fs.allow` ([9b24dd7](https://github.com/nuxt/devtools/commit/9b24dd76a6f4bcd3ab184a62836b44c86b55573f))



# [0.2.0](https://github.com/nuxt/devtools/compare/v0.1.6...v0.2.0) (2023-02-23)


### Bug Fixes

* **button:** remove zoom from buttons to allow double tap on phone ([#195](https://github.com/nuxt/devtools/issues/195)) ([f22200c](https://github.com/nuxt/devtools/commit/f22200cb2c38d34cd39c464551cb22dcebe38353))
* click outside handling, fix [#90](https://github.com/nuxt/devtools/issues/90) ([40ddb1d](https://github.com/nuxt/devtools/commit/40ddb1d5a6b4d253e58d8c48dc6176ce82e91e8e))
* correctly exit inspector, close [#94](https://github.com/nuxt/devtools/issues/94) ([3900d6b](https://github.com/nuxt/devtools/commit/3900d6b4c861c54f37345702820cdf94e03a7e17))
* move back to components view when selecting a component ([8a62d1f](https://github.com/nuxt/devtools/commit/8a62d1fdcd3495567e9ffb79e3a144beb33a56a8)), closes [#93](https://github.com/nuxt/devtools/issues/93)
* nuxt ui playground, close [#188](https://github.com/nuxt/devtools/issues/188), close [#184](https://github.com/nuxt/devtools/issues/184) ([#192](https://github.com/nuxt/devtools/issues/192)) ([7268b3c](https://github.com/nuxt/devtools/commit/7268b3c635bf8a0692afbc02869e9cc24916cc46))
* **templates:** avoid using blur in no-animation mode, disable animation in Safari ([#175](https://github.com/nuxt/devtools/issues/175)) ([23e09be](https://github.com/nuxt/devtools/commit/23e09be0f13946255beca03bb0fa473b6fc99d1f))
* **ui:** `NTextInput` fill width ([de5c772](https://github.com/nuxt/devtools/commit/de5c7725169d88b4b6b4d090c40460f71ddc92f4))
* **ui:** always add global style ([3951517](https://github.com/nuxt/devtools/commit/39515175f179e754dab802d729751b731fa2e4d8))
* **ui:** auto wrap for example layout, close [#163](https://github.com/nuxt/devtools/issues/163) ([#164](https://github.com/nuxt/devtools/issues/164)) ([57a4d9e](https://github.com/nuxt/devtools/commit/57a4d9ee886f17fc251f7583618faaee07ada138))
* **ui:** color-mode using nuxt module ([#86](https://github.com/nuxt/devtools/issues/86)) ([779131e](https://github.com/nuxt/devtools/commit/779131e753ff22fd14a4cb35d4ceb429cbeb7693))
* **ui:** colors ([31a33d6](https://github.com/nuxt/devtools/commit/31a33d6d3b731c703cf90cbd99e03521bcb2bb1e))
* **ui:** darkmode style ([9e1e5fe](https://github.com/nuxt/devtools/commit/9e1e5fea6851cad5dc2c05dad1d42a3ffccfd95c))
* **ui:** explicit imports ([822e8cb](https://github.com/nuxt/devtools/commit/822e8cb91e392fd1d674f1342da4a89ca2ed479f))
* **ui:** fix cjs stub paths ([00e6dc3](https://github.com/nuxt/devtools/commit/00e6dc3e0e21aa9c7d105329d098e293adb73557))
* **ui:** fix color mode toggle on Nuxt ([8f03da2](https://github.com/nuxt/devtools/commit/8f03da290daec7d9479fd529e98adbd975d10b6c))
* **ui:** improve background contrast ([6344904](https://github.com/nuxt/devtools/commit/634490447c0d092fc2498657cbb4a94fbbbbb759))
* **ui:** let nuxt/kit resolve module source ([#117](https://github.com/nuxt/devtools/issues/117)) ([79c08fa](https://github.com/nuxt/devtools/commit/79c08fa41a134a43929ced4544ebe93dfa6c1513))
* **ui:** make carbon icons as deps ([a530f04](https://github.com/nuxt/devtools/commit/a530f04a53202a6d6e111ed0b1b4a8c4c7d17074))
* **ui:** use `NuxtLink` ([202b1c7](https://github.com/nuxt/devtools/commit/202b1c7b4243f453f643c438a52bf7ec8c398090))
* use repo for detecting logo ([b7b3980](https://github.com/nuxt/devtools/commit/b7b39802f91f7aa5615c060af5b71da8328e5d5c))


### Features

* add `@nuxt/ui` ([b5b4baa](https://github.com/nuxt/devtools/commit/b5b4baa5fe5119c597b00d1518168148351b82bf))
* add Typography preset ([#130](https://github.com/nuxt/devtools/issues/130)) ([e3d332e](https://github.com/nuxt/devtools/commit/e3d332e12f684794a7b0e1307f654247b5781fa2)), closes [#129](https://github.com/nuxt/devtools/issues/129)
* click outside to close, close [#90](https://github.com/nuxt/devtools/issues/90) ([f6d8d31](https://github.com/nuxt/devtools/commit/f6d8d315dfb71b27b2de395429e0a0c5e1ed0a9a))
* init component details ([e9096a5](https://github.com/nuxt/devtools/commit/e9096a5b5f37a389d8e22d51f0635a8bee43e4ae))
* introduce local module entry ([0b42fde](https://github.com/nuxt/devtools/commit/0b42fde10d2bf30183ef00f104319c6ee8ff595a))
* new design welcome template ([#178](https://github.com/nuxt/devtools/issues/178)) ([9129b96](https://github.com/nuxt/devtools/commit/9129b9686f4a6700a6868350379f988b303b76b1))
* refresh page ([1a924e1](https://github.com/nuxt/devtools/commit/1a924e177beb3a76797f18bea86c1f0a49850090))
* rename icon to logo slot and add content logo ([#108](https://github.com/nuxt/devtools/issues/108)) ([1391b8f](https://github.com/nuxt/devtools/commit/1391b8fe459f4ab9e8687f9fd6d148a9b822b21a))
* rename to `@nuxt/devtools-ui-kit` ([e0ac298](https://github.com/nuxt/devtools/commit/e0ac2982226ec6a2dbaf1f01a53b94f94faea8e2))
* **ui:** add props for input type ([#48](https://github.com/nuxt/devtools/issues/48)) ([933e99a](https://github.com/nuxt/devtools/commit/933e99a1a687dea1d57680d652e7611722aa9010))
* **ui:** enable transformers for unocss ([55e1dd1](https://github.com/nuxt/devtools/commit/55e1dd1cd143771d4b68c03b162a9dc85648231f))
* **ui:** expose unocss preset ([7125735](https://github.com/nuxt/devtools/commit/71257356af40703975fe80750f92f1fc677fae7c))
* **ui:** extend example layout ([#98](https://github.com/nuxt/devtools/issues/98)) ([51a2875](https://github.com/nuxt/devtools/commit/51a2875b09683209dd8e4ccea1df39a1637bb593))
* **ui:** improve dark mode ssr ([8dbd968](https://github.com/nuxt/devtools/commit/8dbd968a27bfc8121ec74f2feedc863d2979b8ac))
* **ui:** new NDarkToggle renderless component helper ([ecf8a69](https://github.com/nuxt/devtools/commit/ecf8a694ea0fdead6c9d3b8276a0e2eb6b682d26))
* **ui:** suport both prefixed and unprefixed icons ([be8306e](https://github.com/nuxt/devtools/commit/be8306ef70028305147d821c456b7c8a0bd8eb6b))
* **ui:** support dark mode for examples ([32d18fb](https://github.com/nuxt/devtools/commit/32d18fbf92841f0670f2ca3f8d3d75542e8dc397))
* update deps ([02d0b94](https://github.com/nuxt/devtools/commit/02d0b94951c5055222f853ef5a295d6a6ec39b88))



## [0.1.6](https://github.com/nuxt/devtools/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools/issues/86) ([92ccf1c](https://github.com/nuxt/devtools/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools/issues/84) ([87b3232](https://github.com/nuxt/devtools/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools/issues/82)) ([70907e0](https://github.com/nuxt/devtools/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools/issues/78) ([c572ed0](https://github.com/nuxt/devtools/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools/compare/v0.1.2...v0.1.3) (2023-02-16)


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


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools/issues/42) ([fb70274](https://github.com/nuxt/devtools/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools/issues/28) ([3a115aa](https://github.com/nuxt/devtools/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools/issues/5)) ([28def06](https://github.com/nuxt/devtools/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools/issues/27) ([49b2e55](https://github.com/nuxt/devtools/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.6](https://github.com/nuxt/devtools-poc/compare/v0.6.5...v0.6.6) (2023-06-30)


### Bug Fixes

* handle when iframe is failed to create ([ace5d5b](https://github.com/nuxt/devtools-poc/commit/ace5d5b1710c59e49872fc22c578d5c6cf2f4722))
* stackblitz support ([33e83ae](https://github.com/nuxt/devtools-poc/commit/33e83aeaac25da112a6f4f2cdcbb2658af065758))



## [0.6.5](https://github.com/nuxt/devtools-poc/compare/v0.6.4...v0.6.5) (2023-06-30)


### Bug Fixes

* open DevTools back when open file in embedded VS Code ([#299](https://github.com/nuxt/devtools-poc/issues/299)) ([45dc415](https://github.com/nuxt/devtools-poc/commit/45dc415977e2634a19d36db648bbd92d3589d53f))
* **plugins:** change execution time position ([#294](https://github.com/nuxt/devtools-poc/issues/294)) ([2b5f8e5](https://github.com/nuxt/devtools-poc/commit/2b5f8e539e443a41bca906c53c6cc7bcf51bc0d1))
* **server-routes:** fixed same path different methods ([#301](https://github.com/nuxt/devtools-poc/issues/301)) ([6dd8eb3](https://github.com/nuxt/devtools-poc/commit/6dd8eb3f93738764eb17f48740accf41b34b9798))
* try catch iframe cross-domain error ([ddf41ea](https://github.com/nuxt/devtools-poc/commit/ddf41eaf0ea845eb393120ca60a6650931bc169d))


### Features

* **server-routes:** json-editor for tab inputs ([#297](https://github.com/nuxt/devtools-poc/issues/297)) ([ee3b446](https://github.com/nuxt/devtools-poc/commit/ee3b446fac26798ff223dfbdff9b41f3fd6c8cff))
* **server-routes:** preview for pdfs ([#300](https://github.com/nuxt/devtools-poc/issues/300)) ([5dd6ea7](https://github.com/nuxt/devtools-poc/commit/5dd6ea7ceb79ee8ce75c2e44fb887ce142424171))



## [0.6.4](https://github.com/nuxt/devtools-poc/compare/v0.6.3...v0.6.4) (2023-06-26)


### Bug Fixes

* disable iframe interactive on dragging ([cc84ccf](https://github.com/nuxt/devtools-poc/commit/cc84ccf7849aeaea149d1614db2de3265ae46343))
* prevent floating panel to dragged outside of window ([#290](https://github.com/nuxt/devtools-poc/issues/290)) ([6d315cd](https://github.com/nuxt/devtools-poc/commit/6d315cd05198f65c4767cae3d2aba7523054abd1))
* respect safe area, close [#272](https://github.com/nuxt/devtools-poc/issues/272) ([2d84e4f](https://github.com/nuxt/devtools-poc/commit/2d84e4f5e53d3d29dbc61f512e0218908cb32e51))


### Features

* add PiP flag settings link ([#292](https://github.com/nuxt/devtools-poc/issues/292)) ([d21e24f](https://github.com/nuxt/devtools-poc/commit/d21e24fa5fb77d6e1b421734d972251412d196a3))
* **server-routes:** preview for media type ([#291](https://github.com/nuxt/devtools-poc/issues/291)) ([b56c860](https://github.com/nuxt/devtools-poc/commit/b56c86081fb500241a511c23d2569a33a49c2825))



## [0.6.3](https://github.com/nuxt/devtools-poc/compare/v0.6.2...v0.6.3) (2023-06-23)


### Bug Fixes

* add button and font reset to floating panel ([f819b0c](https://github.com/nuxt/devtools-poc/commit/f819b0cdd6dc7378ed4ac0cea86b52b022be76d1))
* **ComponentGraph:** show global components in different color ([#278](https://github.com/nuxt/devtools-poc/issues/278)) ([41a881d](https://github.com/nuxt/devtools-poc/commit/41a881de63a45f7a9ca66f4fef3cd78adb4251c8))
* **overview:** modules count ([#284](https://github.com/nuxt/devtools-poc/issues/284)) ([2ef2664](https://github.com/nuxt/devtools-poc/commit/2ef26646d5226d49820983fdd96bedb887084b0f))


### Features

* popup devtools as Picture-in-Picture ([#282](https://github.com/nuxt/devtools-poc/issues/282)) ([a65f50e](https://github.com/nuxt/devtools-poc/commit/a65f50ee4a36182e05c32494d11c41716b23da96))
* **server-routes:** group routes by type ([#256](https://github.com/nuxt/devtools-poc/issues/256)) ([6899cbb](https://github.com/nuxt/devtools-poc/commit/6899cbbd1839224c6ac7508208c0b5f81ddb076d))
* **server-routes:** read routes from nitro ([#286](https://github.com/nuxt/devtools-poc/issues/286)) ([2cf46b0](https://github.com/nuxt/devtools-poc/commit/2cf46b066aaf835e0bc34ce975f1447a48274b68))



## [0.6.2](https://github.com/nuxt/devtools-poc/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools-poc/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools-poc/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools-poc/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools-poc/issues/277)) ([980ad3c](https://github.com/nuxt/devtools-poc/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools-poc/issues/279)) ([7f922df](https://github.com/nuxt/devtools-poc/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools-poc/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.5](https://github.com/nuxt/devtools-poc/compare/v0.6.4...v0.6.5) (2023-06-30)


### Bug Fixes

* open DevTools back when open file in embedded VS Code ([#299](https://github.com/nuxt/devtools-poc/issues/299)) ([45dc415](https://github.com/nuxt/devtools-poc/commit/45dc415977e2634a19d36db648bbd92d3589d53f))
* **plugins:** change execution time position ([#294](https://github.com/nuxt/devtools-poc/issues/294)) ([2b5f8e5](https://github.com/nuxt/devtools-poc/commit/2b5f8e539e443a41bca906c53c6cc7bcf51bc0d1))
* **server-routes:** fixed same path different methods ([#301](https://github.com/nuxt/devtools-poc/issues/301)) ([6dd8eb3](https://github.com/nuxt/devtools-poc/commit/6dd8eb3f93738764eb17f48740accf41b34b9798))
* try catch iframe cross-domain error ([ddf41ea](https://github.com/nuxt/devtools-poc/commit/ddf41eaf0ea845eb393120ca60a6650931bc169d))


### Features

* **server-routes:** json-editor for tab inputs ([#297](https://github.com/nuxt/devtools-poc/issues/297)) ([ee3b446](https://github.com/nuxt/devtools-poc/commit/ee3b446fac26798ff223dfbdff9b41f3fd6c8cff))
* **server-routes:** preview for pdfs ([#300](https://github.com/nuxt/devtools-poc/issues/300)) ([5dd6ea7](https://github.com/nuxt/devtools-poc/commit/5dd6ea7ceb79ee8ce75c2e44fb887ce142424171))



## [0.6.4](https://github.com/nuxt/devtools-poc/compare/v0.6.3...v0.6.4) (2023-06-26)


### Bug Fixes

* disable iframe interactive on dragging ([cc84ccf](https://github.com/nuxt/devtools-poc/commit/cc84ccf7849aeaea149d1614db2de3265ae46343))
* prevent floating panel to dragged outside of window ([#290](https://github.com/nuxt/devtools-poc/issues/290)) ([6d315cd](https://github.com/nuxt/devtools-poc/commit/6d315cd05198f65c4767cae3d2aba7523054abd1))
* respect safe area, close [#272](https://github.com/nuxt/devtools-poc/issues/272) ([2d84e4f](https://github.com/nuxt/devtools-poc/commit/2d84e4f5e53d3d29dbc61f512e0218908cb32e51))


### Features

* add PiP flag settings link ([#292](https://github.com/nuxt/devtools-poc/issues/292)) ([d21e24f](https://github.com/nuxt/devtools-poc/commit/d21e24fa5fb77d6e1b421734d972251412d196a3))
* **server-routes:** preview for media type ([#291](https://github.com/nuxt/devtools-poc/issues/291)) ([b56c860](https://github.com/nuxt/devtools-poc/commit/b56c86081fb500241a511c23d2569a33a49c2825))



## [0.6.3](https://github.com/nuxt/devtools-poc/compare/v0.6.2...v0.6.3) (2023-06-23)


### Bug Fixes

* add button and font reset to floating panel ([f819b0c](https://github.com/nuxt/devtools-poc/commit/f819b0cdd6dc7378ed4ac0cea86b52b022be76d1))
* **ComponentGraph:** show global components in different color ([#278](https://github.com/nuxt/devtools-poc/issues/278)) ([41a881d](https://github.com/nuxt/devtools-poc/commit/41a881de63a45f7a9ca66f4fef3cd78adb4251c8))
* **overview:** modules count ([#284](https://github.com/nuxt/devtools-poc/issues/284)) ([2ef2664](https://github.com/nuxt/devtools-poc/commit/2ef26646d5226d49820983fdd96bedb887084b0f))


### Features

* popup devtools as Picture-in-Picture ([#282](https://github.com/nuxt/devtools-poc/issues/282)) ([a65f50e](https://github.com/nuxt/devtools-poc/commit/a65f50ee4a36182e05c32494d11c41716b23da96))
* **server-routes:** group routes by type ([#256](https://github.com/nuxt/devtools-poc/issues/256)) ([6899cbb](https://github.com/nuxt/devtools-poc/commit/6899cbbd1839224c6ac7508208c0b5f81ddb076d))
* **server-routes:** read routes from nitro ([#286](https://github.com/nuxt/devtools-poc/issues/286)) ([2cf46b0](https://github.com/nuxt/devtools-poc/commit/2cf46b066aaf835e0bc34ce975f1447a48274b68))



## [0.6.2](https://github.com/nuxt/devtools-poc/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools-poc/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools-poc/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools-poc/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools-poc/issues/277)) ([980ad3c](https://github.com/nuxt/devtools-poc/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools-poc/issues/279)) ([7f922df](https://github.com/nuxt/devtools-poc/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools-poc/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.4](https://github.com/nuxt/devtools-poc/compare/v0.6.3...v0.6.4) (2023-06-26)


### Bug Fixes

* disable iframe interactive on dragging ([cc84ccf](https://github.com/nuxt/devtools-poc/commit/cc84ccf7849aeaea149d1614db2de3265ae46343))
* prevent floating panel to dragged outside of window ([#290](https://github.com/nuxt/devtools-poc/issues/290)) ([6d315cd](https://github.com/nuxt/devtools-poc/commit/6d315cd05198f65c4767cae3d2aba7523054abd1))
* respect safe area, close [#272](https://github.com/nuxt/devtools-poc/issues/272) ([2d84e4f](https://github.com/nuxt/devtools-poc/commit/2d84e4f5e53d3d29dbc61f512e0218908cb32e51))


### Features

* add PiP flag settings link ([#292](https://github.com/nuxt/devtools-poc/issues/292)) ([d21e24f](https://github.com/nuxt/devtools-poc/commit/d21e24fa5fb77d6e1b421734d972251412d196a3))
* **server-routes:** preview for media type ([#291](https://github.com/nuxt/devtools-poc/issues/291)) ([b56c860](https://github.com/nuxt/devtools-poc/commit/b56c86081fb500241a511c23d2569a33a49c2825))



## [0.6.3](https://github.com/nuxt/devtools-poc/compare/v0.6.2...v0.6.3) (2023-06-23)


### Bug Fixes

* add button and font reset to floating panel ([f819b0c](https://github.com/nuxt/devtools-poc/commit/f819b0cdd6dc7378ed4ac0cea86b52b022be76d1))
* **ComponentGraph:** show global components in different color ([#278](https://github.com/nuxt/devtools-poc/issues/278)) ([41a881d](https://github.com/nuxt/devtools-poc/commit/41a881de63a45f7a9ca66f4fef3cd78adb4251c8))
* **overview:** modules count ([#284](https://github.com/nuxt/devtools-poc/issues/284)) ([2ef2664](https://github.com/nuxt/devtools-poc/commit/2ef26646d5226d49820983fdd96bedb887084b0f))


### Features

* popup devtools as Picture-in-Picture ([#282](https://github.com/nuxt/devtools-poc/issues/282)) ([a65f50e](https://github.com/nuxt/devtools-poc/commit/a65f50ee4a36182e05c32494d11c41716b23da96))
* **server-routes:** group routes by type ([#256](https://github.com/nuxt/devtools-poc/issues/256)) ([6899cbb](https://github.com/nuxt/devtools-poc/commit/6899cbbd1839224c6ac7508208c0b5f81ddb076d))
* **server-routes:** read routes from nitro ([#286](https://github.com/nuxt/devtools-poc/issues/286)) ([2cf46b0](https://github.com/nuxt/devtools-poc/commit/2cf46b066aaf835e0bc34ce975f1447a48274b68))



## [0.6.2](https://github.com/nuxt/devtools-poc/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools-poc/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools-poc/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools-poc/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools-poc/issues/277)) ([980ad3c](https://github.com/nuxt/devtools-poc/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools-poc/issues/279)) ([7f922df](https://github.com/nuxt/devtools-poc/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools-poc/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.3](https://github.com/nuxt/devtools-poc/compare/v0.6.2...v0.6.3) (2023-06-23)


### Bug Fixes

* add button and font reset to floating panel ([f819b0c](https://github.com/nuxt/devtools-poc/commit/f819b0cdd6dc7378ed4ac0cea86b52b022be76d1))
* **ComponentGraph:** show global components in different color ([#278](https://github.com/nuxt/devtools-poc/issues/278)) ([41a881d](https://github.com/nuxt/devtools-poc/commit/41a881de63a45f7a9ca66f4fef3cd78adb4251c8))
* **overview:** modules count ([#284](https://github.com/nuxt/devtools-poc/issues/284)) ([2ef2664](https://github.com/nuxt/devtools-poc/commit/2ef26646d5226d49820983fdd96bedb887084b0f))


### Features

* popup devtools as Picture-in-Picture ([#282](https://github.com/nuxt/devtools-poc/issues/282)) ([a65f50e](https://github.com/nuxt/devtools-poc/commit/a65f50ee4a36182e05c32494d11c41716b23da96))
* **server-routes:** group routes by type ([#256](https://github.com/nuxt/devtools-poc/issues/256)) ([6899cbb](https://github.com/nuxt/devtools-poc/commit/6899cbbd1839224c6ac7508208c0b5f81ddb076d))
* **server-routes:** read routes from nitro ([#286](https://github.com/nuxt/devtools-poc/issues/286)) ([2cf46b0](https://github.com/nuxt/devtools-poc/commit/2cf46b066aaf835e0bc34ce975f1447a48274b68))



## [0.6.2](https://github.com/nuxt/devtools-poc/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools-poc/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools-poc/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools-poc/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools-poc/issues/277)) ([980ad3c](https://github.com/nuxt/devtools-poc/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools-poc/issues/279)) ([7f922df](https://github.com/nuxt/devtools-poc/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools-poc/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.2](https://github.com/nuxt/devtools-poc/compare/v0.6.1...v0.6.2) (2023-06-21)


### Bug Fixes

* anchor icon button style ([#276](https://github.com/nuxt/devtools-poc/issues/276)) ([b0e31c7](https://github.com/nuxt/devtools-poc/commit/b0e31c72c12094b11ea3dd7d818106eb43309f6f))
* auto verify auth token ([62136a4](https://github.com/nuxt/devtools-poc/commit/62136a4b9868a0467a8d45ba926640efb6bc00d4))
* devtools close on outside click ([#277](https://github.com/nuxt/devtools-poc/issues/277)) ([980ad3c](https://github.com/nuxt/devtools-poc/commit/980ad3caea003c4377869500a6568c713af7ba29))
* **terminals:** badge number ([#279](https://github.com/nuxt/devtools-poc/issues/279)) ([7f922df](https://github.com/nuxt/devtools-poc/commit/7f922dfba6a92de85ea2be8909158712f31ce254))


### Features

* allow manually enter the token ([fad945a](https://github.com/nuxt/devtools-poc/commit/fad945a894b5ffdb18af51d25a8d2d6fcd90bc1c))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.6.1](https://github.com/nuxt/devtools-poc/compare/v0.6.0...v0.6.1) (2023-06-15)


### Bug Fixes

* `runWizard` token argument ([29aeb27](https://github.com/nuxt/devtools-poc/commit/29aeb27cbbfbd02623932a35e3901a7f1bdd0e51)), closes [/github.com/nuxt/devtools/issues/267#issuecomment-1593493316](https://github.com//github.com/nuxt/devtools/issues/267/issues/issuecomment-1593493316)
* prefix all classes to avoid style conflicting, close [#271](https://github.com/nuxt/devtools-poc/issues/271) ([63e2a19](https://github.com/nuxt/devtools-poc/commit/63e2a1906e1d25ca8aa4ec613af8ff723c7f7b9f))
* require token for storage related operation ([7af61bb](https://github.com/nuxt/devtools-poc/commit/7af61bbcc823f9ee148cda16a6a8b70286f8c605))


### Features

* auth required view for terminal ([f1bf102](https://github.com/nuxt/devtools-poc/commit/f1bf102b6d95f684ba590f80cfb2b56b06cd1f80))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



# [0.6.0](https://github.com/nuxt/devtools-poc/compare/v0.5.5...v0.6.0) (2023-06-13)


### Bug Fixes

* **composables:** hide usages of macro modules ([e6cdbf3](https://github.com/nuxt/devtools-poc/commit/e6cdbf3d4769c44ec99c5d44f6c6be7396d6f0a3))
* introduce local auth for running commands ([#257](https://github.com/nuxt/devtools-poc/issues/257)) ([306c6a5](https://github.com/nuxt/devtools-poc/commit/306c6a51a99bfe8929fb17fca20826c473585e95))
* **kit:** explicit set file extension, close [#262](https://github.com/nuxt/devtools-poc/issues/262) ([594a352](https://github.com/nuxt/devtools-poc/commit/594a3529ff003c12b62e166b6ce6dec660957e77))


### Features

* mutliple level command-palette, commands for docs ([#247](https://github.com/nuxt/devtools-poc/issues/247)) ([3cf828e](https://github.com/nuxt/devtools-poc/commit/3cf828edfe2d1ee3eea7ee36264739971119fa47))
* new floating panel and layouting system ([#266](https://github.com/nuxt/devtools-poc/issues/266)) ([4b02cca](https://github.com/nuxt/devtools-poc/commit/4b02cca8487ec229ddc8c9e98a34d1915cfb7450))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)


### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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



## [0.1.6](https://github.com/nuxt/devtools-poc/compare/v0.1.5...v0.1.6) (2023-02-22)


### Bug Fixes

* **cli:** make sure only one nuxt devtools module is enabled, close [#86](https://github.com/nuxt/devtools-poc/issues/86) ([92ccf1c](https://github.com/nuxt/devtools-poc/commit/92ccf1c4acf8a7dbe482ba6ba7cf6b7258e10ea3))
* composables popup ([e669008](https://github.com/nuxt/devtools-poc/commit/e669008438db47830cea1c13d981a5ad5af835d2))


### Features

* improve state editor ([e44efe5](https://github.com/nuxt/devtools-poc/commit/e44efe5d4b11d400df77f95023b9ed59c909517c))



## [0.1.5](https://github.com/nuxt/devtools-poc/compare/v0.1.4...v0.1.5) (2023-02-22)


### Bug Fixes

* do not bundle `is-installed-globally`, close [#84](https://github.com/nuxt/devtools-poc/issues/84) ([87b3232](https://github.com/nuxt/devtools-poc/commit/87b3232b06e73c04412fc4b4564941611fc86932))


### Features

* **client:** allow file column resize in VFS ([#82](https://github.com/nuxt/devtools-poc/issues/82)) ([70907e0](https://github.com/nuxt/devtools-poc/commit/70907e0a536efa657f449dd0450e7851726daf91))



## [0.1.4](https://github.com/nuxt/devtools-poc/compare/v0.1.3...v0.1.4) (2023-02-16)


### Bug Fixes

* **cli:** global module path, close [#78](https://github.com/nuxt/devtools-poc/issues/78) ([c572ed0](https://github.com/nuxt/devtools-poc/commit/c572ed0ca3971ed05721a9f1505043efdd62e95d))



## [0.1.3](https://github.com/nuxt/devtools-poc/compare/v0.1.2...v0.1.3) (2023-02-16)


### Bug Fixes

* `performance` downgrade ([#66](https://github.com/nuxt/devtools-poc/issues/66)) ([8683c50](https://github.com/nuxt/devtools-poc/commit/8683c50b771bd1cff2b379e1f495909a0fb56713))
* `performance` downgrade in node env ([#71](https://github.com/nuxt/devtools-poc/issues/71)) ([a90b825](https://github.com/nuxt/devtools-poc/commit/a90b825343cfeb08b3ae276256cb58799b0263f7))
* **a11y:** add aria-label & aria-expanded attrs to toggle button ([#49](https://github.com/nuxt/devtools-poc/issues/49)) ([7ea0fe6](https://github.com/nuxt/devtools-poc/commit/7ea0fe658e18fb8f223e84d2f446f7efde6a0fc2))
* cannot close component inspector ([#70](https://github.com/nuxt/devtools-poc/issues/70)) ([63bf34f](https://github.com/nuxt/devtools-poc/commit/63bf34fe0d62ef406212f6ca14966d2831d04537))
* **cli:** improve windows compatibility, close [#62](https://github.com/nuxt/devtools-poc/issues/62) ([e1ff704](https://github.com/nuxt/devtools-poc/commit/e1ff7048ead90e7331053a1d7eae012ef9108e67))
* do not bundle `pacote`, close [#41](https://github.com/nuxt/devtools-poc/issues/41) ([87d64db](https://github.com/nuxt/devtools-poc/commit/87d64dbe41dbf629c5d0bb3fa5ed5aeffffffffc))
* explicit import performance hook, close [#61](https://github.com/nuxt/devtools-poc/issues/61) ([c7f83f8](https://github.com/nuxt/devtools-poc/commit/c7f83f84924c48ffcdc49aa389c5de20ab894088))
* props without reactivity transform ([0b21cb8](https://github.com/nuxt/devtools-poc/commit/0b21cb89c0b1db6f324421a89ad101941278a381))
* revert vscode default mode to `local-serve` ([9312802](https://github.com/nuxt/devtools-poc/commit/9312802b6d9493d4f9d34ba9863f9dcdf179ba3f))
* trigger client reactivity on app mounted ([a9898c1](https://github.com/nuxt/devtools-poc/commit/a9898c1586eda63fd1b8bffd478c2077217ec79d))
* use pointer cursor for user module which redirects to file ([#51](https://github.com/nuxt/devtools-poc/issues/51)) ([8c05e32](https://github.com/nuxt/devtools-poc/commit/8c05e322965d7da41f9e1b075b688597586bf660))


### Features

* button for refresh all ([e6a498d](https://github.com/nuxt/devtools-poc/commit/e6a498dfb561aea5a41ea4fd78d904fc69e2dd52))



## [0.1.2](https://github.com/nuxt/devtools-poc/compare/v0.1.1...v0.1.2) (2023-02-10)


### Bug Fixes

* legacy module path removal ([378cc1c](https://github.com/nuxt/devtools-poc/commit/378cc1c4394fc35dd9b2c09bd2347be6f4bc0a83))



## [0.1.1](https://github.com/nuxt/devtools-poc/compare/v0.1.0...v0.1.1) (2023-02-10)


### Bug Fixes

* insecure websocket connection ([#36](https://github.com/nuxt/devtools-poc/issues/36)) ([2c79aa5](https://github.com/nuxt/devtools-poc/commit/2c79aa5bfeb650bf5ef22bffd45b09b3e4c7ef16))
* use cjs  in global install to be compactible with Nuxt 2, close [#42](https://github.com/nuxt/devtools-poc/issues/42) ([fb70274](https://github.com/nuxt/devtools-poc/commit/fb70274bdaf8d75ac5d8b2d691200f0ba5498260))



# [0.1.0](https://github.com/nuxt/devtools-poc/compare/dd70c96bd009ce560f51b4c1e1be45e177472880...v0.1.0) (2023-02-09)


### Bug Fixes

* allow fs access to devtools client ([be8a776](https://github.com/nuxt/devtools-poc/commit/be8a7760b28614acab3370ef6524375d552521ac))
* avoid custom tab icon layout shift ([a355a8f](https://github.com/nuxt/devtools-poc/commit/a355a8f2912f595662e6e4e9cde1176ceec37fc0))
* build runtime path ([56d9ffb](https://github.com/nuxt/devtools-poc/commit/56d9ffb071b07e6d64d4d2a0160e27fdfc842a33))
* close button ([4334aef](https://github.com/nuxt/devtools-poc/commit/4334aef644d986018965b43d48cddb39454234cb))
* cors error catch ([ec320f5](https://github.com/nuxt/devtools-poc/commit/ec320f5c0ca32a8f8dde3edfd6cef09665e53f62))
* dedupe runtime components, close [#28](https://github.com/nuxt/devtools-poc/issues/28) ([3a115aa](https://github.com/nuxt/devtools-poc/commit/3a115aa06461f04e04cfa45139745ac497040297))
* dir path ([4b9a33c](https://github.com/nuxt/devtools-poc/commit/4b9a33c17dce401459b257287e2b6598771370b4))
* disable in test mode ([e9a6161](https://github.com/nuxt/devtools-poc/commit/e9a61617cb688c3b77a33ba7c4e29a63ee7946c9))
* dispose effect scope only in active ([#34](https://github.com/nuxt/devtools-poc/issues/34)) ([bb05ed5](https://github.com/nuxt/devtools-poc/commit/bb05ed5afd463475bb9f62f4af269dd15b744108))
* dividers ([fd5c434](https://github.com/nuxt/devtools-poc/commit/fd5c434b579c85121c5c1e9de0e191c94e65cea1))
* export cjs module ([60612a2](https://github.com/nuxt/devtools-poc/commit/60612a2f27f69b0010836f2d61eb9d76e34e360a))
* force upgrade color-mode ([7d8f5c6](https://github.com/nuxt/devtools-poc/commit/7d8f5c61342e60bd82b7bbc5fa6736ef0d277af1)), closes [#4](https://github.com/nuxt/devtools-poc/issues/4)
* frame resizing flickering ([0298dad](https://github.com/nuxt/devtools-poc/commit/0298dade427eb8e01c8db6c440debdb069a08a34))
* global installation ([ded46c2](https://github.com/nuxt/devtools-poc/commit/ded46c2107eb7d3f6b62de80a2166ad39b11d33c))
* hide pages tab when pages is disabled ([c6b19bc](https://github.com/nuxt/devtools-poc/commit/c6b19bc589921d66c80a9e4c79f646a9d518b9ee))
* hide payload prefix ([079dd9b](https://github.com/nuxt/devtools-poc/commit/079dd9bd43690896051685608e664cba7b256a1e))
* iframe switching logic ([e49bedd](https://github.com/nuxt/devtools-poc/commit/e49bedd0058f58f2b13603734799b5f8230fe83f))
* import `useRuntimeConfig` ([e2bf5ef](https://github.com/nuxt/devtools-poc/commit/e2bf5ef16bb320cbcdd8140b4f7f7acde4881b34))
* improve @nuxt/ui style ([0649338](https://github.com/nuxt/devtools-poc/commit/064933841c7ac0f4d342b1b2ff20a4423e364dd4))
* improve cli installation ([8dc6dc5](https://github.com/nuxt/devtools-poc/commit/8dc6dc5b5c45326cffabf2fb61045435430debaf))
* improve component graph ([df7cab3](https://github.com/nuxt/devtools-poc/commit/df7cab357fa0928206fb9cba50698110a7268f6b))
* improve hook timing ([3663fcb](https://github.com/nuxt/devtools-poc/commit/3663fcb888240ab35d8c69cca27ba89c177e3d0f))
* improve nested iframe loading for Stackblitz ([f4644e3](https://github.com/nuxt/devtools-poc/commit/f4644e3d43fc2170b234e274beff35cb5a8151ee))
* improve route table ([c91ffe5](https://github.com/nuxt/devtools-poc/commit/c91ffe5b983930a8c64024d88a953a6f7e7a704e))
* improve routes table ([a9fbf3d](https://github.com/nuxt/devtools-poc/commit/a9fbf3df71812d56b7796beb46ea771dfeb7d830))
* improve UI ([e0cbca8](https://github.com/nuxt/devtools-poc/commit/e0cbca881245323911a53c106e1ef7b0adbe8b5e))
* increase default panel height ([5266648](https://github.com/nuxt/devtools-poc/commit/52666485c641c23457cad5e050532e8669ff12a1))
* local storage sync ([5236c20](https://github.com/nuxt/devtools-poc/commit/5236c201c9d0523daf9d819261ff669e02f99400))
* minor ui issue ([b7cf3cc](https://github.com/nuxt/devtools-poc/commit/b7cf3cce4090fc762c8a05cd65537abbf023f842))
* module image path ([7dc71a5](https://github.com/nuxt/devtools-poc/commit/7dc71a51bee3c79cbdad5529067eb36b424bbcf6))
* nested frame detection logic ([a8bd101](https://github.com/nuxt/devtools-poc/commit/a8bd1011837318e7b662871f6180ddf555d86d24))
* ordering tabs ([5c83325](https://github.com/nuxt/devtools-poc/commit/5c83325a61ac22c9373a1859c75f6be61f3d4a8a))
* pacote resolving ([2a7409a](https://github.com/nuxt/devtools-poc/commit/2a7409a21d3ce00895ac32c4c65c5ff5f0173328))
* persist iframes ([8a8c349](https://github.com/nuxt/devtools-poc/commit/8a8c349d6032be632a7646172fec65ba4c284aba))
* **pkg:** move `@antfu/utils` to deps ([3117a9a](https://github.com/nuxt/devtools-poc/commit/3117a9a60083312d9d38a738450fe53f8587f258))
* publish shiki ([8682d19](https://github.com/nuxt/devtools-poc/commit/8682d19e35e4003af4894825c2cf9282e461f2df))
* remove cjs entry ([417bb2c](https://github.com/nuxt/devtools-poc/commit/417bb2cd1fc4be5db06a1e457573ea6b20eaf70e))
* resize flickering ([f6efaaf](https://github.com/nuxt/devtools-poc/commit/f6efaaf6e4450ae6e64a9a40b909a40ce135cc42))
* route link ([6c45fdc](https://github.com/nuxt/devtools-poc/commit/6c45fdcd3a6e1cc602e909dadeeab95415cfa6ff))
* route persistent ([39db3b0](https://github.com/nuxt/devtools-poc/commit/39db3b00c704378e154bf29e4508ad00db9f2b3f))
* routing enable check ([19c9d24](https://github.com/nuxt/devtools-poc/commit/19c9d241b4a7a2a9e40ef3fbccd6547a837426f8))
* strict typecheck for module ([b2d58ec](https://github.com/nuxt/devtools-poc/commit/b2d58ecdf824b69b3fec5698f8aacc0597ba1f25))
* submodule types ([10ac0bf](https://github.com/nuxt/devtools-poc/commit/10ac0bf446f620127b1d63005c9b103a86ee6071))
* upgrade @nuxt/ui, fix NButton link ([61e23da](https://github.com/nuxt/devtools-poc/commit/61e23daccc14efc331cbe474b78246c989658e27))
* use client App config ([39d6793](https://github.com/nuxt/devtools-poc/commit/39d6793528a0f80529bb113e7af6a19cc0e2c798))
* use shiki-es ([#5](https://github.com/nuxt/devtools-poc/issues/5)) ([28def06](https://github.com/nuxt/devtools-poc/commit/28def06334b0bf418a548c21ef1fd0bcc1207d7b))
* use target blank for external link ([d72e5be](https://github.com/nuxt/devtools-poc/commit/d72e5be2ddcd79746b0336a61937c2663a19fb2b))
* using the maximum z-index ([065be93](https://github.com/nuxt/devtools-poc/commit/065be934ef473f55e80260204198069af562c4b1))
* virtual file nav line truncate, close [#27](https://github.com/nuxt/devtools-poc/issues/27) ([49b2e55](https://github.com/nuxt/devtools-poc/commit/49b2e5580cbe0dccf98a1e5cdff67b9ab3cb6354))
* vite inspect view ([5ffe8bb](https://github.com/nuxt/devtools-poc/commit/5ffe8bba63af7e4323adee79fecf485faa3d807a))
* vite-inspect in production ([50f2c8c](https://github.com/nuxt/devtools-poc/commit/50f2c8c93680651547c5b2d50e5d8e5bb4abbb04))
* vue inspector navigation ([849f9b7](https://github.com/nuxt/devtools-poc/commit/849f9b73354aea0921426cf8063f23eb0595db00))


### Features

* able to disable section block ([4020303](https://github.com/nuxt/devtools-poc/commit/402030352b7ea42bc2e9b36bf515fefa81d0d6e0))
* able to dock on left, right and top ([ccf3f56](https://github.com/nuxt/devtools-poc/commit/ccf3f5613ba9ed18e6e33afd22c20d8845a39df1))
* able to filter component in graph ([cc70251](https://github.com/nuxt/devtools-poc/commit/cc70251b1c87e5df6e07889e032f154809cb4430))
* add `persistent` option to iframe view ([7e0c725](https://github.com/nuxt/devtools-poc/commit/7e0c725a4a98bd8ea24417852bf03c03c18b77d4))
* add nitro vfs ([52df677](https://github.com/nuxt/devtools-poc/commit/52df677df6f5418f7125113df85b9ace899b7c8f))
* allow custom plugin to contribute iframe ([4276a70](https://github.com/nuxt/devtools-poc/commit/4276a708c7cd0a7096bb9d70eebe5f0f12326edb))
* basic integration with json editor ([b1ad163](https://github.com/nuxt/devtools-poc/commit/b1ad16310666d886eb7606cfb0642dc6f7cbbd28))
* basic integrations with vite-plugin-vue-inspector ([d42ef2d](https://github.com/nuxt/devtools-poc/commit/d42ef2db11d394657823b143cda8ffec0b324e8a))
* basic rpc communication ([a500cd0](https://github.com/nuxt/devtools-poc/commit/a500cd03a92dd6ad531bc9fa7d7411c75e374f43))
* basic server hooks measurements ([1940103](https://github.com/nuxt/devtools-poc/commit/19401031485f942a440053717d514d1755e55c8b))
* basic version check ([e197b25](https://github.com/nuxt/devtools-poc/commit/e197b2511b9450e452397d8cad2d826a143ab10d))
* basic ws reconnecting ([219b7bf](https://github.com/nuxt/devtools-poc/commit/219b7bf1c41f750156f7d1166530026904eb555c))
* collapse SectionBlock ([f29a2b2](https://github.com/nuxt/devtools-poc/commit/f29a2b256bb83fcaee1a4674ebbbc5b1721264c3))
* component graph ([36c0b30](https://github.com/nuxt/devtools-poc/commit/36c0b30800ba604f6a1c573313c26a92dcabab99))
* components tab ([440617e](https://github.com/nuxt/devtools-poc/commit/440617e9bbe64b5cd75e921ef88d8b19fc4197a7))
* componets search ([5213da3](https://github.com/nuxt/devtools-poc/commit/5213da361ffeb68bbff1e0057c3ee4fbcfe8826e))
* composable usage counts ([65e8746](https://github.com/nuxt/devtools-poc/commit/65e8746f278244e6ff9953ab5c50a2186e07b4a2))
* composables ([6b4b421](https://github.com/nuxt/devtools-poc/commit/6b4b421e139bef627593fe6fd8425ef61e30c236))
* corner resize ([b0d71c3](https://github.com/nuxt/devtools-poc/commit/b0d71c308567f63727bff3d7f4b615946726531b))
* data reactivity across frame ([21c926f](https://github.com/nuxt/devtools-poc/commit/21c926fded75ce2987dd0269246b3ea775a5de72))
* detect installation of code-server ([71682ff](https://github.com/nuxt/devtools-poc/commit/71682ff9a9470f03daa2b8c451304b6b5101799d))
* drawer types ([f46b862](https://github.com/nuxt/devtools-poc/commit/f46b8628133bb5478ba287c2780309d81013cb2c))
* enable pages wizard ([dea228d](https://github.com/nuxt/devtools-poc/commit/dea228d4fd226a0b78865c36bdf23d5ac1068f2d))
* fix search bar for components and composables tab ([0691e9c](https://github.com/nuxt/devtools-poc/commit/0691e9c0e17a28c3cca9f0e32803228904e51234))
* iframe communication ([193ff0b](https://github.com/nuxt/devtools-poc/commit/193ff0b8048e065d3f50ea07ea99ea2308952757))
* improve component inspector ([6e06c4b](https://github.com/nuxt/devtools-poc/commit/6e06c4ba82163c329c219981f9e901f96738067d))
* improve global module handling ([f19b084](https://github.com/nuxt/devtools-poc/commit/f19b084dd14ff80e86f5a025301dc161ac95c8b5))
* improve global module handling ([2f7174a](https://github.com/nuxt/devtools-poc/commit/2f7174a5dc6c6ed57a29b8220eeb98bf267a5b45))
* improve hooks interface ([e3f7652](https://github.com/nuxt/devtools-poc/commit/e3f7652036c68dfc0c3fd5c499058039227e59d6))
* improve hooks table ([b0cecd1](https://github.com/nuxt/devtools-poc/commit/b0cecd1da517266d4d8388e6d4e96b2a8896d179))
* improve hooks table ([235654b](https://github.com/nuxt/devtools-poc/commit/235654b4f662bfbdb07b9704dc780132d3ad66a6))
* improve iframe communication ([13512e6](https://github.com/nuxt/devtools-poc/commit/13512e680aa3ea8c037cc052692d2512936433d0))
* improve interaction ([a95bc50](https://github.com/nuxt/devtools-poc/commit/a95bc50ea819ab24ba1d96b8b2b252134586b9ce))
* improve modules design ([472619a](https://github.com/nuxt/devtools-poc/commit/472619abb64e23d0b96cdb2fb4e6f1529aa20eb8))
* improve modules view ([7a681f1](https://github.com/nuxt/devtools-poc/commit/7a681f1cef0137e2a91d54cacac67cd4c6c058d5))
* improve notice ([96df06a](https://github.com/nuxt/devtools-poc/commit/96df06a9c9b9b8f551945f7c911b7849048ced79))
* improve overview design ([a23090a](https://github.com/nuxt/devtools-poc/commit/a23090a57558e6d573ad59aeffc392eaa1aa71af))
* improve overview page ([b50ce0b](https://github.com/nuxt/devtools-poc/commit/b50ce0b98d7da153a63e8a7596f455326cee90db))
* improve payload display ([634efad](https://github.com/nuxt/devtools-poc/commit/634efad2934cbac23ba0350a4d476af4daa7680e))
* improve style of component items ([be3cd3f](https://github.com/nuxt/devtools-poc/commit/be3cd3fc2cc17fb53b70995243936a885e5b36df))
* in page navbar ([3eaa6e3](https://github.com/nuxt/devtools-poc/commit/3eaa6e3fb2761c8c2e49304ba85826a1240fdbe5))
* include iframe-client ([4532f72](https://github.com/nuxt/devtools-poc/commit/4532f729a3f078410152c389824aef96d56a6273))
* init ([dd70c96](https://github.com/nuxt/devtools-poc/commit/dd70c96bd009ce560f51b4c1e1be45e177472880))
* init pages ([2c193c2](https://github.com/nuxt/devtools-poc/commit/2c193c28394518f2c78e31fbc8026501d78a18d4))
* inject client to sub iframe ([2f8009a](https://github.com/nuxt/devtools-poc/commit/2f8009aac09167a83c7ca3f0239a039049b76932))
* integrate VS Code server ([d91f467](https://github.com/nuxt/devtools-poc/commit/d91f46774853dd3a0c4434ddaa3d4da1a567829e))
* intro page ([a82b9a1](https://github.com/nuxt/devtools-poc/commit/a82b9a175f2396e315f9d703d30255b5769d6557))
* keyboard shortcut to toggle ([e796f11](https://github.com/nuxt/devtools-poc/commit/e796f111cf7edb9bc18f7d85e4a0f0b057a32ce9))
* layouting ([3fcaa28](https://github.com/nuxt/devtools-poc/commit/3fcaa28856fbcabb3993db218cc1e53494140f38))
* lazy load custom tabs ([1eeb1e6](https://github.com/nuxt/devtools-poc/commit/1eeb1e6885db58a1ef4578453efb0e1108634f7d))
* matched layouts ([8ef5aa6](https://github.com/nuxt/devtools-poc/commit/8ef5aa6e9e6b5fa38734a58ea251ed3869a45919))
* modules ([8ce99ce](https://github.com/nuxt/devtools-poc/commit/8ce99cece34bab2c89412ba3335bee7312972965))
* modules category ([baabe7c](https://github.com/nuxt/devtools-poc/commit/baabe7ce71035ae46e7d842bd8f28bc9bb85895c))
* more hooks ([dce14f0](https://github.com/nuxt/devtools-poc/commit/dce14f0a5e6d6b71ba5bcea649bde27743dfae42))
* more pages info ([c7416b2](https://github.com/nuxt/devtools-poc/commit/c7416b2ea5e29de614ac520f6821fa5ef561bf77))
* move drawer to right ([cc07396](https://github.com/nuxt/devtools-poc/commit/cc07396210332f5e9f4dffc10b026d3fb441f6a5))
* move drawer to the left ([5f8d5c9](https://github.com/nuxt/devtools-poc/commit/5f8d5c932b453fadc57815e8b5d279dab39885a1))
* notice of about ui not connected ([b0b6c74](https://github.com/nuxt/devtools-poc/commit/b0b6c74fe8832e9125a007d35ff7387e17a1e05a))
* option to hide custom tabs ([a014d7a](https://github.com/nuxt/devtools-poc/commit/a014d7a6b5952bea0c2376b710a313ec021b3568))
* package name ([ca59fe3](https://github.com/nuxt/devtools-poc/commit/ca59fe3ea45bca84c22ef6de9eef6443e8947760))
* payload ([b96bb3c](https://github.com/nuxt/devtools-poc/commit/b96bb3c8455ee401d4fb3e3972f20a569da72dd7))
* payload ([4acbc01](https://github.com/nuxt/devtools-poc/commit/4acbc01166b6d2f035acb4401854abfff64c6493))
* persist route of devtools ([eacb9a6](https://github.com/nuxt/devtools-poc/commit/eacb9a6866a3693a0664822f9e4cb48e74a0a7e2))
* presit opening state ([e12e389](https://github.com/nuxt/devtools-poc/commit/e12e3892581d1ee8ae901750d5cbf1b615ffa4f4))
* provide better instructions for vscode ([8f382d4](https://github.com/nuxt/devtools-poc/commit/8f382d486f08b20765ac06e82ddd2a5050fb00d3))
* provide option for vscode integration ([f88764a](https://github.com/nuxt/devtools-poc/commit/f88764afcb49083c6918eadc4988aaa1a1ab04c3))
* reactive states ([58b1613](https://github.com/nuxt/devtools-poc/commit/58b1613fbbe010b00b35ba0a4bd226259f138267))
* render markdown in composable description ([7042012](https://github.com/nuxt/devtools-poc/commit/7042012da01019451f22d0d92cddc71905bdaf6f))
* resize devtools frame ([def4455](https://github.com/nuxt/devtools-poc/commit/def445577e0a5b27b5ccc09e0c9e11faa1ffbcf5))
* rework pages tab ([6ea4f1c](https://github.com/nuxt/devtools-poc/commit/6ea4f1c13c31f7c96eaab6e1faa06d620b7bd11c))
* route nav with custom params ([7c53569](https://github.com/nuxt/devtools-poc/commit/7c535692b83945cdbd0c2563049950447f96904b))
* routes navigation ([f97d811](https://github.com/nuxt/devtools-poc/commit/f97d8112672895a603007e267aacc9d31267dfb6))
* runtime global component ([f5865e6](https://github.com/nuxt/devtools-poc/commit/f5865e66d769edaa959e9f130308660a0da35ad3))
* RWD for the panel ([0540c17](https://github.com/nuxt/devtools-poc/commit/0540c17c05017986cbb52ab1b408b278a3e37b70))
* search for virtual files ([fe4fad1](https://github.com/nuxt/devtools-poc/commit/fe4fad132fb3125c44f63648eebc23b02ecad36f))
* setup unocss runtime for dynamic icons ([ce19a85](https://github.com/nuxt/devtools-poc/commit/ce19a8581e02cd5da2bfea0a68053b136a0b5dff))
* shiki ([1fef053](https://github.com/nuxt/devtools-poc/commit/1fef053b4190d2087272cc7bcc90b945d699ebaa))
* show devtools version ([9b52e18](https://github.com/nuxt/devtools-poc/commit/9b52e18145a639567a137a6f1652ac27eecb5ca8))
* show pages name ([5db401f](https://github.com/nuxt/devtools-poc/commit/5db401f4c79a5121f4d7741a3360bf6b3d5f46a8))
* support docs link ([7f633c2](https://github.com/nuxt/devtools-poc/commit/7f633c208af3a12e7a9c260b8bb43e8776d0f287))
* support static vnode in custom tabs ([16b9a2a](https://github.com/nuxt/devtools-poc/commit/16b9a2aae093d230a943595d3ee968e791f3621e))
* sync color mode with iframe ([22d7320](https://github.com/nuxt/devtools-poc/commit/22d7320561648e3aa811b3c43a76dbcb3c333b39))
* tree view wip ([4185bbb](https://github.com/nuxt/devtools-poc/commit/4185bbb131275ebf050859a6e11cc5c237cd774d))
* ui for plugins ([84a8507](https://github.com/nuxt/devtools-poc/commit/84a85079081e1e2915a786b3c03a746865441765))
* **ui:** improve ui ([80848d2](https://github.com/nuxt/devtools-poc/commit/80848d213cf793f48dddc58f30bf486cfc529b91))
* update logo ([24cb0a3](https://github.com/nuxt/devtools-poc/commit/24cb0a36cdebc8151b9ae8f05276cafd07a3f032))
* use different color for selected note in component graph ([131a392](https://github.com/nuxt/devtools-poc/commit/131a39233d19240fb7bc40b765302d7a2d820e47))
* use vfs.json to render virtual files page ([74dc185](https://github.com/nuxt/devtools-poc/commit/74dc18515c9e075190ca5e3d23caa92227729a32))



## [0.5.5](https://github.com/nuxt/devtools-poc/compare/v0.5.4...v0.5.5) (2023-05-25)


### Bug Fixes

* **command-palette:** avoid key conflicts ([c86697e](https://github.com/nuxt/devtools-poc/commit/c86697ee29324b8809f4b041891c628829f001c7))
* **CommandPalette:** fix item scroll ([#246](https://github.com/nuxt/devtools-poc/issues/246)) ([9aa13f6](https://github.com/nuxt/devtools-poc/commit/9aa13f6966b1b6b2b260cc87b5065e60c41762a7))
* **pages:** route parsing ([d525412](https://github.com/nuxt/devtools-poc/commit/d525412b81f3f3b08a28a1c94b37fd080e02eb39))



## [0.5.4](https://github.com/nuxt/devtools-poc/compare/v0.5.3...v0.5.4) (2023-05-24)


### Bug Fixes

* **open-graph:** improve ui ([7d03f5d](https://github.com/nuxt/devtools-poc/commit/7d03f5dae38f37ac4222059384dbf60fe85b7569))


### Features

* command panel for tabs ([#240](https://github.com/nuxt/devtools-poc/issues/240)) ([0760252](https://github.com/nuxt/devtools-poc/commit/076025270d46ec4ce61d932e40722dd2be395deb))



## [0.5.3](https://github.com/nuxt/devtools-poc/compare/v0.5.2...v0.5.3) (2023-05-23)



## [0.5.2](https://github.com/nuxt/devtools-poc/compare/v0.5.1...v0.5.2) (2023-05-23)


### Bug Fixes

* improve module installing experience ([ab8083b](https://github.com/nuxt/devtools-poc/commit/ab8083b0980b11d233a5914d2e06b088c06e6fca))
* reactivity life cycle ([486db15](https://github.com/nuxt/devtools-poc/commit/486db15f7f45a06e66de0f60cafc96ac2e219dae))



## [0.5.1](https://github.com/nuxt/devtools-poc/compare/v0.5.0...v0.5.1) (2023-05-23)


### Bug Fixes

* **analyze-build:** state update ([0e32bde](https://github.com/nuxt/devtools-poc/commit/0e32bdee427fdd73e449aa1cdd42955275636e21))
* **plugin-metrics:** forward plugin meta ([facef7a](https://github.com/nuxt/devtools-poc/commit/facef7a35babd4009d1bcc488f8299b97ced3716))
* **ui-kit:** set text prop as optional in NSectionBlock ([#241](https://github.com/nuxt/devtools-poc/issues/241)) ([16f726c](https://github.com/nuxt/devtools-poc/commit/16f726ca60697362172f8e6290dbe59bc6e6a4a1))


### Features

* opt-out all experimental flag ([ff850b1](https://github.com/nuxt/devtools-poc/commit/ff850b18a223c225a022294621e2293397faf648))



# [0.5.0](https://github.com/nuxt/devtools-poc/compare/v0.4.6...v0.5.0) (2023-05-18)


### Bug Fixes

* **build-analyze:** improve ui ([bd263ee](https://github.com/nuxt/devtools-poc/commit/bd263ee2fd0c3bd12cc74647fee8e5175313b1b7))
* **components:** improve graph relationship filtering, close [#192](https://github.com/nuxt/devtools-poc/issues/192) ([c27f80b](https://github.com/nuxt/devtools-poc/commit/c27f80b771ef6f05be502f620a3779b72a2126d6))
* debounce disconnect indicator ([895e6e3](https://github.com/nuxt/devtools-poc/commit/895e6e30a3d3715985fde43a40078322015d9ac6))
* **devtools-ui-kit:** update unocss config path ([#238](https://github.com/nuxt/devtools-poc/issues/238)) ([5162bdd](https://github.com/nuxt/devtools-poc/commit/5162bddb0c2908521237cf2186754aa04079f4b5))
* double disable vue-inspector ([9dc0694](https://github.com/nuxt/devtools-poc/commit/9dc0694fccd388c947314386fabc3ed4484dee88))
* improve module meta resolution ([7dc3d93](https://github.com/nuxt/devtools-poc/commit/7dc3d9302d2a79f45b1d470ce4e797ae37e82e99))
* **install-module:** process exit code ([8c8097e](https://github.com/nuxt/devtools-poc/commit/8c8097e9d350990a675f689403177c03902493f9))
* **open-graph:** avoid layout shift ([4b1eb2c](https://github.com/nuxt/devtools-poc/commit/4b1eb2ce246662687d39ddf72e58de98c5223ce0))
* **open-graph:** use `description` for facebook ([#239](https://github.com/nuxt/devtools-poc/issues/239)) ([31c92f5](https://github.com/nuxt/devtools-poc/commit/31c92f5fe64cdb6094b5702b00086e3da4ab5552))
* print error on process failing ([37f690b](https://github.com/nuxt/devtools-poc/commit/37f690b09a3bffb13186c79bb55ef85bf49cbc2b))
* **style:** switch, radio, checkbox hover style ([#230](https://github.com/nuxt/devtools-poc/issues/230)) ([97f5b1a](https://github.com/nuxt/devtools-poc/commit/97f5b1a33a4c1e0601f48aaf56bdcf819040695f))
* uninstall modules ([#229](https://github.com/nuxt/devtools-poc/issues/229)) ([f7db6a2](https://github.com/nuxt/devtools-poc/commit/f7db6a2f703020f9e694a6c508dccd0a0661a3b1))


### Features

* add component inspect button to the sidebar ([512d852](https://github.com/nuxt/devtools-poc/commit/512d852e0a8eda5350e960a1edd2af9b47bb9312))
* add dark/light mode switch transition ([#224](https://github.com/nuxt/devtools-poc/issues/224)) ([782e0da](https://github.com/nuxt/devtools-poc/commit/782e0da516a8a3c84142452689d59dbaff492be2))
* allow override vue-inspector options, close [#234](https://github.com/nuxt/devtools-poc/issues/234) ([3311f11](https://github.com/nuxt/devtools-poc/commit/3311f11b7e1393cdab8a01cf647c86a6a79c584b))
* **components:** add legend for graph ([de6a97d](https://github.com/nuxt/devtools-poc/commit/de6a97db587921eee346974c6d2275c540033e4a))
* display vue version, close [#236](https://github.com/nuxt/devtools-poc/issues/236) ([83b775a](https://github.com/nuxt/devtools-poc/commit/83b775aa80eb4cfc335c7fe69587494be9fee7c8))
* experimental add module from DevTools ([#222](https://github.com/nuxt/devtools-poc/issues/222)) ([501682b](https://github.com/nuxt/devtools-poc/commit/501682bd888c224095812572a7a60b972d1707b9))
* experimental build analyze ([#190](https://github.com/nuxt/devtools-poc/issues/190)) ([2344afd](https://github.com/nuxt/devtools-poc/commit/2344afd236634bff6ef6e784ab1d71f7ec25787a))
* isolate ui options per-project ([#232](https://github.com/nuxt/devtools-poc/issues/232)) ([3b99477](https://github.com/nuxt/devtools-poc/commit/3b994779aed3556523ab36cc8b6d062ea36995a5))
* **open-graph:** use `useSeoMeta` over `useHead` ([f7d11ee](https://github.com/nuxt/devtools-poc/commit/f7d11ee39f97baa9f6a3793aa8e7c329d0f19e94))
* refactor components, close [#227](https://github.com/nuxt/devtools-poc/issues/227) ([0caa4de](https://github.com/nuxt/devtools-poc/commit/0caa4deefc41cd5bb9b79500644f7972cce7fb5d))
* **server-routes:** rolling out of experiment state ([ed87dfd](https://github.com/nuxt/devtools-poc/commit/ed87dfd86c5fb1b3ff959d5a462e2b70ce6b43ff))
* sidenav overflow as popup ([da6c29f](https://github.com/nuxt/devtools-poc/commit/da6c29f37e3850f923b0b87291840f9b77be6bd3))
* **ui:** fullscreen disconnect indicator ([a158b1b](https://github.com/nuxt/devtools-poc/commit/a158b1bcdbdc216644d4a25463cb3e434986c071))



## [0.4.6](https://github.com/nuxt/devtools-poc/compare/v0.4.5...v0.4.6) (2023-05-08)


### Bug Fixes

* default state of DockingPanel ([a009866](https://github.com/nuxt/devtools-poc/commit/a0098669a2ea85f7917816b251f4cbd5e7b712c6))
* DockingPanel clickoutside on iframe ([#211](https://github.com/nuxt/devtools-poc/issues/211)) ([afdaa5b](https://github.com/nuxt/devtools-poc/commit/afdaa5bca5eaa4ff2e85f9313414b9409122cab5))
* fix shortcut to togglePanel ([#212](https://github.com/nuxt/devtools-poc/issues/212)) ([e64dbcd](https://github.com/nuxt/devtools-poc/commit/e64dbcd31ea1aa50d72bac9cec958e0159da6226))
* nitro storage link ([#220](https://github.com/nuxt/devtools-poc/issues/220)) ([ddd2e41](https://github.com/nuxt/devtools-poc/commit/ddd2e41d7c0e40b222725fb69a1499293e57baa2))


### Features

* add open graph tab ([#209](https://github.com/nuxt/devtools-poc/issues/209)) ([b94de30](https://github.com/nuxt/devtools-poc/commit/b94de302a123d5ccc6b7ef319a25b154ba22953a))
* allow iframe permissions ([#215](https://github.com/nuxt/devtools-poc/issues/215)) ([44fce14](https://github.com/nuxt/devtools-poc/commit/44fce1450374f5ddfe68cb22258105b808b743c9))



## [0.4.5](https://github.com/nuxt/devtools-poc/compare/v0.4.4...v0.4.5) (2023-04-30)


### Bug Fixes

* correctly read plugins list ([76bc71d](https://github.com/nuxt/devtools-poc/commit/76bc71d87a3bd7f195ec362ea46c28aaf7da2421))
* use compile time markdown ([f9979b9](https://github.com/nuxt/devtools-poc/commit/f9979b9cb9eb36044954a5c4a5bd02dab113671c))



## [0.4.4](https://github.com/nuxt/devtools-poc/compare/v0.4.3...v0.4.4) (2023-04-30)


### Features

* open in file in embeded vscode ([#207](https://github.com/nuxt/devtools-poc/issues/207)) ([9f17662](https://github.com/nuxt/devtools-poc/commit/9f176624fcf0c2e2192fcd77104cd33401761604))



## [0.4.3](https://github.com/nuxt/devtools-poc/compare/v0.4.2...v0.4.3) (2023-04-29)


### Bug Fixes

* disconnect indicator zindex, close [#202](https://github.com/nuxt/devtools-poc/issues/202) ([e9ab49f](https://github.com/nuxt/devtools-poc/commit/e9ab49fce40524d66fea2a068408748eb0cb4d40))
* server-routes watcher ([#205](https://github.com/nuxt/devtools-poc/issues/205)) ([19fda12](https://github.com/nuxt/devtools-poc/commit/19fda12c19b983043894763900f9233c92b31e33))
* **wizard:** update disable logic ([95353b6](https://github.com/nuxt/devtools-poc/commit/95353b6c9976923b31e8580e75785cd3edabbb0c))
* **wizard:** use object options instead, close [#206](https://github.com/nuxt/devtools-poc/issues/206) ([d63cf58](https://github.com/nuxt/devtools-poc/commit/d63cf5882f0fd08af691148d218e65023e1b5f64))


### Features

* improve settings ui ([c0b4bd6](https://github.com/nuxt/devtools-poc/commit/c0b4bd664588332242cd978dc75f6da4c3781596))
* support middleware, close [#184](https://github.com/nuxt/devtools-poc/issues/184) ([73ef44c](https://github.com/nuxt/devtools-poc/commit/73ef44ca5a7e87928a1366be50edf3124bc0f1ee))
* support navigating to virtual file ([ff27b92](https://github.com/nuxt/devtools-poc/commit/ff27b9249f55e8c53f04c8bafffc3fe099f82813))



## [0.4.2](https://github.com/nuxt/devtools-poc/compare/v0.4.1...v0.4.2) (2023-04-24)


### Bug Fixes

* code style ([4a082d1](https://github.com/nuxt/devtools-poc/commit/4a082d173660add2ddde863e4548cf033d5e74ae))
* components in graph view style ([#197](https://github.com/nuxt/devtools-poc/issues/197)) ([3075fc1](https://github.com/nuxt/devtools-poc/commit/3075fc162939a2bc66e2d8ed9c6647e7c1097cf8))
* ui layout ([eeb1744](https://github.com/nuxt/devtools-poc/commit/eeb1744b65a6f93b6cd4ae661893bef8c5e8005b))
* **ui:** sidenav tooltip overlaps with title ([#199](https://github.com/nuxt/devtools-poc/issues/199)) ([aec5192](https://github.com/nuxt/devtools-poc/commit/aec51923a7c0c332b8874ca2571b0678f0a9c115))
* **wizard:** builtin `enable` setup fails on new installs ([#200](https://github.com/nuxt/devtools-poc/issues/200)) ([9551479](https://github.com/nuxt/devtools-poc/commit/9551479e6ee62849ae0f33467068af3b410bb0a1))


### Features

* add more categories ([3d41495](https://github.com/nuxt/devtools-poc/commit/3d41495d6b9c1ca34c262d1f2b331cc0e809acb7))
* categorize tabs ([64c48cd](https://github.com/nuxt/devtools-poc/commit/64c48cdf55a756d5263cf8ebfa308258b68a47b5))
* help page for each tab ([#194](https://github.com/nuxt/devtools-poc/issues/194)) ([5ce8df3](https://github.com/nuxt/devtools-poc/commit/5ce8df368527ab614d428f12e3f099c11f072199))
* **plugins:** add total execution time ([2cbb52e](https://github.com/nuxt/devtools-poc/commit/2cbb52eca682b8b35e43772153a22d421df56987))
* support tab badge ([80a5ba2](https://github.com/nuxt/devtools-poc/commit/80a5ba2d193a1c263138cae6da3ce4510985bfce))
* syncing color mode backward for iframe, close [#195](https://github.com/nuxt/devtools-poc/issues/195) ([76b3c7a](https://github.com/nuxt/devtools-poc/commit/76b3c7ab45b4677b38c86d135459034e1eeb627d))


### Performance Improvements

* defer devtools client initialization ([2949e0d](https://github.com/nuxt/devtools-poc/commit/2949e0dbae1a8eb41a9baafaf37e165676e81bbb))
* defer devtools client loading ([ebc9a38](https://github.com/nuxt/devtools-poc/commit/ebc9a388f45cd9a1ae76281b931bf74ae4c5ada8))
* improve runtime icons render ([ea37a07](https://github.com/nuxt/devtools-poc/commit/ea37a07ffdc392bf2802b33bbb2da7d17a1b7707))



## [0.4.1](https://github.com/nuxt/devtools-poc/compare/v0.4.0...v0.4.1) (2023-04-18)


### Bug Fixes

* fix domain to work with https ([#178](https://github.com/nuxt/devtools-poc/issues/178)) ([646fb9b](https://github.com/nuxt/devtools-poc/commit/646fb9b36022df763ee15b3bce971f0da99119cb))
* **server-routes:** add method dropdown ([#187](https://github.com/nuxt/devtools-poc/issues/187)) ([f47060e](https://github.com/nuxt/devtools-poc/commit/f47060e50ee9cd6ba9134a1a0c2061fdbe9ac859))
* **server-routes:** handle base url ([06eb4d7](https://github.com/nuxt/devtools-poc/commit/06eb4d73106f7f0217375bc275cc3af76fa0c309))
* **server-routes:** persistence between route switches ([#186](https://github.com/nuxt/devtools-poc/issues/186)) ([2791d3e](https://github.com/nuxt/devtools-poc/commit/2791d3e239acc7162ea652baa764f43db1a6c6ae))
* **ServerRouteDetail:** fix domain port & body ([#185](https://github.com/nuxt/devtools-poc/issues/185)) ([7b1fbf1](https://github.com/nuxt/devtools-poc/commit/7b1fbf1306426857b81020eeb445196877bf74de))
* **ui-kit:** NTextInput styles ([0ed638e](https://github.com/nuxt/devtools-poc/commit/0ed638e466c50ec0701c6afbc3bf98ee5e32e59c))
* **ui-kit:** ssr compatibility, close [#183](https://github.com/nuxt/devtools-poc/issues/183) ([4f49cd4](https://github.com/nuxt/devtools-poc/commit/4f49cd4d6a15d5d02348031b603c4d5d1bb0c845))


### Features

* provide docs for built-in composables ([e32b8d5](https://github.com/nuxt/devtools-poc/commit/e32b8d5e1b30a1637dc08493a2cd6cb708460315))
* **server-routes:** more code snippets ([40913b9](https://github.com/nuxt/devtools-poc/commit/40913b93f6d3d163c20ede708eedf4909072ec5b))
* **server-routes:** open route in editor button ([#189](https://github.com/nuxt/devtools-poc/issues/189)) ([c0cbfdb](https://github.com/nuxt/devtools-poc/commit/c0cbfdb270878a123a087851e9fad01ce99ccf61))
* styling ([4be0a97](https://github.com/nuxt/devtools-poc/commit/4be0a97567b4d2bc7c1cc33ae488a18bfa2c2d33))
* **ui-kit:** Make NTextInput more generic ([#181](https://github.com/nuxt/devtools-poc/issues/181)) ([f3d61da](https://github.com/nuxt/devtools-poc/commit/f3d61daa3fb44e370c99f70ed0a79640afeb023c))



# [0.4.0](https://github.com/nuxt/devtools-poc/compare/v0.3.2...v0.4.0) (2023-04-11)


### Bug Fixes

* **server-route:** added route type to url ([#175](https://github.com/nuxt/devtools-poc/issues/175)) ([0bbeb28](https://github.com/nuxt/devtools-poc/commit/0bbeb28b221b8e682bb02ee8b9c4e24f61bd39ed))
* **server-routes:** route resolving ([1895a16](https://github.com/nuxt/devtools-poc/commit/1895a1682d298030e79ec775d88e9cbaf0d5f783))
* styling ([d08b233](https://github.com/nuxt/devtools-poc/commit/d08b23355e1a473bc9662c02eab1b98153ec2119))
* **ui-kit:** NCodeBlock layout shift ([875ff88](https://github.com/nuxt/devtools-poc/commit/875ff88c39b2acaba4f2e773efcad03c30e92047))
* **wizard:** also check versions greater than 3.4 ([dd14aac](https://github.com/nuxt/devtools-poc/commit/dd14aacfd9f27ad07f37ec160a761cf672a5064e))
* **wizard:** remove global module install in 3.4 ([c5fdf23](https://github.com/nuxt/devtools-poc/commit/c5fdf2358d9c689981feafede54c1f8bbe5a6a0b))


### Features

* add panel grids ([7304c7b](https://github.com/nuxt/devtools-poc/commit/7304c7b519e1fc0aafc7c1c5bafa5b600b81e613))
* improve style consistentency ([4459cf5](https://github.com/nuxt/devtools-poc/commit/4459cf59c617dfd683e9d0b9c113d26718f146a3))
* init server routes tab ([#159](https://github.com/nuxt/devtools-poc/issues/159)) ([5722c5b](https://github.com/nuxt/devtools-poc/commit/5722c5b8eef28de9fae50319373e7505e26a77a0))
* optimize tab performance ([69dc864](https://github.com/nuxt/devtools-poc/commit/69dc8640d0b8001312acf799f7b9f8af780eef38))
* scroll trap in iframe ([0abc4b3](https://github.com/nuxt/devtools-poc/commit/0abc4b3cc931534431f4a1aa9134926814d489ce))



## [0.3.2](https://github.com/nuxt/devtools-poc/compare/v0.3.1...v0.3.2) (2023-04-07)


### Bug Fixes

* `imports.preset` resolution, close  [#165](https://github.com/nuxt/devtools-poc/issues/165) ([bba0496](https://github.com/nuxt/devtools-poc/commit/bba0496ecace206e13bbb3393d79c409a0fc3f8d))
* hide injected app from the Vue devtools ([#167](https://github.com/nuxt/devtools-poc/issues/167)) ([26ee4a4](https://github.com/nuxt/devtools-poc/commit/26ee4a47c79d62876febf5f2a68f1532a34e1f64))
* improve tab not found view ([02bd365](https://github.com/nuxt/devtools-poc/commit/02bd3653330a9bffe31b428ff3b62279d1cc91ef))
* open in editor regex, close [#169](https://github.com/nuxt/devtools-poc/issues/169) ([8bec14f](https://github.com/nuxt/devtools-poc/commit/8bec14ffe7cb11d4669ef2d99a97cace665026fc))
* **ui:** truncate test in asset details, close [#163](https://github.com/nuxt/devtools-poc/issues/163) ([e1af4a0](https://github.com/nuxt/devtools-poc/commit/e1af4a0d8ac328ead3910664aff8f395637f8162))


### Features

* initial drag & drop & write assets ([#164](https://github.com/nuxt/devtools-poc/issues/164)) ([02bd75d](https://github.com/nuxt/devtools-poc/commit/02bd75de14b81047d8907735be4155c3b480cddc))
* new cli wizard ([#170](https://github.com/nuxt/devtools-poc/issues/170)) ([069ac33](https://github.com/nuxt/devtools-poc/commit/069ac330104a81f8b3e14cafe3512d81b5be1888))
* **ui-kit:** support `v-lazy-show` for `NSectionBlock` ([4351a6b](https://github.com/nuxt/devtools-poc/commit/4351a6b66fc1faa13617027e5c9001f8891d5c50))



## [0.3.1](https://github.com/nuxt/devtools-poc/compare/v0.3.0...v0.3.1) (2023-03-27)


### Bug Fixes

* explicit import `defineNuxtPlugin` ([03535dc](https://github.com/nuxt/devtools-poc/commit/03535dc82d6efe145388ef5df48bf2e073330e4c))



# [0.3.0](https://github.com/nuxt/devtools-poc/compare/v0.2.5...v0.3.0) (2023-03-27)

## Changes

- Panel toggle shortcut changed to `Shift + Alt + D` (#153)
- Some design improvements
- New tabs
  - Assets
  - Terminals
- Support upgrading packages in devtools
- Able to measure plugins execution time
- For module authors:
  - `@nuxt/devtools-kit` is introduced, you can safely depend on it
  - `@nuxt/devtools/kit` is moved `@nuxt/devtools-kit`
  - `@nuxt/devtools/iframe-client` is moved to `@nuxt/devtools-kit/iframe-client`
  - Extendable RPC is introduced, you can now integration your own client-server communication
- Learn more at [docs](https://devtools.nuxtjs.org/)

## New Tabs

### Assets

The assets tab that shows all your static assets and their information. You can copy the paths of the assets, or the code snippets of using them. In the future, with the integrations of [Nuxt Image](https://image.nuxtjs.org/), you can even optimize images with a single click.

<img width="1526" alt="tab-assets" src="https://user-images.githubusercontent.com/11247099/227901468-1089c0a9-8229-4a66-8dee-a3d2a20c9466.png">

### Plugins

Plugins tab shows all the plugins you are using in your app. As plugins runs before the app is mounted,the time spent in each plugin should be minimal to avoid blocking the app from rendering. The time cost of each plugin provided can be helpful to find performance bottlenecks.

<img width="1526" alt="tab-plugins" src="https://user-images.githubusercontent.com/11247099/227901482-b4c84fe2-6649-4088-a8f3-d2fa285121ea.png">

### Terminals Tab

In some integrations, they might require to have subprocesses running to do certain jobs. Before DevTools, you either hide the output of the subprocess entirely and swallow the potential warnings/errors, or pipe to stdout and pollute your terminal with multiple outputs. Now you can now have the outputs in DevTools for each process and clearly isolated.

<img width="1526" alt="tab-terminals" src="https://user-images.githubusercontent.com/11247099/227901494-20e993f2-1010-4d3c-a713-324914e28028.png">

----

### Bug Fixes

* **assets:** show `<NuxtImage>` snippet when `@nuxt/image` is installed ([#133](https://github.com/nuxt/devtools-poc/issues/133)) ([d440f14](https://github.com/nuxt/devtools-poc/commit/d440f140a198f4f15a13b915e627e4405c0e1630))
* change shortcut to `Shift + Alt + D`, close [#153](https://github.com/nuxt/devtools-poc/issues/153) ([ede19a7](https://github.com/nuxt/devtools-poc/commit/ede19a7daf70a748c4a00c75585d70209a63718d))
* component inspector, close [#137](https://github.com/nuxt/devtools-poc/issues/137) ([d608a0f](https://github.com/nuxt/devtools-poc/commit/d608a0fed339f436bf83ff6e24807366b858f7d1))
* components graph layout ([b853005](https://github.com/nuxt/devtools-poc/commit/b8530057ce6dadd7b8864a0d721ebf2d08f03bae))
* display font preview in assets detail ([a18c762](https://github.com/nuxt/devtools-poc/commit/a18c76253f25f5117ec3bb5f9d3337860bc0e47f))
* extra scrollbar ([#139](https://github.com/nuxt/devtools-poc/issues/139)) ([a94fd4d](https://github.com/nuxt/devtools-poc/commit/a94fd4de967a7f862f2d8ed21a05818598c08d57))
* improve path display ([7ed9657](https://github.com/nuxt/devtools-poc/commit/7ed9657f4a0518d55d8893d1ed420fe98f9e6345))
* make assets detail scrollable ([f0a547d](https://github.com/nuxt/devtools-poc/commit/f0a547d423a8090787ce34de6388a07b9f7aa5ea))
* popper text color in light mode ([254b45e](https://github.com/nuxt/devtools-poc/commit/254b45e1406b673697e9689c0e7f07dc1a2d8061))
* scrolling regression after splitpanes ([455ec6c](https://github.com/nuxt/devtools-poc/commit/455ec6ceef264099dd08bde7d3bfc23c95e38c56))
* **ui:** fix unexpected sidenav icon scale on windows chrome ([#138](https://github.com/nuxt/devtools-poc/issues/138)) ([310117a](https://github.com/nuxt/devtools-poc/commit/310117a7200fba4d642f31a30662ade01f9c554a))
* vue inspector in latest Nuxt ([f736291](https://github.com/nuxt/devtools-poc/commit/f736291d6e91d3e94166b72f0f2ea44291d26057))


### Features

* able to disable tabs, close [#132](https://github.com/nuxt/devtools-poc/issues/132) ([0572b18](https://github.com/nuxt/devtools-poc/commit/0572b180e732b115f7afd982365895730a3480ce))
* add `customTabs` option, close [#113](https://github.com/nuxt/devtools-poc/issues/113) ([f172ffb](https://github.com/nuxt/devtools-poc/commit/f172ffbfc319ac47302d6e6935cbbfd765b848af))
* add visual dialog to upgrade ([d4b43c2](https://github.com/nuxt/devtools-poc/commit/d4b43c267b5d46cc05f20a223ed6675f8b2c0888))
* ask for restart once upgrade finished ([8a97d78](https://github.com/nuxt/devtools-poc/commit/8a97d78cc33b68842873817695a475be1ea1013e))
* expose info on `devtools:initialized` ([71f300d](https://github.com/nuxt/devtools-poc/commit/71f300dcabbeff2897e2a32405fc50387df283fa))
* extendable rpc ([#131](https://github.com/nuxt/devtools-poc/issues/131)) ([96080a8](https://github.com/nuxt/devtools-poc/commit/96080a81a05d1e9e983039b5e85df2abf4304935))
* improve assets details view ([7b03da3](https://github.com/nuxt/devtools-poc/commit/7b03da30bcdd8519fa1b1f6f01ef9b2456004d57))
* init terminal support ([#125](https://github.com/nuxt/devtools-poc/issues/125)) ([df3b1db](https://github.com/nuxt/devtools-poc/commit/df3b1db0155b0fb9810e08919aa7946c5346bc19))
* initial assets tab ([#120](https://github.com/nuxt/devtools-poc/issues/120)) ([fd99453](https://github.com/nuxt/devtools-poc/commit/fd9945345e21b6050bfca31c754cf90618a58328))
* initial support for upgrading packages in devtools ([#134](https://github.com/nuxt/devtools-poc/issues/134)) ([4deb883](https://github.com/nuxt/devtools-poc/commit/4deb883e190149dad3b1c5475b02d3db44edec6e))
* introduce `@nuxt/devtools/kit` ([#116](https://github.com/nuxt/devtools-poc/issues/116)) ([4a403e2](https://github.com/nuxt/devtools-poc/commit/4a403e275fbfeb940ebd4840f523e45306cbfa04))
* measuring plugins time ([38acefb](https://github.com/nuxt/devtools-poc/commit/38acefbcc77661dc71e240e1b0027880b2b135cc))
* option in npm version check ([370f799](https://github.com/nuxt/devtools-poc/commit/370f799f3ac7e4634587ba113641a26cc5f6b087))
* refresh data ([09bf33f](https://github.com/nuxt/devtools-poc/commit/09bf33f2c767c66453b0b390609f04b7bd5c23ae))
* self upgrade ([1a56f53](https://github.com/nuxt/devtools-poc/commit/1a56f53b89b2c746ca9928107c68d0b14b0543f5))
* sticky drawer header ([#105](https://github.com/nuxt/devtools-poc/issues/105)) ([0813626](https://github.com/nuxt/devtools-poc/commit/0813626dfe192dfeff7f72b1f3cb8fea8cc2e914))
* support file path as meta ([6faec60](https://github.com/nuxt/devtools-poc/commit/6faec6005c2fc02ee886394ac1cc653d0a2d103f))
* support load shiki-es only when needed ([#142](https://github.com/nuxt/devtools-poc/issues/142)) ([ca6a64a](https://github.com/nuxt/devtools-poc/commit/ca6a64adb1f31c7c619e635782d6ce8cb6f15c54))
* support ui scaling, close [#117](https://github.com/nuxt/devtools-poc/issues/117) ([df4a35f](https://github.com/nuxt/devtools-poc/commit/df4a35f8140d4619c49c0533937d2b6bdb57ee42))
* **ui:** always collapse drawer to give more spaces ([b7c8add](https://github.com/nuxt/devtools-poc/commit/b7c8addc3fc4990bda708d0f52d99f5ef87a7012))


### Performance Improvements

* hide the horizontal scroll bar ([#124](https://github.com/nuxt/devtools-poc/issues/124)) ([6f73c6f](https://github.com/nuxt/devtools-poc/commit/6f73c6f496c3c0db7783c874bffa3e56143743c5))



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
