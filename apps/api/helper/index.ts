import * as dayjs from 'dayjs';

export const categorizeValue = (value, range) => {
  let min = 0.0;
  let max = 0.0;
  if (range.includes('>')) {
    const [splitMin, splitMax] = range.split('>');
    max = splitMax;
  }
  if (range.includes('<')) {
    const [splitMin, splitMax] = range.split('<');
    min = splitMax;
  }
  if (range.includes('-')) {
    const [splitMin, splitMax] = range.split('-');
    min = splitMin;
    max = splitMax;
  }

  let Category = '';
  let Status = '';
  // console.log(value, range, { min, max });
  if (value < min) {
    Status = 'Abnormal';
    Category = 'Too Low';
  } else if (value > max) {
    Status = 'Abnormal';
    Category = 'Too High';
  } else {
    Status = 'Normal';
    const percentage = ((value - min) / (max - min)) * 100;
    const lowThreshold = 30;
    const mediumThreshold = 70;
    if (percentage <= lowThreshold) {
      Category = 'Low';
    } else if (percentage <= mediumThreshold) {
      Category = 'Medium';
    } else {
      Category = 'High';
    }
  }
  return { Category, Status };
};

export const categorizeByEverlab = (value, min, max) => {
  let Category = '';
  let Status = '';
  if (value < min) {
    Status = 'Abnormal';
    Category = 'Too Low';
  } else if (value > max) {
    Status = 'Abnormal';
    Category = 'Too High';
  } else {
    Status = 'Normal';
    const percentage = ((value - min) / (max - min)) * 100;
    const lowThreshold = 30;
    const mediumThreshold = 70;
    if (percentage <= lowThreshold) {
      Category = 'Low';
    } else if (percentage <= mediumThreshold) {
      Category = 'Medium';
    } else {
      Category = 'High';
    }
  }
  return { Category, Status };
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
