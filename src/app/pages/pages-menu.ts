import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Algemeen',
    group: true,
  },
  {
    title: 'Projecten',
    icon: 'book-open',
    link: '/pages/groups',
  },
  {
    title: 'Projecten archief',
    icon: 'archive-outline',
    link: '/pages/group-archive',
  },
  {
    title: 'Huisaansluitingen',
    icon: 'home-outline',
    link: '/pages/object-list/projects',
  },
  {
    title: 'Kolken',
    icon: 'film-outline',
    link: '/pages/object-list/slokkerprojects',
  },
  {
    title: 'Wachtaansluitingen',
    icon: 'home-outline',
    link: '/pages/object-list/wachtaansluitingen',
  },
  {
    title: 'Onvoorziene werken',
    icon: 'folder-outline',
    link: '/pages/object-list/meerwerken',
  },
  {
    title: 'Gebruikers',
    group: true,
  },
  {
    title: 'Gebruikers',
    icon: 'people-outline',
    link: '/pages/users',
  },
  {
    title: 'Gebruiker toevoegen',
    icon: 'plus-square-outline',
    link: '/pages/users/user-create',
  },
  {
    title: 'Instellingen',
    group: true,
  },
  {
    title: 'Logo instellen',
    icon: 'camera-outline',
    link: '/pages/settings',
  },
  {
    title: 'Statistieken',
    group: true,
  },
  {
    title: 'Statistieken',
    icon: 'activity-outline',
    link: '/pages/statistics',
  },
];
