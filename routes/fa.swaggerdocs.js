const createInvestment = {
    tags: ['Fund Administrator'],
    summary: 'create an investment',
    description: 'create an investment by FA',
    operationId: 'createInvestment',
    security: [
        {
            wealthAffairsAuth: [
                "write:data"
            ]
        }
    ],
    requestBody: {
        description: 'Details about the investment',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/createInvestment'
                }
            }
        },
        required: true
    },
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            message: 'Investment has been created...',
                            createdInvestment: {},
                        }
                    }
                }
            }
        },
        400: { description: 'Complete all fields.' },
        401: { description: 'Not authorized.' },
        500: { description: 'Server error. Please try again.' }
    }
};

const allInvestments = {
    tags: ['Fund Administrator'],
    summary: 'View all investments',
    description: 'View all investments created by FA',
    operationId: 'allInvestments',
    security: [
        {
            wealthAffairsAuth: [
                "read:data"
            ]
        }
    ],
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            investments: {}
                        },
                    },
                }
            }
        },
        404: { description: 'Not found' },
        500: { description: 'Internal server error' }
    },
};

const approvedInvestments = {
    tags: ['Fund Administrator'],
    summary: 'View all approved investments',
    description: 'View all approved investments',
    operationId: 'approvedInvestments',
    security: [
        {
            wealthAffairsAuth: [
                "read:data"
            ]
        }
    ],
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            approvedInvestments: {}
                        },
                    },
                }
            }
        },
        404: { description: 'Not found' },
        500: { description: 'Internal server error' }
    },
};

const pendingInvestments = {
    tags: ['Fund Administrator'],
    summary: 'View all pending investments',
    description: 'View all pending investments',
    operationId: 'pendingInvestments',
    security: [
        {
            wealthAffairsAuth: [
                "read:data"
            ]
        }
    ],
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            pendingInvestments: {}
                        },
                    },
                }
            }
        },
        404: { description: 'Not found' },
        500: { description: 'Internal server error' }
    },
};

const rejectedInvestments = {
    tags: ['Fund Administrator'],
    summary: 'View all rejected investments',
    description: 'View all rejected investments',
    operationId: 'rejectedInvestments',
    security: [
        {
            wealthAffairsAuth: [
                "read:data"
            ]
        }
    ],
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            rejectedInvestments: {}
                        },
                    },
                }
            }
        },
        404: { description: 'Not found' },
        500: { description: 'Internal server error' }
    },
};

const faRoutesDoc = {
    '/create-investment': {
        post: createInvestment
    },
    '/investments': {
        get: allInvestments
    },
    '/approved-investments': {
        get: approvedInvestments
    },
    '/pending-investments': {
        get: pendingInvestments
    },
    '/rejected-investments': {
        get: rejectedInvestments
    },

    // Components configuration
    schemas: {
        createInvestment: {
            required: ['investmentDisplayName', 'investmentName', 'primaryAssetType', 'industry', 
            'country', 'region', 'issuer', 'stockExchange', 'currency',
            'unit', 'closingPrice', 'priceClosingDate', 'maturityDate', 'riskLevel'],
            type: 'object',
            properties: {
                investmentDisplayName: {
                    type: 'string',
                    example: 'ACS'
                },
                investmentName: {
                    type: 'string',
                    example: 'Amazon Cloud Services'
                },
                primaryAssetType: {
                    type: 'string',
                    example: 'Equities'
                },
                secondaryAssetType: {
                    type: 'string',
                    example: 'Exchange-Traded Fund'
                },
                industry: {
                    type: 'string',
                    example: 'Software & IT Services'
                },
                country: {
                    type: 'string',
                    example: 'United States'
                },
                region: {
                    type: 'string',
                    example: 'North America'
                },
                issuer: {
                    type: 'string',
                    example: 'Amazon Groups'
                },
                stockExchange: {
                    type: 'string',
                    example: 'NYSE'
                },
                currency: {
                    type: 'string',
                    example: 'USD'
                },
                unit: {
                    type: 'number',
                    example: '1'
                },
                closingPrice: {
                    type: 'number',
                    example: '12'
                },
                priceClosingDate: {
                    type: 'string',
                    format: 'date',
                    example: '20/aug/2023'
                },
                maturityDate: {
                    type: 'string',
                    format: 'date',
                    example: '20/dec/2023'
                },
                coupon: {
                    type: 'string',
                    example: 'ACS12xc04'
                },
                riskLevel: {
                    type: 'Number',
                    example: '2'
                },
                riskLevelBrief: {
                    type: 'string',
                    example: 'Suitable for conservative investors'
                },
                riskLevelDescription: {
                    type: 'string',
                    example: 'Investors who hope to experience no more than small portfolio losses over a rolling one-year period and are generally only willing to buy investments that are priced frequently and have a high certainty of being able to sell quickly (less than a week) although the investor may at times buy individual investments that entail greater risk.'
                },
                status: {
                    type: 'string',
                    example: 'PENDING'
                },
                createdByStaff: {
                    type: 'string',
                    example: '6459076206610127ecd5cae8'
                },
                decidedByStaff: {
                    type: 'string',
                    example: '2258676206610127ecd5nbg6'
                }
            }
        }
    }
}

module.exports = faRoutesDoc