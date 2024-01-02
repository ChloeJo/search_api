import * as yup from 'yup';

// 3개 인덱스
export const multiSearchParam = {
  query: yup.object({
    keyword: yup.string().trim(), // 검색 키워드
    size: yup.number().positive().integer().default(10), // 한 페이지 아이템 수 
    from: yup.number().integer().min(0).default(1), // 페이지 번호
  })
};

// 1개 인덱스 
export const searchParam = {
  query: yup.object({
    fields: yup.array().of(yup.string().trim()).default([]), // 상세검색의 경우 field명 배열 
    keyword: yup.string().trim(), // 검색 키워드 
    size: yup.number().positive().integer().default(10), // 한 페이지 아이템수
    from: yup.number().integer().min(0).default(1), // 페이지 번호
    period: yup.string().trim().default('0'), // 고정기간 조회
    periodFrom: yup.string().trim().default(''), // 상세 기간(gte) 조회
    periodTo: yup.string().trim().default(''), // 상세 기간(lte) 조회
    sort: yup.string().trim().default('asc') // 정렬
  })
};