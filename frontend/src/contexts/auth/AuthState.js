import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import api from '../../utils/api';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from './types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      setAuthToken(localStorage.getItem('token'));
    }

    try {
      const res = await api.get('/auth/me');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    try {
      const res = await api.post('/auth/register', formData);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || 'Đăng ký thất bại'
      });
    }
  };

// Trong AuthState.js
const login = async formData => {
  try {
    const res = await api.post('/auth/login', formData);
    
    // Kiểm tra xem response có token không
    if (!res.data.token) {
      return dispatch({
        type: LOGIN_FAIL,
        payload: 'Không nhận được token từ server'
      });
    }
    
    // Lưu token trực tiếp vào localStorage
    localStorage.setItem('token', res.data.token);
    
    // Đặt token vào header cho các request tiếp theo
    setAuthToken(res.data.token);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // Tải thông tin người dùng
    await loadUser();
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Đăng nhập thất bại'
    });
  }
};


  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;