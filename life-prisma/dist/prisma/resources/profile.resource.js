import { menu } from 'src/admin/index.js';
import { useEnvironmentVariableToDisableActions } from 'src/admin/features/useEnvironmentVariableToDisableActions.js';
import { client, dmmf } from '../config.js';
export const CreateProfileResource = () => ({
    resource: {
        model: dmmf.modelMap.Profile,
        client,
    },
    features: [useEnvironmentVariableToDisableActions()],
    options: {
        navigation: menu.prisma,
    },
});
