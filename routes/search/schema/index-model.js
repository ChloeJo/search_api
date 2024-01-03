// 3개 통합 인덱스 모델
export const multiSearch = () => (
    [
        {
            index: 'stock',
            body: {
                from: 0,
                size: 5,
                query: {
                    bool: {
                        must: [{
                            multi_match: {
                                fields: ['title_ksk*^2', 'content_ksk*^3', '*'],
                                type: "best_fields",
                            }
                        }],
                        filter: [],
                        should: [],
                    }
                },
                highlight: {
                    fields: {
                        'title_ksk*': {},
                        'content_ksk*': {}
                    }
                },
                _source: []
            }
        }, {
            index: 'thesis',
            body: {
                from: 0,
                size: 5,
                query: {
                    bool: {
                        must: [{
                            multi_match: {
                                fields: ['title_*^3', 'abstract_*^3', 'author_skn*^1.5', 'publisher_eko*^1.5', 'journal_title_ecko*^1.5', 'issn_skn*^1.5', '*'],
                                type: "best_fields",
                            }
                        }],
                        filter: [],
                        should: [],
                    }
                },
                highlight: {
                    fields: {
                        'title_*': {},
                        'author_skn*': {},
                        'abstract_*': {},
                        'publisher_eko*': {},
                        'journal_title_ecko*': {},
                        'issn_skn*': {}
                    }
                },
                _source: []
            }
        }, {
            index: 'ked_cmp_m',
            body: {
                from: 0,
                size: 5,
                query: {
                    bool: {
                        must: [{
                            multi_match: {
                                fields: ['nm_kskn*^4', 'gnrl_nm_kskn*^4', 'eng_nm_e*^3', 'bizno_k*^2', '*_addr_*^2', '*'],
                                type: "best_fields",
                            }
                        }],
                        filter: [],
                        should: [],
                    }
                },
                highlight: {
                    fields: {
                        'nm_kskn*': {},
                        'gnrl_nm_kskn*': {},
                        'eng_nm_e*': {},
                        'bizno_k*': {},
                        '*_addr_*': {}
                    }
                },
                _source: []
            }
        }
    ]
);

