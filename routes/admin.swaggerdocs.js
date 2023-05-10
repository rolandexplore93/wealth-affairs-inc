const listClients = {
    tags: ['Admin'],
    summary: 'Get a list of all clients',
    description: 'List all registered clients',
    responses: {
        200: {
            description: 'Ok',
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
        500: {
            description: 'Internal server error',
        }
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
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        firstname: {
                            type: 'string',
                            description: 'Firstname of the staff',
                            example: 'Oroland'
                        },
                        middlename: {
                            type: 'string',
                            description: 'Middlename of the staff',
                            example: 'RollyJS'
                        },
                        lastname: {
                            type: 'string',
                            description: 'Lastname of the staff',
                            example: 'Oguns'
                        },
                        phoneno: {
                            type: 'string',
                            description: 'Staff phone number',
                            example: '02458612621'
                        },
                        role: {
                            type: 'string',
                            description: 'Staff role, whether FA, FC or RM',
                            example: 'RM'
                        },
                    }
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Ok',
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
                }
            }
        },
        409: {
            description: 'Conflict: Email or phone number already exists',
        },
        500: {
            description: 'Internal server error',
        }
    }

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
    }
};

module.exports = adminRoutesDocs;