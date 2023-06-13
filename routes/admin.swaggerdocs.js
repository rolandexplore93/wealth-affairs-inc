const loginAdmin = {
    tags: ['Admin'],
    summary: 'Authenticate admin into the system',
    description: 'Admin is authenticated to perform designated activities',
    operationId: 'loginAdmin',
    requestBody: {
        description: 'Admin login details',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/admin'
                }
            }
        },
        required: true
    },
    responses: {
        200: {
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            message: 'Login successful...',
                            loginToken: 'hbdjkns2yy27bxs013u. (Token is valid for 2 minutes)'
                        }
                    }
                }
            }
        },
        401: { description: 'Invalid credentials. Please, enter correct username and password.' },
        500: { description: 'Server error. Please try again.' }
    }
};

const logoutAdmin = {
    tags: ['Admin'],
    summary: 'Logout admin',
    description: 'This endpoint logs admin out of the platform',
    operationId: 'logoutAdmin',
    requestBody: {},

};

const createStaffUser = {
    tags: ['Admin'],
    summary: 'Create staff (FA, FC, RM) account',
    description: 'Create staff account',
    operationId: 'createStaffUser',
    requestBody: {
        description: 'Create a new staff profile',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/staff'
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
        404: {
            description: 'Staff role is not assigned',
        },
        409: {
            description: 'Conflict: Email or phone number already exists',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "create:data", 
                // "read:data", 
                // "write:data", 
                // "delete:data"
            ]
        }
    ]
};

const getAllStaff = {
    tags: ['Admin'],
    summary: 'list all staff users',
    description: 'List all staff',
    operationId: 'getAllStaff',
    responses: {
        200: {
            description: 'Successful operation',
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
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
            ]
        }
    ]
};

const getStaffById = {
    tags: ['Admin'],
    summary: 'Get a staff details by ID',
    description: 'Get a staff details',
    operationId: 'getStaffById',
    parameters: [
        {
            name: 'staffId',
            in: 'path',
            description: 'Id of the staff to return',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
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
        400: {
            description: 'Invalid Staff ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Staff not found',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
            ]
        }
    ]
};

const editStaff = {
    tags: ['Admin'],
    summary: 'Update staff',
    description: 'Admin can modify staff data only when they are logged in',
    operationId: 'editStaff',
    parameters: [
        {
            name: 'staffId',
            in: 'path',
            description: 'Id of the staff to update',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
        }
    ],
    requestBody: {
        description: 'Update an existing staff profile',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/staff'
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
        400: {
            description: 'Invalid Staff ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Staff ID does not exist',
        },
        409: {
            description: 'Conflict: Email or phone number already exists',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
                "write:data", 
            ]
        }
    ]
};

const deleteStaff = {
    tags: ['Admin'],
    summary: 'Delete a staff',
    description: 'Delete a staff by ID',
    operationId: 'deleteStaff',
    parameters: [
        {
            name: 'staffId',
            in: 'path',
            description: 'Id of the staff to delete',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
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
        400: {
            description: 'Invalid Staff ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Staff not found',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
                "delete:data"
            ]
        }
    ]
}

const getClients = {
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
    },
    security: [
        {
            wealthAffairsAuth: [
                // "create:data", 
                "read:data", 
                // "write:data", 
                // "delete:data"
            ]
        }
    ]
};

const getClientById = {
    tags: ['Admin'],
    summary: 'Get a client details by ID',
    description: 'Get a client details',
    operationId: 'getClientById',
    parameters: [
        {
            name: 'clientId',
            in: 'path',
            description: 'Id of the client to return',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
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
                            staffInfo: [
                                {
                                    "_id": "645bc9f1862a73aace1c5dde",
                                    "firstname": "Client information",
                                    // "middlename": "RollyJS",
                                    // "lastname": "Oguns",
                                    // "email": "oro210@wealthaffairs.com",
                                    // "phoneNo": "0748956210",
                                    // "role": "Relationship Manager",
                                    // "creator": "Admin",
                                }
                            ]
                        },
                    },
                }
            }
        },
        400: {
            description: 'Invalid Client ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Client not found',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
            ]
        }
    ]
};