// 1개 인덱스 모델 
export const search = () => ({
    index: [],
    field: {
        weight: [
            {
                total: {
                    // stock: 본문*3, 제목*2, 전체필드 통합검색
                    stock: ['title_ksk*^2', 'content_ksk*^3', '*'],
                    // thesis: 제목, 요약, 저널명, 연구자명, 논문발표기관, issn
                    thesis: ['title_*^3', 'abstract_*^3', 'author_skn*^1.5', 'publisher_eko*^1.5', 'journal_title_ecko*^1.5', 'issn_skn*^1.5', '*'],
                    // corp: 기업명, 업종코드, 사업자번호, 주소
                    corp: ['nm_kskn*^4', 'gnrl_nm_kskn*^4', 'eng_nm_e*^3', 'bizno_k*^2', '*_addr_*^2', '*']
                },
                detail: {
                    stock: {// stock: 상세검색 필드 - 제목,본문,카테고리
                        title: ['title_ksk*^2'],
                        content: ['content_ksk*^2'],
                        category: ['category_ksk*^2'],
                    },
                    thesis: { // thesis: 논문번호, issn, 논문명, 초록(요약), 키워드, 연구자, 연구기관(location_org_ko), 카테고리(논문/보고서), 논문(국가), 논문언어, 
                        contents: ['title_*^2', 'abstract_*^2'],
                        author: ['author_skn*^2'],
                        publisher: ['publisher_eko*^2'],
                        journal: ['journal_title_ecko*^2'],
                        keyword: ['keyword_e*^2'],
                        issn: ['issn_skn*^2']
                    },
                    corp: { // 기업정보: 기업명, 사업자번호, 창립년도, 상장일, 주소, 업종코드
                        corp_name: ['nm_kskn*^2', 'gnrl_nm_kskn*^2', 'eng_nm_e*^2'],
                        bizno: ['bizno_k*^2'],
                        induty_code: ['induty_cd_k*^2'],
                        fond_date: ['fond_date_dt*^2'],
                        debut_date: ['debut_date_dt*^2'],
                        addr: ['loc_main_addr_nsk.nori^2', 'loc_dt_addr_nsk.noir^2', 'doro_main_addr_nsk.nori^2', 'doro_dt_addr_nsk.nori^2']
                    }
                }
            }
        ],
        highlight: [
            {
                total: {
                    // stock: 제목, 본문 하이라이팅
                    stock: ['title_ksk*', 'content_ksk*', 'reporter_kskn*'],
                    // thesis: 제목, 요약, 저널명, 연구자명, 논문발표기관, issn
                    thesis: ['title_*', 'author_skn*', 'abstract_*', 'publisher_eko*', 'journal_title_ecko*', 'issn_skn*'],
                    // corp: 기업명, 업종코드, 사업자번호, 주소
                    corp: ['nm_kskn*', 'gnrl_nm_kskn*', 'eng_nm_e*', 'bizno_k*', '*_addr_*']
                },
                detail: {
                    stock:
                    {// stock: 하이라이팅 - 해당 필드에만 하이라이팅
                        title: ['title_ksk*'],
                        content: ['content_ksk*'],
                        category: ['category_ksk*'],
                    },
                    thesis: { // thesis: 논문내용(제목+요약), issn, 키워드, 연구자, 발행처
                        contents: ['title_*', 'abstract_*'],
                        author: ['author_skn*'],
                        publisher: ['publisher_eko*'],
                        journal: ['journal_title_ecko*'],
                        keyword: ['keyword_e*'],
                        issn: ['issn_skn*']
                    },
                    corp: { // 기업정보: 기업명, 사업자번호, 창립년도, 상장일, 주소, 업종코드
                        corp_name: ['nm_kskn*', 'gnrl_nm_kskn*', 'eng_nm_e*'],
                        bizno: ['bizno_k*'],
                        induty_code: ['induty_cd_k*'],
                        fond_date: ['fond_date_dt*'],
                        debut_date: ['debut_date_dt*'],
                        addr: ['loc_main_addr_nsk*', 'loc_dt_addr_nsk*', 'doro_main_addr_nsk*', 'doro_dt_addr_nsk*']
                    }
                }
            }
        ],
        sorts: [
            {
                total: {
                    stock: ['title_ksk', 'content_ksk'],
                    thesis: ['title_h_nsk', 'title_eq_nsk'],
                    corp: ['nm_kskn', 'gnrl_nm_kskn', 'eng_nm_e']
                },
                detail: {
                    stock: {
                        title: ['title_ksk'],
                        content: ['content_ksk'],
                        category: ['category_ksk']
                    },
                    thesis: {
                        contents: ['title_h_nsk', 'title_eq_nsk'],
                        author: ['author_skn'],
                        category: ['set_spec_k'],
                        journal: ['journal_title_ecko'],
                        keyword: ['keyword_e'],
                        publisher: ['publisher_eko'],
                        country: ['publication_country_k'],
                        language: ['kmd_language_k'],
                        issn: ['issn_skn']
                    },
                    corp: {
                        corp_name: ['nm_kskn', 'gnrl_nm_kskn', 'eng_nm_e'],
                        bizno: ['bizno_k'],
                        induty_code: ['induty_cd_k'],
                        fond_date: ['fond_date_dt'],
                        debut_date: ['debut_date_dt'],
                        addr: ['loc_main_addr_nsk', 'loc_dt_addr_nsk', 'doro_main_addr_nsk', 'doro_dt_addr_nsk']
                    }
                }
            }
        ],
        result: [
            {
                stock: {},
                thesis: {},
                corp: {}
            }
        ],
        range: [
            {
                stock: {
                    field: "start_dttm_dt",
                    lte: "now/d",
                    format: "yyyyMMdd"
                },
                thesis: {
                    field: "publish_date_dt",
                    lte: "now/d",
                    format: "yyyy || yyyyMMdd"
                },
                corp: {
                    field: "fond_date_dt",
                    lte: "now/d"
                }
            }
        ]
    },
    body: {
        from: 0,
        size: 10,
        query: {
            bool: {
                must: [],
                filter: [],
                should: [],
            }
        },
        highlight: {
            fields: {},
        },
        sort: [],
        _source: []
    }
});