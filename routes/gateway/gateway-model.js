import _moment from 'moment';
import * as gatewayConfig from './schema/gateway-model.js';
import { search } from '../../lib/elasticsearch/client.js';
import { Logger } from '../../lib/logger/logger.js';
import { write } from '../../lib/elasticsearch/client.js';

const logger = Logger(import.meta.url);

// 쿼리로그 적재
export const querylog = async (params) => {
  const indices = params.index;
  params.total = params.total * 1;
  params.took = params.took * 1;

  const now = _moment();
  const index = `.openquery-querylog-${now.format('YYYYMMDD')}`;
  const docType = 'doc';

  const param = {
    refresh: true,
    index,
    type: docType,
    body: {
      indices: indices,
      timestamp: now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      query: params.query,
      total: params.total,
      took: params.took
    }
  };

  try {
    await write(param);
  } catch (err) {
    logger.error(JSON.stringify(param));
    throw err;
  }
}

// 인기 검색어 
export const popquery = async (params) => {
  const { index, body } = await gatewayConfig.getPopqueryConfig();
  body.query.term.label = params.label;

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
};

// 실시간 검색어 
export const hotquery = async (params) => {
  const { index, body } = await gatewayConfig.getHotqueryConfig();
  body.query.term.label = params.label;

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
};

// 자동완성 
export const autocomplete = async (params) => {
  const { index, body } = await gatewayConfig.getAutocompleteConfig(params);

  let keywordFields = [];

  if (params.middle === true) {
    keywordFields.push('keyword.autocomplete_middle');
  }
  keywordFields.push('keyword.autocomplete');
  keywordFields.push('keyword.prefix^10');


  if (params.reverse === true) {
    keywordFields.push('keyword.autocomplete_reverse');
  }

  switch (params.sort) {
    default:
      body.sort = [
        {
          _score: {
            order: 'desc'
          }
        },
        {
          'weight': {
            order: 'desc'
          }
        },
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
      break;
    case 'keyword':
      body.sort = [
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
    case 'weight':
      body.sort = [
        {
          'weight': {
            order: 'desc'
          }
        },
        {
          'keyword.keyword': {
            order: 'asc'
          }
        }
      ]
      break;
  }

  body.size = params.size;
  body.query.multi_match = {
    query: params.keyword,
    fields: keywordFields
  }

  keywordFields.forEach((field) => {
    body.highlight.fields[field] = {};
  })

  try {
    const searchResult = await search({
      index,
      body
    });

    return { searchResult, keywordFields };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
}

// 라벨 체크 
export const labelCheck = async (params) => {
  const { index, body } = await gatewayConfig.getOpenqueryConfig();

  switch (params.name) {
    case 'popquery':
    case 'hotquery':
      body.query.term = {
        'popquery.label': {
          value: params.label
        },
      };
      break;
    case 'autocomplete':
      body.query.term = {
        'autocomplete.label': {
          value: params.label
        },
      };
      break;
  }

  try {
    const searchResult = await search({
      index,
      body,
    });

    return { searchResult, index };
  } catch (err) {
    logger.error(JSON.stringify(body));
    throw err;
  }
};