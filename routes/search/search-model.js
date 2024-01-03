import { search, msearch } from '../../lib/elasticsearch/client.js';
import * as indexModel from './schema/index-model.js';
import { Logger } from '../../lib/logger/logger.js';

const logger = Logger(import.meta.url);

// 3개 인덱스 통합 검색
export const multiSearch = async params => {
    const multiModel = indexModel.multiSearch();
    const indices = [];
    const multiBody = [];

    multiModel.map(model => {
        const { index, body } = model;
        indices.push(index);

        if (params.keyword == undefined || params.keyword.length == 0) { // 첫 페이지 로딩이거나 검색 키워드가 없는 경우 
            body.query = { match_all: {} };
        } else {
            body.query.bool.must[0].multi_match.query = params.keyword;
        }
        body.size = params.size;
        body.from = params.from - 1; // 페이지번호 -1
        multiBody.push({ index }, body);
    });

    logger.debug(JSON.stringify(multiBody));

    const searchResult = await msearch({
        body: multiBody
    });
    return { searchResult, indices };
};

// 1개 인덱스 통합/상세 검색 
export const simpleSearch = async params => {
    const searchModel = indexModel.search();
    const { field, body } = searchModel;
    const { weight, highlight, sorts, result, range } = field;

    let index = params.index;
    const period = params.period;
    const periodFrom = params.periodFrom;
    const periodTo = params.periodTo;
    const fields = params.fields;
    const sort = params.sort;
    const field_dt_name = range[0][index].field;

    let multi_match_fields = [];
    let highlight_fields = {};
    let sort_fields = {};

    if (fields == undefined || fields == '' || fields.length == 0) { // 통합 검색 
        // 검색 가중치 필드
        multi_match_fields.push(...weight[0].total[index]);
        // 하이라이팅
        highlight[0].total[index].forEach(field => {
            highlight_fields[field] = {};
        });
        // 정렬
        if (sort !== '' || sort.length !== 0) {
            sorts[0].total[index].forEach(field => {
                sort_fields[field] = { order: sort };
            })
        }

    } else { // 상세 검색 
        fields.map(f => {
            // 검색 대상 필드
            const search = weight[0].detail[index][f];
            search.map(k => multi_match_fields.push(k));
            // 하이라이팅
            const highlightFileds = highlight[0].detail[index][f];
            highlightFileds.map(k => highlight_fields[k] = {});
            // 정렬
            if (sort !== '' || sort.length !== 0) {
                const sorting = sorts[0].detail[index][f];
                sorting.map(k => sort_fields[k] = { order: sort });
            }
        })
    }

    // match 필드 설정
    body.query.bool.must.push(
        (params.keyword == undefined || params.keyword.length == 0)
            ? { match_all: {} }
            : {
                multi_match: {
                    fields: multi_match_fields,
                    type: "best_fields",
                    query: params.keyword
                }
            }
    );

    // range 설정 
    body.query.bool.must.push({
        range: period !== '0'  // 고정 기간 검색(...M)
            ? {
                [field_dt_name]: {
                    gte: `now-${period}/d`,
                    lte: range[0][index].lte
                }
            }
            : { // 상세 기간 설정
                [field_dt_name]: {
                    gte: (periodFrom === '' ? 'now-200y/d' : periodFrom.length == 4 ? `${periodFrom}0101` : periodFrom),
                    lte: (periodTo === '' ? 'now/d' : periodTo.length == 4 ? `${periodTo}0101` : periodTo),
                    format: range[0][index].format
                }
            }
    })

    body.highlight.fields = highlight_fields;
    body.sort.push(sort_fields);
    body._source = result[0][index];
    body.size = params.size;
    body.from = params.from - 1; // 페이지 번호 -1

    // corp 인덱스명 셋팅 (es 인덱스명 상이)
    index === 'corp' ? (index = 'ked_cmp_m') : (index = index);

    logger.debug(
        JSON.stringify({
            index, body
        })
    );

    const searchResult = await search({
        index,
        body
    });
    return { searchResult, index };
};