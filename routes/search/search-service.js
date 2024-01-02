import { Logger } from '../../lib/logger/logger.js';
import * as searchModel from './search-model.js';

const logger = Logger(import.meta.url);

// 3개 인덱스 통합 검색 
export const multiSearch = async (query) => {
    const { searchResult, indices } = await searchModel.multiSearch(query);

    let total = 0;
    const resultBody = {};

    searchResult.body.responses.map((resp, i) => {
        resultBody[indices[i]] = resp.hits.hits.map(item => ({
            _score: item._score,
            ...item._source,
            highlight: item.highlight
        }));
        total += resp.hits.total.value;
    });

    const response = {
        meta: {
            index: indices.join(', '),
            took: searchResult.body.took,
            total: total
        },
        resultBody
    }

    logger.info(JSON.stringify(resultBody.meta));
    return response;
}

// 1개 인덱스 통합/상세 검색 
export const simpleSearch = async (params, query) => {
    query.index = params.type; // 인덱스명 담기 
    const { searchResult, index } = await searchModel.simpleSearch(query);
    
    const body = searchResult.body.hits.hits.map(item => ({
        _score: item._score,
        ...item._source,
        highlight: item.highlight
    }));

    const response = {
        meta: {
            index,
            took: searchResult.body.took,
            total: searchResult.body.hits.total.value
        },
        body
    }

    logger.info(
        JSON.stringify(response.meta)
    );
    return response;
}