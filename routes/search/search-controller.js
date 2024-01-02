import axios from 'axios';
import config from 'config';
import * as searchService from './search-service.js';
import { asyncWrapper } from '../../lib/utils/async-wrapper.js';
import { Logger } from '../../lib/logger/logger.js';

const appConfig = config.get('app');
const logger = Logger(import.meta.url);

export const multiSearch = asyncWrapper(async (req, res, next) => {
  /*
  #swagger.tags = ['multi']
  #swagger.summary = '3개 인덱스 통합 검색'
  #swagger.description = '3개 인덱스 통합 검색 API'
  #swagger.parameters['keyword'] = { 
    in: 'query',
    description: '키워드',
    required: true,
    type: 'string'
  }
  #swagger.parameters['size'] = { description: '개수' } 
  #swagger.parameters['from'] = { description: 'from' }     
  #swagger.parameters['period'] = { description: '기간설정' }
  #swagger.parameters['periodFrom'] = { description: '기간(from)' }
  #swagger.parameters['periodTo'] = { description: '기간(to)' }
  #swagger.parameters['sort'] = { description: '정렬' }     
  */
  const query = req.validated.query; // set 쿼리 
  const response = await searchService.multiSearch(query);

  // 쿼리로그 적재 (첫 페이지 로딩시나 키워드가 비어 있는 경우 로그 적재 X)
  if (query.keyword !== undefined && query.keyword.length !== 0) {
    axios.post(`${appConfig.host}:${appConfig.port}/gateway/querylog`, {
      query: query.keyword,
      ...response.meta
    }).then(() => {
      logger.debug('querylog success');
    }).catch(err => {
      logger.error(`querylog failed: ${err}`);
    });
  }

  res.send(response);
});

export const simpleSearch = asyncWrapper(async (req, res, next) => {
  /*
    #swagger.tags = ['search']
    #swagger.summary = '1개 인덱스 검색'
    #swagger.description = '1개 인덱스 검색 API'
    #swagger.parameters['type'] = {
      in: 'path',
      description: '인덱스명',
      required: true,
      type: 'string'
    }
    #swagger.parameters['keyword'] = { 
      in: 'query',
      description: '키워드',
      required: true,
      type: 'string'
    }
    #swagger.parameters['field'] = { description: '상세검색 필드' }
    #swagger.parameters['size'] = { description: '개수' } 
    #swagger.parameters['from'] = { description: '페이지' }     
    #swagger.parameters['period'] = { description: '기간설정' }
    #swagger.parameters['periodFrom'] = { description: '기간(from)' }
    #swagger.parameters['periodTo'] = {  description: '기간(to)' }
    #swagger.parameters['sort'] = { description: '정렬' }     
  */
  const params = req.validated.params; // set 인덱스
  const query = req.validated.query; // set 쿼리 
  const response = await searchService.simpleSearch(params, query);

  // 쿼리로그 적재 (첫 페이지 로딩시나 키워드가 비어 있는 경우 로그 적재 X)
  if (query.keyword !== undefined && query.keyword.length !== 0) {
    axios.post(`${appConfig.host}:${appConfig.port}/gateway/querylog`, {
      query: query.keyword,
      ...response.meta
    }).then(() => {
      logger.debug('querylog success');
    }).catch(err => {
      logger.error(`querylog failed: ${err}`);
    });
  }
  res.send(response);
});
