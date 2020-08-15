import {CURRENT_LOCATION} from './types';

export function getCurrentLocation() {
  const pathname = location.pathname.split('/');
  switch (pathname[3]) {
    case 'discover':
      return CURRENT_LOCATION.DISCOVER;
    case 'issues':
      return CURRENT_LOCATION.ISSUES;
    default:
      return CURRENT_LOCATION.PERFORMANCE;
  }
}
