# VCMC Lite

Part of the **Free Vibe Coding Safety Tools** kit.

VCMC Lite is a press-T QA cockpit for vibe coders.

Add `qa-cockpit.js` to your project. Press **T** while your app is running. A cockpit opens on top of your build.

It helps you answer:

> "My AI says it fixed the bug. Did it actually fix it?"

Use VCMC Lite while the app is running, so QA is visible inside the build.

## Install

Copy `qa-cockpit.js` into your project.

Add this before `</body>`:

```html
<script src="qa-cockpit.js"></script>
<script>
  QACockpit.init({
    project: 'My Project',
    version: '1.0.0',
    devMode: true
  });
</script>
```

Open your app in a browser and press **T**.

## Critical Tab: Changelog

VCMC has a Changelog tab.

Use it to show what changed in the current build. This matters because AI can touch many files fast. The changelog keeps the build honest.

```html
<script>
  QACockpit.init({
    project: 'My Project',
    version: '1.2.0',
    devMode: true,
    changelog: [
      {
        version: '1.2.0',
        date: '2026-06-30',
        changes: [
          'Added checkout error handling',
          'Fixed mobile menu overlap',
          'Updated release gate checks'
        ]
      }
    ]
  });
</script>
```

The changelog also appears in **Copy Debug Report**, so your next AI chat can see what changed.

## Tabs

**Import**: paste an AI chat and pull out fixes, bugs, and open tasks.

**Checklist**: track what must work.

**Build Info**: show version, build date, FPS, last key, and live app state.

**Changelog**: show what changed in this build.

**Errors**: catch runtime errors.

**Navigation**: jump to important screens.

**Feature Flags**: turn risky features on and off.

**Performance**: watch FPS and app state.

**Release Gate**: decide if the build is ready or blocked.

## Full Example

```html
<script src="qa-cockpit.js"></script>
<script>
  QACockpit.init({
    project: 'My App',
    version: '1.0.0',
    buildDate: '2026-06-30',
    devMode: true,
    hotkey: 'T',

    changelog: [
      {
        version: '1.0.0',
        date: '2026-06-30',
        changes: [
          'Added the VCMC QA cockpit',
          'Added release gate checks'
        ]
      }
    ],

    items: [
      { id: 'login', label: 'Login works', version: '1.0.0', isNew: true },
      { id: 'checkout', label: 'Checkout completes', version: '1.0.0', isNew: true }
    ],

    gateItems: [
      { id: 'g-open', label: 'Project opens without errors' },
      { id: 'g-flow', label: 'Main flow works end to end' }
    ],

    navItems: [
      { id: 'home', label: 'HOME', action: () => { window.location.hash = '/'; } }
    ],

    getState: () => ({
      'Current page': window.location.hash || '/',
      'Logged in': !!localStorage.getItem('user')
    })
  });
</script>
```

## Keep It Out Of Production

Set `devMode` to `false` when you do not want the cockpit to show.

```js
devMode: window.location.hostname === 'localhost'
```

## License

MIT. Free to use in your projects.
