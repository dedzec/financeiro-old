import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

import apiUrl from 'api';

class Ade90Service extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(`${apiUrl}/auth/register`, data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithLoginAndPassword = (login, pass) => {
    return new Promise((resolve, reject) => {
      axios
        // .get('/api/auth', {
        .post(`${apiUrl}/signin`, {
          login: login,
          pass: pass,
        })
        .then((res) => {
          // if (res.data.user) {
          if (res.data) {
            this.setSession(res.data.access_token);
            resolve(res.data);
          } else {
            reject(res.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${apiUrl}/auth/access-token`, {
          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((err) => {
          console.log(err);
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(`${apiUrl}/auth/user/update`, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    // eslint-disable-next-line no-undef
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('access_token');
  };
}

const instance = new Ade90Service();

export default instance;
