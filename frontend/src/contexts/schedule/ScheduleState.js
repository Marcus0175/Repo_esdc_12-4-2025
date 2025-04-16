import React, { useReducer, useCallback } from 'react';
import scheduleContext from './scheduleContext';
import scheduleReducer from './scheduleReducer';
import api from '../../utils/api';
import {
  GET_SCHEDULE,
  UPDATE_SCHEDULE,
  ADD_SCHEDULE_ITEM,
  DELETE_SCHEDULE_ITEM,
  SCHEDULE_ERROR,
  CLEAR_SCHEDULE,
  SET_LOADING,
  CLEAR_ERRORS
} from './types';

const ScheduleState = props => {
  const initialState = {
    schedule: [],
    trainerId: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Set loading - memoized to prevent recreation on each render
  const setLoading = useCallback(() => {
    dispatch({ type: SET_LOADING });
  }, []);

  // Get trainer's work schedule
  const getSchedule = useCallback(async (trainerId) => {
    setLoading();
    
    try {
      const res = await api.get(`/schedule/${trainerId}`);
      
      dispatch({
        type: GET_SCHEDULE,
        payload: { 
          schedule: res.data.schedule || [], 
          trainerId 
        }
      });

      return res.data.schedule;
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải lịch làm việc'
      });
      throw err;
    }
  }, [setLoading]);

  // Get logged-in trainer's schedule
  const getMySchedule = useCallback(async () => {
    setLoading();
    
    try {
      const res = await api.get('/schedule/me');
      
      dispatch({
        type: GET_SCHEDULE,
        payload: { 
          schedule: res.data.schedule || [], 
          trainerId: 'me' 
        }
      });

      return res.data.schedule;
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi tải lịch làm việc'
      });
      throw err;
    }
  }, [setLoading]);

  // Update entire schedule
  const updateSchedule = useCallback(async (trainerId, schedule) => {
    setLoading();
    
    try {
      const res = await api.put(`/schedule/${trainerId}`, { schedule });
      
      dispatch({
        type: UPDATE_SCHEDULE,
        payload: { schedule: res.data.schedule || [] }
      });

      return res.data.schedule;
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi cập nhật lịch làm việc'
      });
      throw err;
    }
  }, [setLoading]);

  // Sửa hàm addScheduleItem
const addScheduleItem = async (trainerId, scheduleItem) => {
  setLoading();
  
  try {
    // Log để debug
    console.log('Sending to API:', trainerId, scheduleItem);
    
    const res = await api.post(`/schedule/${trainerId}`, scheduleItem);
    
    dispatch({
      type: ADD_SCHEDULE_ITEM,
      payload: { scheduleItem: res.data.scheduleItem }
    });

    return res.data.scheduleItem;
  } catch (err) {
    console.error('Error in addScheduleItem:', err.response?.data || err);
    
    dispatch({
      type: SCHEDULE_ERROR,
      payload: err.response?.data?.message || 'Lỗi khi thêm lịch làm việc'
    });
    throw err;
  }
};

  // Delete schedule item
  const deleteScheduleItem = useCallback(async (trainerId, scheduleId) => {
    setLoading();
    
    try {
      await api.delete(`/schedule/${trainerId}/${scheduleId}`);
      
      dispatch({
        type: DELETE_SCHEDULE_ITEM,
        payload: { scheduleId }
      });
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: err.response?.data?.message || 'Lỗi khi xóa lịch làm việc'
      });
      throw err;
    }
  }, [setLoading]);

  // Clear current schedule
  const clearSchedule = useCallback(() => {
    dispatch({ type: CLEAR_SCHEDULE });
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);

  return (
    <scheduleContext.Provider
      value={{
        schedule: state.schedule,
        trainerId: state.trainerId,
        loading: state.loading,
        error: state.error,
        getSchedule,
        getMySchedule,
        updateSchedule,
        addScheduleItem,
        deleteScheduleItem,
        clearSchedule,
        clearErrors
      }}
    >
      {props.children}
    </scheduleContext.Provider>
  );
};

export default ScheduleState;