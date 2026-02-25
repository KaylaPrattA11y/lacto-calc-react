import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * WAI-ARIA Tabs Pattern implementation
 * Spec: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * Keyboard:
 *  - ArrowLeft / ArrowRight (horizontal) or ArrowUp / ArrowDown (vertical) to move focus between tabs
 *  - Home: focus first enabled tab
 *  - End: focus last enabled tab
 *  - Enter/Space: activate focused tab in manual activation mode
 *  - In auto activation mode, focusing a tab also activates it
 */

export interface TabDefinition {
  id: string; // unique stable id (used to derive panel id)
  label: React.ReactNode; // tab label node
  content: React.ReactNode; // panel content node
  disabled?: boolean; // whether tab is disabled
}

type TabsOrientation = 'horizontal' | 'vertical';
type TabsActivationMode = 'auto' | 'manual';

export interface TabsController {
  activeId: string;
  setActiveId: (id: string) => void;
}

export interface TabsProps {
  tabs: TabDefinition[];
  initialActiveId?: string;
  orientation?: TabsOrientation; // default 'horizontal'
  activationMode?: TabsActivationMode; // default 'auto'
  tablistLabel?: string; // accessible label for the tablist
  className?: string; // wrapper class
  onChange?(id: string, index: number): void; // fired when active tab changes
  lazy?: boolean; // mount only active panel content when true
  controller?: TabsController; // optional external controller for programmatic tab changes
}

/**
 * Hook to create a controller for programmatically changing the active tab.
 * Pass the returned controller to the Tabs component's `controller` prop.
 * 
 * @param initialId - Initial active tab ID
 * @returns TabsController object with activeId and setActiveId
 * 
 * @example
 * const tabController = useTabsController('tab1');
 * 
 * // Later, change the active tab programmatically:
 * tabController.setActiveId('tab2');
 * 
 * <Tabs tabs={tabs} controller={tabController} />
 */
export function useTabsController(initialId: string = ''): TabsController {
  const [activeId, setActiveId] = useState<string>(initialId);
  
  return useMemo(() => ({ activeId, setActiveId }), [activeId]);
}

interface InternalTabMeta {
  id: string;
  panelId: string;
  disabled?: boolean;
}

const isEnabled = (t: TabDefinition) => !t.disabled;

