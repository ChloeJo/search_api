import * as model from './gateway-model.js';

// 쿼리로그 적재 
export const setQuerylog = async (params) => {
    const gatewayResp = await model.querylog(params);
    return gatewayResp;
}

// 인기 검색어 
export const getPopquery = async (params) => {
    const popqueryDTO = {
        label: params.label,
        timestamp: params.timestamp || '',
        timestamp: params.timestamp === 'true' ? true : false,
        name: 'popquery',
    };
    const gatewayResp = await model.popquery(popqueryDTO);

     // 결과가 없으면 빈 배열 / 라벨이 틀리면 오류 
    if (gatewayResp.searchResult.body.hits.hits.length === 0) {
        const labelResp = await model.labelCheck(popqueryDTO);
        if (labelResp.searchResult.body.hits.hits.length > 0) {
            if (popqueryDTO.timestamp) {
                return { items: [] };
            } else {
                return [];
            }
        } else {
            throw new BadRequestError('The label does not exist.');
        }
    } else {
        const popqueryArr = JSON.parse(
            gatewayResp.searchResult.body.hits.hits[0]._source.popqueryJSON
        );
        if (popqueryDTO.timestamp) {
            return {
                timestamp: gatewayResp.searchResult.hits.hits[0]._source.timestamp,
                items: popqueryArr,
            };
        } else {
            return popqueryArr;
        }
    }
}

// 실시간 검색어 
export const getHotquery = async (params) => {
    const hotqueryDTO = {
        label: params.label,
        timestamp: params.timestamp || '',
        timestamp: params.timestamp === 'true' ? true : false,
        name: 'hotquery',
    };
    const gatewayResp = await model.hotquery(hotqueryDTO);

     // 결과가 없으면 빈 배열 / 라벨이 틀리면 오류 
    if (gatewayResp.searchResult.body.hits.hits.length === 0) {
        const labelResp = await model.labelCheck(hotqueryDTO);
        if (labelResp.searchResult.body.hits.hits.length > 0) {
            if (hotqueryDTO.timestamp) {
                return { items: [] };
            } else {
                return [];
            }
        } else {
            throw new BadRequestError('The label does not exist.');
        }
    } else {
        const hotqueryArr = JSON.parse(
            gatewayResp.searchResult.body.hits.hits[0]._source.hotqueryJSON
        );
        if (hotqueryDTO.timestamp) {
            return {
                timestamp: gatewayResp.searchResult.hits.hits[0]._source.timestamp,
                items: hotqueryArr,
            };
        } else {
            return hotqueryArr;
        }
    }
};

// 검색어 자동완성 
export const getAutocomplete = async (params) => {
    const autocompleteDTO = {
        keyword: params.keyword,
        label: params.label,
        middle: params.middle === 'true' ? true : false,
        reverse: params.reverse === 'true' ? true : false,
        size: params.size ?? 10,
        sort: params.sort,
        name: 'autocomplete',
    };

    let autocompleteArr = [];
    let gatewayResp = await model.autocomplete(autocompleteDTO);

    // 결과가 없으면 빈 배열 / 라벨이 틀리면 오류 
    if (gatewayResp.searchResult.body.hits.hits.length === 0) {
        const labelResp = await model.labelCheck(autocompleteDTO);
        if (labelResp.searchResult.body.hits.hits.length > 0) {
            return [];
        } else {
            throw new BadRequestError('The label does not exist.');
        }
    } else {
        gatewayResp.searchResult.body.hits.hits.forEach(async (hit) => {
            let item = {
                keyword: hit._source.keyword,
                highlight: hit._source.keyword,
                weight: hit._source.weight,
                custom: JSON.parse(hit._source.custom),
            };
            autocompleteArr.push(item);
        });
    }
    return autocompleteArr;
};
