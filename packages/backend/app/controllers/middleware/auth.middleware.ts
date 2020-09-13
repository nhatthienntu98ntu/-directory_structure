import { Request, Response, NextFunction } from 'express';
// import * as firebaseAdmin from 'firebase-admin';
// import database from '../../models';
import { CommonResponse } from './../helper/commonResponse';
// import { Models } from '../../models/generic.model';

const roleRanks = {
    superAdmin: 1,
    admin: 2,
    user: 3,
};

export class AuthMiddleWare {
    private commonResponse: CommonResponse = new CommonResponse();
    // private accountDb = Models.Account;

    decodeFirebaseIdToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // console.log('auth request: ', req.headers.authorization);
        // console.log('auth request type: ', req.headers.authorizationtype);
        if (!req.headers.authorization) {
            this.commonResponse.badRequest(res, {
                message: 'You did not specify any idToken for this request',
            });
        }

        try {
            if (req.headers.authorizationtype === 'system') {
                // const existingAccount = await this.accountDb.findOne({ 'token': req.headers.authorization });
                // if (existingAccount) {
                next();
                // } else {
                //   this.commonResponse.badRequest(res, { message: 'You did not specify any idToken for this request' });
                // }
            } else {
                // const userPayload = await firebaseAdmin.auth().verifyIdToken(req.headers.authorization);
                // req.user = userPayload;

                // console.log('------ user payload -------', userPayload);
                next();
            }
        } catch (error) {
            /**
             * Specifically re-authenticate a user if the id token expired, this is to fix a few bugs on the front-end
             */
            const errorCode = error.errorInfo.code;
            const errorMessage = error.errorInfo.message;
            if (
                errorCode === 'auth/argument-error' &&
                errorMessage ===
                    'Firebase ID token has expired. Get a fresh token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.' &&
                req.headers.header_token
            ) {
                try {
                    // const userPayload = await firebaseAdmin.auth().verifyIdToken(req.headers.header_token);

                    // req.user = userPayload;

                    next();
                } catch (error) {
                    this.commonResponse.serverErrorResponse(res, error);
                }
            } else {
                this.commonResponse.serverErrorResponse(res, error);
            }
        } finally {
            // Return final error
        }
    };

    /**
     * hasAdminPermission checks if the user has the right admin right
     *
     * @param {Object} req the request object
     * @param {Object} res the response object
     * @param {Function} next the callback function
     *
     * @returns {Object} validity response
     */
    isAuthorized = async (req, res, next) => {
        if (req.user) {
            next();
        } else {
            return this.commonResponse.unAuthorizedRequest(res, {
                data:
                    'You are not authorized to perform this action. SignUp/Login to continue',
            });
        }
    };
}

/**
 * hasAdminPermission checks if the user has the right admin right
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} validity response
 */
// export const hasAdminRole = async (req, res, next) => {
//   const role = await database.Role.findOne({ where: { id: req.user.roleId } });

//   if (role.rank <= roleRanks.admin) {
//     next();
//   } else {
//     return commonResponse.forbiddenResponse(res, { data: 'You are not allowed access to this route' });
//   }
// };

/**
 * hasSuperPermission checks if the user has the right super admin right
 *
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} validity response
 */
// export const hasSuperAdminRole = async (req, res, next) => {
//   const role = await database.Role.findOne({ where: { id: req.user.roleId } });

//   if (role.rank === roleRanks.superAdmin) {
//     next();
//   } else {
//     return commonResponse.forbiddenResponse(res, { data: 'You are not allowed access to this route' });
//   }
// };
