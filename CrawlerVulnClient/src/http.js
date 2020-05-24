import axios from 'axios'
import router from './router'
const http=axios.create({
  baseURL:'http://localhost:3000'

})
http.interceptors.request.use(function (config) {
  config.headers.Authorization=window.localStorage.getItem('token');
  return config;
  
},function (err) {
  
});
http.interceptors.response.use(function (res) {
  return res;

},function (err) {
  if(err.response.status===422){
    router.push('/login');
  }


})

export default http


