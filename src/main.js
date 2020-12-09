import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import moment from 'moment';

Vue.config.productionTip = false

moment.locale('pl')

Vue.filter('dateTime', function (value) {
    if (!value) return '';

    return moment(value).format('D MMMM hh:mm:ss')
})

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
