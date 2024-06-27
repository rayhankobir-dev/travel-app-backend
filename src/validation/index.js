import Joi from "joi";

export const userSchema = {
  signup: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().default("user"),
  }),
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  create: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().default("admin"),
  }),
};

export const roleSchem = {
  create: Joi.object({
    slug: Joi.string().required(),
  }),
  delete: Joi.object({
    roleId: Joi.string().required(),
  }),
};

export const locationSchema = {
  create: Joi.object({
    location: Joi.string().required(),
    lon: Joi.number().optional(),
    lat: Joi.number().optional(),
    country: Joi.string().required(),
    countryCode: Joi.string().optional(),
  }),
  edit: Joi.object({
    locationId: Joi.string().required(),
    location: Joi.string().required(),
    lon: Joi.number().optional(),
    lat: Joi.number().optional(),
    country: Joi.string().required(),
    countryCode: Joi.string().optional(),
  }),
  delete: Joi.object({
    locationId: Joi.string().required(),
  }),
};

export const faqSchema = {
  create: Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
  edit: Joi.object({
    questionId: Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
  delete: Joi.object({
    questionId: Joi.string().required(),
  }),
};

export const serviceSchema = {
  create: Joi.object({
    service: Joi.string().required(),
  }),
  edit: Joi.object({
    serviceId: Joi.string().required(),
    service: Joi.string().required(),
  }),
  delete: Joi.object({
    serviceId: Joi.string().required(),
  }),
};

export const activitySchema = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
  edit: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
  activityId: Joi.string().required(),
};

export const highLightSchema = {
  create: Joi.object({
    title: Joi.string().required(),
  }),
  edit: Joi.object({
    highlightId: Joi.string().required(),
    title: Joi.string().required(),
  }),
  delete: Joi.object({
    highlightId: Joi.string().required(),
  }),
};

export const tourSchema = {
  create: Joi.object({
    title: Joi.string().required(),
    overview: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    groupSize: Joi.number().required(),
    maxAge: Joi.number().required(),
    minAge: Joi.number().required(),
    cost: Joi.number().required(),
    tax: Joi.number().required(),
    discount: Joi.number().required().default(0),
    location: Joi.string().required(),
    highlights: Joi.array().default([]).optional(),
    services: Joi.array().default([]).optional(),
    faqs: Joi.array().default([]).optional(),
    activities: Joi.array().default([]).optional(),
  }),
  edit: Joi.object({
    tripId: Joi.string().required(),
    title: Joi.string().required(),
    overview: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    groupSize: Joi.number().required(),
    maxAge: Joi.number().required(),
    minAge: Joi.number().required(),
    cost: Joi.number().required(),
    tax: Joi.number().required(),
    discount: Joi.number().required().default(0),
  }),
  id: Joi.object({
    id: Joi.string().required(),
  }),
};

export const orderSchema = {
  init: Joi.object({
    tourId: Joi.string().required(),
    totalPerson: Joi.number().required().default(1),
  }),
};
