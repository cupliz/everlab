import * as dayjs from 'dayjs';

export const inRange = (value, min = 0, max) => {
  return (value - min) * (value - max) <= 0;
};

export const categorizeValue = (value, min, max) => {
  // console.log(value, min, max);
  if (parseFloat(value) < parseFloat(min)) {
    return 'Too Low';
  }
  if (parseFloat(value) > parseFloat(max)) {
    return 'Too High';
  }
  const percentage =
    ((parseFloat(value) - parseFloat(min)) /
      (parseFloat(max) - parseFloat(min))) *
    100;
  const lowThreshold = 30;
  const mediumThreshold = 70;
  if (percentage <= lowThreshold) {
    return 'Low';
  } else if (percentage <= mediumThreshold) {
    return 'Medium';
  } else {
    return 'High';
  }
};

export const getDetailDoctor = (data) => {
  return {
    License: data[0],
    Name: data[0] ? `${data[5]} ${data[2]} ${data[1]}` : '',
  };
};

export const getDateTime = (date) => {
  return date ? dayjs(date.split('+')[0]).format('MMMM DD, YYYY HH:mm') : '';
};

export const getDate = (date) => {
  return date ? dayjs(date).format('MMMM DD, YYYY') : '';
};

export const getObservationIdentifier = (data) => {
  return {
    Id: data[0],
    Text: data[1],
    CodingSystem: data[2],
  };
};

export const getObservationResultStatus = (code) => {
  const values = {
    C: 'Record coming over is a correction and thus replaces a final result',
    D: 'Deletes the OBX record',
    F: 'Final results; Can only be changed with a corrected result.',
    I: 'Specimen in lab; results pending',
    N: 'Not asked',
    O: 'Order detail description only (no result)',
    P: 'Preliminary results',
    R: 'Results entered -- not verified',
    S: 'Partial results',
    U: 'Results status change to final without retransmitting results already sent as preliminary.',
    W: 'Post original as wrong, e.g., transmitted for wrong patient',
    X: 'Results cannot be obtained for this observation',
  };
  return values[code];
};

export const getNatureOfAbnormalTest = (code) => {
  const values = {
    A: 'An age-based population',
    B: 'Breed',
    N: 'None - generic normal range',
    R: 'A race-based population',
    S: 'A sex-based population',
    SP: 'Species',
    ST: 'Strain',
  };
  return values[code];
};
