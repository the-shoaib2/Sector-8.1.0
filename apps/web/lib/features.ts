export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  defaultValue: boolean;
  requiresAdmin?: boolean;
};

export const GROUP_FEATURES = {
  join_requests: {
    id: 'join_requests',
    name: 'Join Requests',
    description: 'Require approval for new members to join',
    defaultValue: false,
    requiresAdmin: true,
  },
  messages: {
    id: 'messages',
    name: 'Group Messages',
    description: 'Enable group chat functionality',
    defaultValue: true,
    requiresAdmin: false,
  },
  announcements: {
    id: 'announcements',
    name: 'Announcements',
    description: 'Allow admins to post announcements',
    defaultValue: true,
    requiresAdmin: true,
  },
  member_roles: {
    id: 'member_roles',
    name: 'Member Roles',
    description: 'Enable custom member roles and permissions',
    defaultValue: true,
    requiresAdmin: true,
  },
  activity_log: {
    id: 'activity_log',
    name: 'Activity Log',
    description: 'Track and display group activities',
    defaultValue: true,
    requiresAdmin: true,
  },
  shopping_list: {
    id: 'shopping_list',
    name: 'Shopping List',
    description: 'Enable group shopping list functionality',
    defaultValue: true,
    requiresAdmin: false,
  },
  meal_planning: {
    id: 'meal_planning',
    name: 'Meal Planning',
    description: 'Enable meal planning and tracking',
    defaultValue: true,
    requiresAdmin: false,
  },
  payments: {
    id: 'payments',
    name: 'Payments',
    description: 'Enable payment tracking and management',
    defaultValue: true,
    requiresAdmin: true,
  },
} as const;

export type GroupFeature = keyof typeof GROUP_FEATURES;

export const GROUP_CATEGORIES = [
  'Food & Cooking',
  'Study',
  'Work',
  'Social',
  'Hobby',
  'Sports',
  'Travel',
  'Other'
] as const;

export type GroupCategory = typeof GROUP_CATEGORIES[number];

export const GROUP_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Budget',
  'Premium',
  'Family',
  'Students',
  'Professionals',
  'Local',
  'International'
] as const;

export type GroupTag = typeof GROUP_TAGS[number];

export function getDefaultFeatures(): Record<string, boolean> {
  return Object.values(GROUP_FEATURES).reduce((acc, feature) => ({
    ...acc,
    [feature.id]: feature.defaultValue
  }), {});
}

export function validateFeatures(features: Record<string, boolean>): boolean {
  return Object.keys(features).every(key => key in GROUP_FEATURES);
}

export function getEnabledFeatures(features: Record<string, boolean>): string[] {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([id]) => id);
}

export function isFeatureEnabled(
  features: Record<string, boolean> | undefined,
  featureId: GroupFeature,
  isAdmin: boolean = false
): boolean {
  if (!features) return GROUP_FEATURES[featureId].defaultValue;
  if (GROUP_FEATURES[featureId].requiresAdmin && !isAdmin) return false;
  return features[featureId] ?? GROUP_FEATURES[featureId].defaultValue;
} 