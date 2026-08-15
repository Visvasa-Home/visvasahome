import { lazy, ComponentType } from 'react';

/**
 * Helper to lazy load named exports.
 * Usage:
 * const MyComponent = lazyNamed(() => import('./MyComponent'), 'MyComponent');
 */
export function lazyNamed<T extends ComponentType<any> = ComponentType<any>>(
  importFn: () => Promise<Record<string, any>>,
  name: string
): ComponentType<any> {
  return lazy(() =>
    importFn().then((module) => {
      if (!module[name]) {
        throw new Error(`Named export "${name}" not found in module.`);
      }
      return { default: module[name] as T };
    })
  ) as any;
}

