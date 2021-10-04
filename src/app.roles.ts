import {RolesBuilder} from "nest-access-control"

export enum AppRoles{
    AUTHOR = 'AUTHOR',
    ADMIN = 'ADMIN'
}

export enum AppResource{
    USER = 'USER',
    POST = 'POST'
}

export const roles: RolesBuilder = new RolesBuilder();
roles
    // author roles
    .grant(AppRoles.AUTHOR)
    .updateOwn([AppResource.USER])
    .deleteOwn([AppResource.USER])
    .createOwn([AppResource.POST])
    .updateOwn([AppResource.POST])
    .deleteOwn([AppResource.POST])
    // admin roles
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.AUTHOR)
    .createAny([AppResource.USER])
    .updateAny([AppResource.POST, AppResource.USER])
    .deleteAny([AppResource.POST, AppResource.USER])