const listClients = {
    tags: ['Admin'],
    summary: 'Get a list of all clients',
    description: 'List all registered clients',
    operationId: 'getClients',
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            count: 1,
                            allClients: [
                                {
                                    "investmentPreferences": {
                                      "riskLevel": null,
                                      "productTypes": [],
                                      "industries": [],
                                      "countries": [],
                                      "regions": []
                                    },
                                    "_id": "64592fba6",
                                    "firstname": "Ife1",
                                    "middlename": "Mary",
                                    "lastname": "Oguns",
                                    "email": "imo@g.com",
                                    "phoneNo": "",
                                    "country": "",
                                    "relationshipManager": null,
                                    "isRMAssigned": false,
                                    "isPreferencesSet": false,
                                    "createdAt": "2023-05-08T17:22:02.735Z",
                                    "updatedAt": "2023-05-10T09:07:35.532Z",
                                  }
                            ]
                        },
                    },
                }
            }
        },
        500: { description: 'Internal server error' }
    }
};

const listStaff = {
    tags: ['Admin'],
    summary: 'list all staff users',
    description: 'List all staff',
    responses: {
        200: {
            description: 'Ok',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            message: "Staff list displayed below",
                            staffList: [
                                {
                                "_id": "64566f",
                                "firstname": "Orobola",
                                "middlename": "Roland",
                                "lastname": "Ogundipe",
                                "email": "oro621@wealthaffairs.com",
                                "phoneNo": "074895621",
                                "role": "Relationship Manager",
                                "creator": "Admin",
                                "createdAt": "2023-05-06T15:17:28.148Z",
                                "updatedAt": "2023-05-06T18:23:46.456Z",
                                }
                            ]
                        },
                    },
                }
            }
        },
        500: {
            description: 'Internal server error',
        }
    }
};

const createUser = {
    tags: ['Admin'],
    summary: 'Create staff (FA, FC, RM) account',
    description: 'Create staff account',
    operationId: 'createUser',
    requestBody: {
        description: 'Create a new staff profile',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/staff'
                    // type: 'object',
                    // properties: {
                    //     firstname: {
                    //         type: 'string',
                    //         description: 'Firstname of the staff',
                    //         example: 'Oroland'
                    //     },
                    //     middlename: {
                    //         type: 'string',
                    //         description: 'Middlename of the staff',
                    //         example: 'RollyJS'
                    //     },
                    //     lastname: {
                    //         type: 'string',
                    //         description: 'Lastname of the staff',
                    //         example: 'Oguns'
                    //     },
                    //     phoneno: {
                    //         type: 'string',
                    //         description: 'Staff phone number',
                    //         example: '02458612621'
                    //     },
                    //     role: {
                    //         type: 'string',
                    //         description: 'Staff role, whether FA, FC or RM',
                    //         example: 'RM'
                    //     },
                    // }
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
                            message: "Staff created successfully.",
                            password: 'staffPassword (Note: When live, only authorised admin can create staff user and receive the auto generated password and email. This is revealed for testing purpose).',
                            staffAddedToDb: [
                                {
                                    "_id": "645bc9f1862a73aace1c5dde",
                                    "firstname": "Oroland",
                                    "middlename": "RollyJS",
                                    "lastname": "Oguns",
                                    "email": "oro210@wealthaffairs.com",
                                    "phoneNo": "0748956210",
                                    "role": "Relationship Manager",
                                    "creator": "Admin",
                                }
                            ]
                        },
                    },
                },
            },
        },
        409: {
            description: 'Conflict: Email or phone number already exists',
        },
        500: {
            description: 'Internal server error',
        }
    },
    // security: [
    //     api_key: []
    // ]

};

const getStaffUserById = {
    tags: ['Admin'],
    summary: 'Get a staff details from path ID',
    description: 'Get a staff details',
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'staff id',
            type: 'string',
            example: '645bc9f1862a73aace1c5dde'
        }
    ],
    responses: {
        200: {
            description: 'Ok',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            staffInfo: [
                                {
                                    "_id": "645bc9f1862a73aace1c5dde",
                                    "firstname": "Oroland",
                                    "middlename": "RollyJS",
                                    "lastname": "Oguns",
                                    "email": "oro210@wealthaffairs.com",
                                    "phoneNo": "0748956210",
                                    "role": "Relationship Manager",
                                    "creator": "Admin",
                                }
                            ]
                        },
                    },
                }
            }
        },
        404: {
            description: 'Staff not found',
        },
        500: {
            description: 'Internal server error',
        }
    }
};

