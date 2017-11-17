/*
** Comment me
*/

import { UPLOAD_SUCCESS, UPLOAD_FAIL } from './types'


export function uploadSuccess({ data }) {
  return {
    type: UPLOAD_SUCCESS,
    data,
  };
}


export function uploadFail(error) {
  return {
    type: UPLOAD_FAIL,
    error,
  };
}


export function sendFormWithUpload({ formData }) {  
  return (dispatch) => {
    axios.post('/files', formData)
      .then(response => dispatch(uploadSuccess(response))
      .catch(error => dispatch(uploadFail(error));
  };
}
