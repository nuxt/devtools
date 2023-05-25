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
