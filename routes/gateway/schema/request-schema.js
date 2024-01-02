import * as yup from 'yup';

export const querylogParam = {
  body: yup.object({
    query: yup.string().trim().required(),
    index:  yup.string().trim().required(),
    total: yup.number().integer().required(),
    took: yup.number().integer().required(),
  }),
};

export const popquery = {
  query: yup.object({
    label: yup.string().trim().required()
  })
}

export const hotquery = {
  query: yup.object({
    label: yup.string().trim().required(),
  }),
};

export const autocomplete = {
  query: yup.object({
    keyword: yup.string().trim().required(),
    label: yup.string().trim().required(),
    middle: yup.boolean(),
    reverse: yup.boolean(),
    size: yup.number().integer().positive(),
    sort: yup.string().oneOf(['keyword', 'weight']),
  }),
}