export default function Tabs({
  tabs,
  initialActiveId,
  orientation = 'horizontal',
  activationMode = 'auto',
  tablistLabel = 'Tabs',
  className = '',
  onChange,
  lazy = false,
  controller,
}: TabsProps) {
  // Build meta (stable memoization to avoid re-renders on content changes)
  const meta: InternalTabMeta[] = useMemo(
    () =>
      tabs.map(t => ({
        id: t.id,
        panelId: `${t.id}-panel`,
        disabled: t.disabled,
      })),
    [tabs],
  );

  // Determine initial active tab id (must be enabled). Fallback to first enabled.
  const initialActive = useMemo(() => {
    if (controller?.activeId) return controller.activeId;
    if (initialActiveId) {
      const target = tabs.find(t => t.id === initialActiveId && isEnabled(t));
      if (target) return target.id;
    }
    const firstEnabled = tabs.find(isEnabled);
    return firstEnabled ? firstEnabled.id : tabs[0]?.id; // may be disabled; edge case
  }, [initialActiveId, tabs, controller?.activeId]);

  const [internalActiveId, setInternalActiveId] = useState<string>(initialActive || '');
  
  // Use controller's activeId if provided, otherwise use internal state
  const activeId = controller?.activeId ?? internalActiveId;
  const setActiveId = controller?.setActiveId ?? setInternalActiveId;
  const [focusIndex, setFocusIndex] = useState<number>(() => meta.findIndex(m => m.id === activeId));

  // Keep focusIndex aligned with activeId if active tab changes externally
  useEffect(() => {
    const idx = meta.findIndex(m => m.id === activeId);
    if (idx >= 0 && idx !== focusIndex) setFocusIndex(idx);
  }, [activeId, meta, focusIndex]);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTabAt = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= meta.length) return;
      const item = tabs[idx];
      if (item?.disabled) return; // skip disabled focus
      setFocusIndex(idx);
      // Roving tabindex: only the focused tab has tabindex 0, others -1
      // Activation mode 'auto' triggers activation when focus changes.
      if (activationMode === 'auto') {
        setActiveId(item.id);
        if (onChange) onChange(item.id, idx);
      }
      // Move DOM focus
      requestAnimationFrame(() => {
        tabRefs.current[idx]?.focus();
      });
    },
    [meta.length, activationMode, tabs, onChange, setActiveId],
  );

  const activateFocused = useCallback(
    (idx: number) => {
      const item = tabs[idx];
      if (!item || item.disabled) return;
      setActiveId(item.id);
      if (onChange) onChange(item.id, idx);
    },
    [tabs, onChange, setActiveId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const { key } = e;
      const lastIdx = meta.length - 1;
      let handled = false;

      const isHorizontal = orientation === 'horizontal';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      if (key === prevKey) {
        // move to previous enabled
        for (let i = focusIndex - 1; i >= 0; i--) {
          if (isEnabled(tabs[i])) {
            focusTabAt(i);
            break;
          }
        }
        handled = true;
      } else if (key === nextKey) {
        for (let i = focusIndex + 1; i <= lastIdx; i++) {
          if (isEnabled(tabs[i])) {
            focusTabAt(i);
            break;
          }
        }
        handled = true;
      } else if (key === 'Home') {
        for (let i = 0; i < meta.length; i++) {
          if (isEnabled(tabs[i])) {
            focusTabAt(i);
            break;
          }
        }
        handled = true;
      } else if (key === 'End') {
        for (let i = lastIdx; i >= 0; i--) {
          if (isEnabled(tabs[i])) {
            focusTabAt(i);
            break;
          }
        }
        handled = true;
      } else if (activationMode === 'manual' && (key === 'Enter' || key === ' ')) {
        activateFocused(focusIndex);
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [focusIndex, meta.length, orientation, activationMode, tabs, focusTabAt, activateFocused],
  );

  // When activeId changes (manual mode), ensure focusIndex matches if auto activation not used
  useEffect(() => {
    if (activationMode === 'manual') {
      const idx = meta.findIndex(m => m.id === activeId);
      if (idx >= 0) setFocusIndex(idx);
    }
  }, [activeId, activationMode, meta]);

  // Provide derived booleans
  const activeIndex = meta.findIndex(m => m.id === activeId);

  return (
    <div
      className={[className, 'tabs', orientation === 'vertical' ? 'is-vertical' : 'is-horizontal']
        .filter(Boolean)
        .join(' ')}>
      <div
        role="tablist"
        tabIndex={0}
        aria-orientation={orientation}
        aria-label={tablistLabel}
        className="tabs--tablist"
        onKeyDown={handleKeyDown}>
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIndex;
          const isFocused = idx === focusIndex; // roving tabindex
          const metaItem = meta[idx];
          return (
            <button
              key={tab.id}
              ref={el => {
                tabRefs.current[idx] = el;
              }}
              id={metaItem.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={metaItem.panelId}
              aria-disabled={tab.disabled || undefined}
              tabIndex={isFocused ? 0 : -1}
              className={['tabs--tab', isActive ? 'is-active' : '', tab.disabled ? 'is-disabled' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (tab.disabled) return;
                if (activationMode === 'manual') {
                  // click activates immediately
                  activateFocused(idx);
                } else {
                  focusTabAt(idx);
                }
              }}
              onFocus={() => {
                if (activationMode === 'auto') {
                  focusTabAt(idx);
                } else {
                  // just move focus index
                  setFocusIndex(idx);
                }
              }}>
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="tabs--tabpanels">
        {tabs.map((tab, idx) => {
          const { panelId, id } = meta[idx];
          const isActive = tab.id === activeId;
          if (lazy && !isActive) {
            return null;
          }
          return (
            <div
              key={panelId}
              id={panelId}
              role="tabpanel"
              aria-labelledby={id}
              hidden={!isActive}
              className={['tabs--tabpanel', isActive ? 'is-active' : 'is-hidden'].join(' ')}>
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
