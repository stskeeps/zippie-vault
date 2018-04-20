// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Web3 from 'web3'
import router from './router'

var zippieprovider = require('vault-web3-provider')
var vault = require('vault-api')
var vaultSecp256k1 = require('vault-api/src/secp256k1.js')

var vault_opts = {}

/* This handles being launched by vault. */
if (location.hash.startsWith('#zippie-vault=')) {
  vault_opts = {
    'vaultURL': location.hash.slice('#zippie-vault='.length)
  }
  location.hash = ''
}
/* And this handles the terrifying fact that Vue automatically converts #foo to #/foo upon loading router with hash option */
if (location.hash.startsWith('#/zippie-vault=')) {
  vault_opts = {
    'vaultURL': location.hash.slice('#/zippie-vault='.length)
  }
  location.hash = ''
}


  
//Vue.config.productionTip = false

window.addEventListener('load', function () {

vault.init(vault_opts).then((result) => {
  console.log('got inited:')
  console.log(result)
  var provider = zippieprovider.init(vault, vaultSecp256k1, {
    network: 'kovan'
  })
  window.web3 = new Web3(provider)
  zippieprovider.addAccount('m/0').then((addy) => {
   console.log(addy)
   /* eslint-disable no-new */
   new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  })
}, (error) => {
  console.log('encountered error: ')
    console.log(error)
    if (error.error === 'launch') {
      vault.launch(error.launch)
    }
})

})