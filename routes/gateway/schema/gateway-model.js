export const getOpenqueryConfig = async () => {
    return {
        index: '.openquery',
        body: {
            size: 10,
            from: 0,
            query: {
                term: {
                }
            }
        },
    };
};

export const getPopqueryConfig = async () => {
    return {
        index: '.openquery-popquery',
        body: {
            size: 1,
            query: {
                term: {
                    label: {},
                },
            },
            sort: [
                {
                    timestamp: {
                        order: 'desc',
                    },
                },
            ],
            _source: ['popqueryJSON', 'timestamp'],
        },
    };
};

export const getHotqueryConfig = async () => {
    return {
        index: '.openquery-popquery',
        body: {
            size: 1,
            query: {
                term: {
                    label: {},
                },
            },
            sort: [
                {
                    timestamp: {
                        order: 'desc'
                    }
                }
            ],
            _source: ['hotqueryJSON', 'timestamp'],
        },
    };
};

export const getAutocompleteConfig = async (params) => {
    return {
        index: `.openquery-autocomplete_${params.label}`,
        body: {
            size: 1,
            query: {
                multi_match: {
                    query: "",
                    fields: [],
                },
            },
            highlight: {
                fields: {},
            },
            sort: {},
        },
    };
};

