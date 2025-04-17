import React, { useReducer } from 'react';
import serviceContext from './serviceContext';
import serviceReducer from './serviceReducer';
import api from '../../utils/api';
import {
  GET_SERVICES,
  GET_SERVICE,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE,
  SERVICE_ERROR,
  CLEAR_SERVICE,
  GET_REGISTRATIONS,
  GET_MY_REGISTRATIONS,
  GET_TRAINER_REGISTRATIONS,
  GET_REGISTRATION,
  CREATE_REGISTRATION,
  UPDATE_REGISTRATION_STATUS,
  UPDATE_COMPLETED_SESSIONS,
  CANCEL_REGISTRATION,
  REGISTRATION_ERROR,
  CLEAR_REGISTRATION,
  SET_LOADING
} from './types';

const ServiceState = props => {
  const initialState = {
    services: [],
    currentService: null,
    registrations: [],
    myRegistrations: [],
    trainerRegistrations: [],
    currentRegistration: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(serviceReducer, initialState);

  // Set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  // Get all services with optional filters
  const getServices = async (filters = {}) => {
    setLoading();
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.trainerId) {
        queryParams.append('trainerId', filters.trainerId);
      }
      
      const queryString = queryParams.toString();
      const url = queryString ? `/services?${queryString}` : '/services';
      
      const res = await api.get(url);
      
      dispatch({
        type: GET_SERVICES,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải danh sách dịch vụ'
      });
      throw err;
    }
  };

  // Get service by ID
  const getService = async (id) => {
    setLoading();
    
    try {
      const res = await api.get(`/services/${id}`);
      
      dispatch({
        type: GET_SERVICE,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải thông tin dịch vụ'
      });
      throw err;
    }
  };

  // Get trainer services
  const getTrainerServices = async (trainerId) => {
    setLoading();
    
    try {
      const res = await api.get(`/services/trainer/${trainerId}`);
      
      dispatch({
        type: GET_SERVICES,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải dịch vụ của huấn luyện viên'
      });
      throw err;
    }
  };

  // Add service (admin or trainer)
  const addService = async (serviceData) => {
    setLoading();
    
    try {
      const res = await api.post('/services', serviceData);
      
      dispatch({
        type: ADD_SERVICE,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi thêm dịch vụ'
      });
      throw err;
    }
  };

  // Update service (admin only)
  const updateService = async (id, serviceData) => {
    setLoading();
    
    try {
      const res = await api.put(`/services/${id}`, serviceData);
      
      dispatch({
        type: UPDATE_SERVICE,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi cập nhật dịch vụ'
      });
      throw err;
    }
  };

  // Delete service (admin only)
  const deleteService = async (id) => {
    setLoading();
    
    try {
      await api.delete(`/services/${id}`);
      
      dispatch({
        type: DELETE_SERVICE,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: SERVICE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi xóa dịch vụ'
      });
      throw err;
    }
  };

  // Clear current service
  const clearService = () => {
    dispatch({ type: CLEAR_SERVICE });
  };

  // Get all registrations (admin, receptionist)
  const getRegistrations = async () => {
    setLoading();
    
    try {
      const res = await api.get('/service-registrations');
      
      dispatch({
        type: GET_REGISTRATIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải danh sách đăng ký dịch vụ'
      });
    }
  };

  // Get my registrations (customer)
  const getMyRegistrations = async () => {
    setLoading();
    
    try {
      const res = await api.get('/service-registrations/my-registrations');
      
      dispatch({
        type: GET_MY_REGISTRATIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải danh sách đăng ký dịch vụ của bạn'
      });
    }
  };

  // Get trainer registrations (trainer)
  const getTrainerRegistrations = async () => {
    setLoading();
    
    try {
      const res = await api.get('/service-registrations/my-customers');
      
      dispatch({
        type: GET_TRAINER_REGISTRATIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải danh sách khách hàng của bạn'
      });
    }
  };

  // Get registration by ID
  const getRegistration = async (id) => {
    setLoading();
    
    try {
      const res = await api.get(`/service-registrations/${id}`);
      
      dispatch({
        type: GET_REGISTRATION,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải thông tin đăng ký dịch vụ'
      });
    }
  };

  // Create registration (customer, admin, receptionist)
  const createRegistration = async (registrationData) => {
    setLoading();
    
    try {
      const res = await api.post('/service-registrations', registrationData);
      
      dispatch({
        type: CREATE_REGISTRATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi đăng ký dịch vụ'
      });
      throw err;
    }
  };

  // Update registration status (trainer, admin, receptionist)
  const updateRegistrationStatus = async (id, statusData) => {
    setLoading();
    
    try {
      const res = await api.put(`/service-registrations/${id}/status`, statusData);
      
      dispatch({
        type: UPDATE_REGISTRATION_STATUS,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi cập nhật trạng thái đăng ký'
      });
      throw err;
    }
  };

  // Update completed sessions (trainer, admin, receptionist)
  const updateCompletedSessions = async (id, sessionsData) => {
    setLoading();
    
    try {
      const res = await api.put(`/service-registrations/${id}/sessions`, sessionsData);
      
      dispatch({
        type: UPDATE_COMPLETED_SESSIONS,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi cập nhật số buổi hoàn thành'
      });
      throw err;
    }
  };

  // Cancel registration (customer, admin, receptionist)
  const cancelRegistration = async (id) => {
    setLoading();
    
    try {
      const res = await api.put(`/service-registrations/${id}/cancel`);
      
      dispatch({
        type: CANCEL_REGISTRATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi hủy đăng ký dịch vụ'
      });
      throw err;
    }
  };

  // Clear registrations
  const clearRegistration = () => {
    dispatch({ type: CLEAR_REGISTRATION });
  };

  return (
    <serviceContext.Provider
      value={{
        services: state.services,
        currentService: state.currentService,
        registrations: state.registrations,
        myRegistrations: state.myRegistrations,
        trainerRegistrations: state.trainerRegistrations,
        currentRegistration: state.currentRegistration,
        loading: state.loading,
        error: state.error,
        getServices,
        getService,
        getTrainerServices,
        addService,
        updateService,
        deleteService,
        clearService,
        getRegistrations,
        getMyRegistrations,
        getTrainerRegistrations,
        getRegistration,
        createRegistration,
        updateRegistrationStatus,
        updateCompletedSessions,
        cancelRegistration,
        clearRegistration
      }}
    >
      {props.children}
    </serviceContext.Provider>
  );
};

export default ServiceState;