const editClient = {
    tags: ['Admin'],
    summary: 'Update client',
    description: 'Admin can modify client data only when they are logged in',
    operationId: 'editClient',
    parameters: [
        {
            name: 'clientId',
            in: 'path',
            description: 'Id of the client to update',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
        }
    ],
    requestBody: {
        description: 'Update an existing client profile',
        content: {
            'application/json': {
                schema: {
                    $ref: '#components/schemas/client'
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
                            message: "Client profile updated successfully.",
                            profileUpdated: [
                                {
                                    "_id": "645bc9f1862a73aace1c5dde",
                                    "firstname": "client details",
                                    // "middlename": "RollyJS",
                                    // "lastname": "Oguns",
                                    // "email": "oro210@wealthaffairs.com",
                                    // "phoneNo": "0748956210",
                                    // "role": "Relationship Manager",
                                    // "creator": "Admin",
                                }
                            ]
                        },
                    },
                },
            },
        },
        400: {
            description: 'Invalid Client ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Client ID does not exist',
        },
        409: {
            description: 'Conflict: Email or phone number already exists',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
                "write:data", 
            ]
        }
    ]
};

const deleteClient = {
    tags: ['Admin'],
    summary: 'Delete a client',
    description: 'Delete a client by ID',
    operationId: 'deleteClient',
    parameters: [
        {
            name: 'clientId',
            in: 'path',
            description: 'Id of the client to delete',
            required: true,
            schema: {
                type: 'string',
                example: '645bc9f1862a73aace1c5dde'
            }
        }
    ],
    responses: {
        200: {
            description: 'Successful operation',
        },
        400: {
            description: 'Invalid Client ID',
        },
        401: {
            description: 'Not authorized',
        },
        404: {
            description: 'Client not found',
        },
        500: {
            description: 'Internal server error',
        }
    },
    security: [
        {
            wealthAffairsAuth: [
                "read:data", 
                "delete:data"
            ]
        }
    ]
};




const adminRoutesDocs = {
    '/loginAdmin': {
        post: loginAdmin,
    },
    '/logoutAdmin': {
        post: logoutAdmin
    },
    '/auth/register-staff': {
        post: createStaffUser
    },
    '/auth/staff': {
        get: getAllStaff,
    },
    '/auth/staff/{staffId}': {
        get: getStaffById,
        patch: editStaff,
        delete: deleteStaff
    },
    '/auth/clients': {
        get: getClients
    },
    '/auth/clients/{clientId}': {
        get: getClientById,
        patch: editClient,
        delete: deleteClient
    },

    // Components configuration
    schemas: {
        admin: {
            required: ['username', 'password'],
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: 'rolly'
                },
                password: {
                    type: 'string',
                    example: 'rolly'
                }
            }
        },
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
    }
};

module.exports = adminRoutesDocs;



// bearerAuth: ['']
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


// schema: {
//     $ref: '#components/schemas/staff'
//     // type: 'object',
//     // properties: {
//     //     firstname: {
//     //         type: 'string',
//     //         description: 'Firstname of the staff',
//     //         example: 'Oroland'
//     //     },
//     //     middlename: {
//     //         type: 'string',
//     //         description: 'Middlename of the staff',
//     //         example: 'RollyJS'
//     //     },
//     //     lastname: {
//     //         type: 'string',
//     //         description: 'Lastname of the staff',
//     //         example: 'Oguns'
//     //     },
//     //     phoneno: {
//     //         type: 'string',
//     //         description: 'Staff phone number',
//     //         example: '02458612621'
//     //     },
//     //     role: {
//     //         type: 'string',
//     //         description: 'Staff role, whether FA, FC or RM',
//     //         example: 'RM'
//     //     },
//     // }
// }