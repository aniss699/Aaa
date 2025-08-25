
export const paths = {
  home: '/',
  marketplace: '/marketplace',
  missions: '/missions',
  missionDetail: (id = ':id') => `/missions/${id}`,
  createMission: '/create-mission',
  availableProviders: '/available-providers',
  profile: '/profile',
  dashboard: '/dashboard',
  aiDashboard: '/ai-dashboard',
  aiFeatures: '/ai-features',
  aiTest: '/ai-test',
  features: '/features',
  messages: '/messages',
  legal: '/legal',
  notFound: '/404',
} as const;
