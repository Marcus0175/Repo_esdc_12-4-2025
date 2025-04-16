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
  
  const serviceReducer = (state, action) => {
    switch (action.type) {
      case GET_SERVICES:
        return {
          ...state,
          services: action.payload,
          loading: false,
          error: null
        };
      case GET_SERVICE:
        return {
          ...state,
          currentService: action.payload,
          loading: false,
          error: null
        };
      case ADD_SERVICE:
        return {
          ...state,
          services: [action.payload, ...state.services],
          loading: false,
          error: null
        };
      case UPDATE_SERVICE:
        return {
          ...state,
          services: state.services.map(service => 
            service._id === action.payload._id ? action.payload : service
          ),
          currentService: action.payload,
          loading: false,
          error: null
        };
      case DELETE_SERVICE:
        return {
          ...state,
          services: state.services.filter(
            service => service._id !== action.payload
          ),
          loading: false,
          error: null
        };
      case SERVICE_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case CLEAR_SERVICE:
        return {
          ...state,
          currentService: null,
          error: null
        };
      case GET_REGISTRATIONS:
        return {
          ...state,
          registrations: action.payload,
          loading: false,
          error: null
        };
      case GET_MY_REGISTRATIONS:
        return {
          ...state,
          myRegistrations: action.payload,
          loading: false,
          error: null
        };
      case GET_TRAINER_REGISTRATIONS:
        return {
          ...state,
          trainerRegistrations: action.payload,
          loading: false,
          error: null
        };
      case GET_REGISTRATION:
        return {
          ...state,
          currentRegistration: action.payload,
          loading: false,
          error: null
        };
      case CREATE_REGISTRATION:
        return {
          ...state,
          myRegistrations: [action.payload, ...state.myRegistrations],
          loading: false,
          error: null
        };
      case UPDATE_REGISTRATION_STATUS:
        return {
          ...state,
          trainerRegistrations: state.trainerRegistrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          registrations: state.registrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          currentRegistration: action.payload,
          loading: false,
          error: null
        };
      case UPDATE_COMPLETED_SESSIONS:
        return {
          ...state,
          trainerRegistrations: state.trainerRegistrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          registrations: state.registrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          currentRegistration: action.payload,
          loading: false,
          error: null
        };
      case CANCEL_REGISTRATION:
        return {
          ...state,
          myRegistrations: state.myRegistrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          registrations: state.registrations.map(reg => 
            reg._id === action.payload._id ? action.payload : reg
          ),
          currentRegistration: action.payload,
          loading: false,
          error: null
        };
      case REGISTRATION_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case CLEAR_REGISTRATION:
        return {
          ...state,
          currentRegistration: null,
          error: null
        };
      case SET_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  };
  
  export default serviceReducer;