const adminRoutesDocs = {
    '/auth/clients': {
        get: listClients,
    },
    '/auth/staff': {
        get: listStaff,
    },
    '/auth/staff/{id}': {
        get: getStaffUserById,
    },
    '/auth/register-staff': {
        post: createUser
    },
    // Components configuration
    schemas: {
        staff: {
            required: ['firstname', 'lastname', 'phoneno', 'role'],
            type: 'object',
            properties: {
                firstname: {
                    type: 'string',
                    description: 'Staff firstname',
                    example: 'Orobola'
                },
                middlename: {
                    type: 'string',
                    description: 'Staff middlename',
                    example: 'RollyJS'
                },
                lastname: {
                    type: 'string',
                    description: 'Staff lastname',
                    example: 'Oguns'
                },
                phoneno: {
                    type: 'string',
                    description: 'Staff phone number',
                    example: '02458612621'
                },
                role: {
                    type: 'string',
                    description: 'Staff role (FA, FC, RM)',
                    example: 'RM',
                    enum: ['FA', 'FC', 'RM']
                    // enum: ['Pending', 'Approved', 'Rejected']
                },
            }
        },
        investment: {
            required: ['investmentDisplayName', 'investmentName', 'primaryAssetType', 
            'industry', 'country', 'region', 'issuer', 'stockExchange', 'currency', 'unit', 'closingPrice',
            'priceClosingDate', 'maturityDate', 'riskLevel', 'createdByStaff'],
            type: 'object',
            properties: {
                investmentDisplayName: {
                    type: 'string',
                    example: 'AWS'
                },
                investmentName: {
                    type: 'string',
                    example: 'Amazon Web Services'
                },
                primaryAssetType: {
                    type: 'string',
                    example: 'Bonds'
                },
                secondaryAssetType: {
                    type: 'string',
                    example: 'Convertible Bond'
                },
                industry: {
                    type: 'string',
                    example: 'Technology'
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
                    example: 'AWS2023X1'
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
                    type: 'Number',
                    example: '2'
                },
                closingPrice: {
                    type: 'Number',
                    example: '200.25'
                },
                priceClosingDate: {
                    type: 'Date',
                    example: '15/08/2023'
                },
                maturityDate: {
                    type: 'Date',
                    example: '15/12/2023'
                },
                coupon: {
                    type: 'string',
                    example: 'Og22u5'
                },
                riskLevel: {
                    type: 'Number',
                    example: '1'
                },
                createdByStaff: {
                    type: 'string',
                    example: 'RM',
                    enum: ['FA1', 'FC1', 'RM1', 'FA2', 'FC2', 'RM2']
                },
            }
        },
    //     investmentDisplayName: { type: String, required: true },
    // investmentName: { type: String, required: true },
    // primaryAssetType: { type: String, required: true },
    // secondaryAssetType: { type: String, default: '' },
    // industry: { type: String, required: true },
    // country: { type: String, required: true },
    // region: { type: String, required: true },
    // issuer: { type: String, required: true },
    // stockExchange: { type: String, required: true },
    // currency: { type: String, required: true },
    // unit: { type: Number, required: true },
    // closingPrice: { type: Number, required: true },
    // priceClosingDate: { type: Date, required: true },
    // maturityDate: { type: Date, required: true },
    // coupon: [{ type: String }],
    // riskLevel: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    // riskLevelBrief: { type: String },
    // riskLevelDescription: { type: String },
    // status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    // createdByStaff: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    // decidedByStaff: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
        securitySchemes: {
            wa_auth: {
                type: 'Bearer',
                flow: {
                    implicit: {
                        authorizationUrl: '',
                        scopes: {
                            write: {
                                admin: {
                                    // 'Modify accpount'
                                }
                            }
                        }
                    }
                }
            },
            // api_key: {
            //     // type: apiKey,
            //     name: api_key,
            //     in: header
            // }
        }
    }
};

module.exports = adminRoutesDocs;