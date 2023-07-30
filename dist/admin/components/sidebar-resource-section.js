import React from 'react';
import { Navigation } from '@adminjs/design-system';
import { useTranslation, useNavigationResources } from 'adminjs';
const SidebarResourceSection = ({ resources }) => {
    const elements = useNavigationResources(resources);
    const { translateLabel } = useTranslation();
    const openUrl = (url) => () => {
        window.open(url, '_blank');
    };
    elements.unshift({
        icon: 'Truck',
        label: translateLabel('kanbanBoard'),
        onClick: openUrl('https://github.com/orgs/SoftwareBrothers/projects/5'),
    });
    elements.unshift({
        icon: 'PieChart',
        label: translateLabel('stats'),
        onClick: openUrl('https://stats.adminjs.co'),
    });
    return React.createElement(Navigation, { label: translateLabel('navigation'), elements: elements });
};
export default SidebarResourceSection;
