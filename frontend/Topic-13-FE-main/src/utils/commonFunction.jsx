import React from 'react';
import dayjs from 'dayjs';

export const capitalizeFirstLetter = string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const convertSkillArray = skills => {
  if (!Array.isArray(skills)) return '';
  return skills.map(skill => capitalizeFirstLetter(skill.skillName)).join(', ');
};

export const convertDateMeeting = (meeting, index) => {
  const availableFrom = dayjs(meeting.availableFrom, 'DD-MM-YYYY HH:mm');
  const availableTo = dayjs(meeting.availableTo, 'DD-MM-YYYY HH:mm');

  const date = availableFrom.format('DD-MM-YYYY');
  const start = availableFrom.format('HH:mm');
  const end = availableTo.format('HH:mm');

  return index ? `Meeting ${index}: ${date}, ${start} - ${end}` : `${date}, ${start} - ${end}`;
};

export const calculatePointDeduction = (timeStart, timeEnd, studentsLength) => {
  const availableFrom = dayjs(timeStart, 'DD-MM-YYYY HH:mm');
  const availableTo = dayjs(timeEnd, 'DD-MM-YYYY HH:mm');

  const timeDiffInMinutes = availableTo.diff(availableFrom, 'minute');

  const timeInSlots = Math.floor(timeDiffInMinutes / 30);

  const pointDeduction = studentsLength * 10 * timeInSlots;

  return pointDeduction;
};

export const formatDate = date => {
  const dayFormat = dayjs(date).format('YYYY-MM-DD HH:mm');
  return dayFormat;
};

export const formatDateTransaction = date => {
  const dayFormat = dayjs(date).format('dddd, HH:mm DD-MM-YYYY');

  return dayFormat;
};

export const parseStringStatus = string => {
  const stringWithoutSpaces = string.replace(/\s+/g, '');
  console.log(stringWithoutSpaces);

  return stringWithoutSpaces.toUpperCase();
};
