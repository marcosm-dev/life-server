import { menu } from '../../src/admin/index.js';
import { useEnvironmentVariableToDisableActions } from '../../src/admin/features/useEnvironmentVariableToDisableActions.js';
import client, { dmmf } from '../config.js';
export const CreateUserResource = () => ({
    resource: {
        model: dmmf.modelMap.Post,
        client,
    },
    features: [useEnvironmentVariableToDisableActions()],
    options: {
        navigation: menu.prisma,
        properties: {
            content: { type: 'richtext' },
            someJson: { type: 'mixed', isArray: true },
            'someJson.number': { type: 'number' },
            'someJson.string': { type: 'string' },
            'someJson.boolean': { type: 'boolean' },
            'someJson.date': { type: 'datetime' },
        },
    },
});
