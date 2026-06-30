/*!
 * VCMC Lite v1.0.0
 * https://github.com/vincentjkessler/vibe-coder-master-control-lite
 * MIT License (c) Vincent J. Kessler
 *
 * A dev-only tabbed QA overlay for any web or Electron project.
 * Zero dependencies. One script tag. Works everywhere.
 *
 * Quick start:
 *   QACockpit.init({
 *     project: 'My App',
 *     version: '1.0.0',
 *     items: [
 *       { id: 'login', label: 'Login flow works end to end', version: '1.0.0' },
 *     ],
 *     flags: [
 *       { id: 'dark-mode', label: 'Dark mode', hint: 'Toggle dark mode on/off' },
 *     ],
 *   });
 *
 * Open/close: press T (configurable with hotkey option)
 * Tabs: Import | Checklist | Build Info | Changelog | Error Log | Navigation | Feature Flags | Performance | Release Gate
 */
(function (global) {
  'use strict';

  // ─── CSS ──────────────────────────────────────────────────────────────────
  var CSS = [
    '#rqac{display:none;position:fixed;inset:0;z-index:2147483647;',
    'background:rgba(0,0,0,0.88);align-items:flex-start;justify-content:center;',
    'padding-top:28px;font-family:"JetBrains Mono","SF Mono",Consolas,monospace;}',
    '#rqac.rqac-open{display:flex;}',
    '#rqac-box{background:#080b12;border:1px solid rgba(0,221,255,0.28);',
    'width:min(800px,96vw);max-height:88vh;display:flex;flex-direction:column;',
    'box-shadow:0 0 60px rgba(0,221,255,0.08);}',
    '#rqac-head{padding:10px 16px;border-bottom:1px solid rgba(0,221,255,0.12);',
    'display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}',
    '#rqac-title{color:#00ddff;font-size:10px;letter-spacing:.28em;}',
    '#rqac-meta{color:rgba(255,255,255,0.22);font-size:8px;letter-spacing:.1em;}',
    '#rqac-tabs{display:flex;border-bottom:1px solid rgba(0,221,255,0.1);flex-shrink:0;overflow-x:auto;}',
    '#rqac-tabs::-webkit-scrollbar{height:2px;}',
    '.rqac-tab{background:none;border:none;color:rgba(255,255,255,0.3);',
    'font-family:inherit;font-size:9px;letter-spacing:.15em;padding:8px 14px;cursor:pointer;',
    'border-bottom:2px solid transparent;white-space:nowrap;transition:all .1s;}',
    '.rqac-tab:hover{color:rgba(255,255,255,0.6);}',
    '.rqac-tab.rqac-active{color:#00ddff;border-bottom-color:#00ddff;}',
    '#rqac-body{flex:1;overflow-y:auto;}',
    '#rqac-body::-webkit-scrollbar{width:3px;}',
    '#rqac-body::-webkit-scrollbar-thumb{background:rgba(0,221,255,0.18);}',
    '.rqac-panel{display:none;padding:10px 16px 16px;}',
    '.rqac-panel.rqac-active{display:block;}',
    '#rqac-foot{padding:7px 16px;border-top:1px solid rgba(0,221,255,0.08);font-size:8px;',
    'color:rgba(255,255,255,0.22);letter-spacing:.1em;display:flex;gap:10px;',
    'align-items:center;flex-shrink:0;flex-wrap:wrap;}',
    '.rqac-btn{background:none;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.4);',
    'font-family:inherit;font-size:8px;padding:3px 9px;cursor:pointer;letter-spacing:.1em;transition:all .1s;}',
    '.rqac-btn:hover{border-color:rgba(255,255,255,0.5);color:#fff;}',
    '.rqac-row{display:flex;align-items:flex-start;gap:10px;padding:5px 0;',
    'border-bottom:1px solid rgba(255,255,255,0.04);font-size:9px;}',
    '.rqac-row:last-child{border:none;}',
    '.rqac-check{width:13px;height:13px;border:1px solid rgba(255,255,255,0.28);flex-shrink:0;',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'color:#00ddff;font-size:8px;margin-top:1px;transition:all .1s;}',
    '.rqac-check:hover{border-color:#00ddff;}',
    '.rqac-check.rqac-done{background:rgba(0,221,255,0.12);border-color:#00ddff;}',
    '.rqac-label{flex:1;color:rgba(200,220,240,0.78);line-height:1.5;}',
    '.rqac-label.rqac-done{text-decoration:line-through;color:rgba(255,255,255,0.25);}',
    '.rqac-new{color:#ffcc00;font-size:8px;margin-left:5px;letter-spacing:.08em;}',
    '.rqac-ver{color:rgba(255,255,255,0.18);font-size:8px;flex-shrink:0;}',
    '.rqac-go{background:none;border:1px solid rgba(0,221,255,0.22);color:rgba(0,221,255,0.55);',
    'font-family:inherit;font-size:7px;padding:2px 7px;cursor:pointer;letter-spacing:.1em;',
    'flex-shrink:0;transition:all .1s;}',
    '.rqac-go:hover{background:rgba(0,221,255,0.1);border-color:#00ddff;color:#00ddff;}',
    '.rqac-kv{display:flex;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:9px;}',
    '.rqac-k{color:rgba(255,255,255,0.3);width:160px;flex-shrink:0;letter-spacing:.06em;}',
    '.rqac-v{color:rgba(200,220,240,0.85);}',
    '.rqac-change{padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);}',
    '.rqac-change-head{display:flex;gap:8px;align-items:center;margin-bottom:5px;}',
    '.rqac-change-ver{color:#00ddff;font-size:10px;letter-spacing:.12em;}',
    '.rqac-change-date{color:rgba(255,255,255,0.25);font-size:8px;}',
    '.rqac-change ul{margin:0;padding-left:16px;}',
    '.rqac-change li{color:rgba(200,220,240,0.78);font-size:9px;line-height:1.6;margin:2px 0;}',
    '.rqac-err{padding:6px 8px;margin:4px 0;background:rgba(255,50,50,0.06);',
    'border-left:2px solid rgba(255,60,60,0.4);font-size:8px;color:rgba(255,180,180,0.8);line-height:1.5;}',
    '.rqac-err-t{color:rgba(255,255,255,0.25);font-size:7px;}',
    '.rqac-nav-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px;}',
    '.rqac-nav-btn{background:rgba(0,221,255,0.06);border:1px solid rgba(0,221,255,0.2);',
    'color:rgba(0,221,255,0.7);font-family:inherit;font-size:9px;letter-spacing:.12em;',
    'padding:8px 6px;cursor:pointer;transition:all .12s;text-align:center;}',
    '.rqac-nav-btn:hover{background:rgba(0,221,255,0.14);border-color:#00ddff;color:#00ddff;}',
    '.rqac-flag{display:flex;align-items:center;gap:10px;padding:5px 0;',
    'border-bottom:1px solid rgba(255,255,255,0.04);font-size:9px;}',
    '.rqac-toggle{width:28px;height:14px;background:rgba(255,255,255,0.1);',
    'border:1px solid rgba(255,255,255,0.2);border-radius:7px;cursor:pointer;',
    'position:relative;transition:all .15s;flex-shrink:0;}',
    '.rqac-toggle.rqac-on{background:rgba(0,221,255,0.25);border-color:#00ddff;}',
    '.rqac-toggle::after{content:"";position:absolute;top:2px;left:2px;',
    'width:8px;height:8px;background:rgba(255,255,255,0.4);border-radius:50%;transition:all .15s;}',
    '.rqac-toggle.rqac-on::after{left:16px;background:#00ddff;}',
    '.rqac-fps-bar{height:3px;background:rgba(0,221,255,0.15);margin:4px 0 12px;}',
    '.rqac-fps-fill{height:100%;background:#00ddff;transition:width .5s;}',
    '.rqac-gate-row{display:flex;align-items:center;gap:10px;padding:5px 0;',
    'border-bottom:1px solid rgba(255,255,255,0.04);font-size:9px;}',
    '.rqac-badge{font-size:7px;padding:2px 6px;border-radius:2px;flex-shrink:0;}',
    '.rqac-pass{background:rgba(0,255,100,0.12);color:#00ff88;border:1px solid rgba(0,255,100,0.3);}',
    '.rqac-fail{background:rgba(255,50,50,0.1);color:#ff6666;border:1px solid rgba(255,60,60,0.3);}',
    '.rqac-unk{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.3);border:1px solid rgba(255,255,255,0.1);}',
    '.rqac-verdict{margin-top:12px;padding:10px;text-align:center;font-size:11px;',
    'letter-spacing:.2em;border:1px solid rgba(255,255,255,0.1);}',
    '.rqac-verdict-ship{color:#00ff88;border-color:rgba(0,255,100,0.3);background:rgba(0,255,100,0.06);}',
    '.rqac-verdict-block{color:#ff4444;border-color:rgba(255,50,50,0.3);background:rgba(255,50,50,0.06);}',
    '.rqac-section{font-size:8px;letter-spacing:.2em;color:rgba(0,221,255,0.5);',
    'margin:10px 0 6px;display:flex;align-items:center;gap:8px;}',
    '.rqac-section::after{content:"";flex:1;height:1px;background:rgba(0,221,255,0.08);}',
    '.rqac-empty{padding:20px;text-align:center;color:rgba(255,255,255,0.2);font-size:9px;}',
    // IMPORT TAB
    '.rqi-zone{padding:12px 16px;border-bottom:1px solid rgba(0,221,255,0.08);}',
    '.rqi-lbl{font-size:8px;letter-spacing:.2em;color:rgba(0,221,255,0.5);text-transform:uppercase;margin-bottom:7px;}',
    '.rqi-ta{width:100%;height:96px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);',
    'color:rgba(200,220,240,0.85);font-family:"JetBrains Mono",monospace;font-size:9px;',
    'padding:8px;resize:vertical;line-height:1.5;outline:none;display:block;}',
    '.rqi-ta:focus{border-color:rgba(0,221,255,0.35);}',
    '.rqi-ta::placeholder{color:rgba(255,255,255,0.18);}',
    '.rqi-row{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap;}',
    '.rqi-filelbl{font-size:8px;color:rgba(255,255,255,0.3);cursor:pointer;letter-spacing:.1em;padding:4px 8px;',
    'border:1px solid rgba(255,255,255,0.1);}',
    '.rqi-filelbl:hover{color:rgba(255,255,255,0.6);border-color:rgba(255,255,255,0.3);}',
    '.rqi-btn{background:rgba(0,221,255,0.08);border:1px solid rgba(0,221,255,0.28);',
    'color:#00ddff;font-family:inherit;font-size:9px;letter-spacing:.14em;',
    'padding:5px 14px;cursor:pointer;transition:all .12s;}',
    '.rqi-btn:hover{background:rgba(0,221,255,0.18);}',
    '.rqi-btn.accept{background:rgba(0,221,255,0.14);border-color:#00ddff;font-weight:bold;}',
    '.rqi-btn.danger{border-color:rgba(255,80,80,0.28);color:rgba(255,130,130,0.6);}',
    '.rqi-btn.danger:hover{background:rgba(255,60,60,0.1);color:#ff8080;}',
    '.rqi-summary{padding:9px 16px;background:rgba(0,221,255,0.04);',
    'border-bottom:1px solid rgba(0,221,255,0.08);font-size:9px;color:rgba(255,255,255,0.45);',
    'display:flex;gap:14px;flex-wrap:wrap;align-items:center;}',
    '.rqi-cnt{color:#00ddff;font-weight:bold;}',
    '.rqi-results{overflow-y:auto;max-height:220px;flex:1;}',
    '.rqi-results::-webkit-scrollbar{width:3px;}',
    '.rqi-results::-webkit-scrollbar-thumb{background:rgba(0,221,255,0.15);}',
    '.rqi-grp-head{font-size:8px;letter-spacing:.2em;color:rgba(0,221,255,0.45);',
    'padding:8px 16px 4px;border-bottom:1px solid rgba(0,221,255,0.07);}',
    '.rqi-item{display:flex;gap:8px;align-items:flex-start;padding:5px 16px;',
    'border-bottom:1px solid rgba(255,255,255,0.03);font-size:9px;}',
    '.rqi-item:last-child{border:none;}',
    '.rqi-cb{width:12px;height:12px;border:1px solid rgba(255,255,255,0.22);flex-shrink:0;',
    'cursor:pointer;display:flex;align-items:center;justify-content:center;',
    'color:#00ddff;font-size:7px;margin-top:1px;transition:all .1s;}',
    '.rqi-cb.on{background:rgba(0,221,255,0.1);border-color:#00ddff;}',
    '.rqi-text{flex:1;color:rgba(200,220,240,0.72);line-height:1.5;}',
    '.rqi-bdg{font-size:7px;padding:1px 5px;border-radius:2px;flex-shrink:0;margin-top:1px;}',
    '.rqi-b-fixed{background:rgba(0,255,100,0.07);color:rgba(0,220,120,0.7);}',
    '.rqi-b-added{background:rgba(0,180,255,0.07);color:rgba(0,200,255,0.7);}',
    '.rqi-b-issue{background:rgba(255,140,0,0.07);color:rgba(255,170,50,0.7);}',
    '.rqi-b-open{background:rgba(255,200,0,0.07);color:rgba(255,210,60,0.7);}',
    '.rqi-empty-state{padding:28px 16px;text-align:center;color:rgba(255,255,255,0.18);',
    'font-size:10px;line-height:1.9;}',
    '.rqi-empty-state strong{color:rgba(255,255,255,0.35);display:block;margin-bottom:8px;}',
    '.rqi-foot{padding:9px 16px;border-top:1px solid rgba(0,221,255,0.08);',
    'display:flex;gap:8px;align-items:center;flex-wrap:wrap;flex-shrink:0;}',
    '.rqi-status{flex:1;font-size:8px;color:rgba(255,255,255,0.28);letter-spacing:.08em;}',
  ].join('');

  // ─── HTML TEMPLATE ────────────────────────────────────────────────────────
  var TABS = ['IMPORT', 'CHECKLIST', 'BUILD INFO', 'CHANGELOG', 'ERRORS', 'NAVIGATION', 'FEATURE FLAGS', 'PERFORMANCE', 'RELEASE GATE'];
  var TAB_IDS = ['import', 'checklist', 'build', 'changelog', 'errors', 'nav', 'flags', 'perf', 'gate'];

  function buildHTML(config) {
    var tabBtns = TABS.map(function (label, i) {
      return '<button class="rqac-tab' + (i === 0 ? ' rqac-active' : '') + '" ' +
        'onclick="QACockpit._tab(\'' + TAB_IDS[i] + '\',this)">' + label + '</button>';
    }).join('');

    var panels = TAB_IDS.map(function (id, i) {
      return '<div id="rqac-' + id + '" class="rqac-panel' + (i === 0 ? ' rqac-active' : '') + '"></div>';
    }).join('');

    return '<div id="rqac"><div id="rqac-box">' +
      '<div id="rqac-head"><span id="rqac-title">VCMC LITE</span>' +
      '<span id="rqac-meta">' + (config.hotkey || 'T') + ' TO CLOSE &nbsp;&bull;&nbsp; ESC CLOSES</span></div>' +
      '<div id="rqac-tabs">' + tabBtns + '</div>' +
      '<div id="rqac-body">' + panels + '</div>' +
      '<div id="rqac-foot"><span id="rqac-status"></span>' +
      '<button class="rqac-btn" onclick="QACockpit.copyReport()">COPY DEBUG REPORT</button>' +
      '<button class="rqac-btn" onclick="QACockpit.clearErrors()">CLEAR ERRORS</button>' +
      '</div></div></div>';
  }

  // ─── CORE ─────────────────────────────────────────────────────────────────
  var QACockpit = {
    _cfg: null,
    _open: false,
    _currentTab: 'import',
    _checks: {},
    _flags: {},
    _gate: {},
    _errors: [],
    _lastKey: '',
    _fps: 0,
    _fpsCount: 0,
    _fpsTimer: 0,
    _lastFrameMs: 0,

    // ── PUBLIC API ────────────────────────────────────────────────────────
    /**
     * Initialize the cockpit.
     * @param {Object} config
     * @param {string} config.project        - Project name shown in Build Info
     * @param {string} config.version        - Build version
     * @param {string} [config.buildDate]    - Build date string
     * @param {string} [config.hotkey='T']   - Key to toggle the overlay
     * @param {boolean} [config.devMode=true]- Only open if true
     * @param {Array}   config.items         - QA checklist items [{id, label, version, isNew, nav}]
     * @param {Array}   [config.changelog]   - Build changes [{version,date,changes:[...]}]
     * @param {Array}   [config.flags]       - Feature flags [{id, label, hint}]
     * @param {Array}   [config.gateItems]   - Release gate criteria [{id, label}]
     * @param {Array}   [config.navItems]    - Navigation buttons [{label, action}]
     * @param {Function} [config.onFlagChange] - Called with flags object when a flag changes
     * @param {Function} [config.getState]   - Returns {phase, scene, ...} for Build Info tab
     */
    init: function (config) {
      this._cfg = Object.assign({
        project: 'My Project',
        version: '0.0.1',
        buildDate: new Date().toLocaleDateString(),
        hotkey: 'T',
        devMode: true,
        items: [],
        changelog: [],
        flags: [],
        gateItems: [],
        navItems: [],
        onFlagChange: null,
        getState: null,
      }, config);

      if (!this._cfg.devMode) return;

      this._lsKey = 'rqac_' + this._cfg.project.replace(/\W+/g, '_').toLowerCase() + '_v1';
      this._load();
      this._injectCSS();
      this._injectHTML();
      this._hookErrors();
      this._hookKeys();
      this._applyFlags();
    },

    /** Open the cockpit overlay */
    open: function () {
      if (!this._cfg || !this._cfg.devMode) return;
      this._open = true;
      document.getElementById('rqac').classList.add('rqac-open');
      this._renderTab(this._currentTab);
    },

    /** Close the cockpit overlay */
    close: function () {
      this._open = false;
      var el = document.getElementById('rqac');
      if (el) el.classList.remove('rqac-open');
    },

    /** Toggle open/close */
    toggle: function () { this._open ? this.close() : this.open(); },

    /**
     * Tick FPS counter. Call once per animation frame with the current timestamp.
     * @param {number} nowMs - performance.now() or requestAnimationFrame timestamp
     */
    tick: function (nowMs) {
      if (!this._lastFrameMs) { this._lastFrameMs = nowMs; return; }
      var dt = nowMs - this._lastFrameMs;
      this._lastFrameMs = nowMs;
      this._fpsCount++;
      this._fpsTimer += dt;
      if (this._fpsTimer >= 500) {
        this._fps = Math.round(this._fpsCount * 1000 / this._fpsTimer);
        this._fpsCount = 0;
        this._fpsTimer = 0;
        if (this._open && this._currentTab === 'perf') this._renderPerf();
      }
    },

    /** Manually log an error to the Error Log tab */
    log: function (msg, context) {
      this._errors.unshift({
        msg: String(msg),
        ctx: context || '',
        time: new Date().toTimeString().slice(0, 8),
      });
      if (this._errors.length > 50) this._errors.length = 50;
    },

    /** Get current value of a feature flag */
    flag: function (id) { return !!this._flags[id]; },

    /** Copy debug report to clipboard */
    copyReport: function () {
      var cfg = this._cfg;
      var doneCount = cfg.items.filter(function (it) { return QACockpit._checks[it.id]; }).length;
      var state = cfg.getState ? cfg.getState() : {};
      var lines = [
        '=== VCMC LITE - DEBUG REPORT ===',
        'Project: ' + cfg.project + '  v' + cfg.version,
        'Date: ' + new Date().toISOString(),
        'FPS: ' + this._fps,
        'Checklist: ' + doneCount + '/' + cfg.items.length + ' done',
        '',
      ];
      if (Object.keys(state).length) {
        lines.push('--- APP STATE ---');
        Object.keys(state).forEach(function (k) { lines.push(k + ': ' + state[k]); });
        lines.push('');
      }
      var open = cfg.items.filter(function (it) { return !QACockpit._checks[it.id]; });
      if (open.length) {
        lines.push('--- OPEN CHECKLIST ITEMS ---');
        open.forEach(function (it) { lines.push('[ ] ' + it.label + ' (v' + (it.version || '?') + ')'); });
        lines.push('');
      }
      if ((cfg.changelog || []).length) {
        lines.push('--- CHANGELOG ---');
        cfg.changelog.slice(0, 5).forEach(function (entry) {
          lines.push((entry.version || cfg.version || 'build') + (entry.date ? ' - ' + entry.date : ''));
          (entry.changes || entry.items || []).forEach(function (change) {
            lines.push('- ' + change);
          });
        });
        lines.push('');
      }
      if (this._errors.length) {
        lines.push('--- RECENT ERRORS ---');
        this._errors.slice(0, 10).forEach(function (e) {
          lines.push('[' + e.time + '] ' + e.msg);
        });
      }
      var text = lines.join('\n');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          var s = document.getElementById('rqac-status');
          if (s) { s.textContent = 'COPIED'; setTimeout(function () { QACockpit._updateStatus(); }, 1500); }
        });
      } else {
        prompt('Copy debug report:', text);
      }
    },

    /** Clear the error log */
    clearErrors: function () {
      this._errors = [];
      if (this._currentTab === 'errors') this._renderErrors();
    },

    // ── INTERNAL ──────────────────────────────────────────────────────────
    _injectCSS: function () {
      var style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);
    },

    _injectHTML: function () {
      var div = document.createElement('div');
      div.innerHTML = buildHTML(this._cfg);
      document.body.appendChild(div.firstChild);
    },

    _hookErrors: function () {
      var self = this;
      var prev = window.onerror;
      window.onerror = function (msg, src, line, col, err) {
        self.log(msg, (src || '').split('/').pop() + ':' + line);
        if (prev) return prev(msg, src, line, col, err);
      };
      window.addEventListener('unhandledrejection', function (e) {
        self.log('UnhandledRejection: ' + String(e.reason));
      });
    },

    _hookKeys: function () {
      var self = this;
      var hotkey = (this._cfg.hotkey || 'T').toLowerCase();
      window.addEventListener('keydown', function (e) {
        self._lastKey = e.key;
        if (e.key.toLowerCase() === hotkey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Don't fire if user is typing in an input
          var tag = (document.activeElement || {}).tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          e.preventDefault();
          self.toggle();
          return;
        }
        if (e.key === 'Escape' && self._open) { self.close(); }
      });
    },

    _load: function () {
      try {
        var s = localStorage.getItem(this._lsKey);
        if (s) {
          var data = JSON.parse(s);
          this._checks = data.checks || {};
          this._flags  = data.flags  || {};
          this._gate   = data.gate   || {};
        }
      } catch (e) {}
    },

    _save: function () {
      try {
        localStorage.setItem(this._lsKey, JSON.stringify({
          checks: this._checks,
          flags:  this._flags,
          gate:   this._gate,
        }));
      } catch (e) {}
    },

    _applyFlags: function () {
      var cfg = this._cfg;
      if (cfg.onFlagChange) cfg.onFlagChange(Object.assign({}, this._flags));
    },

    // ── TABS ──────────────────────────────────────────────────────────────
    _tab: function (name, btn) {
      this._currentTab = name;
      document.querySelectorAll('.rqac-tab').forEach(function (b) { b.classList.remove('rqac-active'); });
      document.querySelectorAll('.rqac-panel').forEach(function (p) { p.classList.remove('rqac-active'); });
      btn.classList.add('rqac-active');
      var panel = document.getElementById('rqac-' + name);
      if (panel) panel.classList.add('rqac-active');
      this._renderTab(name);
    },

    _renderTab: function (name) {
      var map = {
        checklist: '_renderChecklist',
        build:     '_renderBuild',
        changelog: '_renderChangelog',
        errors:    '_renderErrors',
        nav:       '_renderNav',
        flags:     '_renderFlags',
        perf:      '_renderPerf',
        gate:      '_renderGate',
        'import':  '_renderImportTab',
      };
      if (map[name]) this[map[name]]();
      this._updateStatus();
    },

    _updateStatus: function () {
      var cfg = this._cfg;
      var done = cfg.items.filter(function (it) { return QACockpit._checks[it.id]; }).length;
      var el = document.getElementById('rqac-status');
      if (el) el.textContent = done + '/' + cfg.items.length + ' DONE';
    },

    _section: function (label) {
      return '<div class="rqac-section">' + label + '</div>';
    },

    // ── TAB RENDERERS ────────────────────────────────────────────────────
    _renderChecklist: function () {
      var el = document.getElementById('rqac-checklist');
      if (!el) return;
      var items = this._cfg.items;
      if (!items.length) { el.innerHTML = '<div class="rqac-empty">No items defined. Pass items[] to QACockpit.init()</div>'; return; }
      var html = '';
      items.forEach(function (it) {
        var done = !!QACockpit._checks[it.id];
        var newTag = it.isNew ? '<span class="rqac-new">NEW</span>' : '';
        html += '<div class="rqac-row">' +
          '<div class="rqac-check' + (done ? ' rqac-done' : '') + '" ' +
          'onclick="QACockpit._toggleCheck(\'' + it.id + '\')">' + (done ? '&#x2713;' : '') + '</div>' +
          '<div class="rqac-label' + (done ? ' rqac-done' : '') + '">' + it.label + newTag + '</div>' +
          '<div class="rqac-ver">' + (it.version || '') + '</div>' +
          '<button class="rqac-go" onclick="QACockpit._navigate(\'' + it.id + '\')">GO</button>' +
          '</div>';
      });
      el.innerHTML = html;
    },

    _toggleCheck: function (id) {
      this._checks[id] = !this._checks[id];
      this._save();
      this._renderChecklist();
      this._updateStatus();
    },

    _renderBuild: function () {
      var el = document.getElementById('rqac-build');
      if (!el) return;
      var cfg = this._cfg;
      var state = cfg.getState ? cfg.getState() : {};
      var html = this._section('IDENTITY') +
        '<div class="rqac-kv"><span class="rqac-k">Project</span><span class="rqac-v">' + cfg.project + '</span></div>' +
        '<div class="rqac-kv"><span class="rqac-k">Version</span><span class="rqac-v">' + cfg.version + '</span></div>' +
        '<div class="rqac-kv"><span class="rqac-k">Build date</span><span class="rqac-v">' + (cfg.buildDate || '--') + '</span></div>' +
        '<div class="rqac-kv"><span class="rqac-k">Mode</span><span class="rqac-v">DEV</span></div>' +
        '<div class="rqac-kv"><span class="rqac-k">Last key pressed</span><span class="rqac-v">' + (this._lastKey || '--') + '</span></div>' +
        '<div class="rqac-kv"><span class="rqac-k">FPS</span><span class="rqac-v">' + this._fps + '</span></div>';
      if (Object.keys(state).length) {
        html += this._section('APP STATE');
        Object.keys(state).forEach(function (k) {
          html += '<div class="rqac-kv"><span class="rqac-k">' + k + '</span><span class="rqac-v">' + state[k] + '</span></div>';
        });
      }
      el.innerHTML = html;
    },

    _renderChangelog: function () {
      var el = document.getElementById('rqac-changelog');
      if (!el) return;
      var cfg = this._cfg;
      var list = cfg.changelog || [];
      if (!list.length) {
        el.innerHTML = '<div class="rqac-empty">No changelog yet. Pass changelog:[{version,date,changes:[...]}] to init().</div>';
        return;
      }
      var html = this._section('WHAT CHANGED IN THIS BUILD');
      list.forEach(function (entry) {
        var changes = entry.changes || entry.items || [];
        html += '<div class="rqac-change">' +
          '<div class="rqac-change-head"><span class="rqac-change-ver">' + (entry.version || cfg.version || 'BUILD') + '</span>' +
          '<span class="rqac-change-date">' + (entry.date || '') + '</span></div>' +
          '<ul>' + changes.map(function (change) { return '<li>' + change + '</li>'; }).join('') + '</ul>' +
          '</div>';
      });
      el.innerHTML = html;
    },

    _renderErrors: function () {
      var el = document.getElementById('rqac-errors');
      if (!el) return;
      if (!this._errors.length) { el.innerHTML = '<div class="rqac-empty">NO ERRORS LOGGED</div>'; return; }
      el.innerHTML = this._errors.map(function (e) {
        return '<div class="rqac-err"><span class="rqac-err-t">' + e.time + (e.ctx ? ' [' + e.ctx + ']' : '') + '</span><br>' + e.msg + '</div>';
      }).join('');
    },

    _renderNav: function () {
      var el = document.getElementById('rqac-nav');
      if (!el) return;
      var items = this._cfg.navItems;
      if (!items.length) { el.innerHTML = '<div class="rqac-empty">No nav items. Pass navItems:[{label,action}] to init().</div>'; return; }
      var html = this._section('JUMP TO') + '<div class="rqac-nav-grid">';
      items.forEach(function (n, i) {
        html += '<button class="rqac-nav-btn" onclick="QACockpit._navigate(' + i + ')">' + n.label + '</button>';
      });
      html += '</div>';
      el.innerHTML = html;
    },

    _navigate: function (nav) {
      this.close();
      var cfg = this._cfg;

      // Layer 1: numeric index into navItems (from Navigation tab buttons)
      if (typeof nav === 'number') {
        var item = (cfg.navItems || [])[nav];
        if (item && typeof item.action === 'function') { item.action(); return; }
      }

      if (typeof nav === 'string') {
        // Layer 2: explicit navItem match by id or label
        var match = (cfg.navItems || []).find(function (n) { return n.id === nav || n.label === nav; });
        if (match && typeof match.action === 'function') { match.action(); return; }

        // Layer 3: checklist item has explicit nav property pointing to a navItem
        var clItem = (cfg.items || []).find(function (it) { return it.id === nav; });
        if (clItem && clItem.nav) {
          var navMatch = (cfg.navItems || []).find(function (n) { return n.id === clItem.nav || n.label === clItem.nav; });
          if (navMatch && typeof navMatch.action === 'function') { navMatch.action(); return; }
        }

        // Layer 4: auto-nav from item label — no config needed
        var label = clItem ? clItem.label : nav;
        this._autoNav(label);
      }
    },

    // Auto-navigate based on plain-English label text.
    // Tries four techniques in order, falls back gracefully.
    _autoNav: function (label) {
      // Extract meaningful keywords — skip common verbs/articles
      var SKIP = { the:1,and:1,for:1,are:1,this:1,that:1,with:1,works:1,should:1,
                   does:1,not:1,from:1,have:1,has:1,when:1,its:1,end:1,to:1,
                   correctly:1,properly:1,without:1,all:1,any:1,new:1,old:1 };
      var words = label.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
        .filter(function (w) { return w.length > 2 && !SKIP[w]; });

      if (!words.length) return;

      // Technique A: find a matching <a> link and click it
      var links = Array.prototype.slice.call(
        document.querySelectorAll('a[href]:not([href=""]):not([href="#"])'));
      for (var i = 0; i < links.length; i++) {
        var lt = links[i].textContent.toLowerCase().trim();
        var lh = (links[i].getAttribute('href') || '').toLowerCase();
        if (words.some(function (w) { return lt.includes(w) || lh.includes(w); })) {
          links[i].click(); return;
        }
      }

      // Technique B: find a matching button or clickable element and click it
      var btns = Array.prototype.slice.call(
        document.querySelectorAll('button,[role="button"],[data-nav]'));
      for (var j = 0; j < btns.length; j++) {
        var bt = btns[j].textContent.toLowerCase().trim();
        if (bt.length > 1 && words.some(function (w) { return bt.includes(w); })) {
          btns[j].click(); return;
        }
      }

      // Technique C: hash routing — try each keyword as a hash fragment
      var prevHash = window.location.hash;
      for (var k = 0; k < words.length; k++) {
        var slug = words[k];
        if (document.getElementById(slug)) {
          // Element with matching id exists — scroll to it
          document.getElementById(slug).scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        window.location.hash = '#' + slug;
        if (window.location.hash !== prevHash) {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          return;
        }
      }

      // Technique D: history.pushState for SPA routing
      var primary = words[0];
      try {
        var testPath = '/' + primary;
        if (!window.location.pathname.endsWith(testPath)) {
          history.pushState({}, '', testPath);
          window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        }
      } catch (e) {
        // File:// or restricted context — silently fail
        // Cockpit is already closed, user can navigate manually
      }
    },

    _renderFlags: function () {
      var el = document.getElementById('rqac-flags');
      if (!el) return;
      var flags = this._cfg.flags;
      if (!flags.length) { el.innerHTML = '<div class="rqac-empty">No flags. Pass flags:[{id,label,hint}] to init().</div>'; return; }
      var html = this._section('FEATURE TOGGLES  &#x2014;  PERSIST IN LOCALSTORAGE');
      flags.forEach(function (f) {
        var on = !!QACockpit._flags[f.id];
        html += '<div class="rqac-flag">' +
          '<div class="rqac-toggle' + (on ? ' rqac-on' : '') + '" onclick="QACockpit._toggleFlag(\'' + f.id + '\')"></div>' +
          '<div style="flex:1;font-size:9px;color:rgba(200,220,240,0.78);">' + f.label +
          (f.hint ? '<br><span style="font-size:7px;color:rgba(255,255,255,0.25);">' + f.hint + '</span>' : '') +
          '</div>' +
          '<div style="font-size:8px;color:' + (on ? '#00ddff' : 'rgba(255,255,255,0.25)') + ';">' + (on ? 'ON' : 'OFF') + '</div>' +
          '</div>';
      });
      el.innerHTML = html;
    },

    _toggleFlag: function (id) {
      this._flags[id] = !this._flags[id];
      this._save();
      this._applyFlags();
      this._renderFlags();
    },

    _renderPerf: function () {
      var el = document.getElementById('rqac-perf');
      if (!el) return;
      var fps = this._fps;
      var pct = Math.min(100, fps / 60 * 100);
      var col = fps < 30 ? '#ff4444' : fps < 50 ? '#ffaa00' : '#00ddff';
      var cfg = this._cfg;
      var state = cfg.getState ? cfg.getState() : {};
      var html = this._section('FRAME RATE') +
        '<div class="rqac-kv"><span class="rqac-k">FPS</span><span class="rqac-v" style="color:' + col + '">' +
        fps + (fps < 30 ? ' &#9888; LOW' : fps < 50 ? ' &#9888; OK' : ' &#10003; GOOD') + '</span></div>' +
        '<div class="rqac-fps-bar"><div class="rqac-fps-fill" style="width:' + pct + '%;background:' + col + '"></div></div>' +
        '<div class="rqac-kv"><span class="rqac-k">Frame time</span><span class="rqac-v">' + (1000 / Math.max(1, fps)).toFixed(1) + ' ms</span></div>' +
        this._section('APP STATE');
      if (Object.keys(state).length) {
        Object.keys(state).forEach(function (k) {
          html += '<div class="rqac-kv"><span class="rqac-k">' + k + '</span><span class="rqac-v">' + state[k] + '</span></div>';
        });
      } else {
        html += '<div style="font-size:9px;color:rgba(255,255,255,0.2);padding:6px 0;">Pass getState:()=>({}) to init() to show live app state here.</div>';
      }
      el.innerHTML = html;
    },

    _renderGate: function () {
      var el = document.getElementById('rqac-gate');
      if (!el) return;
      var items = this._cfg.gateItems;
      if (!items.length) { el.innerHTML = '<div class="rqac-empty">No gate criteria. Pass gateItems:[{id,label}] to init().</div>'; return; }
      var passing = items.filter(function (g) { return QACockpit._gate[g.id]; }).length;
      var allPass = passing === items.length;
      var html = this._section('SHIP CRITERIA');
      items.forEach(function (g) {
        var done = !!QACockpit._gate[g.id];
        html += '<div class="rqac-gate-row">' +
          '<span class="rqac-badge ' + (done ? 'rqac-pass' : 'rqac-unk') + '">' + (done ? 'PASS' : '?') + '</span>' +
          '<div style="flex:1;font-size:9px;color:rgba(200,220,240,0.78);">' + g.label + '</div>' +
          '<div class="rqac-check' + (done ? ' rqac-done' : '') + '" onclick="QACockpit._toggleGate(\'' + g.id + '\')">' + (done ? '&#x2713;' : '') + '</div>' +
          '</div>';
      });
      html += '<div class="rqac-verdict ' + (allPass ? 'rqac-verdict-ship' : 'rqac-verdict-block') + '">' +
        (allPass ? 'RELEASE CANDIDATE &#x2014; ' : 'SHIP BLOCKED &#x2014; ') + passing + '/' + items.length + ' PASSED' +
        '</div>';
      el.innerHTML = html;
    },

    _toggleGate: function (id) {
      this._gate[id] = !this._gate[id];
      this._save();
      this._renderGate();
    },

    _renderImportTab: function () { _renderImport(); },
  };

  // ── IMPORT ENGINE ─────────────────────────────────────────────────────────
  // Pure regex — no API calls, no subscription, works offline forever.
  // Parses Claude copy-paste, ChatGPT JSON export, or any AI conversation text.

  var _imp = { raw:'', extracted:[], selected:{}, status:'' };

  // ── Format detection ─────────────────────────────────────────────────────
  function _impDetect(text){
    var t=text.trim();
    if((t[0]==='['||t[0]==='{')&&t.indexOf('"role"')>-1) return 'json';
    if(t.indexOf('"mapping"')>-1&&t.indexOf('"message"')>-1) return 'json';
    return 'text';
  }

  // ── Turn extraction ───────────────────────────────────────────────────────
  function _impTurns(text,fmt){
    if(fmt==='json'){
      var data; try{data=JSON.parse(text);}catch(e){return [{role:'assistant',content:text}];}
      var out=[];
      var arr=Array.isArray(data)?data:[data];
      arr.forEach(function(conv){
        // Newer format: conv.messages
        if(conv.messages&&Array.isArray(conv.messages)){
          conv.messages.forEach(function(m){
            if(m.role&&m.content) out.push({role:m.role,
              content:typeof m.content==='string'?m.content:
              (Array.isArray(m.content)?m.content.map(function(c){return c.text||'';}).join('\n'):JSON.stringify(m.content))});
          });
        }
        // Older ChatGPT format: conv.mapping
        if(conv.mapping){
          Object.keys(conv.mapping).forEach(function(k){
            var node=conv.mapping[k];
            if(!node.message||!node.message.author) return;
            var role=node.message.author.role;
            var parts=(node.message.content&&node.message.content.parts)||[];
            var content=parts.filter(function(p){return typeof p==='string';}).join('\n');
            if(content.trim()) out.push({role:role,content:content});
          });
        }
      });
      return out.length?out:[{role:'assistant',content:text}];
    }
    // Plain text — treat as single assistant block
    // Try to detect Human/Assistant markers
    if(text.indexOf('Human:')>-1||text.indexOf('Assistant:')>-1){
      var turns=[]; var lines=text.split('\n'); var cur=null;
      lines.forEach(function(ln){
        var hm=/^(Human|User|Me):\s*/i.exec(ln);
        var am=/^(Assistant|Claude|ChatGPT|AI):\s*/i.exec(ln);
        if(hm){if(cur)turns.push(cur);cur={role:'user',content:ln.replace(hm[0],'').trim()};}
        else if(am){if(cur)turns.push(cur);cur={role:'assistant',content:ln.replace(am[0],'').trim()};}
        else if(cur){cur.content+='\n'+ln;}
      });
      if(cur)turns.push(cur);
      return turns.length>1?turns:[{role:'assistant',content:text}];
    }
    return [{role:'assistant',content:text}];
  }

  // ── Pattern engine ────────────────────────────────────────────────────────
  function _impExtract(turns){
    var results=[]; var seen={};
    function add(label,type,confidence){
      label=label.trim().replace(/\s+/g,' ').replace(/[.!?]+$/,'');
      // Clean up common AI preamble
      label=label.replace(/^(?:the\s+|a\s+|an\s+)/i,'');
      if(label.length<8||label.length>120) return;
      var key=label.toLowerCase();
      if(seen[key]) return;
      seen[key]=true;
      results.push({id:'imp-'+results.length,label:label,type:type,confidence:confidence});
    }

    turns.forEach(function(turn){
      var t=turn.content; var isAI=(turn.role==='assistant'||turn.role==='ai');

      if(isAI){
        // ── FIXED / RESOLVED ─────────────────────────────────────────
        var fixPats=[
          /(?:i(?:'ve| have)?|has been|is now|was)\s+(?:fixed|resolved|corrected|patched|addressed)\s+(?:the\s+|a\s+|an\s+)?([^.\n!?]{8,110})/gi,
          /\b(?:fix(?:ed)?|resolv(?:ed)?|corrected)[:\s]+([^.\n!?]{8,110})/gi,
          /\b(?:fix(?:ed)?|resolv(?:ed)?)\s+(?:the\s+)?([^.\n!?]{8,100}?)(?:\s+(?:issue|bug|problem|error))?(?:\.|$)/gi,
        ];
        fixPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1],'fixed','high');});

        // ── ADDED / IMPLEMENTED ──────────────────────────────────────
        var addPats=[
          /(?:i(?:'ve| have)?)\s+(?:added|implemented|built|created|introduced|integrated|included)\s+(?:the\s+|a\s+|an\s+)?([^.\n!?]{8,110})/gi,
          /\b(?:added|implemented|created)[:\s]+([^.\n!?]{8,110})/gi,
          /\bnew\b[:\s]+([^.\n!?]{8,110})/gi,
        ];
        addPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1],'added','high');});

        // ── REMOVED / STRIPPED ───────────────────────────────────────
        var remPats=[
          /(?:i(?:'ve| have)?)\s+(?:removed|deleted|stripped|disabled|eliminated|dropped)\s+(?:the\s+)?([^.\n!?]{8,110})/gi,
          /\b(?:removed|stripped|deleted)[:\s]+([^.\n!?]{8,110})/gi,
        ];
        remPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1],'fixed','high');});

        // ── STILL OPEN / TODO ────────────────────────────────────────
        var openPats=[
          /(?:still\s+needs?|not\s+yet|todo|next\s+step|you(?:'ll|\s+will)\s+need)[:\s]+([^.\n!?]{8,110})/gi,
          /\bpending\b[:\s]+([^.\n!?]{8,110})/gi,
        ];
        openPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1],'open','medium');});

        // ── KNOWN ISSUES (assistant admitting something is wrong) ────
        var issPats=[
          /(?:known\s+issue|current\s+issue|bug|problem|limitation)[:\s]+([^.\n!?]{8,110})/gi,
          /(?:is\s+(?:still\s+)?(?:broken|not\s+working|failing)|doesn't\s+work)\s*(?:because|when|due\s+to)?\s*([^.\n!?]{0,80})/gi,
        ];
        issPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1]||m[0].slice(0,80),'issue','medium');});

      } else {
        // ── FROM USER TURNS: bug reports ─────────────────────────────
        var bugPats=[
          /([^.\n!?]{8,80}?)\s+(?:is\s+broken|isn't\s+working|doesn't\s+work|not\s+working|won'?t)/gi,
          /\b(?:fix|broken|bug)[:.\s]+([^.\n!?]{8,110})/gi,
        ];
        bugPats.forEach(function(re){var m;re.lastIndex=0;
          while((m=re.exec(t))!==null) add(m[1],'issue','low');});
      }
    });

    return results;
  }

  // ── Version extraction ───────────────────────────────────────────────────
  function _impVersions(text){
    var found=[]; var seen={};
    var re=/v(\d+)b?(\d+)/g; var m;
    while((m=re.exec(text))!==null){
      if(!seen[m[0]]){found.push(m[0]);seen[m[0]]=true;}
    }
    return found.slice(0,5);
  }

  // ── Run extraction ───────────────────────────────────────────────────────
  function _impRun(){
    var text=_imp.raw.trim();
    if(!text){_imp.status='Paste a conversation first.';_renderImport();return;}
    var fmt=_impDetect(text);
    var turns=_impTurns(text,fmt);
    _imp.extracted=_impExtract(turns);
    _imp.versions=_impVersions(text);
    // Default: all selected
    _imp.selected={};
    _imp.extracted.forEach(function(it){_imp.selected[it.id]=true;});
    _imp.status='Found '+_imp.extracted.length+' items from ~'+turns.length+' turns. Uncheck anything that doesn\'t apply.';
    _renderImport();
  }

  // ── Accept: push selected items into the cockpit ─────────────────────────
  function _impAccept(){
    var cfg=QACockpit._cfg; if(!cfg) return;
    var accepted=_imp.extracted.filter(function(it){return _imp.selected[it.id];});
    var added=0;
    accepted.forEach(function(it){
      var existingId=it.id;
      // Don't duplicate
      var alreadyIn=cfg.items.some(function(x){
        return x.label.toLowerCase()===it.label.toLowerCase();
      });
      if(!it.label||alreadyIn) return;
      cfg.items.push({
        id:existingId, label:it.label, version:cfg.version||'imported',
        isNew:true,
        _imported:true
      });
      added++;
    });
    QACockpit._save();
    _imp.status='Added '+added+' items to your checklist. Check the CHECKLIST tab.';
    _imp.extracted=[];_imp.selected={};_imp.raw='';
    _renderImport();
    QACockpit._updateStatus();
  }

  // ── Clear ────────────────────────────────────────────────────────────────
  function _impClear(){
    _imp.raw='';_imp.extracted=[];_imp.selected={};_imp.status='';
    _renderImport();
  }

  // ── Toggle selection ─────────────────────────────────────────────────────
  function _impToggle(id){
    _imp.selected[id]=!_imp.selected[id];
    var cb=document.getElementById('rqi-cb-'+id);
    if(cb){cb.className='rqi-cb'+((_imp.selected[id])?' on':'');
      cb.textContent=_imp.selected[id]?'&#x2713;':'';}
  }

  // ── Render import tab ─────────────────────────────────────────────────────
  function _renderImport(){
    var el=document.getElementById('rqac-import'); if(!el) return;
    var typeLabels={fixed:'DONE',added:'ADDED',issue:'BUG',open:'OPEN'};
    var typeClass={fixed:'rqi-b-fixed',added:'rqi-b-added',issue:'rqi-b-issue',open:'rqi-b-open'};

    var counts={fixed:0,added:0,issue:0,open:0};
    _imp.extracted.forEach(function(it){if(counts[it.type]!==undefined)counts[it.type]++;});
    var total=_imp.extracted.length;

    var summaryHtml=total>0?
      '<div class="rqi-summary">'+
        '<span>Found: <span class="rqi-cnt">'+total+'</span> items</span>'+
        (counts.fixed?'<span><span class="rqi-cnt">'+counts.fixed+'</span> completed</span>':'')+
        (counts.added?'<span><span class="rqi-cnt">'+counts.added+'</span> added</span>':'')+
        (counts.issue?'<span><span class="rqi-cnt">'+counts.issue+'</span> bugs</span>':'')+
        (counts.open?'<span><span class="rqi-cnt">'+counts.open+'</span> open</span>':'')+
        (_imp.versions&&_imp.versions.length?'<span>Versions: <span class="rqi-cnt">'+_imp.versions.join(', ')+'</span></span>':'')+
      '</div>':'';

    var resultsHtml='';
    if(total>0){
      var groups=[
        {key:'fixed',label:'COMPLETED WORK — mark as done or verify'},
        {key:'added',label:'FEATURES ADDED — verify these work'},
        {key:'issue',label:'BUGS / ISSUES — add to known issues list'},
        {key:'open', label:'STILL OPEN — things not done yet'},
      ];
      groups.forEach(function(g){
        var items=_imp.extracted.filter(function(it){return it.type===g.key;});
        if(!items.length) return;
        resultsHtml+='<div class="rqi-grp-head">'+g.label+'</div>';
        items.forEach(function(it){
          var sel=_imp.selected[it.id];
          resultsHtml+='<div class="rqi-item">'+
            '<div class="rqi-cb'+(sel?' on':'')+'" id="rqi-cb-'+it.id+'" onclick="_impToggle(\''+it.id+'\')">'+(sel?'&#x2713;':'')+'</div>'+
            '<div class="rqi-text">'+it.label+'</div>'+
            '<span class="rqi-bdg '+typeClass[it.type]+'">'+typeLabels[it.type]+'</span>'+
          '</div>';
        });
      });
    } else {
      resultsHtml='<div class="rqi-empty-state">'+
        '<strong>Paste your AI conversation above and click EXTRACT.</strong>'+
        'Works with Claude (copy-paste), ChatGPT (copy-paste or JSON export),<br>'+
        'or any AI assistant\'s conversation text.<br><br>'+
        'The cockpit reads what was built, fixed, and still open<br>'+
        'and pre-populates your checklist automatically.'+
      '</div>';
    }

    var selCount=Object.keys(_imp.selected).filter(function(k){return _imp.selected[k];}).length;

    el.style.padding='0';
    el.style.display='flex';
    el.style.flexDirection='column';
    el.style.height='100%';
    el.innerHTML=
      '<div class="rqi-zone">'+
        '<div class="rqi-lbl">Paste your AI conversation — or upload a ChatGPT JSON export</div>'+
        '<textarea class="rqi-ta" id="rqi-paste" placeholder="Paste your Claude or ChatGPT conversation here...&#10;&#10;Works with copy-paste from any AI chat, or upload a ChatGPT export file below.">'+(_imp.raw||'')+'</textarea>'+
        '<div class="rqi-row">'+
          '<button class="rqi-btn" onclick="_impRun()">EXTRACT ITEMS</button>'+
          '<label class="rqi-filelbl">UPLOAD .JSON <input type="file" accept=".json,.txt" style="display:none" onchange="_impFile(this)"></label>'+
          (total>0?'<button class="rqi-btn danger" onclick="_impClear()">CLEAR</button>':'')+
        '</div>'+
      '</div>'+
      summaryHtml+
      '<div class="rqi-results">'+resultsHtml+'</div>'+
      '<div class="rqi-foot">'+
        '<div class="rqi-status">'+(_imp.status||'')+'</div>'+
        (total>0?'<button class="rqi-btn accept" onclick="_impAccept()">ADD '+selCount+' ITEMS TO COCKPIT</button>':'')+''+
      '</div>';

    // Bind textarea change
    var ta=document.getElementById('rqi-paste');
    if(ta) ta.addEventListener('input',function(){_imp.raw=this.value;});
  }

  // ── File upload handler ──────────────────────────────────────────────────
  function _impFile(input){
    var file=input.files[0]; if(!file) return;
    var reader=new FileReader();
    reader.onload=function(e){_imp.raw=e.target.result;_impRun();};
    reader.readAsText(file);
  }

  // Expose import functions globally so inline onclick handlers reach them
  global._impRun    = _impRun;
  global._impToggle = _impToggle;
  global._impAccept = _impAccept;
  global._impClear  = _impClear;
  global._impFile   = _impFile;

  global.QACockpit = QACockpit;

})(typeof window !== 'undefined' ? window : global);
